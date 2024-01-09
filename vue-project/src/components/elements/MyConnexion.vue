<script setup>
import { ref } from 'vue';
import axios from 'axios';

const loginData = ref({
    user_email: '',
    user_password: '',
});

// Client axios global
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const login = async () => {
    try {
        const response = await client.post('/login', loginData.value);
        console.log('Connecté avec succès', response.data);
        // Ajoutez la logique pour gérer la connexion côté client (par exemple, redirection vers une autre page)
    } catch (error) {
        console.error('Erreur lors de la connexion :', error.message);
        // Ajoutez la logique pour gérer les erreurs de connexion côté client (par exemple, affichez un message d'erreur)
    }
};
</script>

<template>
    <form @submit.prevent="login">
        <label for="email">Email:</label>
        <input v-model="loginData.user_email" type="email" required>

        <label for="password">Mot de passe:</label>
        <input v-model="loginData.user_password" type="password" required>

        <button type="submit">Se connecter</button>
    </form>
</template>

<style>
/* Ajoutez du style si nécessaire */
</style>
