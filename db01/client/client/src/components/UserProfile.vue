<template>
  <div>
    <div class="flex items-center pt-5 pl-10">
      <h1 class="text-zinc-200 text-4xl mr-5">{{ name }}</h1>
      <img class="" :src="picture" loading="lazy">
    </div>
    <div>
      <ViewPaste v-for="paste in pastes.slice().reverse()" :key="paste.id" :pastes="paste" :userID="id" :userPic="picture" :userName="name">
      </ViewPaste>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
import ViewPaste from './ViewPaste.vue'
// sistemare qua (passare i dati alla paste)
export default {
  name: "UserProfile",
  data() {
    return {
      name: "",
      id: this.$route.params.id,
      picture: "",
      pastes: []
    };
  },
  components: { ViewPaste },
  methods: {
    getUserData() {
      axios
        .post("http://localhost:3000/users/" + this.id)
        .then((res) => {
          this.pastes = res.data.paste;
          this.name = res.data.userName;
          this.picture = res.data.userPic;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getUserData();
  },
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
  