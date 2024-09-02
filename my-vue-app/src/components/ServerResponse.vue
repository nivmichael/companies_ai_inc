<template>
  <div>
    <h1>Response from Node.js Server</h1>
    <p>{{ serverMessage }}</p>
    <button @click="fetchData">Fetch Data</button>
  </div>
</template>

<script>
import axios from 'axios'; // Install axios if not already: npm install axios

export default {
  name: 'ServerResponse',
  data() {
    return {
      serverMessage: 'No message yet',
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/api/data');
        this.serverMessage = response.data.message;
      } catch (error) {
        console.error('Error fetching data:', error);
        this.serverMessage = 'Error fetching data from the server.';
      }
    },
  },
};
</script>
