<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
import ListeMontre from '../components/elements/ListeMontre.vue';
import MyPanier from '../components/elements/MyPanier.vue';
import MyIcon from '../components/elements/MyIcon.vue';
</script>

<template>
  <DefaultLayout>
    <template #header>
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

    <div>
      <MyPanier />
    </div>

    <div>
      <ListeMontre />
    </div>


    <template #footer>
    </template>
  </DefaultLayout>
</template>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;

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
</style>
