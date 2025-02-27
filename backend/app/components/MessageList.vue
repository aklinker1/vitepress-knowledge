<script setup lang="ts">
import type { ChatMessage } from "../../shared/types";
import MessageListItem from "./MessageListItem.vue";

const props = defineProps<{
  messages: ChatMessage[];
  loading?: boolean;
}>();
</script>

<template>
  <ul class="flex flex-col gap-4">
    <MessageListItem v-for="message of messages" :message />

    <li v-if="loading">
      <i class="i-svg-spinners-3-dots-bounce" />
    </li>
  </ul>
</template>
