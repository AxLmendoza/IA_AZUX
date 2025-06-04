<template>
  <div class="chat-page">
    <div class="chat-header">
      <h2>AI </h2>
    </div>

    <div class="chat-messages" ref="chatScroll">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.sender]"
      >
        <div class="bubble">{{ msg.text }}</div>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="Escribe tu mensaje..."
      />
      <button @click="sendMessage">Enviar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatPage',
  data() {
    return {
      userInput: '',
      messages: [
        { sender: 'bot', text: 'Hola 👋 Soy tu asistente de cotizaciones. ¿En qué te puedo ayudar hoy?' }
      ]
    }
  },
  methods: {
    sendMessage() {
      const text = this.userInput.trim()
      if (!text) return

      this.messages.push({ sender: 'user', text })
      this.userInput = ''

      this.scrollToBottom()

      // Simular respuesta del bot por el momento 
      setTimeout(() => {
        this.messages.push({
          sender: 'bot',
          text: this.getMockResponse(text)
        })
        this.scrollToBottom()
      }, 1000)
    },
    getMockResponse(input) {
      // Aquí se reemplaza despues a el back
      if (input.toLowerCase().includes('precio')) {
        return '¿Podrías especificar el producto o servicio para cotizarlo?'
      }
      if (input.toLowerCase().includes('hola')) {
        return '¡Hola! ¿Necesitas una cotización o información sobre un producto?'
      }
      return 'Gracias por tu mensaje. En breve te daré una respuesta personalizada.'
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.chatScroll
        el.scrollTop = el.scrollHeight
      })
    }
  }
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #0d1117;
}

.chat-header {
  padding: 20px;
  background-color: #161b22;
  border-bottom: 1px solid #21262d;
  color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #0d1117;
}

.message {
  margin-bottom: 10px;
  display: flex;
}

.message.bot {
  justify-content: flex-start;
}

.message.user {
  justify-content: flex-end;
}

.bubble {
  padding: 12px 16px;
  border-radius: 16px;
  max-width: 70%;
  line-height: 1.4;
  font-size: 15px;
}

.message.bot .bubble {
  background-color: #21262d;
  color: #d1d5da;
  border-bottom-left-radius: 0;
}

.message.user .bubble {
  background-color: #238636;
  color: white;
  border-bottom-right-radius: 0;
}

.chat-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #21262d;
  background-color: #161b22;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background-color: #21262d;
  color: white;
}

.chat-input button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #238636;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}
</style>
