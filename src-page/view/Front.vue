<template>
  <div class="Front" v-model="front.show">
<!--    front.showProgress 是否显示进度订-->
<!--    front.message 是否显示进度订-->
  </div>
</template>

<script lang="ts" setup>
import {Store} from '../store'

const {front} = Store
</script>
