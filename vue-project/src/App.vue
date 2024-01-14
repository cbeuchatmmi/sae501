<script setup>
import MyIcon from './components/elements/MyIcon.vue'
</script>

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
  <RouterView />
  <div class="footer">
    salut
  </div>
</template>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  background-color: $black;

  &__left {
    display: flex;
    align-items: center;
    justify-items: center;

    &--link {
      text-decoration: none;
      font-weight: bold;
      font-size: $button ;
      color: $white;
      margin-left: rem(32);
    }
  }

  &__right {
    display: flex;
    align-items: center;
    justify-items: center;
  }
}

.footer {
  background-color: $black;
  height: 30vh;
}
</style>
