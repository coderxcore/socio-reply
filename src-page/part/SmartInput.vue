<template>
  <textarea
      ref="el"
      class="SmartInput"
      :value="modelValue"
      @input="onInput"
      @keyup="onInput"
      @click="onInput"
      @compositionstart="onCompStart"
      @compositionend="onCompEnd"
  />
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ICursorChangeEvent} from "../type";

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'cursor:change', payload: ICursorChangeEvent): void
}>()

const el = ref<HTMLTextAreaElement>()
let composing = false, lastStart = -1, lastEnd = -1, lastEditText = ''

function onCompStart() {
  composing = true
}

function onCompEnd(e: CompositionEvent) {
  composing = false
  onInput(e as any)
}

function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)

  if (composing) return

  const {selectionStart: start, selectionEnd: end} = target;

  if (lastStart === start && lastEnd === end) return
  lastStart = start
  lastEnd = end

  const editText = start === end ? target.value.slice(0, start) : target.value.slice(start, end)
  lastEditText = editText;

  emit('cursor:change', {
    editText,
    start,
    end
  })
}
</script>
