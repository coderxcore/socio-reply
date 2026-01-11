<template>
  <div class="HomeInput">
    <section>
      <smart-input v-model="message.input" @cursor:change="onCursorChange"/>
    </section>
    <footer>
      <button class="btn-lg" @click="onSend">
        <smile/>
      </button>
      <div class="space"></div>
      <ul class="word">
        <li>联想词</li>
      </ul>
      <div class="space"></div>
      <button class="btn-lg">
        <save/>
      </button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {Save, Smile} from 'lucide-vue-next';
import SmartInput from "../../part/SmartInput.vue";
import {Store} from "../../store";
import {Timer} from "gs-base";
import {Api} from "../../api";

const {message} = Store;

const timer = new Timer();

async function onCursorChange() {
  await timer.wait(300)
  await timer.wait(200)
}
async function onSend() {
  console.log(await Api.search.searchTerm('lo'))
}



</script>
