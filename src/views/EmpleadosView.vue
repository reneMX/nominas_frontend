<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout.vue";

const empleados = ref([]);
const busqueda = ref("");
const cargando = ref(false);

const mostrarModalEditar = ref(false);
const mostrarModalCrear = ref(false);


const modeloEmpleadoBase = {
  nombre: '',
  rfc: '',
  puesto: '',
  numeroEmpleado: '',
  salarioMensual: '',
  tipoContrato: 'INDETERMINADO',
  estatus: 'ACTIVO'
};

const empleadoEditando = ref({ ...modeloEmpleadoBase });
const nuevoEmpleado = ref({ ...modeloEmpleadoBase });


onMounted(() => {
  cargarEmpleados();
});


async function cargarEmpleados() {
  cargando.value = true;
  try {
    const response = await api.get("/empleados");
    empleados.value = response.data;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    cargando.value = false;
  }
}

const empleadosFiltrados = computed(() => {
  if (!busqueda.value) return empleados.value;
  const termino = busqueda.value.toLowerCase();
  return empleados.value.filter(e =>
      (e.nombre || '').toLowerCase().includes(termino) ||
      (e.rfc || '').toLowerCase().includes(termino) ||
      (e.numeroEmpleado || '').toLowerCase().includes(termino)
  );
});

async function eliminar(id) {
  if (!confirm("¿Estás seguro de eliminar este empleado?")) return;
  try {
    await api.delete(`/empleados/${id}`);
    empleados.value = empleados.value.filter(e => e.id !== id);
  } catch (error) {
    alert("No se pudo eliminar.");
  }
}

function abrirEdicion(empleado) {
  empleadoEditando.value = { ...empleado };
  mostrarModalEditar.value = true;
}

async function guardarEdicion() {
  try {
    const id = empleadoEditando.value.id;
    const payload = {
      ...empleadoEditando.value,
      salarioMensual: parseFloat(empleadoEditando.value.salarioMensual),
      numeroEmpleado: String(empleadoEditando.value.numeroEmpleado)
    };

    await api.put(`/empleados/${id}`, payload);
    await cargarEmpleados();
    mostrarModalEditar.value = false;
    alert("Actualizado correctamente");
  } catch (error) {
    alert("Error al actualizar: " + (error.response?.data?.message || "Verifica los datos"));
  }
}

function abrirCrear() {
  nuevoEmpleado.value = { ...modeloEmpleadoBase };
  mostrarModalCrear.value = true;
}

async function guardarCreacion() {
  try {
    const payload = {
      nombre: nuevoEmpleado.value.nombre,
      rfc: nuevoEmpleado.value.rfc,
      puesto: nuevoEmpleado.value.puesto,
      numeroEmpleado: String(nuevoEmpleado.value.numeroEmpleado),
      tipoContrato: nuevoEmpleado.value.tipoContrato || 'INDETERMINADO',
      estatus: nuevoEmpleado.value.estatus || 'ACTIVO',
      salarioMensual: parseFloat(nuevoEmpleado.value.salarioMensual),
    };

    await api.post("/empleados", payload);
    await cargarEmpleados();
    mostrarModalCrear.value = false;
    nuevoEmpleado.value = { ...modeloEmpleadoBase };
    alert("Empleado registrado exitosamente");

  } catch (error) {
    const mensaje = error.response?.data?.message || "Verifica los datos";
    alert("Error al crear: " + mensaje);
  }
}

function getIniciales(nombre) {
  if (!nombre) return "??";
  return nombre.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}
</script>

<template>
  <MainLayout> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Empleados</h1>
      <p class="text-sm text-gray-500 mt-1">Gestión completa del personal activo y bajas.</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <div class="relative w-full sm:w-72">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="material-icons-outlined text-gray-400 text-lg">search</span>
          </span>
        <input v-model="busqueda" type="text" class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition" placeholder="Buscar por nombre, RFC...">
      </div>
      <button @click="abrirCrear" class="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition">
        <span class="material-icons-outlined text-xl mr-2">add</span> Nuevo Empleado
      </button>
    </div>
  </div>

    <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div v-if="cargando" class="p-12 text-center text-gray-500 flex flex-col items-center">
        <span class="material-icons-outlined animate-spin text-3xl mb-3 text-indigo-500">sync</span> Cargando...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Perfil</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contrato</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Salario</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="e in empleadosFiltrados" :key="e.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm">{{ getIniciales(e.nombre) }}</div>
                <div class="ml-4">
                  <div class="text-sm font-bold text-gray-900">{{ e.nombre }}</div>
                  <div class="text-xs text-gray-500 font-mono">{{ e.rfc }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ e.puesto }}</div>
              <div class="text-xs text-gray-500 mt-0.5 flex items-center"><span class="material-icons-outlined text-[10px] mr-1 text-gray-400">badge</span>{{ e.numeroEmpleado }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-medium text-gray-700">${{ e.salarioMensual?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
              <span class="text-xs text-gray-400 block">Mensual MXN</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="e.estatus === 'ACTIVO'" class="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">Activo</span>
              <span v-else class="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">{{ e.estatus }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button @click="abrirEdicion(e)" class="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition shadow-sm" title="Editar"><span class="material-icons-outlined text-lg">edit</span></button>
                <button @click="eliminar(e.id)" class="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition shadow-sm" title="Eliminar"><span class="material-icons-outlined text-lg">delete</span></button>
              </div>
            </td>
          </tr>
          <tr v-if="empleadosFiltrados.length === 0"><td colspan="5" class="px-6 py-16 text-center text-gray-500">No hay empleados registrados.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="mostrarModalCrear" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" @click="mostrarModalCrear = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span class="material-icons-outlined mr-2 text-indigo-600">person_add</span>
            Nuevo Empleado
          </h3>
          <form @submit.prevent="guardarCreacion" class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
              <input v-model="nuevoEmpleado.nombre" type="text" placeholder="Ej. Ana García" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">RFC</label>
              <input v-model="nuevoEmpleado.rfc" type="text" placeholder="RFC..." class="w-full border border-gray-300 rounded-md px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">No. Empleado</label>
              <input v-model="nuevoEmpleado.numeroEmpleado" type="text" placeholder="12345" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Puesto</label>
              <input v-model="nuevoEmpleado.puesto" type="text" placeholder="Ej. Desarrollador" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Salario Mensual</label>
              <input v-model="nuevoEmpleado.salarioMensual" type="number" step="0.01" placeholder="0.00" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Contrato</label>
              <select v-model="nuevoEmpleado.tipoContrato" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="INDETERMINADO">Indeterminado</option>
                <option value="TEMPORAL">Temporal</option>
                <option value="HONORARIOS">Honorarios</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Estatus</label>
              <select v-model="nuevoEmpleado.estatus" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>
            <div class="col-span-2 flex justify-end gap-3 mt-6">
              <button type="button" @click="mostrarModalCrear = false" class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium shadow-sm">Crear Empleado</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalEditar" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" @click="mostrarModalEditar = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span class="material-icons-outlined mr-2 text-orange-500">edit</span>
            Editar Empleado
          </h3>
          <form @submit.prevent="guardarEdicion" class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
              <input v-model="empleadoEditando.nombre" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">RFC</label>
              <input v-model="empleadoEditando.rfc" type="text" disabled class="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-gray-500 cursor-not-allowed">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">No. Empleado</label>
              <input v-model="empleadoEditando.numeroEmpleado" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Puesto</label>
              <input v-model="empleadoEditando.puesto" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Salario Mensual</label>
              <input v-model="empleadoEditando.salarioMensual" type="number" step="0.01" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Contrato</label>
              <select v-model="empleadoEditando.tipoContrato" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                <option value="INDETERMINADO">Indeterminado</option>
                <option value="TEMPORAL">Temporal</option>
                <option value="HONORARIOS">Honorarios</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Estatus</label>
              <select v-model="empleadoEditando.estatus" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>
            <div class="col-span-2 flex justify-end gap-3 mt-6">
              <button type="button" @click="mostrarModalEditar = false" class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium shadow-sm">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </MainLayout>
</template>