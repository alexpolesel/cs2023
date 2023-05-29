<template>
  <div class="dark:text-white m-10">
    <form>
      <div class="w-full mb-4 border border-zinc-200 rounded-lg bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600">
        <div class="flex items-center justify-between px-3 py-2 border-b dark:border-zinc-600">
          <div class="flex flex-wrap items-center divide-zinc-200 sm:divide-x dark:divide-zinc-600">
            <div class="flex items-center space-x-1 text-zinc-300 sm:pr-4">
              <p>Posted by: <a :href="'http://localhost:8080/users/' + user_id" class="ml-1">{{ user_name }}</a></p>
              <img class="w-6 ml-1 h-6" :src="user_picture" loading="lazy">
              <p> | Language: {{ paste.language }}</p>
              <p>| {{ paste.date.substring(0, 10) }}</p>
            </div>
          </div>
        </div>
        <div class="px-4 py-2 bg-white rounded-b-lg dark:bg-zinc-800">
          <label for="editor" class="sr-only"></label>
          <codemirror v-model="paste.text" id="" :tab-size="2" :indent-with-tab="true" :extensions="extensions"
            class="block w-full px-0 text-zinc-800 bg-white border-0 dark:bg-zinc-800 focus:ring-0 dark:text-white dark:placeholder-zinc-400" />
        </div>
      </div>
    </form>
    Paste link: <a :href="'http://localhost:8080/pastes/' + paste.paste_id">https://textdrop.com/{{ paste.paste_id }}</a>
  </div>


  <!-- Modal protected -->
  <div v-if="secret"
    class="fixed backdrop-blur-xl flex flex-col items-center justify-center top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-zinc-700">
        <button @click="secret = false" type="button"
          class="absolute top-3 right-2.5 text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-800 dark:hover:text-white">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="px-6 pb-3 lg:px-8">
          <h3 class="mb-4 pt-3 text-xl font-medium text-zinc-900 dark:text-white">This paste is protected</h3>
          <form class="space-y-6" action="#">
            <div>
              <label class="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Passphrase:</label>
              <input v-model="paste.passphrase" placeholder="••••••••"
                class="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-600 dark:border-zinc-500 dark:placeholder-zinc-400 dark:text-white"
                required>
            </div>
            <button @click="getPasteData(); secret = false"
              class="w-full text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">Access
              to this paste</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Codemirror from "vue-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
// eslint-disable-next-line no-unused-vars
import { javascript } from "@codemirror/lang-javascript";
// eslint-disable-next-line no-unused-vars
import { java } from "@codemirror/lang-java";
// eslint-disable-next-line no-unused-vars
import { cpp } from "@codemirror/lang-cpp";
// eslint-disable-next-line no-unused-vars
import { python } from "@codemirror/lang-python";

export default {
  name: "ViewPaste",
  props: ["pastes", "userID", "userName", "userPic"],
  data() {
    return {
      paste: this.pastes,
      extensions: [javascript(), oneDark],
      user_id: this.userID,
      user_name: this.userName,
      user_picture: this.userPic
    };
  },
  components: Codemirror,
  methods: {
    getPasteData() {
      this.paste = { id: this.$route.params.id };
      axios
        .post("http://localhost:3000/pastes/" + this.paste.id, {
          passphrase: this.paste.passphrase
        })
        .then((res) => {
          if (res.data.secret == true) {
            this.paste.secret = true;
          } else {

            this.paste = res.data.pasteData
            this.user_id = res.data.userData.user_id;
            this.user_name = res.data.userData.name;
            this.user_picture = res.data.userData.picture;

            if (this.paste.language == "python") {
              this.extensions = [python(), oneDark];
            } else if (this.paste.language == "C") {
              this.extensions = [cpp(), oneDark];
            } else if (this.paste.language == "javascript") {
              this.extensions = [javascript(), oneDark];
            } else if (this.paste.language == "java") {
              this.extensions = [java(), oneDark];
            } else {
              this.extensions = [oneDark];
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created() {
    if (this.paste == undefined) {
      this.getPasteData();
    }
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
