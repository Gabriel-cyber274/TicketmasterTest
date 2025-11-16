<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BottomNav from '../../components/BottomNav2.vue'
import { reactive, onMounted, ref, onUnmounted } from 'vue'

const showSplash = ref(true)
const showSplash2 = ref(false)
let splashTimeout, splash2Timeout // Store timeouts to clear if needed

onMounted(() => {
  splashTimeout = setTimeout(() => {
    showSplash.value = false
    showSplash2.value = true

    splash2Timeout = setTimeout(() => {
      showSplash2.value = false
    }, 0)
  }, 1000)
})

// Optional: Clear timeouts if needed
onUnmounted(() => {
  clearTimeout(splashTimeout)
  clearTimeout(splash2Timeout)
})

const selectedCountry = ref(localStorage.getItem('selectedCountryUKS') || 'uk')
const showCountryModal = ref(false)

const openCountryModal = () => {
  showCountryModal.value = true
  console.log('Country modal function called')
}

const selectCountry = country => {
  selectedCountry.value = country
  showCountryModal.value = false

  localStorage.setItem('selectedCountryUKS', country)
}
</script>

<template>
  <div class="main_container" v-if="!showSplash">
    <div class="main_sec" v-if="!showSplash2">
      <img
        v-if="selectedCountry == 'uk'"
        class="fixed-top"
        src="../../assets/ukfullindex.png"
        alt=""
        @click="openCountryModal"
      />
      <img
        v-if="selectedCountry == 'belgium'"
        class="fixed-top"
        src="../../assets/belT1.jpg"
        alt=""
        @click="openCountryModal"
      />
      <img
        v-if="selectedCountry == 'ireland'"
        class="fixed-top"
        src="../../assets/IrelandT2.jpg"
        alt=""
        @click="openCountryModal"
      />
      <img
        v-if="selectedCountry == 'netherland'"
        class="fixed-top"
        src="../../assets/netherT1.jpg"
        alt=""
        @click="openCountryModal"
      />
      <div class="first_sec">
        <img src="../../assets/new-d3/7.jpg" alt="" />
        <img src="../../assets/new-d3/4.jpg" alt="" />
      </div>
      <img src="../../assets/new-d3/5.jpg" alt="" />
      <img src="../../assets/new-d3/6.jpg" alt="" />
      <img src="../../assets/new-d/new4.jpeg" alt="" />
      <img src="../../assets/new-d/new5.jpeg" alt="" />
      <img src="../../assets/new-d/new6.jpeg" alt="" />
      <img src="../../assets/new-d/new7.jpeg" alt="" />
      <img src="../../assets/new-d/new8.jpeg" alt="" />
      <img src="../../assets/new-d/new9.jpeg" alt="" />
      <img src="../../assets/new-d/new10.jpeg" alt="" />
    </div>

    <BottomNav />
  </div>
  <div class="splash" v-if="showSplash">
    <video autoplay muted loop playsinline>
      <source src="/T stuff_1.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
  <!-- <div class="splash2" v-if="showSplash2">
    <video autoplay muted loop playsinline>
      <source src="/test.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div> -->

  <div v-if="showCountryModal" class="modal_overlay">
    <div class="modal_box">
      <h3>Select Region</h3>

      <div class="options">
        <button @click="selectCountry('uk')" class="country-btn">Uk</button>
        <button @click="selectCountry('ireland')" class="country-btn">
          Ireland
        </button>

        <button @click="selectCountry('belgium')" class="country-btn">
          Belgium
        </button>

        <button @click="selectCountry('netherland')" class="country-btn">
          Netherland
        </button>
      </div>

      <button class="close_btn" @click="showCountryModal = false">Close</button>
    </div>
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

.modal_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #000000b5;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30000;
}

.modal_box {
  background: white;
  width: 80%;
  max-width: 350px;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
}

.country-btn {
  width: 100%;
  background: #f0f0f0;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.country-btn:hover {
  background: #ddd;
}

.close_btn {
  margin-top: 15px;
  padding: 10px;
  width: 100%;
  background: #222;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
