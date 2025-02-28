import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory, RouterView } from "vue-router";

const url = new URL(location.href);

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/:pathMatch(.*)*", component: App }],
});

createApp(RouterView).use(router).mount("#app");
