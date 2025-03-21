<script lang="ts" setup>
import { WELCOME_CHAT_MESSAGE } from "./utils/constants";
import MessageList from "./components/MessageList.vue";
import { useClipboard } from "@vueuse/core";
import { computed, ref, shallowRef, toRaw } from "vue";
import { apiClient } from "./utils/api-client";
import type { ChatMessage } from "../shared/types";
import { isIframe } from "./utils/is-iframe";
import { useRouter, useRoute } from "vue-router";

const close = () => {
  window.postMessage("vitepress-knowledge:close-modal", "*");
  window.parent.postMessage("vitepress-knowledge:close-modal", "*");
};

const { copy: copyUrl, copied: isUrlCopied } = useClipboard({
  source: () => new URL(location.search, DOCS_URL).toString(),
});

const route = useRoute();
const threadMessages = shallowRef<ChatMessage[]>(
  route.query.q ? JSON.parse(route.query.q as string) : [],
);

const conversationId = ref<string>();
const newMessage = ref("");
const loading = ref(false);

const router = useRouter();
const sendMessage = async () => {
  const content = newMessage.value.trim();
  if (!content || loading.value) return;

  const oldThreadMessages: ChatMessage[] = toRaw(threadMessages.value);
  try {
    loading.value = true;
    const newThreadMessages: ChatMessage[] = [
      ...oldThreadMessages,
      { role: "user", content: content },
    ];
    threadMessages.value = newThreadMessages;
    const res = await apiClient.api.chat.post({
      conversationId: conversationId.value,
      messages: newThreadMessages,
      model: "gemini-2.0-flash",
    });
    if (res.error) throw res.error;

    threadMessages.value = res.data.messages;
    conversationId.value = res.data.id;

    router.replace({
      query: {
        q: JSON.stringify(
          res.data.messages.map(({ id: _1, ...message }) => message),
        ),
      },
    });
    newMessage.value = "";
  } catch (err) {
    console.error(err);
    threadMessages.value = oldThreadMessages;
  } finally {
    loading.value = false;
  }
};

const messages = computed(() => {
  if (threadMessages.value.length === 0) return [WELCOME_CHAT_MESSAGE];
  return threadMessages.value;
});

const docsUrl = DOCS_URL;
const docsDomain = new URL(DOCS_URL).host;
const appName = APP_NAME;
</script>

<template>
  <div class="flex flex-col h-full">
    <div
      class="shrink-0 flex items-center gap-4 border-b-1 border-black p-3 pl-4"
    >
      <i class="i-heroicons-bolt-solid size-6" />
      <div class="flex gap-1 items-center">
        <h1 class="shrink-0 font-bold text-lg">Ask {{ appName }} AI</h1>
        <p class="shrink-0 ml-1 badge badge-sm badge-warning uppercase">
          Alpha
        </p>
      </div>
      <div class="flex-1" />
      <a
        v-if="!isIframe"
        class="ml-4 link font-bold text-lg"
        :href="docsUrl"
        target="_blank"
      >
        <span>{{ docsDomain }}</span>
        <i
          class="i-heroicons-arrow-top-right-on-square-16-solid size-4 -my-2"
        />
      </a>
      <button class="btn btn-ghost" @click="() => copyUrl()">
        <i class="i-heroicons-share-solid size-5" />
        <span v-if="isUrlCopied">Copied!</span>
        <span v-else>Share</span>
      </button>
      <button
        v-if="isIframe"
        class="btn btn-ghost btn-circle"
        title="close"
        @click="close"
      >
        <i class="i-heroicons-x-mark-solid" />
      </button>
    </div>

    <div class="flex-1 relative">
      <div class="absolute inset-0 overflow-y-auto p-4">
        <MessageList :messages show-top-links :loading />
      </div>
    </div>

    <div class="shrink-0 m-2 flex flex-col gap-2">
      <form
        class="relative pr-0.5 bg-[var(--c-default-soft)] ring-0 ring-[var(--c-brand)] focus-within:ring-2 rounded transition"
        @submit.prevent="sendMessage"
      >
        <textarea
          class="w-full min-w-0 min-h-25 p-3 pr-14.5 leading-normal bg-transparent outline-none resize-y text-sm h-auto"
          placeholder="Ask a question..."
          v-model="newMessage"
          :disabled="loading"
          @keydown.ctrl.enter="sendMessage"
          @keydown.cmd.enter="sendMessage"
        />
        <button
          class="btn btn-circle absolute right-2.5 top-3"
          type="submit"
          :disabled="loading"
        >
          <i class="i-heroicons-paper-airplane-solid size-5" />
        </button>
      </form>

      <div class="text-sm flex gap-1">
        <p class="opacity-70">Powered by</p>
        <a
          class="link"
          href="https://github.com/aklinker1/vitepress-knowledge"
          target="_blank"
        >
          <i class="i-heroicons-bolt-16-solid size-4 -my-2" />
          <span>vitepress-knowledge</span>
        </a>
        <div class="flex-1" />
        <a class="link" href="/privacy-policy" target="_blank">
          <span>Privacy Policy</span>
          <i
            class="i-heroicons-arrow-top-right-on-square-16-solid size-4 -my-2"
          />
        </a>
      </div>
    </div>
  </div>
</template>
