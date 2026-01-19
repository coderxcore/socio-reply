<template>
  <div class="ImportReferences">
    <header class="flex-between">
      <label>
        <span>{{ locale.importAs }}</span>
        <single-choice
            :options="scene.usableScenes"
            v-model="ir.sceneId"
            :text-field="(item) => locale[item.name]"
            value-field="id"
        />
      </label>
      <div>
        <span>{{ locale.mode }}</span>
        <select @change="selectChange">
          <option v-for="item in importModes" :key="item" :value="item">{{ locale[item] }}</option>
        </select>
        <input v-model="ir.pattern" type="text" :readonly="readonly">
      </div>
      <icon-btn @click="ir.selectFile()">
        <file-down :size="14"/>
        {{ locale.importReferences }}
      </icon-btn>
    </header>
    <template v-if="ir.file">
      <list-panel v-if="ir.preview.length" :header-sticky="true">
        <template #header>
          <h2>{{ locale.preview }}</h2>
          <icon-btn @click="confirmImport">
            <check-line :size="14"/>
            {{ locale.confirmImport }}
          </icon-btn>
        </template>
        <li v-for="(row,i) in ir.preview" :key="i" v-html="row"></li>
      </list-panel>
      <list-panel v-else>
        <li v-if="ir.loading">
          {{ locale.loading }}
        </li>
        <li v-else>
          {{ locale.emptyContent }}
        </li>
      </list-panel>
    </template>
  </div>
</template>

<script lang="ts" setup>
import IconBtn from "../part/IconBtn.vue";
import {CheckLine, FileDown} from 'lucide-vue-next'
import {Store} from "../store";
import {ImportMode, importModes} from "/src-com";
import {ref, watch} from "vue";
import ListPanel from "../part/ListPanel.vue";
import SingleChoice from "../part/SingleChoice.vue";
import {wait} from "gs-base";

const {importReferences: ir, locale, front, scene, message} = Store;

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
  front.message = locale.askImport
  front.confirm = async (r) => {
    if (!r || !ir.preview.length) return;
    setTimeout(async () => {
      try {
        front.progress = 0;
        await ir.confirmImport({
          onFileRead: (loaded: number, total: number) => {
            front.updateProgress({
              progress: loaded, total, max: 20,
              msg: locale.import_fileReading
            });
          },
          onDbSave: (loaded: number, total: number) => {
            front.updateProgress({
              progress: loaded, total, max: 80, base: 20,
              msg: locale.import_dbSaving
            });
          },
          onIndexing: (loaded: number, total: number) => {
            front.updateProgress({
              progress: loaded, total, max: 100, base: 80,
              msg: locale.import_indexing
            });
          },
        });
        front.progress = 100;
        await wait(300);
        front.progress = -1;
        front.message = locale.imported;
      } finally {
        front.progress = -1;
        await wait(1000);
        front.hide();
        await message.loadStatus();
      }
    })
  }
}

watch(() => ir.pattern, async () => {
  await ir.updatePreview();
})

</script>
