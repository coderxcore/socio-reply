<template>
  <div class="SwitchInput" :class="{ active }" @click="active = !active">
    <div class="switch-knob"></div>
  </div>
</template>

<script lang="ts" setup>
const active = defineModel({type: Boolean, default: false});
</script>