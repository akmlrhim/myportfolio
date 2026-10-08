<script setup>
import { ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseTextarea from '@/components/atoms/BaseTextarea.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const name = ref('')
const message = ref('')
const submitted = ref(false)

function submit() {
  if (!name.value || !message.value) return
  submitted.value = true
  name.value = ''
  message.value = ''
}
</script>

<template>
  <AnimatePresence mode="wait">
    <motion.form
      v-if="!submitted"
      key="guestbook-form"
      @submit.prevent="submit"
      class="mt-8 space-y-4 max-w-md"
      :initial="{ opacity: 0, y: 16 }"
      :animate="{ opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }"
      :exit="{ opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } }"
    >
      <BaseInput
        id="guest-name"
        v-model="name"
        label="Name"
        placeholder="Your name"
        required
      />
      <BaseTextarea
        id="guest-message"
        v-model="message"
        label="Message"
        placeholder="Write a message..."
        required
      />
      <BaseButton type="submit">Submit</BaseButton>
    </motion.form>

    <motion.div
      v-else
      key="guestbook-success"
      role="status"
      class="mt-8 max-w-md rounded-xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950 p-4"
      :initial="{ opacity: 0, scale: 0.96, y: 8 }"
      :animate="{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }"
      :exit="{ opacity: 0, transition: { duration: 0.15 } }"
    >
      <p class="text-sm font-medium text-green-700 dark:text-green-400">Thank you for your message!</p>
    </motion.div>
  </AnimatePresence>
</template>
