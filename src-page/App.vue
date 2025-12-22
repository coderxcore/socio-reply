<template>
  <router-view/>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import {Store} from "./store";

onMounted(async () => {
  await Store.settings.loadSettings();
  await Store.locale.loadMessages(true);
})


</script>


