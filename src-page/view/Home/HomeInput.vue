<template>
  <div class="HomeInput">
    <section>
      <smart-input v-model="reply.input" @cursor:change="onCursorChange"/>
    </section>
    <footer>
      <button class="btn-lg">
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

const {reply} = Store;

const timer = new Timer();

async function onCursorChange() {
  await timer.wait(300)
  await timer.wait(200)
  await Api.reply.queryReply(reply.input)
}


</script>
