<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import { ref } from 'vue';
import axios from 'axios';


// Client axios global
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Stocke l'id de l'utilisateur connecté
const userId = ref(localStorage.getItem('userId') || null);
const userToken = ref(localStorage.getItem('userToken') || null);

// Informations de connexion
const loginData = ref({
  user_email: '',
  user_password: '',
});




// Fonction de connexion
const login = async () => {
  try {
    // Effectue la requête de connexion pour obtenir le token et userId
    const response = await client.post('/login', loginData.value);


    // Met à jour l'identifiant utilisateur et le stocke dans le localStorage
    userId.value = response.data.user.id_user;
    localStorage.setItem('userId', userId.value);
    console.log("salut", userId)
    console.log("salut2", userId.value)
    console.log(response.data)

    // Affiche la valeur de userId
    console.log('Identifiant utilisateur:', userId.value);

    // Affiche les valeurs de user_email et user_password
    console.log('Email de l\'utilisateur:', loginData.value.user_email);
    console.log('Mot de passe de l\'utilisateur:', loginData.value.user_password);




    console.log('Connecté avec succès', response.data);
  } catch (error) {
    console.error('Erreur lors de la connexion :', error.message);
  }
};

// Fonction de déconnexion
const logout = () => {
  // Supprime le token et le localStorage
  userToken.value = null;
  localStorage.removeItem('userToken');

  // Supprime l'identifiant utilisateur et le localStorage
  userId.value = null;
  localStorage.removeItem('userId');

  console.log('Déconnecté avec succès');
};
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
      <h2>Connexion</h2>
      <form @submit.prevent="login">
        <label for="user_email">Email:</label>
        <input v-model="loginData.user_email" type="email" required>

        <label for="user_password">Mot de passe:</label>
        <input v-model="loginData.user_password" type="password" required>

        <button type="submit">Se connecter</button>
      </form>
    </div>

    <!-- Affichage du statut de connexion -->
    <p v-if="userId">Utilisateur connecté! <button @click="logout">Se déconnecter</button></p>
    <p v-else>Veuillez vous connecter.</p>


    <template #footer> Nouveau Footer </template>
  </DefaultLayout>
</template>

<style></style>
