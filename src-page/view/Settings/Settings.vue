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
    <settings-group name="发言设置">
      <settings-row title="保存设置" desc="在什么情况下保存">
        <label>
          最小保存长度
          <input v-model.number="settings.minSaveLength" type="number">
        </label>
      </settings-row>
      <settings-row title="是否对搜索生效" desc="是否在搜索框输入时启用发言助手">
        <label>
          生效
          <switch-input v-model="settings.applyToSearch"/>
        </label>
      </settings-row>
    </settings-group>
    <settings-group :name="locale.dataMgr">
      <settings-row :title="locale.importData" :desc="locale.importDataDesc">
        <icon-btn v-if="!init.isFullImported" @click="init.forceShow=true">
          <download :size="14"/>
          {{ locale.showImportBuiltIn }}
        </icon-btn>
        <!--        <icon-btn @click="importData">
                  <download :size="14"/>
                  {{ locale.importData }}
                </icon-btn>
                <icon-btn>
                  <upload :size="14"/>
                  {{ locale.exportData }}
                </icon-btn>-->
      </settings-row>
      <settings-row title="异常情况处理" desc="如果不清楚此操作，请不要使用此功能">
        <icon-btn @click="clearAllData">
          <eraser :size="14"/>
          清除所有数据
        </icon-btn>
        <icon-btn @click="rebuildIndex">
          <refresh-cw :size="14"/>
          完全重建索引
        </icon-btn>
      </settings-row>
    </settings-group>
  </div>
</template>

<script lang="ts" setup>
import {Download, RefreshCw, Eraser} from 'lucide-vue-next';
import SettingsGroup from "./SettingsGroup.vue";
import SettingsRow from "./SettingsRow.vue";
import IconBtn from "../../part/IconBtn.vue";
import {Store} from "../../store";
import {openFileHandler} from "grain-sand-web-fs";
import {Locales, themes} from "/src-com";
import {Api} from "../../api";
import {wait} from "gs-base";
import {watch} from "vue";
import SwitchInput from "../../part/SwitchInput.vue";

const {settings, locale, front, init} = Store;

async function clearAllData() {
  if (!await front.showConfirm('确定要完全清除所有数据吗？<br/>这是一个危险操作,将清除所有参考与发言记录！')) {
    return;
  }
  if (!confirm('危险操作二次确认！\n你确定要清除所有数据吗？')) {
    return;
  }
  await Api.specialCase.clearAllData();
  await front.showMessage('所有数据已清除',1);
  location.reload();
}

async function rebuildIndex() {
  if (!await front.showConfirm('确定要完全重建索引吗？<br/>这将是一个需要长久等待的耗时操作！')) {
    return;
  }
  front.updateProgress({progress: 0, msg: '检查更新索引中……'})
  await Api.specialCase.fullRebuildIndex();
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

watch(() => [settings.minSaveLength, settings.applyToSearch], async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await settings.saveSettings();
  }
})

</script>
