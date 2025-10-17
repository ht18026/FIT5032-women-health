<template>
  <div class="card p-3">
    <h5>Bulk Email (version update)</h5>

    <div class="mb-2">
      <label class="form-label">Recipients (comma-separated)</label>
      <input v-model="to" class="form-control" placeholder="a@x.com, b@y.com" />
    </div>

    <div class="mb-2">
      <label class="form-label">Subject</label>
      <input v-model="subject" class="form-control" placeholder="WoHub – Version X.Y Update" />
    </div>

    <div class="mb-2">
      <label class="form-label">HTML Body</label>
      <textarea v-model="html" class="form-control" rows="5"
        placeholder="<p>We have updated WoHub...</p>"></textarea>
    </div>

    <div class="form-check mb-2">
      <input id="dry" class="form-check-input" type="checkbox" v-model="dryRun">
      <label class="form-check-label" for="dry">Dry run (SendGrid sandbox)</label>
    </div>

    <button class="btn btn-primary" :disabled="loading" @click="send">Send</button>
    <span class="ms-2" v-if="loading">Sending…</span>
    <div class="mt-2">
      <small class="text-muted">{{ msg }}</small>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const FN_URL = import.meta.env.VITE_FN_SEND_BULK_EMAIL;

const to = ref("");
const subject = ref("WoHub – Version X.Y Update");
const html = ref("We have updated WoHub to version X.Y...");
const dryRun = ref(true);
const loading = ref(false);
const msg = ref("");

const send = async () => {
  msg.value = "";
  loading.value = true;
  try {
    const payload = { to: to.value, subject: subject.value, html: html.value, dryRun: dryRun.value };
    const { data } = await axios.post(FN_URL, payload, { headers: { "Content-Type": "application/json" }});
    msg.value = `OK: sent=${data.sent}, batches=${data.batchCount}, dryRun=${data.dryRun}`;
  } catch (e) {
    msg.value = `ERR: ${e?.response?.data?.error || e.message}`;
  } finally {
    loading.value = false;
  }
};
</script>
