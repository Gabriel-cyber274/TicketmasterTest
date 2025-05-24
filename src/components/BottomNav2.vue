<script setup>
import { ref, onMounted } from 'vue'

const activeLink = ref('')

const routeMapping = {
  '/uk-index': 'isDis',
  '/account2': 'isMa',
  '/fy': 'isFy',
  '/event2': 'isMe',
  '/sell': 'isSell',
}

onMounted(() => {
  const url = window.location.pathname
  activeLink.value = routeMapping[url] || ''
})
</script>

<template>
  <div class="footer_cont">
    <RouterLink to="/uk-index"
      ><img
        v-if="activeLink === 'isDis'"
        src="../assets/disActive.jpeg"
        alt=""
      />
      <img v-if="activeLink !== 'isDis'" src="../assets/dis.jpeg" alt="" />
    </RouterLink>
    <img src="../assets/fy2.png" style="transform: scale(1.1)" alt="" />
    <RouterLink to="/event2">
      <img v-if="activeLink !== 'isMe'" src="../assets/me.jpeg" alt="" />
      <img v-if="activeLink == 'isMe'" src="../assets/meActive.jpeg" alt="" />
    </RouterLink>
    <RouterLink to="/account2">
      <img v-if="activeLink !== 'isMa'" src="../assets/ma.jpeg" alt="" />
      <img v-if="activeLink === 'isMa'" src="../assets/maActive.jpeg" alt=""
    /></RouterLink>
  </div>
</template>
