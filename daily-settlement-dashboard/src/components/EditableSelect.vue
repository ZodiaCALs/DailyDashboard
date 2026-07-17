<template>
  <div class="position-relative" ref="wrapperRef">
    <!-- 只读模式 -->
    <span v-if="readonly" class="d-block px-2 py-1">
      <slot name="display" :value="modelValue">{{ modelValue || '-' }}</slot>
    </span>

    <!-- 编辑模式 -->
    <template v-else>
      <select 
        v-if="!showCustomInput"
        class="form-select form-select-sm"
        :value="modelValue"
        @change="onSelectChange"
      >
        <option value="" disabled>{{ placeholder || '请选择' }}</option>
        <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
        <option value="__ADD_NEW__" class="text-primary fw-bold">＋ 添加新选项...</option>
      </select>

      <div v-else class="input-group input-group-sm">
        <input 
          ref="customInputRef"
          v-model="customValue"
          class="form-control form-control-sm"
          placeholder="输入新选项后回车"
          @keydown.enter="confirmCustom"
          @keydown.escape="cancelCustom"
        />
        <button class="btn btn-success" @click="confirmCustom">✓</button>
        <button class="btn btn-outline-danger" @click="cancelCustom">✕</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

const props = defineProps<{
  modelValue: string;
  options: string[];
  readonly?: boolean;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'add-option': [value: string];
}>();

const showCustomInput = ref(false);
const customValue = ref('');
const customInputRef = ref<HTMLInputElement>();

const onSelectChange = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value;
  if (val === '__ADD_NEW__') {
    showCustomInput.value = true;
    customValue.value = '';
    nextTick(() => customInputRef.value?.focus());
  } else {
    emit('update:modelValue', val);
  }
};

const confirmCustom = () => {
  const trimmed = customValue.value.trim();
  if (!trimmed) return;
  emit('add-option', trimmed);
  emit('update:modelValue', trimmed);
  showCustomInput.value = false;
  customValue.value = '';
};

const cancelCustom = () => {
  showCustomInput.value = false;
  customValue.value = '';
};
</script>