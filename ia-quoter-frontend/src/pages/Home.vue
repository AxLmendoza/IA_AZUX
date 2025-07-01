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
      <th>Eliminar</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="quote in quotes" :key="quote._id">
      <td>{{ quote._id }}</td>
      <td>{{ quote.cliente }}</td>
      <td>{{ quote.email }}</td>
      <td>{{ new Date(quote.fecha).toLocaleString() }}</td>
      <td>
        <span :class="['status', (quote.estado || 'pendiente').toLowerCase()]">
          {{ quote.estado || 'Pendiente' }}
        </span>
      </td>
      <td style="text-align: center;">
        <button @click="descargarPDF(quote._id)">
          <i class="fas fa-file-pdf"></i>
        </button>
      </td>
      <td style="text-align: center;">
        <button @click="eliminarCotizacion(quote._id)">
          <i class="fas fa-trash-alt"></i>
        </button>
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
      quotes: []
    }
  },
  async mounted() {
    const res = await fetch('http://localhost:2018/api/quote/all');
    this.quotes = await res.json();
  },
  methods: {
    descargarPDF(id) {
      window.open(`http://localhost:2018/api/quote/pdf/${id}`);
    },
    async eliminarCotizacion(id) {
      if (!confirm('¿Seguro que deseas eliminar esta cotización?')) return;
      const res = await fetch(`http://localhost:2018/api/quote/${id}`, { method: 'DELETE' });
      if (res.ok) {
        this.quotes = this.quotes.filter(q => q._id !== id);
      } else {
        alert('Error eliminando la cotización');
      }
    }
  }
}
</script>

<style scoped>
button i {
  font-size: 20px;
  color: #58a6ff;
}
button:hover i.fa-trash-alt {
  color: #f85149;
}
button:hover i.fa-file-pdf {
  color: #d29922;
}
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

.quote-table td:nth-child(6),
.quote-table td:nth-child(7) {
  text-align: center;
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
