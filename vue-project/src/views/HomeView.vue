<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
import ListeMontre from '../components/elements/ListeMontre.vue';
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


    <div>
      <ListeMontre />
    </div>



    <template #footer>
    </template>
  </DefaultLayout>
</template>
<style lang="scss"></style>
