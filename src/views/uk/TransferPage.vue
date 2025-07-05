<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const tickets = ref([])
const selectedTickets = ref([]) // Track selected ticket IDs

// Load ticket data
onMounted(() => {
  if (route.query.event) {
    try {
      tickets.value = JSON.parse(route.query.event)
    } catch (e) {
      console.error('Error parsing event data:', e)
    }
  }
  setTimeout(() => {
    isLoading.value = false
  }, 3000)
})

// Extracted parts from tickets[0].date_place
const eventDate = computed(() => {
  if (!tickets.value.length) return ''
  return tickets.value[0].date_place.split(' • ')[0]
})

const eventDay = computed(() => {
  if (!tickets.value.length) return ''
  const parts = tickets.value[0].date_place.split(' ')
  return parts.length >= 3 ? parts[2].replace(',', '') : ''
})

const eventVenue = computed(() => {
  if (!tickets.value.length) return ''
  return tickets.value[0].date_place.split(' • ')[1] || ''
})

// Go back handler
const goBack = () => {
  router.back()
}

// Generate Ticket Ref like "Ticket-GAO-77"
const generateTicketRef = (ticket, index) => {
  const prefix = 'GAO'
  const idPart =
    ticket.id?.toString().slice(-2) || (index + 1).toString().padStart(2, '0')
  return `Ticket-${prefix}-${idPart}`
}

// Select all tickets
const selectAll = () => {
  selectedTickets.value = tickets.value.map(ticket => ticket.id)
}

// Deselect all tickets
const deselectAll = () => {
  selectedTickets.value = []
}

// Toggle checkbox
const toggleSelection = ticketId => {
  if (selectedTickets.value.includes(ticketId)) {
    selectedTickets.value = selectedTickets.value.filter(id => id !== ticketId)
  } else {
    selectedTickets.value.push(ticketId)
  }
}

const handleTransfer = () => {
  console.log('Selected Tickets:', selectedTickets.value)
  // You can route or handle logic here
}
</script>

<template>
  <div class="transfer-main">
    <!-- Navigation Bar -->
    <div class="nav d-flex align-items-center p-2 pe-3 position-relative">
      <div class="d-flex align-items-center" @click="goBack()">
        <i
          class="fas fa-chevron-left"
          style="color: #f5f5f5e6; font-size: 18px"
        ></i>
        <h2 class="ms-2">My Tickets</h2>
      </div>

      <div class="nav-title-center">
        <h1>Transfer Tickets</h1>
      </div>

      <div class="ms-auto">
        <h3>Help</h3>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div class="is-empty" v-if="isLoading">
      <div class="spinner mb-2"></div>
      <h1>We're fetching your tickets</h1>
      <p>This shouldn't take long</p>
    </div>

    <div v-if="!isLoading">
      <!-- Hero Section -->
      <div
        v-if="tickets.length"
        class="first-section px-2 py-4 position-relative"
      >
        <div
          class="blur-bg"
          :style="{ backgroundImage: 'url(' + tickets[0].url + ')' }"
        ></div>

        <div class="content-overlay position-relative">
          <h6 class="mb-2">{{ eventDate }}</h6>
          <div class="d-flex">
            <h1 class="f1">{{ eventDay }}</h1>
            <div class="ms-2">
              <h2>{{ tickets[0].event_name }}</h2>
              <p>{{ eventVenue }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Ticket Illustration -->
      <img src="../../assets/newT.jpg" alt="" style="width: 100%" />

      <!-- Ticket Selection -->
      <div class="select-side p-3 pt-4 pb-4">
        <div class="header">
          <h1>Select Tickets To Transfer</h1>
          <div class="d-flex px-2 mb-4">
            <h2 class="me-4" @click="selectAll" style="cursor: pointer">
              Select All
            </h2>
            <h2 @click="deselectAll" style="cursor: pointer">Deselect All</h2>
          </div>
        </div>

        <div>
          <div
            class="d-flex align-items mb-3"
            v-for="(ticket, index) in tickets"
            :key="ticket.id"
          >
            <input
              type="checkbox"
              style="width: 25px"
              :checked="selectedTickets.includes(ticket.id)"
              @change="toggleSelection(ticket.id)"
            />
            <div class="ms-2 box-select px-5 pt-4 pb-3">
              <h4 class="mb-4">{{ ticket.ticket_header }}</h4>
              <h1>{{ ticket.ticket_header2 }}</h1>
              <p>
                {{ ticket.ticket_header2 }} / Ref:
                {{ generateTicketRef(ticket, index) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="receipt-detail pb-4"></div>
      <div class="box-side p-3 pb-4 pt-4">
        <h1 class="mt-3">Enter Receipt Details</h1>
        <div class="input-side mt-4">
          <label for="" class="mb-1">First Name</label>
          <input type="text" placeholder="Enter first name" />
        </div>
        <div class="input-side mt-3">
          <label for="" class="mb-1">Last Name</label>
          <input type="text" placeholder="Enter last name" />
        </div>
        <div class="input-side mt-3 mb-3">
          <label for="" class="mb-1">Email</label>
          <input type="text" placeholder="Enter email" />
        </div>
      </div>
      <div class="receipt-detail pb-5"></div>
    </div>
    <img
      v-if="!isLoading"
      src="../../assets/chat-float.jpg"
      class="floating-btn"
      @click="handleTransfer"
      alt=""
    />
    <!-- <button class="floating-btn" @click="handleTransfer">
      <i class="fa-solid fa-message me-1"></i> Chat
    </button> -->
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600&display=swap');

.floating-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 100px;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  transition: background-color 0.3s ease;
}

.floating-btn:hover {
  background-color: #005bb5;
}

.box-side h1 {
  font-size: 20px;
  margin-bottom: 0px;
}
.box-side label {
  font-size: 16px;
  display: block;
  color: #000000a7;
}
.box-side input {
  width: 100%;
  height: 47px;
  padding: 10px;
  outline: 0px;
}

.receipt-detail {
  background: #f7f5f8;
}
.box-side {
  width: 100%;
  background: white;
}

.transfer-main {
  font-family: 'Poppins', sans-serif;
}
.box-select {
  width: 100%;
  border: 1px solid rgba(128, 128, 128, 0.616);
  border-radius: 5px;
  text-align: center;
  position: relative;
}
.box-select::before {
  content: '';
  width: 100%;
  height: 3.5px;
  border-radius: 5px;
  background: #0245dd;
  position: absolute;
  top: 0;
  left: 0;
}
.box-select h1 {
  font-size: 20px;
  margin-bottom: 0px;
}
.box-select p {
  font-size: 14px;
  margin-bottom: 0px;
  font-weight: 500;
}
.box-select h4 {
  font-size: 16px;
  color: #000000a7;
}

.select-side .header h1 {
  font-size: 19px;
  font-weight: 500;
}
.select-side .header h2 {
  font-size: 16px;
  font-weight: 500;
  color: #0078e3;
}
.select-side {
  background: white;
}

/* Navigation Bar */
.nav {
  width: 100%;
  position: sticky !important;
  z-index: 1000;
  top: 0;
  background: #121212;
  height: 60px;
  padding-left: 16px;
  padding-right: 16px;
}

.nav-title-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.nav h1,
.nav h2,
.nav h3 {
  color: #f5f5f5e6;
  font-size: 18px;
  margin-bottom: 0;
}
.nav h1 {
  font-weight: 400;
}
.nav h2 {
  font-weight: 300;
}
.nav h3 {
  font-weight: 500;
}

/* Ticket Display */
.first-section {
  position: relative;
  overflow: hidden;
  min-height: 180px;
}

.blur-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  transform: scale(1.1);
  z-index: 1;
}

.content-overlay {
  z-index: 2;
  position: relative;
  color: #fff;
}
.content-overlay h2 {
  margin-bottom: 0;
  text-decoration: underline;
}

/* Spinner Section */
.is-empty {
  width: 100%;
  background: #e2e6e969;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 46px 0 113px;
}

.spinner {
  width: 61px;
  height: 61px;
  border: 7px solid #004de8;
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.is-empty h1 {
  font-size: 23px;
  margin-bottom: -10px;
}
.is-empty p {
  font-size: 16px;
  margin-bottom: 0;
}
</style>
