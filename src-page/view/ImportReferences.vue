<template>
  <div class="ImportReferences">
    <header class="flex-right">
      <label>
        <span>{{ locale.mode }}</span>
        <select @change="selectChange">
          <option v-for="item in importModes" :key="item" :value="item">{{ locale[item] }}</option>
        </select>
        <input v-model="ir.pattern" type="text" :readonly="readonly">
      </label>
      <icon-btn @click="ir.selectFile()">
        <file-down :size="14"/>
        {{ locale.importReferences }}
      </icon-btn>
    </header>
    <card :header-sticky="true">
      <template #header>
        <h2>{{ locale.preview }}</h2>
        <icon-btn @click="confirmImport">
          <check-line :size="14"/>
          {{ locale.confirmImport }}
        </icon-btn>
      </template>
      <li v-for="(row,i) in ir.preview" :key="i" v-html="row"></li>
    </card>
  </div>
</template>

<script lang="ts" setup>
import IconBtn from "../part/IconBtn.vue";
import {CheckLine, FileDown} from 'lucide-vue-next'
import {Store} from "../store";
import {ImportMode, importModes} from "/src-com";
import {ref, watch} from "vue";
import Card from "../part/ListPanel.vue";

const {importReferences: ir, locale} = Store;

const RegexRecord = {
  eachLine: '\\s*\\n+\\s*',
  blankLine: '(\\s*\\n+\\s*){2,}',
} as Record<ImportMode, string>

const readonly = ref(true);

function selectChange(e) {
  const mode = e.target.value as ImportMode;
  if (mode in RegexRecord) {
    ir.pattern = RegexRecord[mode];
    readonly.value = true;
  } else {
    readonly.value = false;
  }
}

async function confirmImport() {
  await ir.confirmImport((loaded: number, total: number) => {
    console.log(loaded, total);
  });
}

watch(() => ir.pattern, async () => {
  await ir.updatePreview();
})

</script>
