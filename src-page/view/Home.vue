<template>
  <div class="Home container">
    <header>
      <nav>
        <router-link to="/draft"  :title="locale.draft">
          <file-text/>
        </router-link>
        <router-link to="/history"  :title="locale.history">
          <history/>
        </router-link>
        <router-link to="/trash"  :title="locale.trash">
          <trash/>
        </router-link>
        <div class="space"></div>
        <router-link to="/references"  :title="locale.references">
          <book-open/>
        </router-link>
        <router-link to="/settings" :title="locale.settings">
          <settings/>
        </router-link>
      </nav>
      <main-input/>
    </header>
  </div>
</template>

<script lang="ts" setup>
import MainInput from "../part/MainInput.vue";
import {Settings, FileText, History,BookOpen, Trash} from 'lucide-vue-next';
import {Store} from '../store'
const {locale} = Store;
</script>