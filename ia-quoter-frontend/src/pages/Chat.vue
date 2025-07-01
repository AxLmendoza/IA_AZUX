<template>
  <div class="chat-page">
    <!-- Header -->
    <div class="chat-header">
      <span class="chat-id">ID: {{ currentConversation.id }}</span>
    </div>

    <!-- Mensajes -->
    <div class="chat-messages">
      <div
        v-for="(msg, i) in currentConversation.messages"
        :key="i"
        :class="['message', msg.role]"
      >
        <!-- IA a la izquierda -->
        <template v-if="msg.role === 'assistant'">
          <div class="avatar left">
            <img src="@/assets/logo.png" alt="IA" class="avatar-img" />
          </div>
          <div class="bubble left">
            <span class="message-text">{{ msg.content }}</span>
          </div>
        </template>
        <!-- Usuario a la derecha -->
        <template v-else-if="msg.role === 'user'">
          <div class="bubble right">
            <span class="message-text">{{ msg.content }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Input -->
    <div class="chat-input">
      <input
        v-model="userInput"
        placeholder="Escribe tu mensaje..."
        @keyup.enter="enviarMensaje"
      />
      <button class="send-btn" @click="enviarMensaje" :disabled="!userInput">⬆️</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatPage',
  data() {
    return {
      userInput: '',
      conversaciones: JSON.parse(localStorage.getItem('conversaciones') || '[]'),
      currentConversation: {
        id: null,
        messages: []
      }
    };
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        this.cargarConversacion(newId);
      }
    }
  },
  methods: {
    cargarConversacion(id) {
      const conv = this.conversaciones.find(c => c.id == id);
      if (conv) {
        this.currentConversation = conv;
      } else {
        this.currentConversation = {
          id,
          messages: [
            {
              role: 'system',
              content:
                '¡Hola! Estás en el lugar correcto. Podemos ayudarte a crear una web increíble para tu restaurante. ¿Me compartes tu nombre y correo electrónico para enviarte una cotización personalizada?'
            }
          ]
        };
        this.conversaciones.push(this.currentConversation);
        localStorage.setItem('conversaciones', JSON.stringify(this.conversaciones));
      }
    },
    async enviarMensaje() {
      if (!this.userInput) return;
      this.currentConversation.messages.push({
        role: 'user',
        content: this.userInput
      });

      const respuesta = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization:
              'Bearer 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',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192',
            messages: this.currentConversation.messages,
            max_tokens: 100
          })
        }
      ).then(res => res.json());

      const aiMsg =
        respuesta.choices?.[0]?.message?.content || 'Sin respuesta';
      this.currentConversation.messages.push({
        role: 'assistant',
        content: aiMsg
      });

      this.userInput = '';
      localStorage.setItem(
        'conversaciones',
        JSON.stringify(this.conversaciones)
      );
    }
  }
};
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #0d1117;
  color: #c9d1d9;
  min-height: 0; 
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
}
.chat-id {
  font-size: 14px;
  background: #21262d;
  padding: 4px 8px;
  border-radius: 4px;
}

.chat-messages {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 20px;
  min-height: 0; 
  scrollbar-width: none;
  -ms-overflow-style: none; 
}

.chat-messages::-webkit-scrollbar {
  display: none; 
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
  font-size: 22px;
}

.avatar-img {
  width: 35px;
  height: 35px;
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
  background-color: #1d1d1d;
  color: #ffffff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 16px;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  margin-right: auto;
}

.bubble.right {
  background-color: #474747;
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
  padding: 16px 20px;
  background: #161b22;
  border-top: 1px solid #222;
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

html, body {
  height: 100%;
  overflow: hidden;
}
</style>