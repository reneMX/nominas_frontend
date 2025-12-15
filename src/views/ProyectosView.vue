<template>
  <MainLayout>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <span class="material-icons-outlined">folder</span>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Total Proyectos</p>
            <p class="text-lg font-bold text-gray-800">{{ estadisticas.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <span class="material-icons-outlined">play_circle</span>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">En Ejecución</p>
            <p class="text-lg font-bold text-gray-800">{{ estadisticas.activos }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <span class="material-icons-outlined">attach_money</span>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Presupuesto Global</p>
            <p class="text-lg font-bold text-gray-800">${{ formatearMoneda(estadisticas.presupuesto) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <span class="material-icons-outlined">group</span>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Nómina Asignada</p>
            <p class="text-lg font-bold text-gray-800">${{ formatearMoneda(estadisticas.nomina) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Listado de Proyectos</h2>
      <button @click="abrirModalCrear"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow flex items-center">
        <span class="material-icons-outlined mr-2">add</span>
        Nuevo Proyecto
      </button>
    </div>

    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm flex items-center">
      <span class="material-icons-outlined text-gray-400 mr-2">search</span>
      <input v-model="busqueda" type="text" placeholder="Buscar por nombre, cliente o clave..."
             class="w-full border-none focus:ring-0 text-gray-700 placeholder-gray-400">
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto /
            Cliente
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="proyecto in proyectosFiltrados" :key="proyecto.id"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
            @click="verDetalleSimple(proyecto)">

          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div
                  class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                {{ proyecto.nombre.charAt(0).toUpperCase() }}
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">{{ proyecto.nombre }}</div>
                <div class="text-xs text-gray-500">{{ proyecto.cliente }}</div>
                <div class="text-xs text-gray-400 font-mono">{{ proyecto.clave }}</div>
              </div>
            </div>
          </td>

          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">Inicio: {{ formatearFecha(proyecto.fechaInicio) }}</div>
            <div class="text-xs text-gray-500">Fin: {{ formatearFecha(proyecto.fechaFinEstimada) }}</div>
          </td>

          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 font-bold">${{ formatearMoneda(proyecto.presupuestoTotal) }}</div>
            <div class="text-xs text-green-600">Nómina: ${{ formatearMoneda(proyecto.presupuestoNomina || 0) }}</div>
          </td>

          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="obtenerClaseEstatus(proyecto.estatus)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
              {{ proyecto.estatus }}
            </span>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button @click.stop="abrirGestion(proyecto)"
                    class="text-teal-600 hover:text-teal-900 mr-4 font-bold inline-flex items-center"
                    title="Asignar Personal y Ver Detalles">
              <span class="material-icons-outlined text-sm mr-1">settings</span>
              Administrar
            </button>

            <button @click.stop="eliminarProyecto(proyecto.id)" class="text-red-600 hover:text-red-900"
                    title="Eliminar Proyecto">
              <span class="material-icons-outlined text-sm">delete</span>
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="proyectos.length === 0" class="p-8 text-center text-gray-500">
        No hay proyectos registrados o cargando...
      </div>
    </div>

    <div v-if="modalCrear" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Nuevo Proyecto</h3>

        <form @submit.prevent="guardarProyecto" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Clave (ID Único) *</label>
            <input v-model="formProyecto.clave" required type="text" placeholder="Ej: PROY-001"
                   class="block w-full border border-gray-300 rounded-md py-2 px-3 uppercase focus:ring-indigo-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input v-model="formProyecto.nombre" required type="text"
                   class="block w-full border border-gray-300 rounded-md py-2 px-3">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
              <input v-model="formProyecto.cliente" required type="text"
                     class="block w-full border border-gray-300 rounded-md py-2 px-3">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Presupuesto ($)</label>
              <input v-model="formProyecto.presupuestoTotal" type="number" step="0.01"
                     class="block w-full border border-gray-300 rounded-md py-2 px-3">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio *</label>
              <input v-model="formProyecto.fechaInicio" type="date" required
                     class="block w-full border border-gray-300 rounded-md py-2 px-3">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
              <select v-model="formProyecto.estatus"
                      class="block w-full bg-white border border-gray-300 rounded-md py-2 px-3">
                <option value="EJECUCION">En Ejecución</option>
                <option value="PLANEACION">Planeación</option>
                <option value="FINALIZADO">Finalizado</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="formProyecto.descripcion" rows="3"
                      class="block w-full border border-gray-300 rounded-md py-2 px-3"></textarea>
          </div>

          <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" @click="modalCrear = false" class="px-4 py-2 border rounded text-gray-700">Cancelar
            </button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Guardar
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="modalDetalle" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h3 class="text-xl font-bold mb-4 text-indigo-700">{{ proyectoSeleccionado?.nombre }}</h3>
        <p class="mb-4 text-gray-600">{{ proyectoSeleccionado?.descripcion }}</p>
        <div class="flex justify-end">
          <button @click="modalDetalle = false" class="bg-gray-200 text-gray-800 px-4 py-2 rounded">Cerrar</button>
        </div>
      </div>
    </div>

    <div v-if="modalGestion" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 opacity-75" @click="modalGestion = false"></div>

        <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">

          <div class="bg-indigo-600 px-4 py-3 flex justify-between items-center">
            <h3 class="text-lg font-medium text-white">Gestionando: {{ proyectoSeleccionado?.nombre }}</h3>
            <button @click="modalGestion = false" class="text-white text-2xl">&times;</button>
          </div>

          <div class="bg-white px-4 pt-5 pb-4 min-h-[400px]">
            <div class="flex justify-between mb-4">
              <h4 class="text-lg font-bold text-gray-700">Personal Asignado (Contratos)</h4>
              <button @click="abrirModalContrato"
                      class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm shadow">
                + Asignar Empleado
              </button>
            </div>

            <div class="overflow-x-auto mt-4">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto /
                    Actividad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vigencia
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salario
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones
                  </th>
                </tr>
                </thead>

                <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="listaContratos.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-gray-500 text-sm">
                    No hay personal asignado a este proyecto.
                  </td>
                </tr>

                <tr v-for="contrato in listaContratos" :key="contrato.id">

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div
                            class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {{ contrato.empleado?.nombre?.charAt(0) || 'U' }}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ contrato.empleado?.nombre }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ contrato.empleado?.numeroEmpleado }} | RFC: {{ contrato.empleado?.rfc }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4">
                    <div class="text-sm font-bold text-gray-800">
                      {{ contrato.empleado?.puesto || 'Sin puesto' }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ contrato.descripcionActividades || 'Sin actividades especificadas' }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">Del: {{ contrato.fechaInicio }}</div>
                    <div class="text-sm text-gray-500">Al: {{ contrato.fechaFin }}</div>
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-1"
                          :class="contrato.estatus === 'VIGENTE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ contrato.estatus }}
      </span>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="font-bold text-gray-900">
                      ${{ formatearMoneda(contrato.salarioAsignado) }}
                    </div>
                    <div class="text-xs">
                      {{ contrato.horasContratadas }} hrs/semana
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                        @click="eliminarContrato(contrato.id)"
                        class="text-red-600 hover:text-red-900 font-bold border border-red-200 bg-red-50 px-3 py-1 rounded shadow-sm hover:bg-red-100 transition-colors">
                      Desvincular
                    </button>
                  </td>
                </tr>
                </tbody>

              </table>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
            <button @click="modalGestion = false"
                    class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 sm:ml-3 sm:w-auto sm:text-sm">
              Cerrar Panel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modalCrearContrato" class="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
         style="z-index: 100;">
      <div class="fixed inset-0 bg-black bg-opacity-60" @click="modalCrearContrato = false"></div>

      <div class="bg-white rounded-lg shadow-2xl z-50 w-full max-w-lg p-6 relative">
        <h3 class="text-xl font-bold mb-4 text-indigo-800">Asignar Empleado al Proyecto</h3>

        <form @submit.prevent="guardarContrato" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Seleccionar Empleado *</label>
            <select v-model="formContrato.empleadoId" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
              <option :value="null">-- Seleccione --</option>
              <option v-for="emp in listaEmpleados" :key="emp.id" :value="emp.id">
                {{ emp.nombre }} {{ emp.apellidoPaterno }} - RFC: {{ emp.rfc }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha Inicio *</label>
              <input type="date" v-model="formContrato.fechaInicio" required
                     class="mt-1 block w-full border border-gray-300 rounded-md py-1.5 px-3">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha Fin *</label>
              <input type="date" v-model="formContrato.fechaFin" required
                     class="mt-1 block w-full border border-gray-300 rounded-md py-1.5 px-3">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Salario Mensual ($) *</label>
              <input type="number" step="0.01" v-model="formContrato.salarioAsignado" required
                     class="mt-1 block w-full border border-gray-300 rounded-md py-1.5 px-3">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Horas Semana</label>
              <input type="number" v-model="formContrato.horasContratadas"
                     class="mt-1 block w-full border border-gray-300 rounded-md py-1.5 px-3">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Actividades / Puesto</label>
            <textarea v-model="formContrato.descripcionActividades" rows="2"
                      class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"></textarea>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="modalCrearContrato = false"
                    class="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300">Cancelar
            </button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-bold">
              Guardar Asignación
            </button>
          </div>
        </form>
      </div>
    </div>

  </MainLayout>
</template>

<script setup>

import {ref, computed, onMounted} from "vue";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout.vue";

const proyectos = ref([]);
const listaEmpleados = ref([]);
const busqueda = ref("");

/**
 * MODALES
 */
const modalCrear = ref(false);
const modalDetalle = ref(false);
const modalGestion = ref(false);
const modalCrearContrato = ref(false);

const proyectoSeleccionado = ref(null);
const listaContratos = ref([]);

/**
 * FORMULARIOS
 */


const formProyecto = ref({
  clave: "", nombre: "", cliente: "", descripcion: "",
  presupuestoTotal: 0, fechaInicio: "", estatus: "EJECUCION"
});

const formContrato = ref({
  empleadoId: null, fechaInicio: "", fechaFin: "",
  salarioAsignado: 0, horasContratadas: 48, descripcionActividades: ""
});

onMounted(async () => {
  await cargarProyectos();
  await cargarEmpleados();
});


async function cargarProyectos() {
  try {
    const {data} = await api.get("/proyectos");
    proyectos.value = data;
  } catch (error) {
    console.error("Error cargando proyectos:", error);
  }
}

async function cargarEmpleados() {
  try {
    const {data} = await api.get("/empleados");
    listaEmpleados.value = data;
  } catch (error) {
    console.error("Error al cargar empleados. Revisa el endpoint /empleados", error);
  }
}



async function cargarContratosDelProyecto(idProyecto) {

  if (!idProyecto) {
    console.error("Error: Se intentó cargar contratos sin un ID de proyecto.");
    return;
  }

  try {
    const url = `/contratos-proyecto/${idProyecto}`;
    console.log("Consulta URL:", url);
    const {data} = await api.get(url);
    if (Array.isArray(data)) {
      listaContratos.value = data;
    } else if (data && typeof data === 'object') {
      console.warn("El  devolvió un objeto único en lugar de una lista");
      listaContratos.value = [data];
    } else {
      listaContratos.value = [];
    }
    console.log("Datos recibidos del servidor:", data);


    listaContratos.value = data;

  } catch (error) {
    console.error("❌ ERROR AL CARGAR CONTRATOS:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Mensaje:", error.response.data);

      if (error.response.status === 404) {
        alert("Error 404: No se encuentra la ruta de contratos. Verifica tu Backend.");
      }
    } else {
      console.error("Error de conexión:", error);
    }

    listaContratos.value = [];
  }
}

const estadisticas = computed(() => {
  const total = proyectos.value.length;
  const activos = proyectos.value.filter(p => p.estatus === 'EJECUCION' || p.estatus === 'En Progreso').length;


  const presupuesto = proyectos.value.reduce((sum, p) => sum + (p.presupuestoTotal || 0), 0);

  const nomina = proyectos.value.reduce((sum, p) => sum + (p.presupuestoNomina || 0), 0);

  return {total, activos, presupuesto, nomina};
});


const proyectosFiltrados = computed(() => {
  if (!busqueda.value) return proyectos.value;
  const q = busqueda.value.toLowerCase();
  return proyectos.value.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.cliente.toLowerCase().includes(q) ||
      (p.clave && p.clave.toLowerCase().includes(q))
  );
});


function abrirModalCrear() {
  formProyecto.value = {clave: "", nombre: "", cliente: "", estatus: "EJECUCION", presupuestoTotal: 0, fechaInicio: ""};
  modalCrear.value = true;
}

async function guardarProyecto() {
  try {
    const payload = {...formProyecto.value};
    if (!payload.clave || !payload.nombre) return alert("Clave y Nombre son obligatorios");

    await api.post("/proyectos", payload);
    alert("Proyecto creado exitosamente");
    modalCrear.value = false;
    await cargarProyectos();
  } catch (error) {
    console.error(error);
    alert("Error al guardar proyecto: " + (error.response?.data?.message || "Revisa la consola"));
  }
}

function verDetalleSimple(p) {
  proyectoSeleccionado.value = p;
  modalDetalle.value = true;
}

function eliminarProyecto(id) {
  if (confirm("¿Seguro que deseas eliminar este proyecto?")) {
    alert("Eliminar pendiente de implementación en backend");
  }
}


async function abrirGestion(proyecto) {
  proyectoSeleccionado.value = proyecto;
  modalGestion.value = true;
  await cargarContratosDelProyecto(proyecto.id);
}

function abrirModalContrato() {
  if (!proyectoSeleccionado.value) return;
  formContrato.value = {
    empleadoId: null,
    fechaInicio: proyectoSeleccionado.value.fechaInicio || "",
    fechaFin: proyectoSeleccionado.value.fechaFinEstimada || "",
    salarioAsignado: 0,
    horasContratadas: 48,
    descripcionActividades: "Asignación a " + proyectoSeleccionado.value.nombre
  };
  modalCrearContrato.value = true;
}

async function guardarContrato() {
  if (!formContrato.value.empleadoId) {
    alert("Error: Debes seleccionar un empleado de la lista.");
    return;
  }
  if (!proyectoSeleccionado.value || !proyectoSeleccionado.value.id) {
    alert("Error interno: No hay un proyecto seleccionado.");
    return;
  }

  const payload = {
    empleadoId: formContrato.value.empleadoId,
    proyectoId: proyectoSeleccionado.value.id,
    fechaInicio: formContrato.value.fechaInicio,
    fechaFin: formContrato.value.fechaFin,
    salarioAsignado: parseFloat(formContrato.value.salarioAsignado),
    horasContratadas: parseInt(formContrato.value.horasContratadas) || 48,
    descripcionActividades: formContrato.value.descripcionActividades || "Sin descripción",
    motivo: "Asignación Web"
  };

  console.log("Enviando al Backend:", payload);

  try {
    await api.post('/contratos-proyecto', payload);

    alert("Empleado asignado correctamente");
    modalCrearContrato.value = false;
    await cargarContratosDelProyecto(proyectoSeleccionado.value.id);
    await cargarProyectos();

  } catch (error) {
    console.error("Error al guardar:", error);
    if (error.response) {
      const mensaje = error.response.data.error || error.response.data.message || "Error desconocido del servidor";
      alert("Error del Servidor: " + mensaje);
    } else {
      alert("Error de conexión. Verifica que el Backend esté corriendo.");
    }
  }
}

function formatearMoneda(val) {
  return parseFloat(val || 0).toLocaleString('es-MX', {minimumFractionDigits: 2});
}

function formatearFecha(f) {
  return f || "---";
}

function obtenerClaseEstatus(s) {
  return s === 'EJECUCION' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
}


</script>