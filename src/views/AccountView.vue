<script setup>
import { reactive, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import BottomNav from '../components/BottomNav.vue'

// Define a reactive object to hold the items
const state = reactive({
  items: [],
  loading: true,
  error: null,
})

onMounted(async () => {
  try {
    const itemsCollection = collection(firestore, 'user')
    const snapshot = await getDocs(itemsCollection)
    state.items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    // console.log('Fetched items:', state.items)
  } catch (err) {
    console.error('Error fetching items:', err)
    state.error = 'Failed to load items.'
  } finally {
    state.loading = false
  }
})
</script>
<template>
  <div class="main_container">
    <div class="main_sec">
      <img class="fixed-top" src="../assets/acc1.jpeg" alt="" />
      <div class="first_sec">
        <div class="black_name px-4 pb-3 pt-5">
          <h1 class="mb-2">{{ state.items[0]?.name }}</h1>
          <h5>{{ state.items[0]?.email }}</h5>
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
