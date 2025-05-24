<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BottomNav from '../../components/BottomNav2.vue'
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'

const isUpcoming = ref(true)
const loading = ref(false)
const event = ref([])

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
</script>

<template>
  <div class="main_container">
    <div class="main_sec">
      <img class="fixed-top" src="../../assets/eventUkT.png" alt="" />
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
        :to="{
          name: 'event-details',
          query: { event: JSON.stringify(event) },
        }"
      >
        <div v-if="event.length > 0 && !loading" class="ticket-first p-2">
          <!-- <div class="top-level">
            <h3 class="py-1">NEW DATE</h3>
          </div> -->
          <div class="image-and-date">
            <!-- <img class="ti" src="../../assets/adele-pic.jfif" alt="" /> -->
            <img class="ti" :src="event[0]?.url" alt="" />
            <div class="ticket-details">
              <h2>{{ event[0]?.event_name }}</h2>
              <p class="mb-1">
                {{ event[0]?.date_place }}
              </p>
              <h6 class="d-flex align-items-center">
                <i class="fas fa-ticket-alt ticketIcon me-1"></i>
                {{ event.length }} tickets
              </h6>
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
  height: 260px;
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
