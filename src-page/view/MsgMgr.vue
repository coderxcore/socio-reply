<template>
  <list-panel class="MsgMgr" header-sticky footer-sticky>
    <template #header>
      <template v-if="route==='trash'">
        <icon-btn :disabled="!message.status.trashCount" @click="msgMgr.removeAllTrash()">
          <brush-cleaning style="color: brown" :size="14"/>
          清空
        </icon-btn>
      </template>
      <icon-btn v-if="route==='references'" @click="Store.importReferences.selectFile()">
        <file-down :size="14"/>
        {{ locale.importReferences }}
      </icon-btn>
      <div class="space"></div>
      <input type="search" v-model="msgMgr.filter" @keyup="msgMgr.executeFilter()" @click="msgMgr.executeFilter()">
      <icon-btn @click="msgMgr.executeFilter(true)" :disabled="msgMgr.totalPage<=1">
        <search-alert :size="14"/>
        慢速搜索
      </icon-btn>
    </template>
    <li v-for="msg in msgMgr.filtered" :key="msg.id">
      <section v-html="formatText(msg.text)"></section>
      <footer v-if="route==='trash'">
        <button @click="msgMgr.remove(msg.id,'native')">
          &times;
        </button>
        <button @click="msgMgr.remove(msg.id,'recover')">
          <undo size="14"/>
        </button>
      </footer>
      <footer v-else-if="route==='references'">
        <button @click="msgMgr.remove(msg.id)">
          &times;
        </button>
      </footer>
    </li>
    <template #footer>
      <a :style="{visibility: msgMgr.pageNo>1?'':'hidden'}" @click="msgMgr.pageNo--">上一页</a>
      <div>{{ msgMgr.pageNo }}/{{ msgMgr.totalPage }} ( {{ msgMgr.total }} )</div>
      <a :style="{visibility: msgMgr.pageNo<msgMgr.totalPage?'':'hidden'}" @click="msgMgr.pageNo++">下一页</a>
    </template>
  </list-panel>
</template>

<script lang="ts" setup>
import IconBtn from "../part/IconBtn.vue";
import {FileDown, SearchAlert, BrushCleaning, Undo} from 'lucide-vue-next'
import {Store} from "../store";
import {computed, onUnmounted, watch} from "vue";
import {router} from "./index";
import ListPanel from "../part/ListPanel.vue";
import {formatText} from "../lib/formatText";

const {locale, msgMgr, message} = Store

const route = computed(() => router.currentRoute.value.name);

onUnmounted(() => msgMgr.clear())

watch(route, async (r: string) => {
  msgMgr.route = r;
  msgMgr.pageNo = 1;
  await msgMgr.loadData()
}, {immediate: true})

watch(() => [msgMgr.pageNo, msgMgr.pageSize], async () => {
  await msgMgr.loadData();
}, {deep: true})

</script>
