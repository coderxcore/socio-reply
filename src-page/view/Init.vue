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
              <input type="checkbox" v-model="allLanguagesSelected">
              <span>{{ locale.selectAll }}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label v-for="lang in Locales" :key="lang" class="checkbox-item">
              <input
                  type="checkbox"
                  :value="lang"
                  v-model="selectedLanguages"
              >
              <span class="checkbox-label">{{ locale[lang] }}</span>
            </label>
          </div>
        </div>

        <div v-for="lang in selectedLanguages" :key="lang" class="section">
          <div class="header">
            <label>{{ locale[lang] }} - {{ locale.selectScene }}</label>
            <label class="select-all">
              <input type="checkbox" :checked="selectedScenes[lang] || false"
                     @change="toggleSelectAllCategoriesForLanguage(lang)">
              <span>{{ locale.selectAll }}</span>
            </label>
          </div>
          <div class="checkbox-group">
            <label v-for="category in BuiltInSceneKeys" :key="`${lang}-${category}`" class="checkbox-item">
              <input
                  type="checkbox"
                  :value="category"
                  :checked="(languageScenes[lang] || []).includes(category)"
                  @change="toggleCategory(lang, category)"
              >
              <span class="checkbox-label">{{ locale[category] }}</span>
            </label>
          </div>
        </div>

      </div>

      <div class="actions">
        <button class="secondary import-btn" @click="onImportCustomReference">
          {{ locale.importCustomReference }}
        </button>
        <div class="button-group">
          <button class="secondary" @click="onCancel">
            {{ locale.cancel }}
          </button>
          <button class="primary" @click="onConfirm">
            {{ locale.ok }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Store} from "../store";
import {ref, computed, watch} from "vue";
import {BuiltInSceneKeys, Locales} from "/src-com";

const {locale, settings} = Store;

const selectedLanguages = ref<string[]>([Store.settings.language || 'zh-CN']);

const languageScenes = ref<Record<string, string[]>>({});

const selectedScenes = ref<Record<string, boolean>>({});

const updateAllSceneSelectedState = (language: string) => {
  if (!languageScenes.value[language]) {
    languageScenes.value[language] = [];
  }
  const selected = languageScenes.value[language] || [];
  selectedScenes.value[language] = selected.length === BuiltInSceneKeys.length && selected.length > 0;
};

// Initialize language categories with all categories for selected languages
selectedLanguages.value.forEach(lang => {
  languageScenes.value[lang] = [...BuiltInSceneKeys];
  updateAllSceneSelectedState(lang);
});

// Watch selectedLanguages to update allCategoriesSelected state
watch(selectedLanguages, (newLanguages, oldLanguages) => {
  // Update allCategoriesSelected state for new languages
  newLanguages.forEach(lang => {
    if (!oldLanguages.includes(lang)) {
      // Auto-select all categories for newly selected language
      languageScenes.value[lang] = [...BuiltInSceneKeys];
      updateAllSceneSelectedState(lang);
    }
  });
  console.log('Language selection changed:', newLanguages);
}, {deep: true});

// Toggle category selection for a specific language
const toggleCategory = (language: string, category: string) => {
  if (!languageScenes.value[language]) {
    languageScenes.value[language] = [];
  }
  const index = languageScenes.value[language].indexOf(category);
  if (index > -1) {
    languageScenes.value[language].splice(index, 1);
  } else {
    languageScenes.value[language].push(category);
  }
  updateAllSceneSelectedState(language);
};

// Watch languageCategories to update allCategoriesSelected state
watch(languageScenes, (newScene, oldCategories) => {
  // Update allCategoriesSelected state for each language
  Object.keys(newScene).forEach(lang => {
    updateAllSceneSelectedState(lang);
  });
}, {deep: true});

// Computed property for select all languages checkbox
const allLanguagesSelected = computed({
  get: () => selectedLanguages.value.length === Locales.length && selectedLanguages.value.length > 0,
  set: (value) => toggleSelectAllLanguages(value)
});

// Toggle select all languages
const toggleSelectAllLanguages = (value?: boolean) => {
  const newValue = value ?? (selectedLanguages.value.length < Locales.length);
  selectedLanguages.value = newValue ? [...Locales] : [];
};

// Toggle select all categories for a specific language
const toggleSelectAllCategoriesForLanguage = (language: string) => {
  if (!languageScenes.value[language]) {
    languageScenes.value[language] = [];
  }
  const currentState = selectedScenes.value[language] || false;
  const newValue = !currentState;
  languageScenes.value[language] = newValue ? [...BuiltInSceneKeys] : [];
  selectedScenes.value[language] = newValue;
};

// Import custom reference handler
const onImportCustomReference = () => {
  // TODO: Implement import custom reference logic
  console.log('Import custom reference clicked');
};

// Confirm button handler
const onConfirm = () => {
  // TODO: Implement confirm logic
  console.log('Confirm clicked with selections:', {
    languages: selectedLanguages.value,
    languageCategories: languageScenes.value
  });
};

// Cancel button handler
const onCancel = () => {
  // TODO: Implement cancel logic
  console.log('Cancel clicked');
};
</script>
