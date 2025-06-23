<template>
  <v-app>
    <!-- Ojo al piojo  -->
    <v-navigation-drawer app permanent dark elevation="2" width="260" class="sidebar-gradient" rounded>
      <!-- ====== SOLO LOGO EN LA PARTE SUPERIOR XD ====== -->
      <v-list-item class="logo-container">
        <v-img src="@/assets/logo.png" contain height="68" width="68" />
      </v-list-item>

      <v-divider class="divider-user"></v-divider>

      <v-list dense nav class="mt-2">
        <!-- Home -->
        <v-list-item :to="{ name: 'Home' }" exact router active-class="active-item" class="sidebar-item">
          <v-list-item-icon>
            <v-icon class="sidebar-icon">mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Inicio</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Chat IA + Mensajes -->
        <v-list-group v-model="chatOpen" no-action prepend-icon="" append-icon="" class="message-group">
          <template #activator>
            <v-list-item class="sidebar-item group-activator">
              <v-list-item-icon>
                <v-icon class="sidebar-icon">mdi-chat-processing</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>MENSAJES</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon class="rotate-icon">
                <v-icon :class="{ 'rotated': chatOpen }">mdi-chevron-down</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </template>

          <!-- Botón para nueva conversación -->
          <v-list-item
            @click="nuevaConversacion"
              class="sidebar-item message-item new-conv-btn"
               style="cursor:pointer;"
>
  <v-list-item-content>
    <v-list-item-subtitle class="message-text">
      + Nueva conversación
    </v-list-item-subtitle>
  </v-list-item-content>
</v-list-item>

          <!-- Historial de conversaciones -->
          <v-list-item v-for="conv in conversaciones" :key="conv.id" :to="{ name: 'Chat', params: { id: conv.id } }"
            router class="sidebar-item message-item">
            <v-list-item-content>
              <v-list-item-subtitle class="message-text">
                {{ conv.titulo || 'Conversación ' + conv.id }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon small @click.stop="borrarConversacion(conv.id)" color="red">mdi-delete</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>

        <!-- Entrenamiento + History Training (grupo desplegable, SIN "Ir a Entrenamiento") -->
        <v-list-group v-model="trainingOpen" no-action prepend-icon="" append-icon="" class="training-group mt-2">
          <!-- Activador del grupo -->
          <template #activator>
            <v-list-item class="sidebar-item group-activator">
              <v-list-item-icon>
                <v-icon class="sidebar-icon">mdi-upload</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Entrenamiento</v-list-item-title>
              </v-list-item-content>
              <!-- Única flecha giratoria -->
              <v-list-item-icon class="rotate-icon">
                <v-icon :class="{ 'rotated': trainingOpen }">mdi-chevron-down</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </template>
          <!-- History Training -->

<v-list-item
  :to="{ name: 'Training' }"
  router
  class="sidebar-item training-btn"
>
  <v-list-item-icon>
    <v-icon class="sidebar-icon">mdi-upload</v-icon>
  </v-list-item-icon>
  <v-list-item-content>
    <v-list-item-title>Ir a Entrenamiento</v-list-item-title>
  </v-list-item-content>
</v-list-item>

        </v-list-group>
      </v-list>

      <v-spacer></v-spacer>

      <!-- ====== BOTÓN DE LOGOUT CENTRADO ====== -->
      <div class="logout-container">
        <v-btn color="red darken-2" dark class="logout-btn" @click="logout">
          <v-icon left>mdi-logout</v-icon>
          Salir
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- CONTENIDO PRINCIPAL -->
    <v-main>
      <v-container fluid class="pa-4 main-bg">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'SidebarLayout',
  data() {
    return {
      chatOpen: true,
      trainingOpen: false,
      conversaciones: JSON.parse(localStorage.getItem('conversaciones') || '[]')
    };
  },
  methods: {
    nuevaConversacion() {
      const nuevoId = Date.now();
      const nueva = {
        id: nuevoId,
        titulo: 'Conversación ' + (this.conversaciones.length + 1),
        messages: [
          { role: 'system', content: 'Eres un asistente útil.' }
        ]
      };
      this.conversaciones.push(nueva);
      localStorage.setItem('conversaciones', JSON.stringify(this.conversaciones));
      this.$router.push({ name: 'Chat', params: { id: nuevoId } });
    },
    borrarConversacion(id) {
      this.conversaciones = this.conversaciones.filter(c => c.id !== id);
      localStorage.setItem('conversaciones', JSON.stringify(this.conversaciones));
      // Si la conversación borrada está activa, redirige al home
      if (this.$route.name === 'Chat' && this.$route.params.id == id) {
        this.$router.push({ name: 'home' });
      }
    },
    logout() {
      this.$router.push('/');
    }
  },
  watch: {
    // Guarda el historial si cambia
    conversaciones: {
      handler(val) {
        localStorage.setItem('conversaciones', JSON.stringify(val));
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.new-conv-btn {
  background-color: #22384d !important; /*Color del Boton de nueva conversasion */
  color: #fff !important;
}
.new-conv-btn:hover {
  background-color: #1565c0 !important;
}
/* ----------------------------------
   GRADIENTE SUTIL PARA EL SIDEBAR
----------------------------------- */
.sidebar-gradient {
  background: linear-gradient(180deg,
      #161b22 0%,
      #171f24 30%,
      #161b22 100%);
}

/* ----------------------------------
   SOLO LOGO EN LA PARTE SUPERIOR
----------------------------------- */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 26px 18px 22px;
}

/* ----------------------------------
   DIVIDER DEBAJO DEL LOGO
----------------------------------- */
.divider-user {
  background-color: #30363d !important;
  margin: 0 25px;
}

/* ----------------------------------
   ÍTEM DE LISTA (GENÉRICO)
----------------------------------- */
.sidebar-item {
  transition: background-color 0.3s, transform 0.2s;
  border-radius: 6px 0 0 6px;
  margin-right: -12px;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
  transform: translateX(2px);
}

/* ÍCONOS DEL SIDEBAR (tamaño + transición) */
.sidebar-icon {
  font-size: 24px !important;
  transition: color 0.3s, transform 0.3s;
  color: #8b949e;
}

.sidebar-item:hover .sidebar-icon {
  color: #c9d1d9;
  transform: scale(1.1);
}

/* ----------------------------------
   TEXTO DE TÍTULOS
----------------------------------- */
.v-list-item-title {
  font-weight: 500;
  color: #c9d1d9 !important;
}

/* ----------------------------------
   ESTADO “ACTIVO” DE UN ÍTEM
----------------------------------- */
.active-item {
  background-color: #2ea44f !important;
  border-right: 4px solid #36d07b;
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}

.active-item .v-list-item-title {
  color: #ffffff !important;
}

.active-item .sidebar-icon {
  color: #ffffff !important;
}

/* ----------------------------------
   GRUPO “CHAT IA + MENSAJES”
----------------------------------- */
.group-activator {
  display: flex;
  align-items: center;
}

.rotate-icon {
  transition: transform 0.3s;
}

.rotate-icon .rotated {
  transform: rotate(180deg);
}

/* ÍTEMS HIJOS (solo mensajes) */
.message-item {
  padding-left: 56px;
  border-radius: 6px 0 0 6px;
  transition: background-color 0.3s;
  margin-right: -12px;
}

.message-item:hover {
  background-color: rgba(255, 255, 255, 0.04) !important;
}

.message-text {
  font-size: 13px;
  color: #8b949e;
  line-height: 1.3;
}

/* ----------------------------------
   GRUPO “ENTRENAMIENTO + HISTORY TRAINING”
----------------------------------- */
.training-group .group-activator {
  display: flex;
  align-items: center;
}

.training-group .rotate-icon {
  transition: transform 0.3s;
}

.training-group .rotated {
  transform: rotate(180deg);
}

.history-item {
  display: flex;
  align-items: flex-start;
  padding-left: 56px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 6px 0 0 6px;
  transition: background-color 0.3s;
  margin-right: -12px;
}

.history-item:hover {
  background-color: rgba(255, 255, 255, 0.06) !important;
}

.history-title {
  color: #c9d1d9;
  font-weight: 600;
  font-size: 14px;
}

.history-date {
  font-size: 12px;
  color: #8b949e;
  margin-top: 2px;
}

.history-desc {
  font-size: 12px;
  color: #8b949e;
  margin-top: 4px;
  line-height: 1.3em;
}

/* ----------------------------------
   BOTÓN DE LOGOUT CENTRADO
----------------------------------- */
.logout-container {
  display: flex;
  justify-content: center;
  padding-bottom: 24px;
}

.logout-btn {
  width: 80%;
  transition: transform 0.2s;
}

.logout-btn:hover {
  transform: translateY(-2px);
}

/* ----------------------------------
   FONDO PRINCIPAL DETRÁS DEL SIDEBAR
----------------------------------- */
.main-bg {
  background-color: #0d1117;
  min-height: 100vh;
}

/* ----------------------------------
   DIVIDER GENERAL
----------------------------------- */
.v-divider {
  background-color: #30363d !important;
}
</style>
