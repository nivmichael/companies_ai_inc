<!-- src/views/HomeView.vue -->
<template>
    <div class="home">
      <h2>Welcome to the Company Analytics App</h2>
      <p>Please login to access the full features of the application.</p>
      <nav>
        <router-link to="/archive_map" v-if="!isLoggedIn">archive map</router-link> |
        <a href="#" @click.prevent="logout" v-if="isLoggedIn">Logout</a>
      </nav>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView'
  }
  </script>