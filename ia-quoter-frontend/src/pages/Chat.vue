<template>
  <div class="chat-page">
    <!-- Header con ID y iconos -->
    <div class="chat-header">
      <div class="header-left">
        <span class="session-id">ID: 1</span>
      </div>
      <div class="header-center">
        <h2>AI Coti</h2>
      </div>
      <div class="header-right">
        <i class="icon-bell"></i>
        <i class="icon-code"></i>
        <i class="icon-arrow-down"></i>
      </div>
    </div>

    <!-- Mensajes -->
    <div class="chat-messages" ref="chatScroll">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.sender]"
      >
        <div class="avatar">
          <span v-if="msg.sender === 'bot'">🤖</span>
          <span v-else>👤</span>
        </div>
        <div class="bubble">
          <!-- Si es bot, añadir un animal al inicio -->
          <span v-if="msg.sender === 'bot'" class="animal"> </span>{{ msg.text }}
        </div>
      </div>
    </div>

    <!-- Entrada -->
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
        {
          sender: 'bot',
          text: 'Hola soy tu asistente de cotizaciones. ¿En qué te puedo ayudar hoy?'
        }
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

      // Simular respuesta del bot con cariño y un animal
      setTimeout(() => {
        this.messages.push({
          sender: 'bot',
          text: this.getMockResponse(text)
        })
        this.scrollToBottom()
      }, 800)
    },
    getMockResponse(input) {
      const lower = input.toLowerCase()
      if (lower.includes('precio')) {
        return '¿Podrías especificar el producto o servicio para cotizarlo?'
      }
      if (lower.includes('hola')) {
        return '¡Hola! ¿Necesitas una cotización o más detalles?'
      }
      return 'Gracias por tu mensaje. Te responderé en seguida con la info solicitada.'
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
  color: #c9d1d9;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: #161b22;
  border-bottom: 1px solid #21262d;
}
.header-left .session-id {
  font-size: 14px;
  background: #21262d;
  padding: 4px 8px;
  border-radius: 4px;
}
.header-center h2 {
  margin: 0;
  font-size: 18px;
}
.header-right i {
  margin-left: 12px;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 12px;
}
.message.bot {
  justify-content: flex-start;
}
.message.user {
  justify-content: flex-end;
}

.avatar {
  width: 32px;
  height: 32px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.message.user .avatar {
  margin-left: 8px;
  margin-right: 0;
}

.bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.4;
  font-size: 15px;
  position: relative;
}
.message.bot .bubble {
  background-color: #21262d;
  color: #c9d1d9;
  border-bottom-left-radius: 4px;
}
.message.user .bubble {
  background-color: #238636;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.animal {
  margin-right: 4px;
}

.chat-input {
  display: flex;
  padding: 12px 20px;
  border-top: 1px solid #21262d;
  background-color: #161b22;
}
.chat-input input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background-color: #21262d;
  color: #c9d1d9;
}
.chat-input button {
  margin-left: 12px;
  padding: 10px 20px;
  background-color: #238636;
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
}
</style>
