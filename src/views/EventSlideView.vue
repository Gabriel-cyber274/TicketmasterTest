<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import 'swiper/css'
import 'swiper/css/pagination'
import BottomSheet from '../components/BottomSheet.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

// import required modules
import { Pagination } from 'swiper/modules'

const tickets = ref([])
const showStuff = ref(false)
const checkedTickets = ref([])

console.log(JSON.parse(route.query.event))

const showModal = ref(false)
const isChecked = ref(false)

const openBottomSheet = () => {
  showModal.value = true
}

const closeBottomSheet = () => {
  showModal.value = false
}

onMounted(() => {
  if (route.query.event) {
    try {
      tickets.value = JSON.parse(route.query.event)
      checkedTickets.value = new Array(tickets.value.length).fill(false) // Update checkedTickets after tickets are loaded
      showStuff.value = true
    } catch (e) {
      console.error('Error parsing event data:', e)
    }
  } else {
    console.error('No event query parameter found')
  }
})
</script>

<template>
  <div class="main_container">
    <div class="main_sec">
      <div class="fixed-top">
        <img src="../assets/eventDH.jpeg" alt="" />
        <RouterLink to="/event">
          <img class="cancel" src="../assets/cancel.jpeg" alt="" />
        </RouterLink>
      </div>

      <div class="main-stuff" v-if="showStuff">
        <div class="slide_container d-flex justify-content-center">
          <Swiper
            :spaceBetween="14"
            :slidesPerView="1.02"
            :loop="false"
            :autoplay="{ delay: 3000 }"
            :pagination="{ clickable: true }"
            :modules="[Pagination]"
            class="pe-5"
          >
            <!-- Iterate over tickets here -->
            <SwiperSlide v-for="(ticket, index) in tickets" :key="ticket.id">
              <div class="slide-event">
                <div class="first">
                  <div class="header">Artist Registration Sale</div>

                  <div
                    class="row-seat d-flex px-4 py-4 justify-content-between align-items-center"
                  >
                    <div>
                      <h4>SEC</h4>
                      <h2>{{ ticket.sec }}</h2>
                    </div>

                    <div>
                      <h4>ROW</h4>
                      <h2>{{ ticket.row }}</h2>
                    </div>

                    <div>
                      <h4>SEAT</h4>
                      <h2>{{ ticket.seat }}</h2>
                    </div>
                  </div>
                </div>
                <div class="second position-relative">
                  <img class="ti" src="../assets/adele-pic.jfif" alt="" />
                  <div class="position-absolute">
                    <h2>{{ ticket.event_name }}</h2>
                    <p class="px-1">
                      {{ ticket.date_place }}
                    </p>
                  </div>
                </div>
                <div class="third px-4 py-4">
                  <h1>SECTION {{ ticket.section }}</h1>
                  <img class="py-4" src="../assets/viewT.jpeg" alt="" />
                  <h3>Ticket Details</h3>
                </div>
                <div class="fourth"></div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div class="buttons-ts d-flex align-items-center">
          <button @click="openBottomSheet">Transfer</button>
          <button class="grey">Sell</button>
        </div>

        <BottomSheet :isVisible="showModal" @close="closeBottomSheet">
          <div class="bottom-modalstuff">
            <div class="first py-3">
              <h2>SELECT TICKET TO TRANSFER</h2>
            </div>

            <div class="second px-3 my-4">
              <div class="info d-flex align-items-center p-3">
                <i class="fas fa-circle-info infoIcon"></i>
                <p class="ms-2 mb-0">
                  Only transfer tickets to people you know and trust to ensure
                  everyone stays safe
                </p>
              </div>
            </div>
            <div
              class="third mb-3 d-flex align-items-center justify-content-between px-3"
            >
              <h2>Sec {{ tickets[0].sec }}, Row {{ tickets[0].row }}</h2>

              <h6 class="d-flex align-items-center">
                <i class="fas fa-ticket-alt ticketIcon me-1"></i>
                {{ tickets.length }} tickets
              </h6>
            </div>
            <div class="fourth pb-4 px-3 d-flex align-items-center">
              <div
                class="seat me-3"
                v-for="(ticket, index) in tickets"
                :key="ticket.id"
              >
                <div class="firstS py-2">
                  <h2>SEAT {{ ticket.seat }}</h2>
                </div>
                <div class="secondD py-3">
                  <div class="checkbox-container">
                    <input
                      type="checkbox"
                      v-model="checkedTickets[index]"
                      :id="'customCheckbox' + index"
                      class="custom-checkbox"
                    />
                    <label
                      :for="'customCheckbox' + index"
                      class="checkbox-label"
                    ></label>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="fifth d-flex align-items-center justify-content-between p-3 mt-3"
            >
              <h3>
                {{ checkedTickets.filter(isChecked => isChecked).length }}
                Selected
              </h3>

              <h2 class="d-flex align-items-center">
                TRANSFER TO <i class="fas fa-chevron-right ms-2"></i>
              </h2>
            </div>
          </div>
        </BottomSheet>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.bottom-modalstuff .fifth {
  background: #9a9a9a66;
}
.bottom-modalstuff .fifth h3 {
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 0;
}
.bottom-modalstuff .fifth h2 {
  font-family: 'Poppins', sans-serif;
  margin-bottom: 0;
  font-size: 20px;
  color: #0157ea;
}
.bottom-modalstuff .fourth {
  border-bottom: 2px solid #9a9a9a66;
}
.bottom-modalstuff .fourth .seat {
  width: 100px;
  border-radius: 10px;
  box-shadow: 0px 1px 3px grey;
}
.bottom-modalstuff .fourth .seat .firstS {
  text-align: center;
  background: #0157ea;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-family: 'Poppins', sans-serif;
  color: white;
}
.bottom-modalstuff .fourth .seat .secondD {
  display: flex;
  align-items: center;
  justify-content: center;
}
.bottom-modalstuff .fourth .seat .firstS h2 {
  font-size: 16px;
  margin-bottom: 0;
}
.bottom-modalstuff .third {
  font-family: 'Poppins', sans-serif;
}
.ticketIcon {
  transform: rotate(122deg);
}
.bottom-modalstuff .third h2 {
  font-size: 15px;
}
.bottom-modalstuff .third h6 {
  font-size: 15px;
}
.bottom-modalstuff .second .info {
  background: #9a9a9a66;
  border: 1px solid #9a9a9a;
  font-family: 'Poppins', sans-serif;
  border-radius: 5px;
  font-size: 16px;
}
.bottom-modalstuff .first {
  text-align: center;
  border-bottom: 2px solid #9a9a9a66;
  font-family: 'Poppins', sans-serif;
}
.bottom-modalstuff .first h2 {
  margin-bottom: 0;
  font-size: 18px;
}

.swiper-pagination {
  position: relative; /* Change from absolute to relative */
  bottom: 0; /* Adjust the position */
  left: 0; /* Adjust the position */
  transform: none; /* Remove transform */
  display: flex;
  justify-content: center;
  width: 100%; /* Add width */
}
.swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet,
.swiper-pagination-horizontal.swiper-pagination-bullets
  .swiper-pagination-bullet {
  width: 14px;
  height: 14px;
}

.swiper .swiper-pagination-bullet-active {
  background: #6c6c6c;
}
.swiper {
  padding-bottom: 40px;
}
.swiper-pagination-bullet {
  background: red;
  opacity: 1;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 5px;
  transition: background 0.3s ease;
}

.swiper-pagination-bullet-active {
  background: #0157ea;
}

.swiper-pagination-bullet:hover {
  background: #003f8f; /* Add hover effect */
}

.slide-event {
  width: 100%;
  box-shadow: 0px 1px 3px black;
  border-radius: 10px;
  margin-left: 25px;
}
.buttons-ts {
  width: 354px;
  margin: 25px auto;
  justify-content: space-between;
}
.buttons-ts button {
  width: 48.5%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  color: white;
  border-radius: 5px;
  background: #0078e3;
  font-size: 14px;
  border: none;
}
.buttons-ts .grey {
  background: #e2e6e9 !important;
}
.slide-event .first {
  width: 100%;
  background: #0157ea;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.slide-event .fourth {
  background: #0157ea;
  width: 100%;
  height: 40px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.slide-event .third {
  background: white;
  font-family: 'Poppins', sans-serif;
}
.slide-event .third h1 {
  text-align: center;
  font-size: 20px;
  margin-bottom: 0px;
}
.slide-event .third h3 {
  text-align: center;
  font-size: 15px;
  color: #0157ead6;
}
.slide-event .second img {
  height: 200px;
  object-fit: cover;
  filter: brightness(0.8);
}
.slide-event .second div {
  bottom: 0px;
  color: white;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
.slide-event .second div h2 {
  font-size: 19px;
  margin-bottom: 4px;
}
.slide-event .second div p {
  font-size: 13px;
  text-align: center;
}
.slide-event .first .row-seat {
  font-family: 'Poppins', sans-serif;
  text-align: center;
}
.slide-event .first .row-seat h4 {
  color: #f5f5f5e6;
  font-size: 14px;
}
.slide-event .first .row-seat h2 {
  color: white;
  font-size: 20px;
}
.slide-event .first .header {
  text-align: center;
  padding: 10px 0px;
  color: #f5f5f5e6;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
}
.cancel {
  top: 17%;
  left: 4%;
  width: 6%;
  position: absolute;
}
.main-stuff {
  margin-top: 13%;
}

.custom-checkbox {
  display: none;
}

/* Style label to look like a checkbox */
.checkbox-label {
  width: 24px;
  height: 24px;
  background-color: #e0e0e0; /* Unchecked color */
  border-radius: 50%;
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Show check mark when checked */
.custom-checkbox:checked + .checkbox-label {
  background-color: #0078e3; /* Checked background color */
}

.custom-checkbox:checked + .checkbox-label::after {
  content: '✔'; /* Check mark */
  color: white;
  font-size: 18px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
