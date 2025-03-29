<script setup>
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
    <div class="connexion">
        <h2 class="connexion__title">Connexion</h2>
        <form class="connexion__form" @submit.prevent="login">
            <label class="connexion__form--label" for="user_email">Email:</label>
            <input class="connexion__form--input" v-model="loginData.user_email" type="email" required>

            <label class="connexion__form--label" for="user_password">Mot de passe:</label>
            <input class="connexion__form--input" v-model="loginData.user_password" type="password" required>

            <p class="connexion__form--content" v-if="userId">Utilisateur connecté!
                <button class="connexion__form--button" @click="logout">Se déconnecter</button>
            </p>
            <p class="connexion__form--content" v-else>Veuillez vous connecter.
                <button class="connexion__form--button" type="submit">Se connecter</button>
            </p>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.connexion {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;


    &__title {
        font-size: $h2;
        color: $secondary-color;
    }

    &__form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
        color: $secondary-color;


        &--label {
            margin-top: rem(16);
        }

        &--input {
            padding: rem(16);
            width: rem(256);
            border: none;

            border-radius: rem(16);
        }
    }

    &__form {


        &--content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-items: center;
            margin-top: rem(16);
            margin-bottom: rem(16);
        }

        &--button {
            background: none;
            border: none;
            border-radius: rem(16);
            background-color: $primary-color;
            padding: rem(20);
            font-size: $button;
            cursor: pointer;
        }
    }
}
</style>
