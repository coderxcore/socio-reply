<template>
  <div class="SettingsGroup">
    <h3 v-text="name"></h3>
    <ul><slot></slot></ul>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  name: String
})
</script>
