<template>
  <router-view/>
  <front/>
  <init v-if="Store.init.showInit"/>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import {Store} from "./store";
import Front from "./view/Front.vue";
import Init from "./view/Init.vue";

onMounted(async () => {
  await Store.init.loadInitData();
  await Store.settings.loadSettings();
  await Store.locale.loadMessages(true);
  await Store.message.loadStatus();
  await Store.scene.loadScenes();
  // console.log({...Store.message.status})
})


</script>


