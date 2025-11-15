<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import 'swiper/css'
import 'swiper/css/pagination'
import BottomSheet from '../../components/BottomSheet.vue'
import BottomSheet2 from '../../components/BottomSheet2.vue'
import Transfer from '../../components/TransferSheet.vue'
import { useRoute, useRouter } from 'vue-router'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'

const route = useRoute()
const router = useRouter()

// import required modules
import { Pagination } from 'swiper/modules'

const tickets = ref([])
const showStuff = ref(false)
const checkedTickets = ref([])

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const note = ref('')

console.log(JSON.parse(route.query.event))

const showModal = ref(false)
const showModal2 = ref(false)
const showModal3 = ref(false)
const isTransferred = ref(false)
const isChecked = ref(false)

const activeSlideIndex = ref(0)

const handleSlideChange = swiper => {
  activeSlideIndex.value = swiper.realIndex
  console.log('Current slide index:', activeSlideIndex.value)
}

const transferLoading = ref(false)

const transferLoad = () => {
  transferLoading.value = true
  setTimeout(() => {
    transferLoading.value = false
    showModal2.value = false
    showModal3.value = false
    showModal.value = false
    isTransferred.value = true

    // router.push(
    //   `/event/details/success?event=${encodeURIComponent(JSON.stringify(selectedSeats()))}`,
    // )

    console.log(selectedSeats(), 'selected')
    console.log(checkedTickets.value, 'select2')
  }, 3000)
}

const cancelTicket = index => {
  // isTransferred.value = false

  // checkedTickets.value = new Array(tickets.value.length).fill(false)
  checkedTickets.value[index] = false
}

const mapName = ref([])

const openBottomSheet = () => {
  showModal.value = true
  console.log(checkedTickets, 'hello')
}

const closeBottomSheet = () => {
  showModal.value = false
}
const closeBottomSheet2 = () => {
  showModal2.value = false
}
const closeBottomSheet3 = () => {
  showModal3.value = false
}

const transferToFunc = () => {
  showModal2.value = true
  showModal.value = false
}

const transferFunc = () => {
  showModal2.value = false
  showModal3.value = true
  showModal.value = false
}
const selectedSeats = () => {
  return tickets.value.filter((ticket, index) => checkedTickets.value[index])
}

// onMounted(async () => {
//   if (route.query.event) {
//     try {
//       tickets.value = JSON.parse(route.query.event)
//       checkedTickets.value = new Array(tickets.value.length).fill(false) // Update checkedTickets after tickets are loaded
//       showStuff.value = true

//       const itemsCollection = collection(firestore, 'map')
//       const snapshot = await getDocs(itemsCollection)
//       mapName.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
//       console.log('Fetched items:', mapName.value)
//     } catch (e) {
//       console.error('Error parsing event data:', e)
//     }
//   } else {
//     console.error('No event query parameter found')
//   }
// })

const timeLeft = ref({})

let countdownIntervals = {}

const calculateTimeLeft = targetTime => {
  const now = new Date()
  const targetDate = new Date(targetTime)
  const difference = targetDate - now

  if (difference <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      expired: true,
    }
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    expired: false,
  }
}

const startCountdown = (ticketId, targetTime) => {
  // Initial calculation
  timeLeft.value[ticketId] = calculateTimeLeft(targetTime)

  // Only start countdown if not expired
  if (!timeLeft.value[ticketId].expired) {
    countdownIntervals[ticketId] = setInterval(() => {
      timeLeft.value[ticketId] = calculateTimeLeft(targetTime)

      if (timeLeft.value[ticketId].expired) {
        clearInterval(countdownIntervals[ticketId])
        delete countdownIntervals[ticketId]
      }
    }, 1000)
  }
}

onMounted(async () => {
  if (route.query.event) {
    try {
      tickets.value = JSON.parse(route.query.event).filter(e => e.is_uk == true)
      checkedTickets.value = new Array(tickets.value.length).fill(false)
      showStuff.value = true

      // Initialize countdowns for tickets
      tickets.value.forEach(ticket => {
        // Use end_time if start_time is in the past, otherwise use start_time
        const now = new Date()
        const startTime = new Date(ticket.start_time)
        const targetTime = startTime > now ? ticket.start_time : ticket.end_time

        startCountdown(ticket.id, targetTime)
      })

      const itemsCollection = collection(firestore, 'map')
      const snapshot = await getDocs(itemsCollection)
      mapName.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (e) {
      console.error('Error parsing event data:', e)
    }
  }
})

onBeforeUnmount(() => {
  // Clean up all intervals when component is destroyed
  Object.values(countdownIntervals).forEach(interval => {
    clearInterval(interval)
  })
  countdownIntervals = {}
})

function transferTickets(tickets) {
  router.push({
    name: 'uk-transfer',
    query: {
      event: JSON.stringify(tickets),
    },
  })
}
</script>

<template>
  <div class="main_container">
    <div class="main_sec">
      <div class="fixed-top top-ani">
        <!-- <img src="../../assets/eventDH.jpeg" alt="" /> -->
        <img src="../../assets/eventDH2.jpg" alt="" />
        <RouterLink to="/event2">
          <img class="cancel" src="../../assets/cancel.jpeg" alt="" />
        </RouterLink>
      </div>
      <div class="top_new_design fade-ani">
        <div class="first">
          <h4>MY TICKETS</h4>
        </div>
        <div class="second">
          <h4>ADD-ONS</h4>
        </div>
      </div>

      <div class="main-stuff fade-ani" v-if="showStuff">
        <div class="slide_container d-flex justify-content-center">
          <Swiper
            :spaceBetween="14"
            :slidesPerView="1.02"
            :loop="false"
            :autoplay="{ delay: 3000 }"
            :pagination="{ clickable: true }"
            :modules="[Pagination]"
            class="pe-5"
            @slideChange="handleSlideChange"
          >
            <!-- Iterate over tickets here -->
            <SwiperSlide v-for="(ticket, index) in tickets" :key="ticket.id">
              <div class="slide-event">
                <div class="first">
                  <div
                    :class="[
                      checkedTickets[index] && isTransferred && 'sGrey2',
                      'header',
                    ]"
                  >
                    {{ ticket.ticket_header }}
                  </div>

                  <h2 class="general-add text-center">
                    {{ ticket.ticket_header2 }}
                  </h2>

                  <div
                    :class="[
                      checkedTickets[index] && isTransferred && 'sGrey1',
                      'row-seat d-flex px-4 py-4 justify-content-between align-items-center',
                    ]"
                  >
                    <div>
                      <h2>{{ ticket.sec }}</h2>
                    </div>

                    <div v-if="ticket.show_row">
                      <h2>{{ ticket.row }}</h2>
                    </div>

                    <div v-if="ticket.show_row">
                      <h2>{{ ticket.seat }}</h2>
                    </div>

                    <h2 class="rowtext" v-if="!ticket.show_row">
                      {{ ticket.no_row_text }}
                    </h2>
                  </div>
                </div>
                <div class="second position-relative">
                  <!-- <img class="ti" src="../../assets/adele-pic.jfif" alt="" /> -->
                  <img class="ti" :src="ticket.url" alt="" />
                  <div class="position-absolute">
                    <h2>{{ ticket.event_name }}</h2>
                    <p class="px-1">
                      {{
                        ticket.date_place.slice(
                          ticket.date_place.indexOf('/') + 1,
                        )
                      }}
                    </p>
                  </div>
                  <div
                    class="overflow-icon"
                    v-if="checkedTickets[index] && isTransferred"
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1fa41f"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <div
                  v-if="checkedTickets[index] && isTransferred"
                  class="sent-box d-flex justify-content-center py-1"
                >
                  <h2>Sent</h2>
                </div>
                <div class="third px-4 py-4">
                  <div v-if="!(checkedTickets[index] && isTransferred)">
                    <h1 v-if="ticket.start_time == ''">
                      {{ ticket.section_bottom }}
                    </h1>
                    <h1 v-if="ticket.start_time != ''">
                      Ticket will be ready in:
                    </h1>
                    <!-- <img class="py-4" src="../../assets/viewT.jpeg" alt="" /> -->
                    <img
                      v-if="ticket.start_time == ''"
                      class="py-4"
                      src="../../assets/viewT3.jpg"
                      alt=""
                    />
                    <div v-if="ticket.start_time != ''" class="timer mb-5">
                      <div class="box me-3">
                        <h1>{{ timeLeft[ticket.id]?.days || '00' }}</h1>
                        <h4>Day</h4>
                      </div>
                      <div class="box me-3">
                        <h1>{{ timeLeft[ticket.id]?.hours || '00' }}</h1>
                        <h4>Hour</h4>
                      </div>
                      <div class="box me-3">
                        <h1>{{ timeLeft[ticket.id]?.minutes || '00' }}</h1>
                        <h4>Min</h4>
                      </div>
                      <div class="box">
                        <h1>{{ timeLeft[ticket.id]?.seconds || '00' }}</h1>
                        <h4>Seconds</h4>
                      </div>
                    </div>

                    <h3 :class="[ticket.start_time != '' && 'mb-3']">
                      Ticket Details
                    </h3>
                  </div>
                  <div
                    class="success-p"
                    v-if="checkedTickets[index] && isTransferred"
                  >
                    <h1 class="f1">1 ticket sent to</h1>
                    <p>{{ firstname }} {{ lastname }} {{ email }}</p>
                    <p>Waiting for recipient to claim</p>
                    <p>Order 6-45669/GDT</p>

                    <h3 class="mt-2 mb-3" @click="cancelTicket(index)">
                      Cancel Transfer
                    </h3>
                  </div>
                </div>
                <div class="fourth"></div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div class="buttons-ts d-flex align-items-center">
          <button @click="transferTickets(tickets)">Transfer</button>
          <button class="mx-3">Sell</button>
          <button class="">Orders</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

.general-add {
  text-align: center;
  color: #f5f5f5e6;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  margin-bottom: 0;
}
.overflow-icon {
  position: absolute;
  width: 50px !important;
  height: 50px !important;
  border-radius: 50%;
  border: none;
  background: #e9e9ea;
  margin: auto;
  left: 0;
  right: 0;
  top: 10%;

  /* Center content */
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-p {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.success-p h1 {
  text-align: center;
  font-size: 14px !important;
  margin-top: 24px;
  font-weight: 600 !important;
  margin-bottom: 2px;
}
.success-p p {
  margin-bottom: 0px !important;
  text-align: center;
}
.sent-box {
  background: #1ba91f;
}
.sent-box h2 {
  font-size: 14px;
  font-family: Poppins;
  color: white;
  margin-bottom: 0px !important;
}
.sGrey2 {
  background: #4f5a64 !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.sGrey1 {
  background: #576672 !important;
}
.timer {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 80%;
  margin: auto;
}
.timer .box h1 {
  font-size: 26px !important;
  font-weight: 600 !important;
  text-align: center;
  margin-top: 5px !important;
  font-family: Poppins;
}
.timer .box h4 {
  font-size: 11px !important;
  font-weight: 500 !important;
  text-transform: uppercase;
  text-align: center;
  font-family: Poppins;
  border: 1px solid #8080804f;
  padding: 1px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-ani {
  animation: topAnimation 0.4s ease-in 0s 1 forwards;
  transform: translateY(-100%);
}
@keyframes topAnimation {
  0% {
    transform: translateY(1000%);
  }
  100% {
    transform: translateY(0);
  }
}

.fade-ani {
  animation: fadeAnimation 0.7s ease-in 0.5s 1 forwards;
  opacity: 0;
}
@keyframes fadeAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.transfer_form .transfer-n1 .lin {
  width: 30px;
  height: 3px;
  background: black;
}

.transfer_form .transfer-n1 h1 {
  font-size: 19px;
  font-weight: 600;
  font-family: Roboto;
}
.top_new_design {
  background-color: #0157ea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 37px;
  left: 0;
  width: 100%;
  z-index: 2000;
}
.top_new_design div {
  width: 50%;
  padding: 15px 0px;
}
.top_new_design .first {
  border-bottom: 4.5px solid white;
}
.top_new_design h4 {
  text-align: center;
  font-size: 17px;
  color: white;
  margin-bottom: 0px;
  font-family: Poppins;
}
.transfer_form .first_header h4 {
  font-size: 17px;
  margin-bottom: 0px;
  font-family: Poppins;
}
.transfer_form .first_header h5 {
  font-size: 14px;
  margin-bottom: 0px;
  color: #918b8be6;
  font-family: Poppins;
}
.transfer_form .first_header h5 span {
  color: black;
}

.transfer_form .form label {
  font-size: 14px;
  margin-bottom: 0px;
  color: #000000cf;
  font-family: Poppins;
  display: block;
  font-weight: 600;
}
.transfer_form .form input {
  width: 100%;
  height: 41px;
  border: 1px solid #918b8be6;
  outline: none;
  font-size: 14px;
  color: #646060;
  padding: 10px;
  appearance: none;
  -webkit-appearance: none;
}
.transfer_form .form textarea {
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  border: 1px solid #918b8be6;
  color: #646060;
  height: 70px;
  padding: 10px;
  max-height: 70px;
  outline: none;
  min-height: 70px;
  appearance: none;
  -webkit-appearance: none;
}

.map-img h3 {
  position: absolute;
  color: #80817e;
  top: 15%;
  left: 8%;
  font-size: 23px;
  font-weight: 500;
  padding-right: 12px;
  font-family: Arial;
}

.map iframe {
  width: 100%;
  height: 400px;
}
.map-img {
  width: 100%;
}
.bottom-modalstuff .fifth {
  background: #9a9a9a66;
  padding-bottom: 40px !important;
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
  font-family: Roboto;
}
.bottom-modalstuff .third h6 {
  font-size: 15px;
}
.bottom-modalstuff .second .info {
  background: white;
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
  font-weight: 600;
  font-family: Roboto;
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
  height: 565px; /* Fixed height */
  margin-left: 25px;
  position: relative;
}
/* Adjust the internal sections to fill the space */
.slide-event .first {
  flex: 0 0 auto; /* Don't grow or shrink */
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
  width: 96%;
  height: 2px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.slide-event .third {
  background: white;
  font-family: Arial;
}
.slide-event .third h1 {
  text-align: center;
  font-size: 13px;
  margin-top: 24px;
  font-weight: 500;
  margin-bottom: 2px;
}
.slide-event .third h3 {
  text-align: center;
  font-size: 15px;
  font-family: Roboto;
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
  font-size: 17px;
  margin-bottom: 0px;
  font-family: 'Arial';
  padding: 3px 7px;
}
.slide-event .second div p {
  font-size: clamp(10px, 0.8rem, 13px);
  text-align: center;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 6px;
}
.slide-event .first .row-seat {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  padding-left: 0px !important;
  padding-right: 0px !important;
  display: grid !important;
  grid-template-columns: repeat(3, 1fr);
  padding: 1.5rem 0px 14px 0px !important;
}
.slide-event .first .row-seat h4 {
  color: #f5f5f5e6;
  font-size: 14px;
  margin-bottom: 2px;
}
.slide-event .first .row-seat h2 {
  color: white;
  font-size: 22.5px;
  font-family: Roboto;
  font-weight: 600;
  margin-bottom: 0 !important;
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
  margin-top: 47px;
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

.bottom-modalstuff .fifth2 {
  padding: 20px !important;
}

.bottom-modalstuff .fifth2 button {
  background: #0157ea;
  color: white;
  font-size: 16px;
  text-align: center;
  border-radius: 1px;
  border: none;
  padding: 7px 32px !important;
}
.slide-event .first .row-seat .rowtext {
  font-size: 17.5px;
}

.slide-event .second {
  flex: 0 0 auto;
  position: relative;
  height: 200px; /* Fixed height for image */
}

.slide-event .third {
  flex: 1; /* Takes remaining space */
  overflow: auto; /* Add scroll if content overflows */
  background: white;
  font-family: Arial;
}

.slide-event .fourth {
  flex: 0 0 auto;
}

/* Adjust the image container */
.slide-event .second img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8);
}

/* Ensure the timer section doesn't push content */
.timer {
  max-height: 100px;
  overflow: hidden;
}

/* Make sure the ticket details section can scroll if needed */
.slide-event .third > div {
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-height: 812px) {
  .slide-event {
    height: 554px;
  }
  .buttons-ts {
    margin-top: 10px;
    margin-bottom: 11px;
  }
  .slide-event .third > div {
    margin-top: -22px;
  }
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

/* Prevent iOS viewport adjustments when keyboard appears */
.transfer_form {
  position: relative;
}

.transfer_form .form input,
.transfer_form .form textarea {
  width: 100%;
  border: 1px solid #918b8be6;
  outline: none;
  font-size: 16px; /* Important: 16px prevents zoom on iOS */
  color: #646060;
  padding: 10px;
  appearance: none;
  -webkit-appearance: none;
  /* Prevent iOS from adjusting the viewport */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.transfer_form .form input {
  height: 41px;
}

.transfer_form .form textarea {
  height: 70px;
  max-height: 70px;
  min-height: 70px;
  max-width: 100%;
  resize: none;
}

/* Fix for bottom modal positioning on iOS */
.bottom-modal-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  /* Prevent iOS keyboard from pushing modal up */
  -webkit-overflow-scrolling: touch;
}

/* Alternative: Use viewport units that don't change with keyboard */
@supports (-webkit-touch-callout: none) {
  /* iOS specific styles */
  .bottom-modal-container {
    bottom: env(safe-area-inset-bottom, 0);
    /* Use the initial viewport height */
    max-height: calc(100vh - env(safe-area-inset-top, 0));
  }
}

.overflow-icon {
  position: absolute;
  width: 50px !important;
  height: 50px !important;
  border-radius: 50%;
  border: none;
  background: #e9e9ea;
  margin: auto;
  left: 0;
  right: 0;
  top: 10%;

  /* Center content */
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-p {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.success-p h1 {
  text-align: center;
  font-size: 14px !important;
  margin-top: 24px;
  font-weight: 600 !important;
  margin-bottom: 2px;
}
.success-p p {
  margin-bottom: 0px !important;
  text-align: center;
}
.sent-box {
  background: #1ba91f;
}
.sent-box h2 {
  font-size: 14px;
  font-family: Poppins;
  color: white;
  margin-bottom: 0px !important;
}
.sGrey2 {
  background: #4f5a64 !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.sGrey1 {
  background: #576672 !important;
}
.timer {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 80%;
  margin: auto;
}
.timer .box h1 {
  font-size: 26px !important;
  font-weight: 600 !important;
  text-align: center;
  margin-top: 5px !important;
  font-family: Poppins;
}
.timer .box h4 {
  font-size: 11px !important;
  font-weight: 500 !important;
  text-transform: uppercase;
  text-align: center;
  font-family: Poppins;
  border: 1px solid #8080804f;
  padding: 1px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-ani {
  animation: topAnimation 0.4s ease-in 0s 1 forwards;
  transform: translateY(-100%);
}
@keyframes topAnimation {
  0% {
    transform: translateY(1000%);
  }
  100% {
    transform: translateY(0);
  }
}

.fade-ani {
  animation: fadeAnimation 0.7s ease-in 0.5s 1 forwards;
  opacity: 0;
}
@keyframes fadeAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.transfer_form .transfer-n1 .lin {
  width: 30px;
  height: 3px;
  background: black;
}

.transfer_form .transfer-n1 h1 {
  font-size: 19px;
  font-weight: 600;
  font-family: Roboto;
}
.top_new_design {
  background-color: #121212;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 37px;
  left: 0;
  width: 100%;
  z-index: 2000;
}
.top_new_design div {
  width: 50%;
  padding: 15px 0px;
}
.top_new_design .first {
  border-bottom: 4.5px solid white;
}
.top_new_design h4 {
  text-align: center;
  font-size: 14px;
  color: white;
  margin-bottom: 0px;
  font-family: Poppins;
}
.transfer_form .first_header h4 {
  font-size: 17px;
  margin-bottom: 0px;
  font-family: Poppins;
}
.transfer_form .first_header h5 {
  font-size: 14px;
  margin-bottom: 0px;
  color: #918b8be6;
  font-family: Poppins;
}
.transfer_form .first_header h5 span {
  color: black;
}

.transfer_form .form label {
  font-size: 14px;
  margin-bottom: 0px;
  color: #000000cf;
  font-family: Poppins;
  display: block;
  font-weight: 600;
}
.transfer_form .form input {
  width: 100%;
  height: 41px;
  border: 1px solid #918b8be6;
  outline: none;
  font-size: 14px;
  color: #646060;
  padding: 10px;
  appearance: none;
  -webkit-appearance: none;
}
.transfer_form .form textarea {
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  border: 1px solid #918b8be6;
  color: #646060;
  height: 70px;
  padding: 10px;
  max-height: 70px;
  outline: none;
  min-height: 70px;
  appearance: none;
  -webkit-appearance: none;
}

.map-img h3 {
  position: absolute;
  color: white;
  top: 15%;
  left: 8%;
  font-size: 20px;
  font-weight: 500;
  padding-right: 12px;
  font-family: Arial;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 1.6);
}

.map iframe {
  width: 100%;
  height: 400px;
}
.map-img {
  width: 100%;
}
.bottom-modalstuff .fifth {
  background: #9a9a9a14;
  padding-bottom: 40px !important;
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
  color: #044deb;
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
  background: #044deb;
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
  font-family: Roboto;
}
.bottom-modalstuff .third h6 {
  font-size: 15px;
}
.bottom-modalstuff .second .info {
  background: white;
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
  font-weight: 600;
  font-family: Roboto;
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
  background: #044deb;
}

.swiper-pagination-bullet:hover {
  background: #003f8f; /* Add hover effect */
}

.slide-event {
  width: 100%;
  box-shadow: 0px 1px 3px black;
  border-radius: 10px;
  height: 565px; /* Fixed height */
  margin-left: 25px;
  position: relative;
}
/* Adjust the internal sections to fill the space */
.slide-event .first {
  flex: 0 0 auto; /* Don't grow or shrink */
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
  background: #044deb;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.slide-event .fourth {
  background: #044deb;
  width: 96%;
  height: 2px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.slide-event .third {
  background: white;
  font-family: Arial;
}
.slide-event .third h1 {
  text-align: center;
  font-size: 13px;
  margin-top: 24px;
  font-weight: 500;
  margin-bottom: 2px;
}
.slide-event .third h3 {
  text-align: center;
  font-size: 15px;
  font-family: Roboto;
  color: #121212;
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
  font-size: 17px;
  margin-bottom: 0px;
  font-family: 'Arial';
  padding: 3px 7px;
}
.slide-event .second div p {
  font-size: clamp(10px, 0.8rem, 13px);
  text-align: center;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 6px;
}
.slide-event .first .row-seat {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  padding-left: 30px !important;
  padding-right: 30px !important;
}
.slide-event .first .row-seat h4 {
  color: #f5f5f5e6;
  font-size: 14px;
  margin-bottom: 2px;
}
.slide-event .first .row-seat h2 {
  color: white;
  font-size: 19.5px;
  font-family: Roboto;
  font-weight: 600;
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
  margin-top: 103px;
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

.bottom-modalstuff .fifth2 {
  padding: 20px !important;
}

.bottom-modalstuff .fifth2 button {
  background: black;
  color: white;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
  border: none;
  font-family: Roboto;
  padding: 7px 23px !important;
}
.slide-event .first .row-seat .rowtext {
  font-size: 17.5px;
}

.slide-event .second {
  flex: 0 0 auto;
  position: relative;
  height: 200px; /* Fixed height for image */
}

.slide-event .third {
  flex: 1; /* Takes remaining space */
  overflow: auto; /* Add scroll if content overflows */
  background: white;
  font-family: Arial;
}

.slide-event .fourth {
  flex: 0 0 auto;
}

/* Adjust the image container */
.slide-event .second img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8);
}

/* Ensure the timer section doesn't push content */
.timer {
  max-height: 100px;
  overflow: hidden;
}

/* Make sure the ticket details section can scroll if needed */
.slide-event .third > div {
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-height: 812px) {
  .slide-event {
    height: 554px;
  }
  .buttons-ts {
    margin-top: 10px;
    margin-bottom: 11px;
  }
  .slide-event .third > div {
    margin-top: -22px;
  }
}

.useMob {
  color: #0078e3;
  font-size: 14px;
  margin-top: 17px;
  margin-bottom: 10px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
