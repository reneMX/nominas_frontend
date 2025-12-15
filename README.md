# 📊 Sistema de Nóminas – Frontend (Vue.js)

Este proyecto corresponde al **frontend de un sistema de nóminas**, desarrollado con **Vue.js 3** y **Vite**, el cual consume una **API REST** para la gestión de empleados, nóminas y otros módulos administrativos.

El objetivo del proyecto es mostrar el uso de Vue.js para construir una **Single Page Application (SPA)** moderna, modular y conectada a un backend.

---

## 🚀 Tecnologías utilizadas

* **Vue.js 3** – Framework de JavaScript
* **Vite** – Servidor de desarrollo y bundler
* **Vue Router** – Manejo de rutas
* **Axios** – Consumo de API REST
* **JavaScript (ES6+)**
* **HTML5 / CSS3**

---

## 📁 Estructura del proyecto

```
src/
├── api/
│   └── axios.js          # Configuración de Axios y URL base
├── views/
│   ├── Nominas.vue       # Vista de nóminas
│   ├── Empleados.vue     # Vista de empleados
│   └── Proyectos.vue     # Otras vistas del sistema
├── components/
│   └── Modales.vue       # Componentes reutilizables
├── layouts/
│   └── MainLayout.vue    # Layout principal (menú, estructura base)
├── router/
│   └── index.js          # Configuración de rutas
├── App.vue
└── main.js               # Punto de entrada de la aplicación
```

---

## ⚙️ Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd nominas-frontend
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Ejecutar el servidor de desarrollo

```bash
npm run dev
```

La aplicación se ejecutará en:

```
http://localhost:5173
```

---

## 🔌 Conexión con el backend

La aplicación se conecta a un backend mediante **Axios**.

### 📄 Configuración de Axios

```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export default api;
```

Las vistas consumen la API usando métodos HTTP como **GET, POST, PUT y DELETE**.

Ejemplo:

```js
import api from "../api/axios";

const obtenerNominas = async () => {
  const response = await api.get("/nominas");
  nominas.value = response.data;
};
```

---

## 🧠 Conceptos de Vue utilizados

* **ref** – Variables reactivas
* **computed** – Propiedades calculadas
* **onMounted** – Ciclo de vida del componente
* **v-model** – Enlace bidireccional en formularios
* **componentes reutilizables**
* **layouts** para estructura común

---

## 🧭 Navegación (Vue Router)

El proyecto utiliza **Vue Router** para manejar las rutas sin recargar la página.

Ejemplo:

```js
{
  path: "/nominas",
  component: () => import("../views/Nominas.vue"),
}
```

Esto permite que la aplicación funcione como una **SPA**.

---

## 🖥️ ¿Vue.js usa servidor?

Sí. Durante el desarrollo, Vue utiliza un servidor (Vite) para servir la aplicación.

En producción:

* El proyecto se **compila**
* Se generan archivos estáticos (HTML, JS, CSS)
* Se despliegan en un servidor web (Apache, Nginx, Laravel, etc.)

---

## ✅ Funcionalidades principales

* Listado de nóminas
* Consulta de información desde API REST
* Formularios con validación básica
* Navegación entre vistas
* Interfaz reactiva sin recarga de página

---

---

✍️ **Autor:** René Martínez

📚 **Materia:** XML y Mapeo
