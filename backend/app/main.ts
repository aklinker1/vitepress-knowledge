import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory, RouterView } from "vue-router";

if (BRAND_COLOR !== "<BRAND_COLOR>") {
  document.documentElement.style.setProperty("--c-brand-override", BRAND_COLOR);
}
if (BRAND_CONTENT_COLOR !== "<BRAND_CONTENT_COLOR>") {
  document.documentElement.style.setProperty(
    "--c-brand-content-override",
    BRAND_CONTENT_COLOR,
  );
}

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/:pathMatch(.*)*", component: App }],
});

createApp(RouterView).use(router).mount("#app");
