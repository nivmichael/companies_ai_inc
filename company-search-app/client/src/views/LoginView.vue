<!-- src/views/Login.vue -->
<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      error: null
    };
  },
  methods: {
    async login() {
      try {
        const response = await AuthService.login(this.username, this.password);
        console.log('Login successful:', response);
        // Handle successful login (e.g., store token, redirect)
        this.$router.push('/'); // Redirect to home page after successful login
      } catch (err) {
        console.error('Login error:', err);
        if (err.response && err.response.status === 401) {
          this.error = 'Invalid username or password. Please try again.';
        } else {
          this.error = 'An error occurred during login. Please try again later.';
        }
      }
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 300px;
  margin: 0 auto;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>