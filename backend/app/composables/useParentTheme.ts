import { createGlobalState, useEventListener } from "@vueuse/core";
import { ref, watch } from "vue";

export default createGlobalState(() => {
  const isDark = ref(true);

  useEventListener("message", (event) => {
    if (event.data.type !== "theme") return;

    isDark.value = event.data.isDark;
  });

  watch(
    isDark,
    (isDark) => {
      if (isDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    },
    { immediate: true },
  );

  return {
    isDark,
  };
});
