<template>
  <li class="SettingsRow">
    <header>
      <h4 v-text="title"></h4>
      <div v-text="desc"></div>
    </header>
    <div class="space"></div>
    <slot></slot>
  </li>
</template>

<script lang="ts" setup>
defineProps({
  title: String,
  desc: String
})
</script>