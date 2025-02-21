<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'
import { reactive, onMounted, ref, onUnmounted } from 'vue'

// const showSplash = ref(true)
// const showSplash2 = ref(false)

// onMounted(() => {
//   setTimeout(() => {
//     showSplash.value = false
//     showSplash2.value = true

//     setTimeout(() => {
//       showSplash2.value = false
//     }, 3000)
//   }, 1000)
// })
const showSplash = ref(true)
const showSplash2 = ref(false)
let splashTimeout, splash2Timeout // Store timeouts to clear if needed

onMounted(() => {
  splashTimeout = setTimeout(() => {
    showSplash.value = false
    showSplash2.value = true

    splash2Timeout = setTimeout(() => {
      showSplash2.value = false
    }, 3000)
  }, 1000)
})

// Optional: Clear timeouts if needed
onUnmounted(() => {
  clearTimeout(splashTimeout)
  clearTimeout(splash2Timeout)
})
</script>

<template>
  <div class="main_container" v-if="!showSplash">
    <div class="main_sec" v-if="!showSplash2">
      <img class="fixed-top" src="../assets/topfixed.jpeg" alt="" />
      <div class="first_sec">
        <img src="../assets/top.jpeg" alt="" />
        <!-- <img src="../assets/secondImg.jpeg" alt="" /> -->
        <img src="../assets/new-d/new1.jpeg" alt="" />
      </div>
      <!-- <img src="../assets/img1.jpeg" alt="" />
      <img src="../assets/img2.jpeg" alt="" />
      <img src="../assets/img3.jpeg" alt="" />
      <img src="../assets/img4.jpeg" alt="" />
      <img src="../assets/img5.jpeg" alt="" />
      <img src="../assets/img6.jpeg" alt="" />
      <img src="../assets/img7.jpeg" alt="" />
      <img src="../assets/img10.jpeg" alt="" />
      <img src="../assets/img8.jpeg" alt="" />
      <img src="../assets/img9.jpeg" alt="" /> -->
      <img src="../assets/new-d/new2.jpeg" alt="" />
      <img src="../assets/new-d/new3.jpeg" alt="" />
      <img src="../assets/new-d/new4.jpeg" alt="" />
      <img src="../assets/new-d/new5.jpeg" alt="" />
      <img src="../assets/new-d/new6.jpeg" alt="" />
      <img src="../assets/new-d/new7.jpeg" alt="" />
      <img src="../assets/new-d/new8.jpeg" alt="" />
      <img src="../assets/new-d/new9.jpeg" alt="" />
      <img src="../assets/new-d/new10.jpeg" alt="" />
    </div>

    <BottomNav />
  </div>
  <div class="splash" v-if="showSplash">
    <video autoplay muted loop playsinline>
      <source src="/T stuff_1.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
  <div class="splash2" v-if="showSplash2">
    <!-- <div class="splash2"> -->
    <video autoplay muted loop playsinline>
      <source src="/test.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</template>
<style scoped>
.splash2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 90vh;
  z-index: 20000;
}
.splash2 .imag {
  background: red;
  width: 100%;
  height: 49px;
  position: fixed;
  bottom: 94px;
}
.splash2 img {
  width: 100%;
  height: 51px;
  position: fixed;
  bottom: 93px;
  left: 0;
}
.splash2 video {
  position: absolute;
  top: 49%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: fill; /* Ensures the video fills the container */
  transform: translate(-50%, -50%);
}
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
