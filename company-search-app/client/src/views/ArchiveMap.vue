<!-- src/views/ArchiveMap.vue -->
<template>
    <div class="map">
      <h2>Welcome to the Archive Map page</h2>
      <nav>
        <router-link to="/" v-if="!isLoggedIn">Home</router-link> |
        <a href="#" @click.prevent="logout" v-if="isLoggedIn">Logout</a>
      </nav>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ArchiveMap'
  }
  </script>