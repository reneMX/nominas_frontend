<template>
  <div class="login">
    <h2>Iniciar sesión</h2>

    <form @submit.prevent="login">
      <input v-model="email" placeholder="Email" type="email" required />
      <input v-model="password" placeholder="Contraseña" type="password" required />

      <button type="submit">Entrar</button>
    </form>

    <p v-if="error" style="color:red;">{{ error }}</p>
  </div>
</template>

<script>
import api from "../api/axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async login() {
      try {
        const res = await api.post("/auth/login", {
          email: this.email,
          password: this.password
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        this.$router.push("/nominas");

      } catch (e) {
        this.error = "Credenciales incorrectas";
      }
    }
  }
};
</script>
