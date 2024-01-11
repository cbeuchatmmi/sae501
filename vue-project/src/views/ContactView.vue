<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
import ConnexionForm from '@/components/elements/MyConnexion.vue'
import { ref, onMounted } from 'vue';
import axios from 'axios';

const utilisateurs = ref([]);
const newUtilisateur = ref({
    user_email: '',
    user_password: '',
});

// Client axios global
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const getUtilisateurs = async () => {
    try {
        const response = await client.get('/utilisateurs');
        utilisateurs.value = response.data.utilisateurs;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error.message);
    }
};

const addUtilisateur = async () => {
    try {
        await client.post('/user/add', newUtilisateur.value);
        // Actualisez la liste des utilisateurs après l'ajout
        await getUtilisateurs();
        // Réinitialisez le formulaire
        newUtilisateur.value = {
            user_email: '',
            user_password: '',
        };
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error.message);
    }
};

onMounted(getUtilisateurs);
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
            <h1>Liste des Utilisateurs</h1>
            <ul>
                <li v-for="utilisateur in utilisateurs" :key="utilisateur.id_user">
                    {{ utilisateur.id_user }} - {{ utilisateur.user_email }}
                </li>
            </ul>
        </div>

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

        <!-- Include the ConnexionForm component -->
        <ConnexionForm @login="login" />

        <template #footer>
        </template>
    </DefaultLayout>
</template>
<style lang="scss"></style>
