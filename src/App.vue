<script setup>
import MyIcon from './components/elements/MyIcon.vue'
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

onMounted(() => {
  const router = useRouter();
  const route = useRoute();

  // Récupérer userId depuis le stockage local
  const userId = localStorage.getItem('userId');

  // Si userId n'est pas défini et l'utilisateur n'est pas déjà sur la page de connexion, redirigez-le
  if (!userId && route.path !== '/login') {
    router.push('/login');
  }
});
</script>
<template>
  <div class="page-container">
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
    <!-- <div class="footer">
      <div class="footer__content">
        <p>&copy; 2025 - Tous droits réservés</p>
      </div>
    </div> -->
  </div>
</template>
<style lang="scss">
.header {
  position: relative; 
  z-index: 10;
  display: flex;
  justify-content: space-between;
  background-color: $light-black;

  &__left {
    display: flex;
    align-items: center;
    justify-items: center;

    &--link {
      text-decoration: none;
      font-weight: bold;
      font-size: $button;
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
body {
    background-color: $black;
    margin: 0; 
    padding: 0;
    font-family: Arial, sans-serif; 
}
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

.RouterView {
  flex: 1; 
}

.footer {
  background-color: $light-black;
  color: $white;
  text-align: center;
  padding: rem(20);
  margin-top: rem(20);

  &__content {
    max-width: 1200px;
    margin: 0 auto;

    p {
      font-size: $body;
      margin-bottom: rem(16);
    }
  }
}
</style>
