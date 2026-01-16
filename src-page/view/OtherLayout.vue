<template>
  <div class="OtherLayout">
    <header>
      <nav class="container">
        <router-link to="/home" :title="locale.home" :class="{active: viewName === 'home'}">
          <home/>
          <span>{{ locale.home }}</span>
        </router-link>
<!--        <router-link v-if="message.status.draftCount" to="/draft" :title="locale.draft" :class="{active: viewName === 'draft'}">-->
<!--          <file-text/>-->
<!--          <span>{{ locale.draft }}</span>-->
<!--        </router-link>-->
        <router-link v-if="message.status.historyCount" to="/history" :title="locale.history" :class="{active: viewName === 'history'}">
          <history/>
          <span>{{ locale.history }}</span>
        </router-link>
        <router-link v-if="message.status.trashCount" to="/trash" :title="locale.trash" :class="{active: viewName === 'trash'}">
          <trash/>
          <span>{{ locale.trash }}</span>
        </router-link>
        <div class="space"></div>
        <router-link to="/references" :title="locale.references" :class="{active: viewName === 'references'}">
          <book-open/>
          <span>{{ locale.references }}</span>
        </router-link>
        <router-link to="/settings" :title="locale.settings" :class="{active: viewName === 'settings'}">
          <settings/>
          <span>{{ locale.settings }}</span>
        </router-link>
      </nav>
    </header>
    <router-view class="container layout-body"/>
  </div>
</template>

<script lang="ts" setup>
import {BookOpen, History, Home, Settings, Trash} from 'lucide-vue-next';
import {Store} from '../store'
import {computed} from "vue";
import {router} from "./index";

const {locale, message} = Store;

const viewName = computed(() => router.currentRoute.value.name);

</script>
