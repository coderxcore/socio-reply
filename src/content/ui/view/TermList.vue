<template>
  <ul
      v-show="visible"
      class="TermList"
      :style="style"
      tabindex="0"
      ref="ulRef"
      @blur="focus=false"
      @keyup="keyup"
      @keydown="onSelectBeginKeydown"
      @mouseenter="ContextVars.termHover=true"
      @mouseleave="ContextVars.termHover=false"
  >
    <li v-if="!showNum" class="term-header">{{ settings.selectBeginKey }}:</li>
    <li v-for="(term,i) in cxt.terms" :key="term.id" @click="cxt.fullTerm(term)">
      {{ showNum ? `${i + 1}. ` : '' }}
      {{ term.text }}
    </li>
    <!--    <li v-if="!showNum" class="term-icon-btn">-->
    <!--      <edit :size="13"/>-->
    <!--    </li>-->
  </ul>
</template>

<script lang="ts" setup>
import {ContentStore as cs} from "../../store";
import {computed, ref, watch} from "vue";
import {IBounds, ISize} from "/src-page/type";
import {Timer, wait} from "gs-base";
import {onSelectBeginKeydown} from "../../context/listenInput";
import {ContextVars} from "../../context/contextVars";
import {getCaretPoint} from "../../lib/getCaretPoint";
import {getSafeLineHeight} from "../../lib/getSafeLineHeight";
import {AutoMode} from "../../type";
import {matchShortcut} from "/src-page/lib/matchShortcut";

const defaultStyle = {top: `50%`, left: `50%`, maxWidth: `100%`, maxHeight: `50%`};

const numRegex = /^[1-9]$/
const ulRef = ref<HTMLUListElement>(null);

const {pageContext: cxt, settings} = cs

const style = ref<IBounds>(defaultStyle)
const focus = ref(false)

const showNum = computed(() => cxt.autoMode === 1 && focus.value);
const visible = computed(() => cxt.active && cxt.terms.length > 0);

const timer = new Timer(10);

function keyup(e: KeyboardEvent) {
  if (matchShortcut(e, cs.settings.deactivateKey) || matchShortcut(e, cs.settings.deactivateKey2)) {
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

watch(() => [cxt.locationChangeTime, cxt.terms, cxt.active], async () => {
  await timer.reWait();
  if (!cxt.active) {
    return;
  }
  style.value = await calcPosition();
}, {deep: true})

watch(() => cxt.changeAutoModeTime, async () => {
  if (cxt.autoMode !== 1 || !visible) {
    focus.value = false;
  } else {
    focus.value = true;
    ulRef.value?.focus();
  }
})
watch(() => cxt.autoMode, async (mode) => {
  if (mode !== AutoMode.Term || cxt.terms.length != 1) {
    return;
  }
  await cxt.fullTerm(cxt.terms[0]);
})

watch(ulRef, (el) => cxt.termListEl = el)

async function calcPosition(): Promise<IBounds> {
  if (!cxt.inputItem?.el) {
    return defaultStyle;
  }
  let rect: ISize<number> = ulRef.value.getBoundingClientRect();
  for (let i = 0; i < 20 && !rect?.height; i++) {
    await wait(10);
    rect = ulRef.value.getBoundingClientRect();
  }
  const {width: w, height: h} = rect;
  let {x, y} = getCaretPoint(cxt.inputItem.el)
  const lh = getSafeLineHeight(cxt.inputItem.el)
  const {innerWidth: bw, innerHeight: bh} = window;
  if (x + w > bw) {
    x = x - w;
  }
  const maxWidth = bw - w - 20;
  let maxHeight;
  if (y + h + lh > bh) {
    y = y - h;
    if (y < 0) {
      y = 0;
    }
    maxHeight = h;
  } else {
    y = y + lh;
    maxHeight = bh - y - 10;
  }
  if (maxHeight < 20) maxHeight = 20;
  return {top: `${y}px`, left: `${x}px`, maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px`}
}

</script>
