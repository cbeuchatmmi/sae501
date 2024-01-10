<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Stocke les informations de connexion
const loginData = ref({
    user_email: '',
    user_password: '',
});

// Stocke le token de l'utilisateur
const userToken = ref(localStorage.getItem('userToken') || null);

// Client axios global
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Fonction de connexion
const login = async () => {
    try {
        const response = await client.post('/login', loginData.value);

        // Stocke le token et met à jour le localStorage
        userToken.value = response.data.token;
        localStorage.setItem('userToken', userToken.value);

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
    console.log('Déconnecté avec succès');
};

// Exécute la déconnexion lors du chargement initial (si besoin)
onMounted(() => {
    // Exemple : si vous avez un bouton "Déconnexion" au démarrage, il s'exécutera
    // Vous pouvez personnaliser cela en fonction de votre application.
    // logout();

    // Ajoute un message si l'utilisateur est connecté au chargement
    if (userToken.value) {
        console.log('Tu es connecté!');
    }
});
</script>

<template>
    <div>
        <!-- Affiche le formulaire de connexion si l'utilisateur n'est pas connecté -->
        <template v-if="!userToken">
            <form @submit.prevent="login">
                <label for="email">Email:</label>
                <input v-model="loginData.user_email" type="email" required>

                <label for="password">Mot de passe:</label>
                <input v-model="loginData.user_password" type="password" required>

                <button type="submit">Se connecter</button>
            </form>
        </template>

        <!-- Affiche le message de bienvenue si l'utilisateur est connecté -->
        <template v-else>
            <div>
                <p>Bienvenue, utilisateur!</p>
                <button @click="logout">Déconnexion</button>
            </div>
        </template>
    </div>
</template>
