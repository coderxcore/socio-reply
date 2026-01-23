<template>
  <list-panel class="HomeBody" selectable>
    <template #header>
    </template>
    <li
        v-if="message.previewMessages.length"
        v-for="msg in message.previewMessages"
        class="preview-message"
        @click="fullInput(msg)"
    >
      <section>
        <div v-for="part in msg.parts" :class="PartType[part.type]"
             v-html="formatText(part.text)"
        >
        </div>
      </section>
    </li>
    <li
        v-else v-for="msg in message.candidates" :key="msg.id"
        @click="message.toPreviewMessage(msg)"
    >
      <section v-html="formatText(msg.text)"></section>
      <button @click.stop="message.remove(msg)" class="btn-close">&times;</button>
    </li>
  </list-panel>
</template>

<script lang="ts" setup>
import ListPanel from "../../part/ListPanel.vue";
import {Store} from '../../store'
import {IMessagePreview, PartType} from "../../type";
import {formatText} from "../../lib/formatText";

const {locale, message} = Store;

function fullInput(msg: IMessagePreview) {
  message.previewMessages.length = 0;
  message.query.text = msg.parts.map(({text}) => text).join('');
  message.terms.length = 0;
}

</script>
