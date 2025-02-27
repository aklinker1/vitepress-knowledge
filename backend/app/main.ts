import { createApp } from "vue";
import App from "./App.vue";

const url = new URL(location.href);

const theme = url.searchParams.get("theme") as "light" | "dark" | undefined;
if (theme === "dark") {
  document.documentElement.classList.add("dark");
}

createApp(App).mount("#app");
