<template>
  <div class="EmojiPicker" @click.stop>
    <template v-if="emoji.recentEmojis.length">
      <div class="section-title">最近使用</div>
      <div class="recent-grid">
        <button
            v-for="(emj, idx) in emoji.recentEmojis"
            :key="'rec-'+idx"
            class="emoji-btn"
            @click="selectEmoji(emj)"
        >
          {{ emj }}
        </button>
      </div>
      <div class="divider"></div>
    </template>

    <div class="emoji-scroll-area">
      <div class="section-title">{{ categoryNames[activeTab] }}</div>
      <div class="emoji-grid">
        <button
            v-for="(emj, idx) in emoji.emojiCategories[activeTab]"
            :key="activeTab+'-'+idx"
            class="emoji-btn"
            @click="selectEmoji(emj)"
        >
          {{ emj }}
        </button>
      </div>
    </div>

    <div class="tab-bar">
      <button
          v-for="(icon, key) in tabIcons"
          :key="key"
          class="tab-btn"
          :class="{ active: activeTab === key }"
          @click="activeTab = key as string"
          :title="categoryNames[key]"
      >
        <component :is="icon" :size="18"/>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {Coffee, Hand, Lightbulb, Plane, Smile, Spotlight, Flag} from 'lucide-vue-next';
import {Store} from '../../store';

const {emoji, locale} = Store;

const emit = defineEmits(['select']);

const activeTab = ref<string>('face');

onMounted(() => {
  emoji.loadEmojiCategories();
});

const tabIcons: any = {
  face: Smile,
  hand: Hand,
  food: Coffee,
  sport: Spotlight,
  transport: Plane,
  device: Lightbulb,
  flag: Flag,
};

const categoryNames: any = {
  face: '表情与情感',
  hand: '手势',
  food: '食物与饮料',
  sport: '活动',
  transport: '交通',
  device: '物体',
  flag: '国旗',
};


const selectEmoji = (emj: string) => {
  emit('select', emj);
  emoji.addRecentEmoji(emj);
};
</script>
