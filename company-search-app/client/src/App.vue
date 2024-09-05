<!-- src/App.vue -->
<template>
  <div id="app">
    <header>
      <h1>My Vue Login App</h1>
      <nav>
        <router-link to="/" v-if="!isLoggedIn">Home</router-link> |
        <router-link to="/login" v-if="!isLoggedIn">Login</router-link>
        <a href="#" @click.prevent="logout" v-if="isLoggedIn">Logout</a>
      </nav>
    </header>

    <main>
      <router-view></router-view>
    </main>

    <footer>
      <p>&copy; 2024 My Vue Login App</p>
    </footer>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService';

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const user = AuthService.getCurrentUser();
      this.isLoggedIn = !!user;
    },
    logout() {
      AuthService.logout();
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  },
  watch: {
    $route() {
      this.checkLoginStatus();
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

footer {
  margin-top: 40px;
  font-size: 0.8em;
  color: #666;
}
</style>