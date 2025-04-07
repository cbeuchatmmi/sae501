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
    <div class="connexion">
        <h2 class="connexion__title">Ajouter un Utilisateur</h2>
        <form class="connexion__form" @submit.prevent="addUtilisateur">
            <label class="connexion__form--label" for="user_email">Email:</label>
            <input class="connexion__form--input" v-model="newUtilisateur.user_email" type="email" required>

            <label class="connexion__form--label" for="user_password">Mot de passe:</label>
            <input class="connexion__form--input" v-model="newUtilisateur.user_password" type="password" required>

            <button class="connexion__form--button" type="submit">Ajouter</button>
        </form>
    </div>
</template>

<div class="connexion">
   
</div>

<style lang="scss" scoped>
.connexion {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    background-color: $light-black;


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
