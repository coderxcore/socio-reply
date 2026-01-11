<template>
  <router-view/>
  <Front/>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import {Store} from "./store";
import Front from "./view/Front.vue";

onMounted(async () => {
  await Store.settings.loadSettings();
  await Store.locale.loadMessages(true);
  await Store.message.loadStatus();
  await Store.scene.loadScenes();
})


</script>


