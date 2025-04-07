<script setup>
import MyIcon from '../components/elements/MyIcon.vue';

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ThreeJs from '../components/elements/ThreeJs.vue';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const montreId = ref(route.params.id);
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const montre = ref([]);
const userId = localStorage.getItem('userId');
const updatedMontre = ref({
    form_montre: '',
    boitier_fond: '',
    bracelet_texture: '',
    panier: false,
});
const boitiers = ref([]);
const bracelets = ref([]);

const getMontreDetails = async () => {
    try {
        const response = await client.get(`/montres/id/${montreId.value}`);
        montre.value = response.data;
        console.log("montre", montre.value);
        // Définir les valeurs initiales de updatedMontre
        updatedMontre.value = {
            form_montre: montre.value.form_montre,
            boitier_fond: montre.value.boitier_fond,
            bracelet_texture: montre.value.bracelet_texture,
            panier: false,
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la montre :', error.message);
    }
};

const deleteMontre = async () => {
    try {
        if (montre.value.id_user == userId) {
            await client.delete(`/montres/${montreId.value}/delete`);
            router.push('/');
        } else {
            console.error('Vous n\'êtes pas autorisé à supprimer cette montre.');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la montre :', error.message);
    }
};

const updateMontre = async () => {
    try {
        if (montre.value.id_user == userId) {
            await client.put(`/montres/${montreId.value}/update`, updatedMontre.value);
            montre.value = await getMontreDetails();
            console.log("montre.value", montre.value)
        } else {
            console.error('Vous n\'êtes pas autorisé à supprimer cette montre.');
        }

    } catch (error) {
        console.error('Erreur lors de la mise à jour de la montre :', error.message);
    }
};

const getBraceletsAndBoitiers = async () => {
    try {
        const [braceletsResponse, boitiersResponse] = await Promise.all([
            client.get('/bracelets'),
            client.get('/boitiers'),
        ]);

        bracelets.value = braceletsResponse.data;
        console.log("braceletsResponse", bracelets.value)
        boitiers.value = boitiersResponse.data;
        console.log("boitiersResponse", boitiers.value)
    } catch (error) {
        console.error('Erreur lors de la récupération des bracelets et boitiers :', error.message);
    }
};

onMounted(() => {
    getMontreDetails();
    getBraceletsAndBoitiers();
});
</script>

<template>
    <div class="grid">
        <div class="montre">
            <div class="montre__info">
                <h1 class="montre__title">Détails de la Montre</h1>
                <p class="montre__info--content">Forme du boitier</p>
                {{ montre.form_montre }}
                <p class="montre__info--content">Fond du boitier</p>
                {{ montre.boitier_fond }}
                <p class="montre__info--content">Texture du bracelet</p>
                {{ montre.bracelet_texture }}
                <p class="montre__info--content">Prix de la montre</p>
                {{ montre.montre_prix }}€
            </div>
            <button class="montre__button" @click="deleteMontre">Supprimer la Montre</button>
            <form class="form" @submit.prevent="updateMontre">
                <h2 class="form__title">Modifier une montre</h2>
                <div class="form__content">
                    <label class="form__content--label" for="form_montre">Forme de la Montre:</label>
                    <select class="form__content--select" v-model="updatedMontre.form_montre" required>
                        <option class="form__content--select--option" value="carre">Carré</option>
                        <option class="form__content--select--option" value="rond">Rond</option>
                    </select>
                </div>
                <div class="form__content">
                    <label class="form__content--label" for="boitier_fond">Boîtier de Fond:</label>
                    <select class="form__content--select" v-model="updatedMontre.boitier_fond" required>
                        <option class="form__content--select--option" v-for="boitier in boitiers" :value="boitier.boitier_fond" :key="boitier.id_boitier">
                            {{ boitier.boitier_fond }}
                        </option>
                    </select>
                </div>
                <div class="form__content">
                    <label class="form__content--label" for="bracelet_texture">Texture du Bracelet:</label>
                    <select class="form__content--select" v-model="updatedMontre.bracelet_texture" required>
                        <option class="form__content--select--option" v-for="bracelet in bracelets" :value="bracelet.bracelet_texture" :key="bracelet.id_bracelet">
                            {{ bracelet.bracelet_texture }}
                        </option>
                    </select>
                </div>
                <div class="form__content">
                    <label class="form__content--label" for="panier">Ajouter au Panier:</label>
                    <input class="form__content--checkbox" type="checkbox" v-model="updatedMontre.panier" />
                </div>
                <button class="form__button" type="submit">Modifier</button>
            </form>
        </div>
        <div class="three">
            <ThreeJs :fond="updatedMontre.boitier_fond" :boitier="updatedMontre.form_montre"
            :bracelet="updatedMontre.bracelet_texture" />
        </div>
    </div>
</template>

<style lang="scss">
.three {
  width: 100%; 
  height: 100%; 
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr; 
  justify-items: center;
  align-items: center;
  height: 100vh; 
}
.montre {
    
    &__title {
        font-size: $h2;
        color: $secondary-color;
        text-align: center;
        margin-bottom: rem(16);
    }
    &__info {
        background-color: $light-black;
        padding: rem(24);
        border-radius: rem(16);
        box-shadow: 0 rem(4) rem(8) rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: rem(500); 
        margin: rem(20) auto; 
        color: $secondary-color;
        display: flex;
        flex-direction: column;
        gap: rem(12);

        &--content {
            font-size: $body;
            font-weight: bold;
            color: $white;
            margin-bottom: rem(8);
        }

     
        span {
            font-size: $body;
            font-weight: normal;
            color: $secondary-color;
            margin-bottom: rem(16);
        }
    }

    &__button {
        background: none;
        border: none;
        border-radius: rem(16);
        background-color: $primary-color;
        padding: rem(12);
        font-size: $button;
        font-weight: bold;
        color: $white;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: darken($primary-color, 10%);
        }
    }
}
.form {
    background-color: $light-black;
    padding: rem(32);
    border-radius: rem(16); 
    box-shadow: 0 rem(4) rem(8) rgba(0, 0, 0, 0.2); 
    width: 100%;
    max-width: rem(500); 
    margin: rem(20) auto; 

    display: flex;
    flex-direction: column;
    gap: rem(16);

    &__title {
        font-size: $h2;
        color: $secondary-color;
        text-align: center;
        margin-bottom: rem(16);
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: rem(8);

        &--label {
            color: $white;
            font-size: $body;
            font-weight: bold;
        }

        &--select {
            width: 100%;
            background-color: $white;
            border: rem(2) solid $secondary-color;
            border-radius: rem(8);
            padding: rem(12);
            font-size: $body;
            color: $light-black;

            &:focus {
                outline: none;
                border-color: darken($secondary-color, 10%);
            }
        }

        &--checkbox {
            align-self: flex-start;
            margin-top: rem(8);
        }
    }

    &__button {
        background-color: $primary-color;
        color: $white;
        border: none;
        border-radius: rem(8);
        padding: rem(12);
        font-size: $button;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: darken($primary-color, 10%);
        }
    }
}
</style>