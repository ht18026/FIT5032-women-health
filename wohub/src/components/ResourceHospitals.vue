<script setup>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// hospital data
const HOSPITALS = [
  { name: "The Royal Women's Hospital", address: "20 Flemington Rd, Parkville VIC 3052", phone: "03 8345 2000", website: "https://www.thewomens.org.au/", type: "Public" },
  { name: "Mercy Hospital for Women", address: "163 Studley Rd, Heidelberg VIC 3084", phone: "03 8458 4723", website: "https://health-services.mercyhealth.com.au/our-health-services/mercy-hospital-women/", type: "Public" },
  { name: "Joan Kirner Women’s & Children’s (Sunshine Hospital)", address: "176 Furlong Rd, St Albans VIC 3021", phone: "03 8345 1333", website: "https://westernhealth.org.au/location/joan-kirner-womens-and-childrens-jkwc-sunshine-hospital", type: "Public" },
  { name: "Monash Medical Centre – Monash Women’s (Clayton)", address: "246 Clayton Rd, Clayton VIC 3168", phone: "03 9594 6666", website: "https://monashhealth.org/contact/monash-medical-centre/", type: "Public" },
  { name: "Werribee Mercy Hospital", address: "300 Princes Hwy, Werribee VIC 3030", phone: "03 8754 3000", website: "https://health-services.mercyhealth.com.au/our-health-services/werribee-mercy-hospital/", type: "Public" },
  { name: "Frances Perry House (Private Maternity)", address: "Corner Flemington Rd & Grattan St, Parkville VIC 3052", phone: "03 9344 5000", website: "https://www.francesperryhouse.com.au/", type: "Private" }
]

// simple tool：Haversine get distance between two [lng, lat] points
function kmBetween(a, b) {
  const toRad = (x) => (x * Math.PI) / 180
  const R = 6371
  const [lng1, lat1] = a, [lng2, lat2] = b
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1)
  const s = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2
  return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

// —— component state —— 
const mapEl = ref(null)
let map
let routeSourceAdded = false

const entries = ref(HOSPITALS.map(e => ({ ...e, lnglat: null, marker: null })))
const radiusKm = ref(10)
const userPoint = ref(null)        // [lng, lat]
let userMarker = null
const originText = ref('')        
const geoError = ref('')           
const pendingUserPoint = ref(null)

const geocode = async (text) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?access_token=${mapboxgl.accessToken}&limit=1&country=AU`
  const res = await fetch(url)
  const json = await res.json()
  return json?.features?.[0]?.center || null
}

const filtered = computed(() => {
  const ready = entries.value.filter(e => !!e.lnglat)
  if (!userPoint.value) return ready
  return ready.filter(e => kmBetween(userPoint.value, e.lnglat) <= radiusKm.value)
})

function setUserPoint(lnglat) {
  userPoint.value = lnglat
  if (!map) {                      
    pendingUserPoint.value = lnglat
    return
  }
  if (userMarker) userMarker.remove()
  userMarker = new mapboxgl.Marker({ color: '#000' })
    .setLngLat(lnglat)
    .setPopup(new mapboxgl.Popup().setText('Origin'))
    .addTo(map)
  map.flyTo({ center: lnglat, zoom: 12 })
  updateMarkerVisibility()
}

function updateMarkerVisibility() {
  const hasUser = !!userPoint.value
  for (const e of entries.value) {
    const el = e.marker?.getElement?.()
    if (!el) continue
    if (!hasUser) {
      el.style.display = e.lnglat ? '' : 'none'
    } else {
      const show = kmBetween(userPoint.value, e.lnglat) <= radiusKm.value
      el.style.display = show ? '' : 'none'
    }
  }
}

async function drawRoute(origin, dest) {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
  const res = await fetch(url)
  const json = await res.json()
  const r = json?.routes?.[0]
  if (!r) return

  tripSummary.value = `Trip: ${(r.distance/1000).toFixed(2)} km • ${(r.duration/60).toFixed(1)} min`

  // draw on map
  const data = { type: 'FeatureCollection', features: [{ type: 'Feature', geometry: r.geometry }] }
  if (!routeSourceAdded) {
    map.addSource('route', { type: 'geojson', data })
    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      paint: { 'line-width': 5, 'line-color': '#3b82f6' }
    })
    routeSourceAdded = true
  } else {
    map.getSource('route').setData(data)
  }
  // set map view to fit route
  const coords = r.geometry.coordinates
  const bounds = coords.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(coords[0], coords[0]))
  map.fitBounds(bounds, { padding: 60 })
}

const tripSummary = ref('') // friendly text summary of current trip

function safeId(s) {
  return s.replace(/\W+/g, '-').toLowerCase()
}

function addMarker(e) {
  if (!map || !e.lnglat) return
  const id = safeId(e.name)
  const html = `
    <div>
      <strong>${e.name}</strong><br/>
      <small>${e.address}</small><br/>
      <a href="${e.website || '#'}" target="_blank" rel="noopener">Website</a><br/>
      <button id="route-${id}" style="margin-top:6px;">Route here</button>
    </div>
  `
  const m = new mapboxgl.Marker()
    .setLngLat(e.lnglat)
    .setPopup(new mapboxgl.Popup({ offset: 24 }).setHTML(html))
    .addTo(map)
  e.marker = m

  m.getElement().addEventListener('click', () => {
    setTimeout(() => {
      const btn = document.getElementById(`route-${id}`)
      btn?.addEventListener('click', async () => {
        if (!userPoint.value) {
          if (originText.value) {
            const g = await geocode(originText.value)
            if (g) setUserPoint(g)
          }
        }
        if (userPoint.value && e.lnglat) {
          drawRoute(userPoint.value, e.lnglat)
        } else {
          alert('Set origin first: use “My location” or enter an address.')
        }
      })
    }, 0)
  })
}

async function init() {
  map = new mapboxgl.Map({
    container: mapEl.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [144.9631, -37.8136],
    zoom: 10
  })


  // encode all hospital addresses
  for (const e of entries.value) {
    e.lnglat = await geocode(e.address)
    if (e.lnglat) addMarker(e)
  }
  updateMarkerVisibility()

  if (pendingUserPoint.value) {
    setUserPoint(pendingUserPoint.value)
    pendingUserPoint.value = null
  }
}

onMounted(init)
onBeforeUnmount(() => { try { map?.remove() } catch {} })

function requestMyLocation() {
  geoError.value = ''

  if (!window.isSecureContext) {
    geoError.value = 'Location requires HTTPS or localhost. Please use https:// or allow location in browser settings.'
    return
  }
  if (!('geolocation' in navigator)) {
    geoError.value = 'Geolocation is not supported by this browser.'
    return
  }

  navigator.geolocation.getCurrentPosition(
    (p) => setUserPoint([p.coords.longitude, p.coords.latitude]),
    (err) => {
      if (err?.code === err.PERMISSION_DENIED) {
        geoError.value = 'Location permission denied. You can type your origin or allow location in the browser site settings.'
      } else if (err?.code === err.POSITION_UNAVAILABLE) {
        geoError.value = 'Location unavailable. Try again later or type an address.'
      } else if (err?.code === err.TIMEOUT) {
        geoError.value = 'Location timed out. Try again.'
      } else {
        geoError.value = 'Failed to get location.'
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  )
}

// UI events
async function useOriginText() {
  geoError.value = ''
  if (!originText.value) return
  const g = await geocode(originText.value)
  if (g) setUserPoint(g)
}
</script>

<template>
  <main class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-2">Women’s Hospitals around Melbourne</h1>

    <div class="flex flex-wrap items-center gap-3 mb-2">
      <label for="origin" class="sr-only">Origin</label>
      <input id="origin" class="border rounded px-2 py-1" v-model="originText" placeholder="Enter your origin (address/suburb)"/>
      <button class="px-3 py-1 rounded border" @click="useOriginText">Set origin</button>

      <button class="px-3 py-1 rounded border" @click="requestMyLocation">
        My location
      </button>

      <label for="radius" class="ml-2">Within (km)</label>
      <input id="radius" type="range" min="2" max="50" step="1" v-model.number="radiusKm" @input="updateMarkerVisibility"/>
      <span>{{ radiusKm }} km</span>
    </div>

    <!-- read screen friendly -->
    <p v-if="geoError" role="alert" class="text-sm text-red-600 mb-2">{{ geoError }}</p>

    <div ref="mapEl" role="region" aria-label="Interactive map of women's hospitals" style="height: 65vh;"></div>

    <div id="trip-summary" class="mt-3 text-sm" aria-live="polite">{{ tripSummary }}</div>

    <section class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Results ({{ filtered.length }})</h2>
      <ul>
        <li v-for="(e, i) in filtered" :key="i" class="py-2 border-b">
          <div class="font-medium">
            {{ e.name }} <span class="text-xs px-2 py-0.5 border rounded ml-2">{{ e.type }}</span>
          </div>
          <div class="text-sm">{{ e.address }}<span v-if="e.phone"> · {{ e.phone }}</span></div>
          <div class="text-sm">
            <a :href="e.website" target="_blank" rel="noopener">Website</a>
            <button class="ml-3 underline" @click="userPoint && e.lnglat ? drawRoute(userPoint, e.lnglat) : alert('Set origin first')">
              Route here
            </button>
          </div>
        </li>
      </ul>
      <p class="text-xs mt-3">If this is an emergency, call 000 immediately.</p>
    </section>
  </main>
</template>

<style>
/* accessibility approach：hidden but readable text */
.sr-only {
  position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
}
:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
