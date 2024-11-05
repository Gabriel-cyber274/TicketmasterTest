<script setup>
import { ref, onMounted } from 'vue'

const activeLink = ref('')

const routeMapping = {
  '/': 'isDis',
  '/account': 'isMa',
  '/fy': 'isFy',
  '/event': 'isMe',
  '/sell': 'isSell',
}

onMounted(() => {
  const url = window.location.pathname
  activeLink.value = routeMapping[url] || ''
})
</script>

<template>
  <div class="footer_cont">
    <RouterLink to="/"
      ><img
        v-if="activeLink === 'isDis'"
        src="../assets/disActive.jpeg"
        alt=""
      />
      <img v-if="activeLink !== 'isDis'" src="../assets/dis.jpeg" alt="" />
    </RouterLink>
    <img src="../assets/fy.jpeg" alt="" />
    <RouterLink to="/event">
      <img v-if="activeLink !== 'isMe'" src="../assets/me.jpeg" alt="" />
      <img v-if="activeLink == 'isMe'" src="../assets/meActive.jpeg" alt="" />
    </RouterLink>
    <img src="../assets/sell.jpeg" alt="" />
    <RouterLink to="/account">
      <img v-if="activeLink !== 'isMa'" src="../assets/ma.jpeg" alt="" />
      <img v-if="activeLink === 'isMa'" src="../assets/maActive.jpeg" alt=""
    /></RouterLink>
  </div>
</template>
