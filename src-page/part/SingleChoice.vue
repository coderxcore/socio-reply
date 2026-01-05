<template>
  <div class="SingleChoice" ref="containerRef" :style="{ width: containerWidth }">
    <!-- 选择触发器 -->
    <button
        ref="triggerRef"
        class="SingleChoice__trigger"
        @click="toggleDropdown"
        @keydown.down.prevent="openDropdown"
        @keydown.up.prevent="openDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        @keydown.escape.prevent="closeDropdown"
    >
      <span class="SingleChoice__selected">{{ selectedOptionText }}</span>
      <span class="SingleChoice__arrow">▼</span>
    </button>

    <!-- 下拉菜单 -->
    <div
        v-show="isOpen"
        ref="dropdownRef"
        class="SingleChoice__dropdown"
        @keydown.down.prevent="focusNextOption"
        @keydown.up.prevent="focusPreviousOption"
        @keydown.enter.prevent="selectFocusedOption"
        @keydown.escape.prevent="closeDropdown"
        :style="{ opacity: isMeasuring ? 0 : 1, visibility: isMeasuring ? 'hidden' : 'visible' }"
    >
      <div
          v-for="(option, index) in options"
          :key="getOptionKey(option, index)"
          class="SingleChoice__option"
          :class="{
          'SingleChoice__option--selected': isOptionSelected(option),
          'SingleChoice__option--focused': focusedIndex === index
        }"
          @click.stop="selectOption(option)"
          @mouseenter="focusedIndex = index"
      >
        {{ getOptionText(option) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
import {wait} from "gs-base";

// Props
interface Props<T = any> {
  options: T[];
  modelValue?: any;
  label?: string;
  textField?: string | ((option: T) => string);
  valueField?: string;
  autoAdjustWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  textField: undefined,
  valueField: undefined,
  modelValue: undefined,
  autoAdjustWidth: true
});

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

// Refs
const containerRef = ref<HTMLDivElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);
const isOpen = ref(false);
const isMeasuring = ref(false); // 标记是否正在测量宽度
const focusedIndex = ref(0);
const labelId = computed(() => props.label || `single-choice-${Math.random().toString(36).substr(2, 9)}`);
const containerWidth = ref<string | null>(null);
const isWidthCalculated = ref(false); // 标记是否已经计算过宽度

// Helper functions
const getOptionText = (option: any): string => {
  if (!props.textField) {
    return option?.toString() || '';
  }

  // 如果 textField 是函数，则调用它获取显示文本
  if (typeof props.textField === 'function') {
    try {
      return props.textField(option)?.toString() || '';
    } catch (error) {
      console.error('Error in textField function:', error);
      return '';
    }
  }

  // 否则作为字段名处理
  return option?.[props.textField]?.toString() || '';
};

const getOptionValue = (option: any): any => {
  if (!props.valueField) {
    return option;
  }
  return option?.[props.valueField];
};

const isOptionSelected = (option: any): boolean => {
  // 如果 modelValue 未设置，则没有选中项
  if (props.modelValue === undefined) {
    return false;
  }

  const optionValue = getOptionValue(option);
  const modelValue = props.modelValue;

  // 处理对象比较
  if (typeof optionValue === 'object' && optionValue !== null &&
      typeof modelValue === 'object' && modelValue !== null) {
    return JSON.stringify(optionValue) === JSON.stringify(modelValue);
  }

  return optionValue === modelValue;
};

const getOptionKey = (option: any, index: number): any => {
  const value = getOptionValue(option);
  if (value !== undefined && value !== null) {
    return typeof value === 'object' ? JSON.stringify(value) : value;
  }
  return index;
}

// Computed
const selectedOptionText = computed(() => {
  const selected = props.options.find(option => isOptionSelected(option));
  return selected ? getOptionText(selected) : '';
});

// Methods
const adjustContainerWidth = () => {
  if (!props.autoAdjustWidth || !isOpen.value || !containerRef.value || !dropdownRef.value) return;

  // 获取下拉菜单的实际宽度
  const dropdownWidth = dropdownRef.value.offsetWidth;
  // 获取触发器的实际宽度
  const triggerWidth = triggerRef.value?.offsetWidth || 0;

  // 取最大值作为容器宽度
  const newWidth = Math.max(dropdownWidth, triggerWidth);
  containerWidth.value = `${newWidth}px`;
};


// 重新计算宽度的方法 - 使用透明展开方案
const recalculateWidth = async () => {
  if (!props.autoAdjustWidth) return;

  // 重置状态
  isWidthCalculated.value = false;
  containerWidth.value = null;

  // 如果已经打开，则直接调整宽度
  if (isOpen.value) {
    adjustContainerWidth();
    isWidthCalculated.value = true;
    return;
  }

  // 如果当前是关闭状态，使用透明展开方案获取宽度
  isMeasuring.value = true;
  isOpen.value = true;

  // 等待DOM更新完成
  await wait(1);

  // 计算宽度
  adjustContainerWidth();
  isWidthCalculated.value = true;

  // 恢复正常状态并关闭菜单
  isMeasuring.value = false;
  isOpen.value = false;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    focusedIndex.value = props.options.findIndex(option => isOptionSelected(option));
    // 如果没有选中项，则默认聚焦到第一个选项
    if (focusedIndex.value === -1) {
      focusedIndex.value = 0;
    }
    setTimeout(() => {
      const focusedOption: any = containerRef.value?.querySelector('.SingleChoice__option--focused');
      focusedOption?.focus();
      adjustContainerWidth();
    }, 10);
  } else {
  }
};

const openDropdown = () => {
  if (!isOpen.value) {
    isOpen.value = true;
    focusedIndex.value = props.options.findIndex(option => isOptionSelected(option));
    // 如果没有选中项，则默认聚焦到第一个选项
    if (focusedIndex.value === -1) {
      focusedIndex.value = 0;
    }
    setTimeout(() => {
      adjustContainerWidth();
    }, 10);
  }
};

const closeDropdown = () => {
  // 关闭下拉菜单
  isOpen.value = false;
  // 重置测量状态，避免影响下次打开
  isMeasuring.value = false;
  // 恢复焦点到触发器按钮
  triggerRef.value?.focus();
};

const selectOption = (option: any) => {
  // 发出值更新事件
  emit('update:modelValue', getOptionValue(option));

  // 使用setTimeout延迟关闭下拉菜单，确保事件处理完成
  setTimeout(() => {
    // 关闭下拉菜单
    isOpen.value = false;
    // 重置测量状态
    isMeasuring.value = false;
    // 恢复焦点到触发器按钮
    triggerRef.value?.focus();
  }, 0);
};

const focusNextOption = () => {
  if (focusedIndex.value < props.options.length - 1) {
    focusedIndex.value++;
    scrollToFocusedOption();
  }
};

const focusPreviousOption = () => {
  if (focusedIndex.value > 0) {
    focusedIndex.value--;
    scrollToFocusedOption();
  }
};

const selectFocusedOption = () => {
  if (props.options[focusedIndex.value]) {
    selectOption(props.options[focusedIndex.value]);
  }
};

const scrollToFocusedOption = () => {
  const focusedOption = containerRef.value?.querySelector('.SingleChoice__option--focused');
  if (focusedOption) {
    const dropdown = containerRef.value?.querySelector('.SingleChoice__dropdown');
    if (dropdown) {
      const dropdownRect = dropdown.getBoundingClientRect();
      const optionRect = focusedOption.getBoundingClientRect();

      if (optionRect.bottom > dropdownRect.bottom) {
        dropdown.scrollTop += optionRect.bottom - dropdownRect.bottom;
      } else if (optionRect.top < dropdownRect.top) {
        dropdown.scrollTop -= dropdownRect.top - optionRect.top;
      }
    }
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

// Watchers
watch(
    () => props.modelValue,
    () => {
      focusedIndex.value = props.options.findIndex(option => isOptionSelected(option));
    }
);

// 监听options变化，重新计算宽度
watch(
    () => props.options,
    (newOptions, oldOptions) => {
      recalculateWidth();
    },
    {deep: true, immediate: true}
);

// 监听autoAdjustWidth变化
watch(
    () => props.autoAdjustWidth,
    (newValue) => {
      if (!newValue) {
        // 如果关闭自动调整宽度，重置宽度
        containerWidth.value = null;
        isWidthCalculated.value = false;
      } else {
        // 如果开启自动调整宽度，重新计算
        recalculateWidth();
      }
    }
);

// Lifecycle
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  if (props.autoAdjustWidth) {
    recalculateWidth();
  }
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
