<template>
  <div class="TermList" v-if="visible" ref="termListRef" :style="position">
    <ul tabindex="0" ref="ulRef">
      <li v-for="(term,i) in cxt.terms" :key="term.id" @click="cxt.fullTerm(term)">
        {{ cxt.tabStatus === 1 ? `${i + 1}. ` : '' }}
        {{ term.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {ContentStore as cs} from "../store";
import {computed, watch} from "vue";
import {ref} from "vue";
import {IPosition} from "/src-page/type";
import {Timer} from "gs-base";

const termListRef = ref<HTMLDivElement>(null);
const ulRef = ref<HTMLUListElement>(null);

const {pageContext: cxt} = cs

const visible = computed(() => !!(cxt.el && cxt.terms.length));

const position = ref<IPosition>()

const timer = new Timer(10);

watch(() => cxt.inputPoint, async () => {
  await timer.reWait();
  position.value = calcPosition();
}, {immediate: true})

watch(() => cxt.tabTime,  async () => {
  console.log(cxt.tabStatus)
  if (cxt.tabStatus !== 1 || !visible) return;
  ulRef.value?.focus();
})

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
