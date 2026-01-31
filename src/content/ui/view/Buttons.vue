<template>
  <button v-show="cs.pageContext.hasWork" class="deactivate-btn" @click="cs.pageContext.active = false">
    <span>&times;</span>
  </button>
</template>

<script lang="ts" setup>
import {ContentStore as cs} from "../../store";
</script>
