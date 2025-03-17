import { useEventListener, computedWithControl } from "@vueuse/core";
import {
  mdToHtml,
  MARKDOWN_SYNTAX_HIGHLIGHTER_READY_EVENT,
} from "../utils/md-to-html";
import { computed, ref, toValue, type MaybeRefOrGetter } from "vue";
import type { ComputedRef } from "vue";

export default function (md: MaybeRefOrGetter<string>): ComputedRef<string> {
  const trigger = ref(0);

  const html = computed(() => {
    // Access the trigger value so this value is recomputed when it changes.
    void trigger.value;

    return mdToHtml(toValue(md));
  });
  useEventListener(window, MARKDOWN_SYNTAX_HIGHLIGHTER_READY_EVENT, () => {
    trigger.value++;
  });
  return html;
}
