<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout.vue";

const router = useRouter();
const route = useRoute();

// =======================
// ESTADO GENERAL
// =======================
const nominas = ref([]);
const empleados = ref([]);
const busqueda = ref("");
const cargando = ref(false);
const procesandoGuardado = ref(false);
const procesandoTimbrado = ref(false);

// =======================
// MODALES
// =======================
const mostrarModalEditar = ref(false);
const mostrarModalCrear = ref(false);
const mostrarModalDetalle = ref(false);

// =======================
// DETALLE / COSTO EMPRESA
// =======================
const nominaDetalle = ref({});
const mostrarCostoEmpresa = ref(false);
const calculandoCosto = ref(false);
const costoEmpresaData = ref({ cargaSocial: 0, isn: 0, total: 0 });

// =======================
// FORM CREACIÓN SIMPLE
// =======================
const nuevaNomina = ref({
  empleadoId: "",
  total: 0
});

// =======================
// FORM EDICIÓN AVANZADA
// =======================
const nominaForm = ref({
  id: null,
  empleadoId: null,
  nombreEmpleado: "",

  diasTrabajados: 15,
  metodoPago: "TRANSFERENCIA",
  estatusNomina: "CALCULADA",

  sueldoBase: 0,
  montoHorasExtras: 0,
  aguinaldo: 0,
  primaVacacional: 0,
  otrosBonos: 0,

  isrRetenido: 0,
  imssEmpleado: 0,
  infonavit: 0,
  otrosDescuentos: 0,

  totalPercepciones: 0,
  totalDeducciones: 0,
  totalNeto: 0
});

// =======================
// UTILIDADES
// =======================
const formatMoney = (v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN"
    }).format(v || 0);

const getIniciales = (nombre = "") =>
    nombre.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "??";


onMounted(() => {
  cargarNominas();
  cargarEmpleados();
});

// =======================
// API
// =======================
async function cargarEmpleados() {
  try {
    const r = await api.get("/empleados");
    empleados.value = r.data;
  } catch {}
}

async function cargarNominas() {
  cargando.value = true;
  try {
    const r = await api.get("/nominas");
    nominas.value = r.data;
  } catch (e) {
    console.error(e);
  } finally {
    cargando.value = false;
  }
}

async function eliminar(id) {
  if (!confirm("¿Eliminar nómina?")) return;
  await api.delete(`/nominas/${id}`);
  nominas.value = nominas.value.filter(n => n.id !== id);
}

// =======================
// FILTRO
// =======================
const nominasFiltradas = computed(() => {
  if (!busqueda.value) return nominas.value;
  const t = busqueda.value.toLowerCase();
  return nominas.value.filter(n =>
      n.empleado?.nombre?.toLowerCase().includes(t) ||
      String(n.reciboId || "").toLowerCase().includes(t)
  );
});

// =======================
// DETALLE
// =======================
function abrirDetalle(n) {
  nominaDetalle.value = n;
  mostrarModalDetalle.value = true;
  mostrarCostoEmpresa.value = false;
}

function calcularCostoPatronal() {
  calculandoCosto.value = true;
  setTimeout(() => {
    const bruto = nominaDetalle.value.totalPercepciones || 0;
    const carga = bruto * 0.28;
    const isn = bruto * 0.03;
    costoEmpresaData.value = {
      cargaSocial: carga,
      isn,
      total: bruto + carga + isn
    };
    calculandoCosto.value = false;
    mostrarCostoEmpresa.value = true;
  }, 800);
}

// =======================
// CREAR
// =======================
function abrirCrear() {
  nuevaNomina.value = { empleadoId: "", total: 0 };
  mostrarModalCrear.value = true;
}

async function guardarCreacion() {
  await api.post("/nominas", {
    empleado: { id: nuevaNomina.value.empleadoId },
    sueldoBase: nuevaNomina.value.total
  });
  await cargarNominas();
  mostrarModalCrear.value = false;
}

// =======================
// EDITAR
// =======================
function abrirEdicion(n) {
  nominaForm.value = {
    ...nominaForm.value,
    ...n,
    empleadoId: n.empleado?.id,
    nombreEmpleado: n.empleado?.nombre
  };
  mostrarModalEditar.value = true;

  recalcularDesdeBackend();
}

// =======================
// TOTALES (SOLO FRONT)
// =======================
const totalesCalculados = computed(() => {
  const p = nominaForm.value;
  const percepciones =
      p.sueldoBase +
      p.montoHorasExtras +
      p.aguinaldo +
      p.primaVacacional +
      p.otrosBonos;

  const deducciones =
      p.isrRetenido +
      p.imssEmpleado +
      p.infonavit +
      p.otrosDescuentos;

  return {
    percepciones,
    deducciones,
    neto: percepciones - deducciones
  };
});

// =======================
// GUARDAR
// =======================
async function guardarEdicion() {
  procesandoGuardado.value = true;
  await api.put(`/nominas/${nominaForm.value.id}`, {
    ...nominaForm.value,
    ...totalesCalculados.value
  });
  await cargarNominas();
  mostrarModalEditar.value = false;
  procesandoGuardado.value = false;
}

// =======================
// recargar
// =======================
function recargar(fn, delay = 600) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

const recalcularDesdeBackend = recargar(async () => {
  procesandoGuardado.value = true;
  try {
    const r = await api.post("/nominas/calcular", {
      empleadoId: nominaForm.value.empleadoId,
      sueldoBase: nominaForm.value.sueldoBase,
      diasTrabajados: nominaForm.value.diasTrabajados,
      montoHorasExtras: nominaForm.value.montoHorasExtras,
      otrosBonos: nominaForm.value.otrosBonos,
      aguinaldo: nominaForm.value.aguinaldo,
      otrosDescuentos: nominaForm.value.otrosDescuentos
    });

    const c = r.data;
    nominaForm.value.isrRetenido = c.isrRetenido;
    nominaForm.value.imssEmpleado = c.imssEmpleado;
  } catch (e) {
    console.error(e);
  } finally {
    procesandoGuardado.value = false;
  }
}, 700);

// =======================
// ESCUCHA
// =======================
watch(
    () => [
      nominaForm.value.sueldoBase,
      nominaForm.value.montoHorasExtras,
      nominaForm.value.otrosBonos,
      nominaForm.value.aguinaldo,
      nominaForm.value.primaVacacional,
      nominaForm.value.otrosDescuentos
    ],
    () => {
      if (mostrarModalEditar.value && !procesandoGuardado.value) {
        recalcularDesdeBackend();
      }
    }
);
</script>



<template>
  <MainLayout>

    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Nóminas</h2>
        <p class="text-sm text-gray-500">Historial y cálculo de pagos.</p>
      </div>
      <div class="flex gap-3 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span class="material-icons-outlined text-gray-400">search</span></span>
          <input v-model="busqueda" type="text" class="block w-full pl-10 border border-gray-300 rounded-lg py-2 text-sm focus:ring-indigo-500" placeholder="Buscar...">
        </div>
        <button @click="abrirCrear" class="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md">
          <span class="material-icons-outlined text-lg mr-1">add</span> Nueva
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-xl overflow-hidden border border-gray-200">
      <div v-if="cargando" class="p-10 text-center text-gray-500"><span class="material-icons-outlined animate-spin">sync</span> Cargando...</div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Recibo</th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Empleado</th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estatus</th>
          <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Neto</th>
          <th class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
        <tr v-for="n in nominasFiltradas" :key="n.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 font-mono text-sm text-indigo-600 font-bold">{{ n.reciboId || n.id }}</td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs mr-3">{{ getIniciales(n.empleado?.nombre) }}</div>
              <div><div class="text-sm font-medium text-gray-900">{{ n.empleado?.nombre }}</div><div class="text-xs text-gray-500">{{ n.empleado?.puesto }}</div></div>
            </div>
          </td>
          <td class="px-6 py-4"><span :class="['px-2 text-xs font-semibold rounded-full', n.estatusNomina === 'PAGADA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">{{ n.estatusNomina || 'PENDIENTE' }}</span></td>
          <td class="px-6 py-4 text-right font-bold text-gray-800">{{ formatMoney(n.totalNeto || n.total) }}</td>
          <td class="px-6 py-4 text-center">
            <div class="flex justify-center gap-1">
              <button @click="abrirDetalle(n)" class="text-blue-600 p-1.5 hover:bg-blue-50 rounded" title="Ver Detalle"><span class="material-icons-outlined">visibility</span></button>
              <button @click="verXML(n.id, n.reciboId)" class="text-indigo-600 p-1.5 hover:bg-indigo-50 rounded" title="XML"><span class="material-icons-outlined">code</span></button>
              <button @click="abrirEdicion(n)" class="text-amber-500 p-1.5 hover:bg-amber-50 rounded" title="Editar Conceptos"><span class="material-icons-outlined">edit</span></button>
              <button @click="eliminar(n.id)" class="text-red-400 p-1.5 hover:bg-red-50 rounded" title="Eliminar"><span class="material-icons-outlined">delete</span></button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mostrarModalDetalle" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in-up">
        <div class="bg-indigo-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h3 class="text-xl font-bold text-white flex items-center"><span class="material-icons-outlined mr-2">receipt_long</span> {{ nominaDetalle.reciboId }}</h3>
          <button @click="mostrarModalDetalle = false" class="text-indigo-100 hover:text-white"><span class="material-icons-outlined text-2xl">close</span></button>
        </div>
        <div class="p-6 overflow-y-auto">
          <div class="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <div class="h-12 w-12 rounded-full bg-white border text-indigo-700 flex items-center justify-center font-bold text-lg mr-4">{{ getIniciales(nominaDetalle.empleado?.nombre) }}</div>
            <div><h4 class="text-lg font-bold text-gray-800">{{ nominaDetalle.empleado?.nombre }}</h4><p class="text-sm text-gray-600">{{ nominaDetalle.empleado?.puesto }} | RFC: {{ nominaDetalle.empleado?.rfc }}</p></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="border border-green-100 rounded-lg overflow-hidden">
              <div class="bg-green-50 px-4 py-2 border-b border-green-100 font-bold text-green-800">Percepciones</div>
              <div class="p-4 space-y-2 text-sm">
                <div class="flex justify-between"><span>Sueldo Base</span><span>{{ formatMoney(nominaDetalle.sueldoBase) }}</span></div>
                <div class="flex justify-between"><span>Bonos/Otros</span><span>{{ formatMoney(nominaDetalle.otrosBonos + nominaDetalle.aguinaldo) }}</span></div>
                <div class="flex justify-between font-bold border-t pt-2"><span>TOTAL</span><span>{{ formatMoney(nominaDetalle.totalPercepciones) }}</span></div>
              </div>
            </div>
            <div class="border border-red-100 rounded-lg overflow-hidden">
              <div class="bg-red-50 px-4 py-2 border-b border-red-100 font-bold text-red-800">Deducciones</div>
              <div class="p-4 space-y-2 text-sm">
                <div class="flex justify-between"><span>ISR</span><span>{{ formatMoney(nominaDetalle.isrRetenido) }}</span></div>
                <div class="flex justify-between"><span>IMSS</span><span>{{ formatMoney(nominaDetalle.imssEmpleado) }}</span></div>
                <div class="flex justify-between font-bold border-t pt-2"><span>TOTAL</span><span>{{ formatMoney(nominaDetalle.totalDeducciones) }}</span></div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-5 border border-gray-200 shadow-inner">
            <div class="flex justify-between items-center mb-4">
              <h4 class="font-bold text-gray-700 flex items-center"><span class="material-icons-outlined mr-2 text-amber-500">analytics</span> Análisis Costo Empresa</h4>
              <button v-if="!mostrarCostoEmpresa && !calculandoCosto" @click="calcularCostoPatronal" class="text-xs bg-white border px-3 py-1 rounded-full hover:text-indigo-600">Calcular Ahora</button>
            </div>
            <div v-if="calculandoCosto" class="text-center text-gray-500"><span class="material-icons-outlined animate-spin">settings</span> Calculando...</div>
            <div v-if="mostrarCostoEmpresa" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-white p-3 rounded border shadow-sm"><span class="block text-xs text-gray-400">Total Percepciones</span><span class="block font-bold">{{ formatMoney(nominaDetalle.totalPercepciones) }}</span></div>
              <div class="bg-white p-3 rounded border shadow-sm"><span class="block text-xs text-gray-400">Carga Social (28%)</span><span class="block font-bold text-amber-600">+ {{ formatMoney(costoEmpresaData.cargaSocial) }}</span></div>
              <div class="bg-indigo-50 p-3 rounded border shadow-sm"><span class="block text-xs text-indigo-400 font-bold">COSTO TOTAL</span><span class="block font-bold text-indigo-700 text-lg">{{ formatMoney(costoEmpresaData.total) }}</span></div>
            </div>
          </div>
        </div>
        <div class="bg-gray-100 px-6 py-4 rounded-b-xl flex justify-between items-center">
          <button @click="mostrarModalDetalle = false" class="text-gray-500 font-medium text-sm">Cerrar</button>
          <div class="flex gap-3">
            <button @click="imprimirPDFLocal" class="flex items-center px-4 py-2 bg-white border rounded hover:bg-gray-50 text-indigo-600 text-sm font-medium"><span class="material-icons-outlined mr-2">print</span> Imprimir</button>
            <button @click="simularTimbrado" :disabled="procesandoTimbrado" class="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium">{{ procesandoTimbrado ? 'Timbrando...' : 'Timbrar Nómina' }}</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalEditar" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-indigo-700 px-6 py-4 flex justify-between items-center shadow-md shrink-0">
          <div><h3 class="text-lg font-bold text-white">Editar Nómina #{{ nominaForm.id }}</h3><p class="text-indigo-200 text-xs">{{ nominaForm.nombreEmpleado }}</p></div>
          <button @click="mostrarModalEditar = false" class="text-white hover:text-indigo-200"><span class="material-icons-outlined">close</span></button>
        </div>

        <div class="p-6 overflow-y-auto grow bg-gray-50">
          <form @submit.prevent="guardarEdicion" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label class="block text-xs font-bold text-gray-500 uppercase">Días Trab.</label><input v-model.number="nominaForm.diasTrabajados" type="number" class="w-full mt-1 border-gray-300 rounded text-sm"></div>
              <div><label class="block text-xs font-bold text-gray-500 uppercase">Método Pago</label>
                <select v-model="nominaForm.metodoPago" class="w-full mt-1 border-gray-300 rounded text-sm bg-white"><option>EFECTIVO</option><option>TRANSFERENCIA</option><option>CHEQUE</option></select>
              </div>
              <div><label class="block text-xs font-bold text-gray-500 uppercase">Estatus</label>
                <select v-model="nominaForm.estatusNomina" class="w-full mt-1 border-gray-300 rounded text-sm bg-white"><option>CALCULADA</option><option>PENDIENTE</option><option>PAGADA</option></select>
              </div>
            </div>

            <div class="space-y-4">
              <h4 class="font-bold text-indigo-700 border-b border-indigo-200 pb-1">Percepciones (Ingresos)</h4>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase">Sueldo Base</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-400">$</span>
                  <input v-model.number="nominaForm.sueldoBase" type="number" class="pl-7 w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 bg-white font-bold text-gray-800">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase">Aguinaldo</label>
                  <input v-model.number="nominaForm.aguinaldo" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-indigo-500">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase">Bonos Extra</label>
                  <input v-model.number="nominaForm.otrosBonos" type="number" class="w-full border border-gray-300 rounded p-2 focus:ring-indigo-500">
                </div>
              </div>
            </div>

            <div class="space-y-4 mt-6 md:mt-0">
              <h4 class="font-bold text-red-700 border-b border-red-200 pb-1">Deducciones (Impuestos)</h4>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase">ISR Retenido (Automático)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">$</span>
                  <input v-model.number="nominaForm.isrRetenido" type="number" disabled class="pl-7 w-full border border-gray-200 rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed font-medium">
                  <span class="absolute right-3 top-2 text-xs text-green-600 font-bold" v-if="procesandoGuardado">Calculando...</span>
                </div>
                <p class="text-[10px] text-gray-400 mt-1">* Calculado por sistema según tablas ISR vigentes.</p>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase">Cuota IMSS (Automático)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">$</span>
                  <input v-model.number="nominaForm.imssEmpleado" type="number" disabled class="pl-7 w-full border border-gray-200 rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed font-medium">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase">Otros Descuentos (Préstamos, etc)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-400">$</span>
                  <input v-model.number="nominaForm.otrosDescuentos" type="number" class="pl-7 w-full border border-gray-300 rounded p-2 focus:ring-red-500 text-red-600">
                </div>
              </div>
            </div>
            <div class="lg:col-span-1 flex flex-col gap-4">
              <div class="bg-gray-800 text-white p-6 rounded-lg shadow-lg flex flex-col justify-center h-full">
                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 text-center">Resumen Final</h4>
                <div class="flex justify-between mb-2"><span class="text-gray-300">(+) Percepciones</span><span class="font-mono text-green-400">{{ formatMoney(totalesCalculados.percepciones) }}</span></div>
                <div class="flex justify-between mb-6"><span class="text-gray-300">(-) Deducciones</span><span class="font-mono text-red-400">{{ formatMoney(totalesCalculados.deducciones) }}</span></div>
                <div class="border-t border-gray-600 pt-6 block text-center">
                  <span class="text-xs text-gray-400 uppercase">Neto a Pagar</span>
                  <div class="text-4xl font-extrabold text-white mt-2">{{ formatMoney(totalesCalculados.neto) }}</div>
                </div>
              </div>
              <button type="submit" :disabled="procesandoGuardado" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition flex justify-center items-center">
                {{ procesandoGuardado ? 'Guardando...' : 'GUARDAR CAMBIOS EN NÓMINA' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalCrear" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center"><span class="material-icons-outlined mr-2 text-indigo-600">add_circle</span> Nueva Nómina</h3>
        <form @submit.prevent="guardarCreacion" class="space-y-4">
          <div><label class="block text-sm font-medium text-gray-700">Empleado</label>
            <select v-model="nuevaNomina.empleadoId" required class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 bg-white">
              <option value="" disabled>-- Elige un empleado --</option>
              <option v-for="emp in empleados" :key="emp.id" :value="emp.id">{{ emp.nombre }}</option>
            </select>
          </div>
          <div><label class="block text-sm font-medium text-gray-700">Sueldo Base</label><input v-model.number="nuevaNomina.total" type="number" step="0.01" class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" required></div>
          <div class="flex justify-end gap-3 mt-4">
            <button type="button" @click="mostrarModalCrear = false" class="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Crear</button>
          </div>
        </form>
      </div>
    </div>

  </MainLayout>
</template>

<style>
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>