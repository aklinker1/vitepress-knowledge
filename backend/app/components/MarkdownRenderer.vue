<script setup lang="ts">
import { computed } from "vue";
import useMdToHtml from "../composables/useMdToHtml";

const props = defineProps<{
  markdown: string;
}>();

const html = useMdToHtml(() => props.markdown);
</script>

<template>
  <div
    class="prose prose-neutral max-w-none prose-a:link dark:prose-invert flex flex-col gap-4 prose-code:not-[pre>*]:before:hidden prose-code:not-[pre>*]:after:hidden prose-code:not-[pre>*]:px-1 prose-code:not-[pre>*]:py-0.5 prose-code:not-[pre>*]:text-[var(--c-brand)] prose-code:not-[pre>*]:bg-white/10 prose-code:not-[pre>*]:rounded-sm"
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
  gap: calc(2 * var(--spacing));
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
