<template>
  <div class="HomeInput">
    <section>
      <smart-input :rows="rows" v-model="message.query.text" @cursor:change="onCursorChange"/>
    </section>
    <footer>
      <emoji-selector @select="selectEmoji"/>
      <ul class="terms">
        <li v-for="term in message.terms" :key="term" @click="fullTerm(term)">{{ term.text }}</li>
      </ul>
      <div class="menu-wrapper">
        <button
            class="btn-lg"
            :disabled="!showSaveBtn"
            @click="showSaveMenu=!showSaveMenu"
        >
          <plus/>
        </button>
        <ul v-show="showSaveMenu">
          <li>保存为：</li>
          <li v-for="s of scene.usableScenes">{{ locale[s.name] }}</li>
          <li @click="showSaveMenu=false">取消</li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {Plus} from 'lucide-vue-next';
import SmartInput from "../../part/SmartInput.vue";
import {Store} from "../../store";
import {isNumber, Timer} from "gs-base";
import {ICursorChangeEvent} from "../../type";
import {computed, ref, watch} from "vue";
import {ISearchTerm} from "/src-com";
import {detectChar} from "gs-tokenizer/core";
import {Lang} from "gs-tokenizer/type";
import {findLongest} from "/src-com/lib/findLongest";
import EmojiSelector from "../../part/emoji/EmojiSelector.vue";
import {isSidePanel} from "../../lib/isSlidePanel";
import {Api} from "../../api";
import {countLines} from "/src-com/other/countLines";

let i = 0;

const {message, settings, scene, locale} = Store;

const rows = computed(() => countLines(message.query.text, {min: 2, max: 10}))

let lastChange: ICursorChangeEvent;

const showSaveBtn = computed(() => message.query.text.length >= settings.minSaveLength && !isSidePanel())

const showSaveMenu = ref(false)

async function savReference() {

}

async function selectEmoji(e) {
  if (isNumber(lastChange?.end)) {
    message.query.text = message.query.text.slice(0, lastChange.end) + e + message.query.text.slice(lastChange.end);
  } else {
    message.query.text += e;
  }
  const len = message.query.text.length;
  const {start, end} = lastChange || {start: len, end: len};
  await message.queryTerm(e, start, end);
}

async function onCursorChange(e: ICursorChangeEvent) {
  const {editText} = e;
  if (!editText) {
    message.terms.length = 0;
    lastChange = undefined;
    return
  }
  const {start, end} = e;
  if (lastChange && lastChange.start === start && lastChange.end === end && lastChange.editText === editText) {
    return;
  }
  lastChange = e;
  const lang = detectChar(editText.charCodeAt(editText.length - 1));
  if (lang === Lang.WHITESPACE) {
    message.terms.length = 0;
    return
  }
  await message.queryTerm(editText, start, end);
}

function fullTerm(term: ISearchTerm) {
  let text = message.query.text;
  const token = findLongest(term.tokens);
  // todo 大小写优化
  const {index} = text.match(new RegExp(`(${token})`, 'i'));
  if (index < 0) {
    text += term.text;
  } else {
    text = text.slice(0, index) + term.text + text.slice(index + token.length);
  }
  message.query.text = text;
  message.terms.length = 0;
  if (term.termType === 'emoji') {
    Store.emoji.addRecentEmoji(Array.from(term.text)[0]);
  }
  onCursorChange({start: text.length, end: text.length, editText: text})
}

watch(() => message.query, async () => {
  message.terms.length = 0;
  await message.loadMessage(500);
}, {deep: true, immediate: true})


if (isSidePanel()) {
  const timer = new Timer(500);
  watch(() => message.query.text, async (text: string) => {
    await timer.reWait();
    await Api.message.sendMessageToContent(text);
  }, {deep: true, immediate: true})
}

</script>
