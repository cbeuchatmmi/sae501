
<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import ThreeJs from './threejs.vue';

const montres = ref([]);
const bracelets = ref([]);
const boitiers = ref([]);
const userId = ref(); // Utilisez userId directement

const newMontre = ref({
    form_montre: 'carre',
    boitier_fond: 'black01',
    bracelet_texture: 'tissus-or',
    panier: false,
    id_user: userId.value, // Assurez-vous que userId est correctement défini ici
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

const getBracelets = async () => {
    try {
        const response = await client.get('/bracelets');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des bracelets :', error.message);
    }
};

const getBoitiers = async () => {
    try {
        const response = await client.get('/boitiers');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des boitiers :', error.message);
    }
};

const addMontre = async () => {
    newMontre.value.id_user = userId.value;
    try {
        await client.post('/montres/add', newMontre.value);
        newMontre.value = {
            id_user: userId.value,
            form_montre: 'carre',
            boitier_fond: 'black02',
            bracelet_texture: 'tissus-or',
            panier: false,
        };
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la montre:', error.message);
    }
};

onMounted(async () => {
    userId.value = localStorage.getItem('userId');
    if (!userId.value) {
        console.error('Erreur: userId est null');
        return;
    }

    getMontres();
    boitiers.value = await getBoitiers();
    bracelets.value = await getBracelets();
});

watch(() => newMontre.value.panier, (newVal) => {
    newMontre.value.panier = newVal;
});

</script>

<template>
    <div class="add">

        <form class="form" @submit.prevent="addMontre">
            <h2 class="form__title">Créer une montre</h2>
            <div class="form__content">
                <label class="form__content--label">Texture du Bracelet</label>
                <select class="form__content--select" v-model="newMontre.bracelet_texture" required>
                    <option class="form__content--select--option" v-for="(bracelet, index) in bracelets" :key="index"
                        :value="bracelet.bracelet_texture" :label="bracelet.bracelet_texture" />
                </select>
            </div>
            <div class="form__content">
                <label class="form__content--label">Fond du boitier</label>
                <select class="form__content--select" v-model="newMontre.boitier_fond" required>
                    <option class="form__content--select--option" v-for="(boitier, index) in boitiers" :key="index"
                        :value="boitier.boitier_fond" :label="boitier.boitier_fond" />
                </select>
            </div>
            <div class="form__content">
                <label class="form__content--label">Forme du boitier</label>
                <select class="form__content--select" v-model="newMontre.form_montre" required>
                    <option class="form__content--select--option" value="carre" label="Carre"></option>
                    <option class="form__content--select--option" value="rond" label="Rond"></option>
                </select>
            </div>
            <div class="form__content">
                <label class="form__content--label">Ajouter au panier?
                    <input class="form__content--checkbox" type="checkbox" v-model="newMontre.panier">
                </label>
            </div>
            <button class="form__button" type="submit">Ajouter</button>
        </form>
        <div id="app" class="three">
            <ThreeJs :fond="newMontre.boitier_fond" :boitier="newMontre.form_montre"
                :bracelet="newMontre.bracelet_texture" />
        </div>
    </div>
</template>


<style lang="scss" scoped>
.add {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
}

.three {
  width: 100%; 
  height: 100%; 
}

.form {
    background-color: $light-black;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;

    &__title {
        font-size: $h2;
        color: $secondary-color;
    }

    &__content {

        &--label {
            color: $secondary-color;
        }

        &--select {
            width: rem(200);
            margin: rem(20);
            background-color: $white;
            border: none;
            border: rem(2) solid $secondary-color ;
            border-radius: rem(16);
            padding: rem(16);

            &--option {}
        }

        &__checkbox {
            align-items: left;
        }
    }


    &__button {
        background: none;
        border: none;
        border-radius: rem(16);
        background-color: $primary-color;
        padding: rem(20);
        font-size: $button;
        cursor: pointer;
    }
}
</style>