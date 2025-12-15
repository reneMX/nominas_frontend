import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import NominasView from "../views/NominasView.vue";
import EmpleadosView from "../views/EmpleadosView.vue";
import ProyectosView from "../views/ProyectosView.vue";

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: LoginView },
    { path: "/nominas", component: NominasView },
    { path: "/empleados", name: "Empleados",component: EmpleadosView},
    {
        path: '/reportes',
        name: 'reportes',
        component: EmpleadosView
    },
    {
        path: '/proyectos',
        name: 'proyectos',
        component: ProyectosView
    }
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
