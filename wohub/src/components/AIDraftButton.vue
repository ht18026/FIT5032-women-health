<script setup>
import { ref } from 'vue'
import { genaiText } from '@/lib/genai'

const props = defineProps({
  subject: { type: String, default: '' },
  body:    { type: String, default: '' },     
})
const emit = defineEmits(['update:subject', 'update:body'])

const highlights = ref('')    // version highlights
const tone = ref('friendly')  // tone：friendly / formal / concise
const loading = ref(false)
const error = ref('')

const JSON_SCHEMA = {
  type: "object",
  properties: {
    subject: { type: "string" },
    body: { type: "string" }  
  },
  required: ["subject", "body"],
}

async function generate() {
  loading.value = true
  error.value = ''
  try {
    const system =
      "You are an assistant for a health charity. Return ONLY JSON that matches the schema. Subject <= 80 chars."
    const prompt =
      `Write a release-note email in ${tone.value} tone.\nHighlights:\n${highlights.value}\nLanguage: English.`

    const { text } = await genaiText({
      system,
      prompt,
      model: "gemini-2.0-flash",
      temperature: 0.6,
      maxOutputTokens: 800,
      jsonSchema: JSON_SCHEMA,
    })
    const data = JSON.parse(text)
    emit('update:subject', data.subject)
    emit('update:body', data.body)
  } catch (e) {
    console.error(e)
    error.value = e.message || 'AI failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="ai-draft">
    <label class="form-label small text-muted">Release highlights</label>
    <textarea v-model="highlights" class="form-control mb-2" rows="3"
      placeholder="e.g. Bulk email feature; Admin dashboard with user charts; Performance improvements..."></textarea>

    <div class="d-flex align-items-center gap-2 mb-2">
      <label class="small text-muted mb-0">Tone:</label>
      <select v-model="tone" class="form-select form-select-sm w-auto">
        <option value="friendly">Friendly</option>
        <option value="formal">Formal</option>
        <option value="concise">Concise</option>
      </select>

      <button class="btn btn-sm btn-primary ms-auto" :disabled="loading || !highlights.trim()" @click="generate">
        {{ loading ? 'Generating…' : 'AI Draft' }}
      </button>
    </div>

    <div v-if="error" class="text-danger small">{{ error }}</div>
  </div>
</template>

<style scoped>
.ai-draft textarea { resize: vertical; }
</style>
