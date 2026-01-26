<template>
  <link rel="stylesheet" :href="cssHref">
  <div id="message-assistant-app" :class="{'dark': settings.theme === 'dark'}">
    <button @click="test">{{ cs.pageContext.scene.name }}</button>
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import {ContentStore as cs} from "../store";
import {Api} from "/src-page/api";
import {registerRootListener} from "../context/registerRootListener";

const {settings} = cs;

const cssHref = chrome.runtime.getURL('content-scripts/content.css')
onMounted(async () => {
  try {
    await settings.loadSettings();
    await cs.init.loadInitData();
    await cs.locale.loadLocaleTexts()
    await cs.scene.loadScenes();
    cs.pageContext.scene = cs.scene.findScenes(location.href);
  } catch (e) {
    console.error(e);
  } finally {
    registerRootListener();
  }
  await Api.data.preload();
})

function test() {
  // console.log(cs.pageContext.inputEl?.getBoundingClientRect())
}

</script>


