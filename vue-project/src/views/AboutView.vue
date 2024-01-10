<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const montres = ref([]);
const newMontre = ref({
  id_utilisateur_commande: '',
  id_utilisateur_enregistrer: '',
  id_bracelet: '',
  id_boitier: '',
  id_heure: '',
  id_minute: '',
  id_seconde: '',
});

// Client axios global
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const getMontres = async () => {
  try {
    const response = await client.get('/montres');
    montres.value = response.data.montres;
  } catch (error) {
    console.error('Erreur lors de la récupération des montres :', error.message);
  }
};

const addMontre = async () => {
  try {
    await client.post('/montres/add', newMontre.value);
    // Actualisez la liste des montres après l'ajout
    await getMontres();
    // Réinitialisez le formulaire
    newMontre.value = {
      id_utilisateur_commande: '',
      id_utilisateur_enregistrer: '',
      id_bracelet: '',
      id_boitier: '',
      id_heure: '',
      id_minute: '',
      id_seconde: '',
    };
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la montre :', error.message);
  }
};

onMounted(getMontres);

// Fonction de connexion
const login = async () => {
  try {
    const response = await client.post('/login', { /* Les détails de connexion ici */ });
    userToken.value = response.data.token;
    localStorage.setItem('userToken', userToken.value);
    console.log('Connecté avec succès', response.data);
  } catch (error) {
    console.error('Erreur lors de la connexion :', error.message);
  }
};

// Fonction de déconnexion
const logout = () => {
  userToken.value = null;
  localStorage.removeItem('userToken');
  console.log('Déconnecté avec succès');
};

const userToken = ref(localStorage.getItem('userToken') || null);

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
      <h1>Liste des Montres</h1>
      <ul>
        <li v-for="montre in montres" :key="montre.id_montre">
          {{ montre.id_montre }} - {{ montre.id_bracelet }}
          <!-- Remplacez "autres_attributs" par les attributs que vous souhaitez afficher -->
        </li>
      </ul>
    </div>


    <div>
      <h2>Ajouter une Montre</h2>
      <form @submit.prevent="addMontre">
        <label for="id_utilisateur_commande">Id Utilisateur Commande:</label>
        <input v-model="newMontre.id_utilisateur_commande" type="text" required>

        <label for="id_utilisateur_enregistrer">Id Utilisateur Enregistrer:</label>
        <input v-model="newMontre.id_utilisateur_enregistrer" type="text" required>

        <label for="id_bracelet">Id Bracelet:</label>
        <input v-model="newMontre.id_bracelet" type="text" required>

        <label for="id_boitier">Id Boitier:</label>
        <input v-model="newMontre.id_boitier" type="text" required>

        <label for="id_heure">Id Heure:</label>
        <input v-model="newMontre.id_heure" type="text" required>

        <label for="id_minute">Id Minute:</label>
        <input v-model="newMontre.id_minute" type="text" required>

        <label for="id_seconde">Id Seconde:</label>
        <input v-model="newMontre.id_seconde" type="text" required>

        <button type="submit">Ajouter</button>
      </form>
    </div>
    <p v-if="userToken">Utilisateur connecté!</p>
    <p v-else>Veuillez vous connecter.</p>

    <button v-if="!userToken" @click="login">Se connecter</button>
    <button v-if="userToken" @click="logout">Se déconnecter</button>


    <template #footer> Nouveau Footer </template>
  </DefaultLayout>
</template>

<style></style>
