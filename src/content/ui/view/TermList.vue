<template>
  <div class="TermList" v-show="visible" ref="termListRef" :style="position">
    <ul tabindex="0" ref="ulRef" @blur="focus=false" @keyup="keyup">
      <li v-if="!showNum" class="term-header">{{ settings.selectBeginKey}}:</li>
      <li v-for="(term,i) in cxt.terms" :key="term.id" @click="cxt.fullTerm(term)">
        {{ showNum ? `${i + 1}. ` : '' }}
        {{ term.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {ContentStore as cs} from "../../store";
import {computed, watch} from "vue";
import {ref} from "vue";
import {IPosition} from "/src-page/type";
import {Timer} from "gs-base";

const numRegex = /^[1-9]$/

const termListRef = ref<HTMLDivElement>(null);
const ulRef = ref<HTMLUListElement>(null);

const {pageContext: cxt, settings} = cs

const position = ref<IPosition>()
const focus = ref(false)

const showNum = computed(() => cxt.autoMode === 1 && focus.value);
const visible = computed(() => cxt.active && cxt.terms.length > 0);

const timer = new Timer(10);

function keyup(e: KeyboardEvent) {
  if (e.code === cs.settings.deactivateKey) {
    cxt.active = false;
    cxt.el?.focus();
    return;
  }
  if (numRegex.test(e.key)) {
    const term = cxt.terms[parseInt(e.key) - 1]
    if (term) {
      cxt.fullTerm(term);
    }
  }
}

watch(() => cxt.inputPoint, async () => {
  await timer.reWait();
  position.value = calcPosition();
}, {immediate: true})

watch(() => cxt.changeAutoModeTime, async () => {
  if (cxt.autoMode !== 1 || !visible) {
    focus.value = false;
  } else {
    focus.value = true;
    ulRef.value?.focus();
  }
})

watch(termListRef, (el) => cxt.termListEl = el)

function calcPosition(): IPosition {
  const {inputPoint: p, lineHeight: lh} = cxt
  if (!p) {
    return {top: `0px`, left: `0px`}
  }
  let {x, y} = p
  if (!termListRef.value) {
    return {top: `${y + lh}px`, left: `${x}px`}
  }
  const {innerWidth: ww, innerHeight: wh} = window;
  const {width: w, height: h} = termListRef.value.getBoundingClientRect();
  if (x + w > ww) {
    x = x - w;
  }
  if (y + h > wh) {
    y = y - h;
  } else {
    y = y + lh;
  }
  return {top: `${y}px`, left: `${x}px`}
}

</script>
