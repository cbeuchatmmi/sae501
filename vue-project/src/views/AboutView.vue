<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
</script>
<template>
  <DefaultLayout>
    <template #header> Nouveau Header </template>
    Page about
    <template #aside>
      <nav>
        <ul>
          <li><a href="#">Aside link 1</a></li>
          <li><a href="#">Aside link 2</a></li>
          <li><a href="#">Aside link 3</a></li>
        </ul>
      </nav>
    </template>




    <template #footer> Nouveau Footer </template>
  </DefaultLayout>
</template>

<style></style>
