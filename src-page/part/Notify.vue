<template>
  <div class="Notify">
    <div
      v-for="(item, index) in notify.texts"
      :key="item.id"
      class="Notify-item"
      :style="{
        animationDelay: `${index * 100}ms`,
        '--animation-duration': `${0.3 + 3 + 0.2}s` // 使用默认timeout 3秒
      }"
      @click="notify.removeNotification(item.id)"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Store} from "../store";

const {notify} = Store;
</script>
