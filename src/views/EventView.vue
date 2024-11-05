<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BottomNav from '../components/BottomNav.vue'
</script>

<template>
  <div class="main_container">
    <div class="main_sec">
      <img class="fixed-top" src="../assets/img11.jpeg" alt="" />
      <div class="first_sec">
        <img src="../assets/img12.jpeg" alt="" />
      </div>
      <div class="ticket-first p-2">
        <div class="top-level">
          <h3 class="py-1">NEW DATE</h3>
        </div>
        <div class="image-and-date">
          <img class="ti" src="../assets/adele-pic.jfif" alt="" />
          <div class="ticket-details">
            <h2>Weekends with Adele</h2>
            <p class="mb-1">
              Sat, Nov 9, 8pm • The Colosseum at Caesars Palace
            </p>
            <h6 class="d-flex align-items-center">
              <i class="fas fa-ticket-alt ticketIcon me-1"></i> 4 tickets
            </h6>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.first_sec {
  background: white;
}
.ticket-first .top-level {
  background: #a1349a;
  margin-bottom: 0 !important;
}
.ticket-first .top-level h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: white;
  text-align: center;
  margin-bottom: 0 !important;
}
.image-and-date {
  position: relative;
  width: 100%;
  height: 200px;
}
.image-and-date .ti {
  position: absolute;
  width: 100%;
  height: 100%;
  filter: brightness(80%);
  object-fit: cover;
}
.image-and-date .ticket-details {
  position: absolute;
  bottom: 8px;
  z-index: 1;
  color: white;
  padding-right: 5px;
  left: 8px;
}
h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin-bottom: 0 !important;
  font-family: 'Poppins', sans-serif;
}
.image-and-date .ticket-details h2 {
  font-size: 18px;
}
.image-and-date .ticket-details p {
  font-size: 14px;
}
.image-and-date .ticket-details h6 {
  font-size: 12px;
}
.ticketIcon {
  transform: rotate(122deg);
}
</style>
