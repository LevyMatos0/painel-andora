import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import DashboardView from "../views/DashboardView.vue";
import SiteView from "../views/SiteView.vue";
import ServicesView from "../views/ServicesView.vue";
import TeamView from "../views/TeamView.vue";
import MessagesView from "../views/MessagesView.vue";
import UserView from "../views/UserView.vue";
import { sessionToken } from "../services/api";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/admin",
    component: AdminLayout,
    redirect: "/dashboard", // <-- Redireciona automaticamente se entrar em /admin
    meta: { requerAutenticacao: true },
    children: [
      { path: "/dashboard", name: "dashboard", component: DashboardView },
      { path: "/site", name: "site", component: SiteView },
      { path: "/servicos", name: "services", component: ServicesView },
      { path: "/equipe", name: "team", component: TeamView },
      { path: "/mensagens", name: "messages", component: MessagesView },
      { path: "/usuario", name: "user", component: UserView },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = sessionToken();

  if (to.meta.requerAutenticacao && !token) {
    next("/");
  } else if (to.path === "/" && token) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
