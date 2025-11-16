<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BottomNav from '../../components/BottomNav2.vue'
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'

const isUpcoming = ref(true)
const loading = ref(false)
const event = ref([])

const selectedCountry = localStorage.getItem('selectedCountryUKS') || 'uk'

const handleChange = value => {
  isUpcoming.value = value
}

onMounted(async () => {
  try {
    loading.value = true
    const itemsCollection = collection(firestore, 'event')
    const snapshot = await getDocs(itemsCollection)
    // event.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    event.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() ?? new Date(0) // fallback to epoch if undefined
        const bDate = b.createdAt?.toDate?.() ?? new Date(0)
        return aDate - bDate
      })

    console.log('Fetched items:', event.value)
    loading.value = false
  } catch (err) {
    loading.value = false

    console.error('Error fetching items:', err)
  }
})

function formatEventDate(datePlace) {
  if (!datePlace) return { formattedDate: '', place: '' }

  // Split into date/time part and location
  const [dateTimeStr, placeRaw] = datePlace.split('•').map(str => str.trim())

  const place = placeRaw?.split('/')[0]?.trim() || ''

  // Convert to Date object
  const dateObj = new Date(dateTimeStr)

  // Format parts
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  const dateFormatted = dateObj
    .toLocaleDateString('en-US', options)
    .toUpperCase()

  let hours = dateObj.getHours()
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12

  const timeFormatted = `${hours}:${minutes}${ampm}`

  return {
    formattedDate: `${dateFormatted} . ${timeFormatted}`,
    place,
  }
}
</script>

<template>
  <div class="main_container">
    <div class="main_sec">
      <img
        v-if="selectedCountry == 'uk'"
        class="fixed-top"
        src="../../assets/eventUkT.png"
        alt=""
      />
      <img
        v-if="selectedCountry == 'belgium'"
        class="fixed-top"
        src="../../assets/belT2.jpg"
        alt=""
      />
      <img
        v-if="selectedCountry == 'ireland'"
        class="fixed-top"
        src="../../assets/IrelandT1.jpg"
        alt=""
      />
      <img
        v-if="selectedCountry == 'netherland'"
        class="fixed-top"
        src="../../assets/netherT2.jpg"
        alt=""
      />

      <div class="first_sec">
        <!-- <img src="../../assets/img12.jpeg" alt="" /> -->
        <div class="blue-nav d-flex justify-content-between">
          <div
            :class="['first', isUpcoming && 'active']"
            @click="handleChange(true)"
          >
            <h3>UPCOMING (1)</h3>
          </div>
          <div
            :class="['second', !isUpcoming && 'active']"
            @click="handleChange(false)"
          >
            <h3>PAST (0)</h3>
          </div>
        </div>
      </div>
      <div v-if="loading" class="loader-stuff py-2">
        <img src="../../assets/loader.gif" width="20" height="20" alt="" />
      </div>
      <RouterLink
        style="text-decoration: none"
        :to="{
          name: 'event-uk-details',
          query: { event: JSON.stringify(event) },
        }"
      >
        <div v-if="event.length > 0 && !loading" class="ticket-first p-2">
          <!-- <div class="top-level">
            <h3 class="py-1">NEW DATE</h3>
          </div> -->
          <div class="new-designn">
            <div class="image-and-date">
              <img class="ti" :src="event[0]?.url" alt="" />
              <!-- <div class="ticket-details">
                <h2>{{ event[0]?.event_name }}</h2>
                <p class="mb-1">
                  {{ event[0]?.date_place }}
                </p>
                <h6 class="d-flex align-items-center">
                  <i class="fas fa-ticket-alt ticketIcon me-1"></i>
                  {{ event.filter(e => e.is_uk == false).length }} tickets
                </h6>
              </div> -->
            </div>
            <div class="new-d122 px-3 position-relative">
              <div class="top-part px-3 py-2">
                <h4>
                  {{ formatEventDate(event[0]?.date_place).formattedDate }}
                </h4>
              </div>
              <h1>{{ event[0]?.event_name }}</h1>
              <div
                class="d-flex mt-4 justify-content-between align-items-center"
              >
                <h2>{{ formatEventDate(event[0]?.date_place).place }}</h2>

                <h6 class="d-flex align-items-center">
                  <!-- <i class="fas fa-ticket-alt ticketIcon me-1"></i> -->
                  <img
                    src="../../assets/tic-icon.jpg"
                    class="me-1"
                    width="25"
                    height="25"
                    alt=""
                  />
                  x{{ event.filter(e => e.is_uk == true).length }}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>

    <BottomNav />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.new-designn {
  background: black;
  padding-bottom: 20px;
}
.new-designn .new-d122 h1 {
  font-size: 30px;
  color: white;
  position: relative;
}
.new-designn .new-d122 h2 {
  font-size: 16px;
  color: #ffffffad;
}
.new-designn .new-d122 h6 {
  color: #ffffffad;
}
.new-designn .new-d122 .top-part {
  background: black;
  position: absolute;
  left: 0;
  top: -36px;
}
.new-designn .new-d122 .top-part h4 {
  font-size: 14px;
  color: white;
}
.new-designn .new-d122 h1::after {
  content: '';
  width: 70%;
  height: 4px;
  background: rgb(130 91 52 / 93%);
  position: absolute;
  bottom: -10px;
  left: 0;
}

.loader-stuff img {
  width: 40px;
  height: 40px;
}
.loader-stuff {
  display: flex;
  justify-content: center;
}
.blue-nav {
  background: #004de7;
  color: white;
  margin-top: 10%;
}
.blue-nav div {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
}
.blue-nav div h3 {
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
}
.blue-nav .active {
  border-bottom: 5px solid white;
}
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
  height: 240px;
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
  font-family: Arial;
  padding: 3px 0px;
}
.image-and-date .ticket-details p {
  font-size: clamp(11px, 0.9rem, 14px);
}
.image-and-date .ticket-details h6 {
  font-size: 12px;
}
.ticketIcon {
  transform: rotate(122deg);
}
</style>
