<script setup lang="ts">
import { computed } from "vue";
import { mdToHtml } from "../utils/md-to-html.ts";
import type { ChatMessage } from "../../shared/types";
import MarkdownRenderer from "./MarkdownRenderer.vue";

const props = defineProps<{
  message: ChatMessage;
}>();

const assistantIconUrl = `url(${ASSISTANT_ICON_URL})`;
</script>

<template>
  <li
    class="py-2 px-3 rounded-lg max-w-[90%] text-sm shrink-0 relative"
    :class="{
      'rounded-br-none user self-end bg-[var(--c-brand-soft)]':
        message.role === 'user',
      'rounded-bl-none assistant self-start ml-10 bg-[var(--c-default-soft)]':
        message.role === 'assistant',
    }"
  >
    <MarkdownRenderer :markdown="message.content" />
  </li>
</template>

<style scoped>
.assistant:before {
  content: "";
  position: absolute;
  width: 24px;
  height: 24px;
  left: -40px;
  bottom: 0;
  background-image: v-bind(assistantIconUrl);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
