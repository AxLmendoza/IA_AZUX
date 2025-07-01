<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo 1" class="logo" />
        <span class="plus">+</span>
        <img src="@/assets/AI.png" alt="Logo 2" class="logo" />
      </div>

      <h2>INICIAR SESIÓN</h2>

      <form @submit.prevent="handleLogin">
        <input v-model="email" type="text" placeholder="Usuario o Email" required />
        <input v-model="pwd" type="password" placeholder="Contraseña" required />
        <button type="submit">Acceder</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '', 
      pwd: '',   
      error: ''
    };
  },
  methods: {
    ...mapActions('auth', ['login']),
    async handleLogin() {
      try {
        await this.login({ email: this.email, pwd: this.pwd });
        this.$router.push('/home');
      } catch (err) {
        console.log('Login error:', err);
        this.error = err.response?.data?.error || 'Error al iniciar sesión';
      }
    }
  }
};
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
  width: 320px;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0px;
  margin-bottom: 20px;
}

.logo {
  height: 120px;
  object-fit: contain;
}

.plus {
  color: white;
  font-size: 28px;
  font-weight: bold;
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