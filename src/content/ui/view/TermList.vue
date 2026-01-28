<template>
  <div class="TermList" v-if="visible" ref="termList" :style="position">
    <ul>
      <li v-for="term in cxt.terms" :key="term.id">{{ term.text }}</li>
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

const {pageContext: cxt} = cs

const visible = computed(() => !!(cxt.el && cxt.terms.length));

const position = ref<IPosition>()

const timer = new Timer(10);

watch(() => cxt.terms.length, async (len) => {
  await timer.reWait();
  position.value = calcPosition(len);
}, {immediate: true})

function calcPosition(len: number): IPosition {
  const {inputPoint: p, lineHeight: lh} = cxt
  if (!p) {
    return {top: `0px`, left: `0px`}
  }
  let {x, y} = p
  if (!len || !termListRef.value) {
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
