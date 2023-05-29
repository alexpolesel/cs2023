<template>
  <NavBar></NavBar>
  <router-view :userData="userData" />
  <div class="flex flex-col items-center justify-center">
    <button v-if="logged" @click="login"
      class="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
      <img class="w-6 h-6" :src="userData.picture" loading="lazy">
      <span>You're logged as {{ userData.name }}</span>
    </button>
    <button v-if="!logged" @click="login"
      class="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
      <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
      <span>Login with Google</span>
    </button>
  </div>
</template>
<script>
import NavBar from "./components/NavBar.vue";

import { googleTokenLogin } from "vue3-google-login"
import axios from 'axios'

export default {
  name: "App",
  components: {
    NavBar,
  },
  data: () => ({
    logged: false,
    userData: Object
  }),
  methods: {
    login() {
      googleTokenLogin().then((response) => {
        axios
          .post("http://localhost:3000/login", {
            token: response.access_token
          })
          .catch(function (error) {
            console.log(error);
          }).then(res => {
            this.userData = (res.data);
            this.logged = true;
          });
      });
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
