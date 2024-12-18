<script setup>
import { reactive, onMounted } from 'vue'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import BottomNav from '../components/BottomNav.vue'
import axios from 'axios' // Import axios for HTTP requests

// Define a reactive object to hold the items
const state = reactive({
  items: [],
  urls: [],
  events: [],
  loading: true,
  error: null,
  successMessage: null, // New reactive property for success messages
})

// Define another reactive object for form data
const formData = reactive({
  email: '',
  name: '',
  map: '',
  imageUrl: '', // To store the image URL
})

onMounted(async () => {
  try {
    const itemsCollection = collection(firestore, 'user') // 'user' is the Firestore collection name
    const snapshot = await getDocs(itemsCollection)
    const fetchedItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    state.items = fetchedItems

    const itemsCollection2 = collection(firestore, 'img_url') // 'url' is the Firestore collection name
    const snapshot2 = await getDocs(itemsCollection2)
    const fetchedItems2 = snapshot2.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    state.urls = fetchedItems2

    const itemsCollection3 = collection(firestore, 'event') // 'event' is the Firestore collection name
    const snapshot3 = await getDocs(itemsCollection3)
    const fetchedItems3 = snapshot3.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    state.events = fetchedItems3

    const itemsCollection4 = collection(firestore, 'map')
    const snapshot4 = await getDocs(itemsCollection4)
    let data = snapshot4.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    formData.map = data[0].location || ''

    // Update form data once items are fetched
    if (fetchedItems.length > 0) {
      formData.email = fetchedItems[0].email || ''
      formData.name = fetchedItems[0].name || ''
    }

    if (fetchedItems2.length > 0) {
      formData.imageUrl = fetchedItems2[0].url
    }
  } catch (err) {
    console.error('Error fetching items:', err)
    state.error = 'Failed to load items.'
  } finally {
    state.loading = false
  }
})

// Update function to handle form submission
const updateAccD = async event => {
  event.preventDefault() // Prevent form submission from refreshing the page

  if (!formData.email || !formData.name) {
    state.error = 'Please fill in both email and name.'
    return
  }

  try {
    // Assuming you're updating the first user's data, you can modify it to target the correct user if needed
    const userDocRef = doc(firestore, 'user', state.items[0].id) // Get reference to the user's document
    await updateDoc(userDocRef, {
      email: formData.email,
      name: formData.name,
    })

    // Update the state after successful update
    state.items[0].email = formData.email
    state.items[0].name = formData.name

    state.successMessage = 'Account updated successfully!' // Show success message
    state.error = null // Clear any error message
    console.log('Account updated successfully')

    // Auto hide the success message after 3 seconds
    setTimeout(() => {
      state.successMessage = null
    }, 3000)
  } catch (err) {
    console.error('Error updating account:', err)
    state.error = 'Failed to update account.'
    state.successMessage = null // Clear any success message if an error occurs

    // Auto hide the error message after 3 seconds
    setTimeout(() => {
      state.error = null
    }, 3000)
  }
}

// Function to handle image upload and update
const postImage = async event => {
  event.preventDefault()

  const fileInput = event.target.querySelector('input[type="file"]')
  const file = fileInput.files[0]

  if (!file) {
    state.error = 'Please select an image.'
    return
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('key', '55fdc4f9634c9ce63666928abe512e77') // Your ImgBB API key

  try {
    // Upload image to ImgBB
    const response = await axios.post(
      'https://api.imgbb.com/1/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )

    // Get the image URL from the response
    const imageUrl = response.data.data.url

    // Optionally update a separate img_url collection if needed
    const imgUrlDocRef = doc(firestore, 'img_url', state.urls[0].id)
    await updateDoc(imgUrlDocRef, {
      url: imageUrl,
    })

    state.items[0].imageUrl = imageUrl
    state.successMessage = 'Image updated successfully!' // Show success message
    state.error = null // Clear any error message

    // Auto hide the success message after 3 seconds
    setTimeout(() => {
      state.successMessage = null
    }, 3000)
    console.log('Image updated successfully:', imageUrl)
  } catch (err) {
    console.error('Error uploading image:', err)
    state.error = 'Failed to upload image.'
    state.successMessage = null // Clear any success message if an error occurs

    // Auto hide the error message after 3 seconds
    setTimeout(() => {
      state.error = null
    }, 3000)
  }
}

const postTicket = async event => {
  event.preventDefault() // Prevent form submission from refreshing the page

  const eventName = event.target.querySelector(
    '[placeholder="Weekends with Adele"]',
  ).value
  const row = event.target.querySelector('[placeholder="G"]').value
  const seat = event.target.querySelector('[placeholder="104 seat"]').value
  const sec = event.target.querySelector('[placeholder="104 section"]').value
  const section = event.target.querySelector(
    '[placeholder="104 section"]',
  ).value
  const datePlace = event.target.querySelector(
    '[placeholder="Sat, Nov 9, 8pm • The Colosseum at Caesars Palace "]',
  ).value

  const section_bottom = event.target.querySelector(
    '[placeholder="SECTION 108"]',
  ).value
  const url = formData.imageUrl // Assuming the image URL is stored in formData.imageUrl

  try {
    const ticketsCollection = collection(firestore, 'event')
    const docRef = await addDoc(ticketsCollection, {
      event_name: eventName,
      row: row,
      seat: seat,
      sec: sec,
      section: section,
      date_place: datePlace,
      url: url,
      section_bottom: section_bottom,
    })

    state.successMessage = 'Ticket created successfully!' // Show success message

    const itemsCollection3 = collection(firestore, 'event')
    const snapshot3 = await getDocs(itemsCollection3)
    const fetchedItems3 = snapshot3.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    state.events = fetchedItems3
    event.target.reset()

    // Auto hide the success message after 3 seconds
    setTimeout(() => {
      state.successMessage = null
    }, 3000)
  } catch (error) {
    console.error('Error adding ticket:', error)
    state.error = 'Failed to add ticket.'
    state.successMessage = null // Clear any success message if an error occurs

    // Auto hide the error message after 3 seconds
    setTimeout(() => {
      state.error = null
    }, 3000)
  }
}

const deleteEvent = async eventId => {
  try {
    console.log(eventId)
    const eventDocRef = doc(firestore, 'event', eventId) // Get reference to the event's document
    await deleteDoc(eventDocRef) // Delete the event from Firestore

    // Remove the event from the state to update the UI
    state.events = state.events.filter(event => event.id !== eventId)

    state.successMessage = 'Event deleted successfully!' // Show success message
    setTimeout(() => {
      state.successMessage = null
    }, 3000)
  } catch (err) {
    console.error('Error deleting event:', err)
    state.error = 'Failed to delete event.'
    setTimeout(() => {
      state.error = null
    }, 3000)
  }
}

const updateMap = async event => {
  event.preventDefault()

  try {
    const itemsCollection = collection(firestore, 'map')
    const snapshot = await getDocs(itemsCollection)
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    const imgUrlDocRef = doc(firestore, 'map', data[0].id)
    await updateDoc(imgUrlDocRef, {
      location: event.target[0].value,
    })

    state.successMessage = 'Map updated successfully!'

    console.log(event.target[0].value)
    event.target.reset()

    // Auto hide the success message after 3 seconds
    setTimeout(() => {
      state.successMessage = null
    }, 3000)
  } catch (error) {
    state.error = 'Failed to updated map name.'

    console.error('Error adding ticket:', error)

    // Auto hide the error message after 3 seconds
    setTimeout(() => {
      state.error = null
    }, 3000)
  }
}
</script>

<template>
  <div class="main_stuff p-3">
    <div class="first_sec">
      <h1>Account Name Section</h1>

      <!-- Show the form only when data is loaded -->
      <form
        v-if="!state.loading && state.items.length > 0"
        @submit="updateAccD"
      >
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label"
            >Email address</label
          >
          <input
            type="email"
            v-model="formData.email"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="name@example.com"
          />
        </div>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">Name</label>
          <input
            type="text"
            v-model="formData.name"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="Ijaka"
          />
        </div>

        <button type="submit" class="btn btn-primary">Update</button>
      </form>

      <!-- Show a loading message if the data is still being fetched -->
      <div v-else-if="state.loading" class="loading-container">
        <p>Loading...</p>
      </div>

      <!-- Show an error message if there was an issue fetching data -->
      <div v-else-if="state.error" class="error-container">
        <p>{{ state.error }}</p>
      </div>

      <!-- Show a success message -->
      <div v-if="state.successMessage" class="success-container">
        <p>{{ state.successMessage }}</p>
      </div>
    </div>

    <div class="second_sec my-4">
      <h1>Event Image</h1>
      <img
        v-if="!state.loading"
        class="my-3"
        :src="formData.imageUrl"
        alt="Event image"
        width="100%"
        height="200"
        style="object-fit: cover"
      />
      <form @submit="postImage">
        <input type="file" class="form-control" id="exampleFormControlInput1" />
        <button type="submit" class="btn btn-primary mt-3">Update Image</button>
      </form>

      <!-- Show a success message after image update -->
      <div v-if="state.successMessage" class="success-container">
        <p>{{ state.successMessage }}</p>
      </div>

      <!-- Show an error message if there was an issue -->
      <div v-if="state.error" class="error-container">
        <p>{{ state.error }}</p>
      </div>
    </div>

    <div class="third my-5">
      <h1>Map Details</h1>
      <form @submit="updateMap">
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label"
            >Location name</label
          >
          <input
            type="text"
            v-model="formData.map"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="Footprint Center"
          />
        </div>
        <button type="submit" class="btn btn-primary">update</button>
      </form>
    </div>

    <div class="third my-5">
      <h1>Create Ticket</h1>
      <form @submit="postTicket">
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label"
            >Event Name</label
          >
          <input
            type="text"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="Weekends with Adele"
          />
        </div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">Row</label>
          <input
            type="text"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="G"
          />
        </div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">Seat</label>
          <input
            type="text"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="104 seat"
          />
        </div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label"
            >Section</label
          >
          <input
            type="text"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="104 section"
          />
        </div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label"
            >Date/Place</label
          >
          <input
            type="text"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="Sat, Nov 9, 8pm • The Colosseum at Caesars Palace "
          />
        </div>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label"
            >section bottom</label
          >
          <input
            type="text"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="SECTION 108"
          />
        </div>
        <button type="submit" class="btn btn-primary">Create</button>
      </form>
    </div>

    <div class="fourth mb-5">
      <h1>Event View</h1>
      <div v-if="!state.loading && state.events.length > 0">
        <div
          v-for="(event, index) in state.events"
          :key="index"
          class="event-item"
        >
          <div class="event-info">
            <h3>{{ index + 1 }}) {{ event.event_name }}</h3>
            <p>
              <strong>Row:</strong> {{ event.row }} | <strong>Seat:</strong>
              {{ event.seat }}
            </p>
            <p><strong>section_bottom:</strong> {{ event.section_bottom }}</p>
            <p>
              <strong>Section:</strong> {{ event.section }} |
              <strong>Date/Place:</strong> {{ event.date_place }}
            </p>
            <img
              :src="event.url"
              alt="Event image"
              width="100px"
              height="100px"
              style="object-fit: cover"
            />
          </div>
          <!-- Delete Button -->
          <button @click="deleteEvent(event.id)" class="btn btn-danger mt-2">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main_stuff {
  padding: 1rem;
}

.first_sec,
.second_sec,
.third {
  padding: 1rem;
}

.error-container {
  color: red;
}

.success-container {
  color: green;
}

.loading-container {
  color: blue;
}

.my-3 {
  margin: 1rem 0;
}

.event-item {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
}

.event-info {
  margin-bottom: 1rem;
}

.event-item img {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
}

.btn-danger {
  background-color: red;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
}

.btn-danger:hover {
  background-color: darkred;
}
</style>
