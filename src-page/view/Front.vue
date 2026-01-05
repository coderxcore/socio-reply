<template>
  <div class="Front" v-if="front.show" @click="handleClick">
    <div class="content" @click.stop>
      <!-- 确认对话框 - 优先级最高 -->
      <div v-if="front.confirm" class="confirm">
        <div v-if="front.message" class="message">
          {{ front.message }}
        </div>
        <div class="buttons">
          <icon-btn @click="handleConfirm(false)">
            {{locale.cancel}}
          </icon-btn>
          <icon-btn class="confirm" @click="handleConfirm(true)">
            {{locale.ok}}
          </icon-btn>
        </div>
      </div>

      <!-- 进度条 - 优先级次之 -->
      <div v-else-if="front.showProgress" class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${front.progress}%` }"></div>
        </div>
        <div class="progress-text">
          {{ front.progress }}%
        </div>
        <!-- 进度条模式下也可以显示消息 -->
        <div v-if="front.message" class="message">
          {{ front.message }}
        </div>
      </div>

      <!-- 仅消息显示 - 优先级最低 -->
      <div v-else-if="front.message" class="message">
        {{ front.message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Store} from '../store'
import IconBtn from "../part/IconBtn.vue";

const {front,locale} = Store

// 点击隐藏功能，仅当showProgress为false且没有confirm时生效
const handleClick = () => {
  if (!front.showProgress && !front.confirm) {
    front.showProgress = false
    front.progress = 0
    front.message = ''
  }
}

// 处理确认/取消按钮点击
const handleConfirm = async (result: boolean) => {
  if (front.confirm) {
    try {
      // 调用回调函数
      await front.confirm(result)
    } finally {
      // 无论回调结果如何，都清空confirm
      front.confirm = undefined
      // 如果没有其他要显示的内容，清空消息
      if (!front.showProgress) {
        front.message = ''
      }
    }
  }
}
</script>
