<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const sidebarOpenMobile = ref(false);
const isSidebarCollapsed = ref(false);

function toggleMobileSidebar() {
  sidebarOpenMobile.value = !sidebarOpenMobile.value;
}

function toggleDesktopSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

const esActivo = (ruta) => route.path === ruta;

function logout() {
  localStorage.clear();
  router.push("/login");
}
</script>

<template>
  <div class="flex h-screen bg-gray-50 font-sans overflow-hidden">

    <div v-if="sidebarOpenMobile"
         class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden transition-opacity"
         @click="sidebarOpenMobile = false">
    </div>

    <aside
        :class="[
        'fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out',
        sidebarOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full w-64',
        'lg:static lg:translate-x-0',
        isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
      ]"
    >

      <div class="h-16 flex items-center border-b border-gray-100 transition-all duration-300"
           :class="isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6'">

        <div class="flex items-center overflow-hidden whitespace-nowrap">
          <img src="/jro_logo.png" alt="logo" class="h-8 w-8 flex-shrink-0 object-contain">

          <span
              class="ml-3 text-lg font-bold text-gray-800 tracking-wide transition-opacity duration-200"
              :class="isSidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100 block'"
          >
            JRO Soft
          </span>
        </div>

        <button @click="sidebarOpenMobile = false" class="lg:hidden text-gray-500">
          <span class="material-icons-outlined">close</span>
        </button>

        <button @click="toggleDesktopSidebar" class="hidden lg:flex text-gray-400 hover:text-indigo-600 transition-colors">
            <span class="material-icons-outlined text-xl">
                {{ isSidebarCollapsed ? 'last_page' : 'first_page' }}
            </span>
        </button>
      </div>

      <nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">

        <router-link to="/"
                     class="flex items-center py-2.5 rounded-lg group transition-colors relative whitespace-nowrap"
                     :class="[
             esActivo('/') ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
             isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
           ]"
                     title="Inicio"
        >
          <span v-if="esActivo('/')" class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-lg"></span>

          <span class="material-icons-outlined text-2xl flex-shrink-0 transition-all"
                :class="[
                    esActivo('/') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500',
                    isSidebarCollapsed ? 'mr-0' : 'mr-3'
                ]">
            dashboard
          </span>

          <span :class="isSidebarCollapsed ? 'hidden' : 'block'">Inicio</span>
        </router-link>

        <router-link to="/empleados"
                     class="flex items-center py-2.5 rounded-lg group transition-colors relative whitespace-nowrap"
                     :class="[
             esActivo('/empleados') ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
             isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
           ]"
                     title="Empleados"
        >
          <span v-if="esActivo('/empleados')" class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-lg"></span>

          <span class="material-icons-outlined text-2xl flex-shrink-0 transition-all"
                :class="[
                    esActivo('/empleados') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500',
                    isSidebarCollapsed ? 'mr-0' : 'mr-3'
                ]">
            people
          </span>

          <span :class="isSidebarCollapsed ? 'hidden' : 'block'">Empleados</span>
        </router-link>

        <router-link to="/nominas"
                     class="flex items-center py-2.5 rounded-lg group transition-colors relative whitespace-nowrap"
                     :class="[
             esActivo('/nominas') ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
             isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
           ]"
                     title="Nóminas"
        >
          <span v-if="esActivo('/nominas')" class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-lg"></span>
          <span class="material-icons-outlined text-2xl flex-shrink-0 transition-all"
                :class="[
                    esActivo('/nominas') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500',
                    isSidebarCollapsed ? 'mr-0' : 'mr-3'
                ]">payments</span>
          <span :class="isSidebarCollapsed ? 'hidden' : 'block'">Nóminas</span>
        </router-link>

        <router-link to="/proyectos"
                     class="flex items-center py-2.5 rounded-lg group transition-colors relative whitespace-nowrap"
                     :class="[
             esActivo('/proyectos') ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
             isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
           ]"
                     title="Proyectos"
        >
          <span v-if="esActivo('/proyectos')" class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-lg"></span>
          <span class="material-icons-outlined text-2xl flex-shrink-0 transition-all"
                :class="[
                    esActivo('/proyectos') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500',
                    isSidebarCollapsed ? 'mr-0' : 'mr-3'
                ]">analytics</span>
          <span :class="isSidebarCollapsed ? 'hidden' : 'block'">Proyectos</span>
        </router-link>

      </nav>

      <div class="border-t border-gray-200 p-4 transition-all duration-300"
           :class="isSidebarCollapsed ? 'flex justify-center' : ''">

        <div class="flex items-center mb-3" v-if="!isSidebarCollapsed">
          <div class="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">AD</div>
          <div class="ml-3 overflow-hidden">
            <p class="text-sm font-medium text-gray-700 truncate">Admin User</p>
            <p class="text-xs text-gray-500 truncate">Recursos Humanos</p>
          </div>
        </div>

        <div v-else class="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0 mb-3 cursor-help" title="Admin User">
          AD
        </div>

        <button @click="logout"
                class="w-full flex items-center justify-center border border-gray-300 rounded-lg shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                :class="isSidebarCollapsed ? 'p-2 rounded-full border-0 shadow-none hover:bg-red-50 hover:text-red-600' : 'px-4 py-2'">
          <span class="material-icons-outlined text-lg" :class="isSidebarCollapsed ? 'text-red-500' : 'text-gray-500 mr-1'">logout</span>
          <span v-if="!isSidebarCollapsed">Salir</span>
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden relative w-full transition-all duration-300">

      <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:hidden flex-shrink-0">
        <span class="font-bold text-gray-700">JRO Soft RH</span>
        <button @click="toggleMobileSidebar" class="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none">
          <span class="material-icons-outlined text-2xl">menu</span>
        </button>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-10">
        <slot></slot>
      </main>
    </div>

  </div>
</template>