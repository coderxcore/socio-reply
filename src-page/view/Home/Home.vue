<template>
  <div class="Home container">
    <header>
      <nav>
        <single-choice
            :options="scene.usableScenes"
            v-model="message.query.sceneId"
            :text-field="(item) => locale[item.name]"
            value-field="id"
        />
        <div class="space"></div>
        <!--        <router-link v-if="message.status.draftCount > 0" to="/draft" :title="locale.draft">-->
        <!--          <file-text/>-->
        <!--        </router-link>-->
        <router-link v-if="message.status.historyCount" to="/history" :title="locale.history" :disabled="!message.status.historyCount">
          <history/>
        </router-link>
        <router-link v-if="message.status.trashCount" to="/trash" :title="locale.trash">
          <trash/>
        </router-link>
        <div class="space"></div>
        <router-link v-if="message.status.referencesCount" to="/references" :title="locale.references">
          <book-open/>
        </router-link>
        <a v-else @click="Store.importReferences.selectFile()" :title="locale.importReferences">
          <file-down/>
        </a>
        <router-link to="/settings" :title="locale.settings">
          <settings/>
        </router-link>
      </nav>
      <home-input/>
    </header>
    <home-body/>
  </div>
</template>

<script lang="ts" setup>
import {BookOpen, FileDown, History, Settings, Trash} from 'lucide-vue-next';
import HomeInput from "./HomeInput.vue";
import HomeBody from "./HomeBody.vue";
import {Store} from '../../store'
import SingleChoice from "../../part/SingleChoice.vue";

const {locale, message, scene} = Store;


</script>
