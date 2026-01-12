<template>
  <div class="Settings">
    <settings-group :name="`${locale.pref}${locale.settings}`">
      <settings-row :title="locale.language" :desc="locale.languageDesc">
        <select v-model="settings.language" @change="changeLanguage">
          <option v-for="key of Locales" :value="key">
            {{ locale[key] }}
          </option>
        </select>
      </settings-row>
      <settings-row :title="locale.theme" :desc="locale.themeDesc">
        <select v-model="settings.theme" @change="changeTheme">
          <option v-for="theme of themes" :value="theme">
            {{ locale[theme] }}
          </option>
        </select>
      </settings-row>
    </settings-group>
    <settings-group :name="locale.dataMgr">
      <settings-row :title="locale.importData" :desc="locale.importDataDesc">
        <icon-btn v-if="!init.isFullImported" @click="init.forceShow=true">
          <download :size="14"/>
          {{ locale.showImportBuiltIn }}
        </icon-btn>
        <icon-btn @click="importData">
          <download :size="14"/>
          {{ locale.importData }}
        </icon-btn>
        <icon-btn>
          <upload :size="14"/>
          {{ locale.exportData }}
        </icon-btn>
      </settings-row>
      <settings-row title="索引管理" desc="如果没有出现异常情况，请不要使用此功能">
        <icon-btn @click="updateIndex">
          <refresh-cw :size="14"/>
          检查更新索引
        </icon-btn>
      </settings-row>
    </settings-group>
  </div>
</template>

<script lang="ts" setup>
import {Download, Upload, RefreshCw} from 'lucide-vue-next';
import SettingsGroup from "./SettingsGroup.vue";
import SettingsRow from "./SettingsRow.vue";
import IconBtn from "../../part/IconBtn.vue";
import {Store} from "../../store";
import {openFileHandler} from "grain-sand-web-fs";
import {Locales, themes} from "/src-com";
import {Api} from "../../api";
import {wait} from "gs-base";

const {settings, locale, front, init} = Store;

async function updateIndex() {
  front.updateProgress({progress: 0, msg: '检查更新索引中……'})
  console.log(await Api.index.updateIndex())
  front.updateProgress({progress: 100, msg: '完成'})
  await wait(1000);
  front.hide();
}

async function changeTheme() {
  await settings.saveSettings();
  settings.setPageTheme();
}

async function changeLanguage() {
  await settings.saveSettings();
  await locale.reLoadMessages(true);
}

async function importData() {
  const handler = await openFileHandler();
  const file = await handler.getFile()
  const buffer = await file.arrayBuffer()
  console.log(buffer)
}
</script>
