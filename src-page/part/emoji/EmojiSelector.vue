<template>
  <div class="EmojiSelector">
    <button class="btn-lg" @click.stop="showEmojiPicker = true;">
      <smile/>
    </button>
    <emoji-picker v-if="showEmojiPicker" @select="emit('select', $event)"/>
  </div>
</template>

<script lang="ts" setup>
import {Smile} from 'lucide-vue-next';
import {onMounted, onUnmounted, ref} from "vue";
import EmojiPicker from "./EmojiPicker.vue";

const showEmojiPicker = ref(false);

const emit = defineEmits(['select']);

const closeEmoji = () => showEmojiPicker.value = false;
onMounted(() => document.addEventListener('click', closeEmoji));
onUnmounted(() => document.removeEventListener('click', closeEmoji));
</script>
