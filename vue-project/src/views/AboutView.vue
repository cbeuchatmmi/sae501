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

// Stocke l'id de l'utilisateur connecté
const userId = ref(localStorage.getItem('userId') || null);
const userToken = ref(localStorage.getItem('userToken') || null);

// Informations de connexion
const loginData = ref({
  user_email: '',
  user_password: '',
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
    // Effectue la requête de connexion pour obtenir le token et userId
    const response = await client.post('/login', loginData.value);


    // Met à jour l'identifiant utilisateur et le stocke dans le localStorage
    userId.value = response.data.user.id_user;
    localStorage.setItem('userId', userId.value);
    console.log(response.data)

    // Affiche la valeur de userId
    console.log('Identifiant utilisateur:', userId.value);

    // Affiche les valeurs de user_email et user_password
    console.log('Email de l\'utilisateur:', loginData.value.user_email);
    console.log('Mot de passe de l\'utilisateur:', loginData.value.user_password);



    // Met à jour les valeurs des champs liés à l'utilisateur connecté
    newMontre.value.id_utilisateur_commande = userId.value;
    newMontre.value.id_utilisateur_enregistrer = userId.value;

    console.log('Connecté avec succès', response.data);
    console.log(newMontre.value.id_utilisateur_enregistrer)
    console.log(newMontre.value.id_utilisateur_commande)
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
    <p v-if="userToken">Utilisateur connecté! <button @click="logout">Se déconnecter</button></p>
    <p v-else>Veuillez vous connecter.</p>


    <template #footer> Nouveau Footer </template>
  </DefaultLayout>
</template>

<style></style>
