<template>
  <div class="HomeInput">
    <section>
      <smart-input v-model="message.input" @cursor:change="onCursorChange"/>
    </section>
    <footer>
      <emoji-selector @select="selectEmoji"/>
      <ul class="terms">
        <li v-for="term in message.terms" :key="term" @click="fullTerm(term)">{{ term.text }}</li>
      </ul>
      <button class="btn-lg">
        <save/>
      </button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {Save} from 'lucide-vue-next';
import SmartInput from "../../part/SmartInput.vue";
import {Store} from "../../store";
import {Timer} from "gs-base";
import {ICursorChangeEvent} from "../../type";
import {watch} from "vue";
import {ISearchTerm} from "/src-com";
import {detectChar} from "gs-tokenizer/core";
import {Lang} from "gs-tokenizer/type";
import {findLongest} from "/src-com/lib/findLongest";
import EmojiSelector from "../../part/emoji/EmojiSelector.vue";

const {message} = Store;

const timer = new Timer();

let lastChange: ICursorChangeEvent;

async function selectEmoji(e) {
  if(lastChange.end) {
    message.input = message.input.slice(0, lastChange.end) + e + message.input.slice(lastChange.end);
  } else {
    message.input += e;
  }
}

async function onCursorChange(e: ICursorChangeEvent) {
  await timer.wait(200)
  const {editText} = e;
  if (!editText) {
    message.terms.length = 0;
    lastChange = undefined;
    return
  }
  if (lastChange && lastChange.start === e.start && lastChange.end === e.end && lastChange.editText === editText) {
    return;
  }
  lastChange = e;
  const lang = detectChar(editText.charCodeAt(editText.length - 1));
  if (lang === Lang.WHITESPACE || lang === Lang.SYMBOL_HALF || lang === Lang.SYMBOL_FULL) {
    message.terms.length = 0;
    return
  }
  await message.queryTerm(editText);
}

function fullTerm(term: ISearchTerm) {
  let text = message.input;
  const token = findLongest(term.tokens);
  const index = text.lastIndexOf(token);
  if (index < 0) {
    text += term.text;
  } else {
    text = text.slice(0, index) + term.text + text.slice(index + token.length);
  }
  message.input = text;
  message.terms.length = 0;
  if(term.termType==='emoji') {
    Store.emoji.addRecentEmoji(Array.from(term.text)[0]);
  }
  onCursorChange({start: text.length, end: text.length, editText: text})
}

watch(() => message.input, async (input) => {
  if (!input) {
    message.terms.length = 0;
  }
})

</script>
