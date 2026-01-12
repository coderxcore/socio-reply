<template>
  <div class="Init">
    <div class="container">
      <h2>{{ locale.initTitle }}</h2>
      <p>{{ locale.initSubtitle }}</p>

      <div class="content">
        <div class="section">
          <div class="header">
            <label>{{ locale.selectImportLanguage }}</label>
            <label class="select-all">
              <input type="checkbox" :checked="init.allLangSelected" @change="init.toggleSelectAllLang()">
              <span>{{ locale.selectAll }}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label v-for="lang of Object.keys(init.unImportedData)" :key="lang" class="checkbox-item">
              <input
                  type="checkbox"
                  :value="lang"
                  :checked="init.selectedMap.has(lang)"
                  @change="init.toggleSelectLang(lang)"
              >
              <span class="checkbox-label">{{ locale[lang] }}</span>
            </label>
          </div>
        </div>

        <div v-for="lang in init.selectedMap.keys()" :key="lang" class="section">
          <div class="header">
            <label>{{ locale.selectScene }} - {{ locale[lang] }}</label>
            <label class="select-all">
              <input type="checkbox"
                     :checked="init.selectedMap.get(lang)?.length===Object.keys(init.unImportedData[lang]||{}).length"
                     @change="init.toggleSelectAllScene(lang)">
              <span>{{ locale.selectAll }}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label v-for="sceneKey of init.unImportedData[lang]" :key="`${lang}-${sceneKey}`" class="checkbox-item">
              <input
                  type="checkbox"
                  :value="sceneKey"
                  :checked="init.selectedMap.get(lang)?.includes(sceneKey)"
                  @change="init.toggleSelectScene(lang, sceneKey)"
              >
              <span class="checkbox-label">{{ locale[sceneKey] }}</span>
            </label>
          </div>
        </div>

      </div>

      <div class="actions">
        <div class="button-group">
          <button class="secondary" @click="init.hideInit()">
            {{ locale.cancel }}
          </button>
          <button class="primary" @click="onConfirm">
            {{ locale.ok }}
          </button>
        </div>
        <button class="secondary import-btn" v-if="!init.initialized" @click="onImportCustomReference">
          {{ locale.importCustomReference }}
        </button>
      </div>
    </div>
    <div class="space"></div>
  </div>
</template>

<script lang="ts" setup>
import {Store} from "../store";
import {builtInSceneIds, BuiltInSceneKey, Locale} from "/src-com";
import {wait} from "gs-base";
import {Api} from "../api";
import {Bool} from "gs-idb-basic";

const {locale, settings, importReferences, init, front, message} = Store;

const onImportCustomReference = async () => {
  if (await importReferences.selectFile()) {
    init.savedData = {} as any;
  }
};

const onConfirm = async () => {
  const keys: [Locale, BuiltInSceneKey][] = [...init.selectedMap.entries()].map(([lang, arr]) => arr.map(s => [lang, s])).flat();
  const total = keys.length;
  front.progress = 0;
  try {
    for (let i = 0; i < total; i++) {
      const [lang, sceneKey] = keys[i];
      try {
        const sceneId = builtInSceneIds[sceneKey];
        const path = `data/references/${lang.replace(/-/, '_')}/${sceneKey}.txt`;
        const data = (await fetch(path).then(r => r.text())).split(/\s*[\r\n]\s*/).filter(Boolean)
        const msgs = data.map(text => ({sceneId, text, is_reference: Bool.True}))
        await Api.import.importReferences(msgs)
        // console.log(await Api.import.importReferences(msgs))
        init.addSaveData(lang, sceneKey, true)
        front.updateProgress({
          progress: i,
          total,
          msg: `${locale[lang]} ${locale[sceneKey]} ${locale.importing}`,
          max: 80
        })
        await message.loadStatus();
      } catch (e) {
        console.log(e)
      }
    }
    try {
      init.selectedMap.clear();
      front.updateProgress({progress: 80, total: 100, msg: locale.import_indexing})
      await Api.index.updateIndex()
      // console.log(await Api.index.updateIndex())
      front.updateProgress({progress: total, total, msg: locale.imported})
      await wait(800)
    } finally {
      init.hideInit();
      front.hide();
    }
  } catch (e) {
    await front.showMessage(`导入失败：${e.message}`)
  }
};

</script>
