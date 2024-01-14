<script setup>
import MyConnexion from '../components/elements/MyConnexion.vue';
import MyIcon from '../components/elements/MyIcon.vue';

</script>
<template>
  <template>
    <nav>
      <div class="header">
        <div class="header__left">
          <a href="/">
            <MyIcon name="" />
          </a>
          <a href="/add" class="header__left--link">Création</a>
        </div>
        <div class="header__right">
          <a href="/panier">
            <MyIcon name="panier" />
          </a>
          <a href="/login">
            <MyIcon name="profil" />
          </a>
        </div>
      </div>
    </nav>
  </template>

  <MyConnexion />

  <template> Nouveau Footer </template>
</template>

<style></style>
