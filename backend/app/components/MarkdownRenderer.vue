<script setup lang="ts">
import { computed } from "vue";
import { mdToHtml } from "../utils/md-to-html";

const props = defineProps<{
  markdown: string;
}>();

const html = computed(() => mdToHtml(props.markdown));
</script>

<template>
  <div
    class="prose prose-neutral max-w-none prose-a:link dark:prose-invert flex flex-col gap-4"
    v-html="html"
  />
</template>

<style scoped>
/* Paragraph spacing overrides */
.prose,
.prose > ol,
.prose > ul {
  display: flex;
  flex-direction: column;
  gap: calc(4 * var(--spacing));
}
.prose > *,
.prose > ol,
.prose > ul {
  margin: 0;
}

/* Colors */
.prose {
  --tw-prose-links: var(--c-brand);
  --tw-prose-pre-bg: var(--c-bg-soft);
}

/* Inline code */
.prose code {
  font-size: calc(0.875 * var(--spacing));
}
</style>
