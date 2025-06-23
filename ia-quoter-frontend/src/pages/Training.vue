<template>
  <div class="training-container">
    <h2>📂 & 🤖 Entrenamiento IA</h2>
    <div class="chat-messages">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['message', msg.role]"
      >
        <div class="avatar" v-if="msg.role === 'assistant'">
          <img src="@/assets/logo.png" alt="IA" class="avatar-img" />
        </div>
        <div class="bubble" :class="msg.role === 'user' ? 'right' : 'left'">
          <span class="message-text">{{ msg.content }}</span>
        </div>
        <div class="avatar" v-if="msg.role === 'user'">🧑</div>
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="userInput"
        placeholder="Escribe tu respuesta..."
        @keyup.enter="enviarMensaje"
      />
      <button class="send-btn" @click="enviarMensaje" :disabled="!userInput">⬆️</button>
    </div>
    <button
      v-if="puedeGenerarPDF"
      class="pdf-btn"
      @click="generarCotizacion"
    >
      Generar Cotización PDF
    </button>
    <div v-if="pdfUrl">
      <a :href="pdfUrl" download="cotizacion.pdf">Descargar PDF</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrainingPage',
  data() {
    return {
      messages: [
        {
          role: 'assistant',
          content:
            '¡Hola! Para generar tu cotización necesito algunos datos. ¿Cuál es tu nombre?'
        }
      ],
      userInput: '',
      cliente: '',
      email: '',
      requerimiento: '',
      pdfUrl: ''
    };
  },
  computed: {
    puedeGenerarPDF() {
      return this.cliente && this.email && this.requerimiento;
    }
  },
  methods: {
    async enviarMensaje() {
      if (!this.userInput) return;

      this.messages.push({ role: 'user', content: this.userInput });

      if (!this.cliente) {
        this.cliente = this.userInput;
        this.messages.push({
          role: 'assistant',
          content: 'Gracias. ¿Cuál es tu correo electrónico?'
        });
      } else if (!this.email) {
        this.email = this.userInput;
        this.messages.push({
          role: 'assistant',
          content: 'Perfecto. ¿Cuál es tu necesidad o requerimiento?'
        });
      } else if (!this.requerimiento) {
        this.requerimiento = this.userInput;
        this.messages.push({
          role: 'assistant',
          content:
            '¡Listo! Ya tengo todos tus datos. Haz clic en "Generar Cotización PDF" para obtener tu cotización.'
        });
      } else {
        this.messages.push({
          role: 'assistant',
          content:
            'Ya tengo todos los datos necesarios. Si deseas actualizar algo, vuelve a empezar o genera tu PDF.'
        });
      }

      this.userInput = '';
    },
    async generarCotizacion() {
      console.log('Enviando datos al backend...');
      const response = await fetch('http://localhost:2018/api/quote/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: this.cliente,
          email: this.email,
          requerimiento: this.requerimiento
        })
      });
      console.log('Respuesta recibida:', response);
      if (!response.ok) {
        alert('Error generando la cotización');
        return;
      }
      const blob = await response.blob();
      this.pdfUrl = window.URL.createObjectURL(blob);
      this.messages.push({
        role: 'assistant',
        content: '¡Cotización generada! Puedes descargar tu PDF abajo.'
      });
    }
  }
};
</script>

<style scoped>
.training-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #181c24;
  border-radius: 12px;
  color: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}
.chat-messages {
  max-height: 350px;
  overflow-y: auto;
  padding: 1rem;
  background: #161b22;
  border-radius: 10px;
  margin-bottom: 1rem;
}
.message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 12px;
}
.message.assistant {
  flex-direction: row;
  justify-content: flex-start;
}
.message.user {
  flex-direction: row-reverse;
  justify-content: flex-end;
}
.avatar {
  width: 32px;
  height: 32px;
  margin: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
}
.bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.4;
  font-size: 15px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.bubble.left {
  background-color: #fff;
  color: #22272e;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 16px;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  margin-right: auto;
}
.bubble.right {
  background-color: #238636;
  color: #fff;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 16px;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  margin-left: auto;
}
.message-text {
  word-break: break-word;
}
.chat-input {
  display: flex;
  align-items: center;
  padding: 8px 0;
}
.chat-input input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #21262d;
  color: #fff;
  margin-right: 12px;
  font-size: 15px;
}
.send-btn {
  background: #238636;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.send-btn:disabled {
  background: #444c56;
  cursor: not-allowed;
}
.pdf-btn {
  background: #1e88e5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
}
.pdf-btn:disabled {
  background: #444c56;
  cursor: not-allowed;
}
.training-container a {
  display: inline-block;
  margin-top: 1rem;
  color: #1e88e5;
  text-decoration: underline;
}
</style>