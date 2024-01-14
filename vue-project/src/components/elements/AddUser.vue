<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const newUtilisateur = ref({
    user_email: '',
    user_password: '',
});

// Client axios global
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const addUtilisateur = async () => {
    try {
        await client.post('/user/add', newUtilisateur.value);
        // Réinitialisez le formulaire
        newUtilisateur.value = {
            user_email: '',
            user_password: '',
        };
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error.message);
    }
};

onMounted(() => {
    // Vous pouvez ajouter des actions à effectuer après le montage du composant si nécessaire.
});
</script>

<template>
    <div>
        <h2>Ajouter un Utilisateur</h2>
        <form @submit.prevent="addUtilisateur">
            <label for="user_email">Email:</label>
            <input v-model="newUtilisateur.user_email" type="email" required>

            <label for="user_password">Mot de passe:</label>
            <input v-model="newUtilisateur.user_password" type="password" required>

            <button type="submit">Ajouter</button>
        </form>
    </div>
</template>

<style lang="scss"></style>
