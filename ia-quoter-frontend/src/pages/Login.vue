<template>
  <div class="login-page">
    <div class="login-card">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h2>INICIAR SESIÓN</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="username" type="text" placeholder="Usuario" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Acceder</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    handleLogin() {
      // Aquí se va a conectar el back pero despues xd
 if (this.username === 'admin' && this.password === 'admin') {
  this.$router.push({ name: 'Home' }) // Usa el nombre de la ruta
} else {
  this.error = 'Usuario o contraseña incorrectos'
}
    }
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  background-color: #0d1117;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  background-color: #161b22;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 300px;
}

.logo {
  width: 50%;
  margin-bottom: 10px;
}

h2 {
  color: #ffffff;
  margin-bottom: 20px;
}

form input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 6px;
  background-color: #21262d;
  color: white;
}

form button {
  width: 100%;
  padding: 10px;
  background-color: #238636;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: background 0.3s;
}

form button:hover {
  background-color: #2ea043;
}

.error {
  color: #f5f5f5;
  margin-top: 10px;
}
</style>
