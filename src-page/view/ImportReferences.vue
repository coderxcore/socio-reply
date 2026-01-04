<template>
  <div class="ImportReferences">
    <header class="flex-between">
      <label>
        <span>{{ locale.scene }}</span>
        <single-choice :options="scene.names" />
      </label>
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
    <template v-if="ir.file">
      <card v-if="ir.preview.length" :header-sticky="true">
        <template #header>
          <h2>{{ locale.preview }}</h2>
          <icon-btn @click="confirmImport">
            <check-line :size="14"/>
            {{ locale.confirmImport }}
          </icon-btn>
        </template>
        <li v-for="(row,i) in ir.preview" :key="i" v-html="row"></li>
        <template #footer>
          <footer>
            <button>按钮</button>
          </footer>
        </template>
      </card>
      <card v-else>
        <li v-if="ir.loading">
          {{ locale.loading }}
        </li>
        <li v-else>
          {{ locale.emptyContent }}
        </li>
      </card>
    </template>
  </div>
</template>

<script lang="ts" setup>
import IconBtn from "../part/IconBtn.vue";
import {CheckLine, FileDown} from 'lucide-vue-next'
import {Store} from "../store";
import {ImportMode, importModes} from "/src-com";
import {ref, watch} from "vue";
import Card from "../part/ListPanel.vue";
import SingleChoice from "../part/SingleChoice.vue";

const {importReferences: ir, locale, front,scene} = Store;

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
  front.message = '确定要导入当前全部数据？'
  front.confirm = async (r) => {
    if (!r || !ir.preview.length) return;
    try {
      ir.preview.length = 0;
      front.showProgress = true;
      await ir.confirmImport((loaded: number, total: number) => {
        front.progress = Math.round(loaded / total * 100);
      });
      front.showProgress = false;
      front.message = locale.imported;
    } finally {
      front.showProgress = false;
    }
  }
}

watch(() => ir.pattern, async () => {
  await ir.updatePreview();
})

</script>
