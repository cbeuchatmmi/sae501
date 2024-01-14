<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

import MyConnexion from '../components/elements/MyConnexion.vue'


</script>
<template>
  <DefaultLayout>
    <template #header>
      <nav>
        <ul>
          <li><a href="/three">three</a></li>
          <li><a href="/about">about</a></li>
          <li><a href="/contact">contact</a></li>
        </ul>
      </nav>
    </template>

    <MyConnexion />

    <template #footer> Nouveau Footer </template>
  </DefaultLayout>
</template>

<style></style>
