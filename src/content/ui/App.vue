<template>
  <link rel="stylesheet" :href="cssHref">
  <div id="message-assistant-app">
    <button>测试按钮</button>
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import {ContentStore as Cs} from "../store";
import {Api} from "/src-page/api";

const cssHref = chrome.runtime.getURL('content-scripts/content.css')
onMounted(async () => {
  await Cs.settings.loadSettings();
  await Cs.init.loadInitData();
  await Cs.locale.loadLocaleTexts()
  await Cs.scene.loadScenes();
  await Api.data.preload();

  console.log(Cs.scene.findScenes(location.href))

})
</script>


