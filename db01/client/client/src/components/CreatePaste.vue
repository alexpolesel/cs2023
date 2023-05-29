<template>
  <div class="dark:text-white m-10">
    <form>
      <div class="w-full mb-4 border border-zinc-200 rounded-lg bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600">
        <div class="flex items-center justify-between px-3 py-2 border-b dark:border-zinc-600">
          <div class="flex flex-wrap items-center divide-zinc-200 sm:divide-x dark:divide-zinc-600">
            <div class="flex items-center space-x-1 text-zinc-300 sm:pr-4">
              Syntax Highlighting
              <label class="inline-flex relative items-center ml-2 mr-5 cursor-pointer">
                <input type="checkbox" @click="highlightCheck" value="" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-zinc-200 rounded-full peer dark:bg-zinc-500 peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-emerald-600">
                </div>
                <span class="ml-3 font-medium text-zinc-900 dark:text-zinc-300"></span>
              </label>
            </div>
            <div class="flex flex-wrap items-center space-x-1 mr-2 sm:pl-4">
              <select id="countries" v-model="language" @change="setLanguage"
                class="bg-zinc-50 outline-noneborder border-zinc-300 text-zinc-900  rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500">
                <option value="choose" selected>Choose a Language</option>
                <option value="C">C</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="javascript">Javascript</option>
              </select>
            </div>
            <div>
              <input type="password" v-model="passphrase" id="password"
                class="bg-zinc-50 outline-none border ml-3 border-zinc-300 text-zinc-900  rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                placeholder="passphrase.." />
            </div>
          </div>
        </div>
        <div class="px-4 py-2 bg-white rounded-b-lg dark:bg-zinc-800">
          <label for="editor" class="sr-only">Publish paste</label>
          <codemirror placeholder="write a paste..." v-model="text" id="editor" :tab-size="2" :indent-with-tab="true"
            :extensions="extensions"
            class="block w-full px-0 text-zinc-800 bg-white border-0 dark:bg-zinc-800 focus:ring-0 dark:text-white dark:placeholder-zinc-400" />
        </div>
      </div>
      <button type="button" @click="sendData"
        class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-emerald-700 rounded-lg focus:ring-4 focus:ring-emerald-200 dark:peer-focus:ring-emerald-800 hover:bg-emerald-800">
        Publish paste
      </button>
    </form>
  </div>
</template>
<script>
import router from "@/router";
import axios from "axios";
import Codemirror from 'vue-codemirror'

import { oneDark } from '@codemirror/theme-one-dark'
// eslint-disable-next-line no-unused-vars 
import { javascript } from '@codemirror/lang-javascript'
// eslint-disable-next-line no-unused-vars 
import { java } from '@codemirror/lang-java'
// eslint-disable-next-line no-unused-vars 
import { cpp } from '@codemirror/lang-cpp'
// eslint-disable-next-line no-unused-vars 
import { python } from '@codemirror/lang-python'


export default {
  name: "CreatePaste",
  components: Codemirror,
  props: ["userData"],
  data: function () {
    return {
      text: "",
      passphrase: "",
      language: "",
      extensions: [oneDark],
      hightlight: false,
    }
  },
  methods: {
    sendData() {
      axios
        .post("http://localhost:3000/NewPaste", {
          text: String(this.text),
          passphrase: this.passphrase,
          language: this.language,
          user_id: this.userData.user_id,
          token: this.userData.token
        })
        .catch(function (error) {
          console.log(error);
        }).then(data => {
          console.log(data)
          router.push("/pastes/" + data.data.id);
        });
    },
    setLanguage() {
      if (this.highlight) {
        if (this.language == "python") {
          this.extensions = [python(), oneDark];
        }
        else if (this.language == "C") {
          this.extensions = [cpp(), oneDark];
        }
        else if (this.language == "javascript") {
          this.extensions = [javascript(), oneDark];
        }
        else if (this.language == "java") {
          this.extensions = [java(), oneDark];
        }
        else {
          this.extensions = [oneDark];
        }
      }
    },
    highlightCheck() {
      this.highlight = !this.highlight;
      if (this.highlight == true) {
        this.setLanguage();
      }
      else {
        this.extensions = [oneDark];
      }
    },
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
