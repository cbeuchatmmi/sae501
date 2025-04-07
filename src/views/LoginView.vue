<script setup>
import { ref } from 'vue';
import AddUser from '../components/elements/AddUser.vue';
import MyConnexion from '../components/elements/MyConnexion.vue';

const showAddUser = ref(false);
const showMyConnexion = ref(true);

const toggleAddUser = () => {
    showAddUser.value = !showAddUser.value;
    showMyConnexion.value = !showAddUser.value;
};
</script>

<template>
    <div class="login">
        <MyConnexion v-if="showMyConnexion" />

        <button class="login__button" v-if="showMyConnexion" @click="toggleAddUser">
            Créer un compte
        </button>

        <AddUser v-if="showAddUser" />
        <button class="login__button" v-if="showAddUser" @click="toggleAddUser">
            Se connecter
        </button>
    </div>
</template>

<style lang="scss">
.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;

    &__button {
        border: none;
        background: none;
        color: $primary-color;
        font-size: $body;
        cursor: pointer;
    }
}
</style>
