<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'
import { reactive, onMounted, ref } from 'vue'

const showSplash = ref(true)

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false
  }, 1000) // 1 second delay
})
</script>

<template>
  <div class="main_container" v-if="!showSplash">
    <div class="main_sec">
      <img class="fixed-top" src="../assets/topfixed.jpeg" alt="" />
      <div class="first_sec">
        <img src="../assets/top.jpeg" alt="" />
        <img src="../assets/secondImg.jpeg" alt="" />
      </div>
      <img src="../assets/img1.jpeg" alt="" />
      <img src="../assets/img2.jpeg" alt="" />
      <img src="../assets/img3.jpeg" alt="" />
      <img src="../assets/img4.jpeg" alt="" />
      <img src="../assets/img5.jpeg" alt="" />
      <img src="../assets/img6.jpeg" alt="" />
      <img src="../assets/img7.jpeg" alt="" />
      <img src="../assets/img10.jpeg" alt="" />
      <img src="../assets/img8.jpeg" alt="" />
      <img src="../assets/img9.jpeg" alt="" />
    </div>

    <BottomNav />
  </div>
  <div class="splash" v-if="showSplash">
    <video autoplay muted loop playsinline>
      <source src="/T stuff_1.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</template>
<style scoped>
.splash {
  z-index: 20000;
  width: 100%;
  background: black;
  transition: 0.5s;
  position: fixed;
  height: 100vh;
  z-index: 20000;
  left: 0;
  top: 0;
}
.splash video {
  width: 100%;
  height: 100vh;
  transform: scale(1.5);
}
</style>
