<template>
  <div class="home-page">
    <h1 class="title">Cotizaciones Generadas</h1>

    <table class="quote-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Correo</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>PDF</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="quote in quotes" :key="quote.id">
          <td>{{ quote.id }}</td>
          <td>{{ quote.cliente }}</td>
          <td>{{ quote.email }}</td>
          <td>{{ quote.fecha }}</td>
          <td>
            <span :class="['status', quote.estado.toLowerCase()]">
              {{ quote.estado }}
            </span>
          </td>
          <td>
            <button @click="descargarPDF(quote.id)">📄</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      quotes: [
        {
          id: 'Q-001',
          cliente: 'Carlos López',
          email: 'carlos@example.com',
          fecha: '2025-06-03',
          estado: 'Aprobada'
        },
        {
          id: 'Q-002',
          cliente: 'María Pérez',
          email: 'maria@example.com',
          fecha: '2025-06-01',
          estado: 'Pendiente'
        },
        {
          id: 'Q-003',
          cliente: 'Luis Torres',
          email: 'luis@example.com',
          fecha: '2025-05-30',
          estado: 'Rechazada'
        }
      ]
    }
  },
  methods: {
    descargarPDF(id) {
      alert(`Aquí se descargaría el PDF de la cotización ${id} 😘`)
      // Luego se conectara con el backend: window.open(`/api/pdf/${id}`) creo bb 
    }
  }
}
</script>

<style scoped>
.home-page {
  padding: 30px;
  background-color: #0d1117;
  min-height: 100vh;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #fff;
}

.quote-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #161b22;
  border-radius: 10px;
  overflow: hidden;
}

.quote-table th,
.quote-table td {
  padding: 12px 16px;
  text-align: left;
  color: #d1d5da;
}

.quote-table thead {
  background-color: #21262d;
}

.quote-table tbody tr:hover {
  background-color: #1f2937;
}

.status {
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
}

.status.aprobada {
  background-color: #238636;
  color: white;
}

.status.pendiente {
  background-color: #d29922;
  color: white;
}

.status.rechazada {
  background-color: #f85149;
  color: white;
}

button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #58a6ff;
}
</style>
