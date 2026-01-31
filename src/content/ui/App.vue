<template>
  <link rel="stylesheet" :href="cssHref">
  <div id="message-assistant-app" :class="{'dark': settings.theme === 'dark'}">
    <term-list/>
    <buttons/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {ContentStore as cs} from "../store";
import {Api} from "/src-page/api";
import {listenRoot} from "../context/listenRoot";
import TermList from "./view/TermList.vue";
import Buttons from "./view/Buttons.vue";

const {settings, pageContext: cxt} = cs;

const appEl = ref<HTMLDivElement>(null);

const cssHref = chrome.runtime.getURL('content-scripts/content.css')
onMounted(async () => {
  try {
    await settings.loadSettings();
    await cs.init.loadInitData();
    await cs.locale.loadLocaleTexts()
    await cs.scene.loadScenes();
    cxt.scene = cs.scene.findScenes(location.href);
  } catch (e) {
    console.error(e);
  } finally {
    listenRoot();
  }
  await Api.data.preload();
})

function test() {
  console.log(document.activeElement)
  // console.log(cs.pageContext.inputEl?.getBoundingClientRect())

}

</script>


