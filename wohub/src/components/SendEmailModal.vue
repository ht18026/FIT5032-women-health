<template>
  <div class="p-4 rounded-xl shadow">
    <h3 class="text-xl font-semibold mb-3">Send Email</h3>

    <!-- 🔹 AI 草稿（纯文本） -->
    <div class="mb-3">
      <AIDraftButton
        v-model:subject="form.subject"
        v-model:body="form.text"
        format="text"
      />
    </div>

    <form @submit.prevent="onSubmit">
      <div class="mb-2">
        <label>To</label>
        <input v-model="form.to" class="form-control" type="email" required />
      </div>
      <div class="mb-2">
        <label>Subject</label>
        <input v-model="form.subject" class="form-control" required />
      </div>
      <div class="mb-2">
        <label>Message</label>
        <textarea v-model="form.text" class="form-control" rows="4"></textarea>
      </div>
      <div class="mb-4">
        <label>Attachment (optional)</label>
        <input type="file" @change="pickFile" />
      </div>
      <button class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AIDraftButton from "@/components/AIDraftButton.vue";

const form = ref({ to: "", subject: "", text: "" });
const loading = ref(false);
let fileObj = null;

const pickFile = (e) => {
  fileObj = e.target.files?.[0] ?? null;
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",").pop());
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const onSubmit = async () => {
  loading.value = true;
  try {
    let payload = {
      to: form.value.to,
      subject: form.value.subject,
      text: form.value.text,
      html: undefined,
    };

    if (fileObj) {
      payload.fileBase64 = await toBase64(fileObj);
      payload.filename = fileObj.name;
      payload.mimeType = fileObj.type;
    }
    const FN_SEND_EMAIL = import.meta.env.VITE_FN_SEND_EMAIL;
    const res = await fetch(FN_SEND_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Failed");
    alert("✅ Email sent!");
    form.value = { to: "", subject: "", text: "" };
    fileObj = null;
  } catch (e) {
    alert("❌ " + e.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-control { width:100%; padding:.5rem; border:1px solid #ddd; border-radius:.5rem; }
.btn { padding:.5rem 1rem; border-radius:.5rem; }
.btn-primary { background:#0d6efd; color:#fff; border:none; }
</style>
