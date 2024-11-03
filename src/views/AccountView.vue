<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'
</script>

<template>
  <div class="main_container">
    <div class="main_sec">
      <img class="fixed-top" src="../assets/acc1.jpeg" alt="" />
      <div class="first_sec">
        <div class="black_name px-4 pb-3 pt-5">
          <h1 class="mb-2">Ijaka</h1>
          <h5>ijakasbm@gmail.com</h5>
        </div>
      </div>
      <img src="../assets/acc2.jpeg" alt="" />
      <img src="../assets/acc3.jpeg" alt="" />
    </div>

    <BottomNav />
  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
.black_name {
  color: white;
  font-family: 'Poppins', sans-serif;
}
.black_name h1 {
  font-size: 20px;
  font-weight: 400;
}
.black_name h5 {
  font-size: 16px;
  color: #666666;
}
</style>
