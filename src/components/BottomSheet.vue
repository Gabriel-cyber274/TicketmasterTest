<!-- BottomSheet.vue -->
<template>
  <div class="bottom-sheet" v-if="isVisible" @click.self="closeSheet">
    <div class="bottom-sheet-content">
      <!-- <button class="close-btn" @click="closeSheet">Close</button> -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const closeSheet = () => {
  emit('close')
}
</script>

<style scoped>
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2000;
  transition: opacity 0.3s ease;
}
.bottom-sheet-content {
  width: 100%;
  max-width: 600px;
  background: white;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.close-btn {
  background: #e2e6e9;
  border: none;
  padding: 8px 12px;
  color: #333;
  border-radius: 5px;
  cursor: pointer;
}
</style>
