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
        <icon-btn>
          <upload :size="14"/>
          {{ locale.importData }}
        </icon-btn>
      </settings-row>
      <settings-row :title="locale.exportData" :desc="locale.exportDataDesc">
        <icon-btn>
          <download :size="14"/>
          {{ locale.exportData }}
        </icon-btn>
      </settings-row>
    </settings-group>
  </div>
</template>

<script lang="ts" setup>
import {Download, Upload} from 'lucide-vue-next';
import SettingsGroup from "./SettingsGroup.vue";
import SettingsRow from "./SettingsRow.vue";
import IconBtn from "../../part/IconBtn.vue";
import {Locales, themes} from "/src-com";
import {Store} from "../../store";

const {settings, locale} = Store;

async function changeTheme() {
  await settings.saveSettings();
  settings.setPageTheme();
}

async function changeLanguage() {
  await settings.saveSettings();
  await locale.reLoadMessages(true);
}
</script>