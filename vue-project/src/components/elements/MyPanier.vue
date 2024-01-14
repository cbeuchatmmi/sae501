<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Threejs from './threejs.vue';

const montres = ref([]);

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Fonction pour obtenir les montres dans le panier
const getMontresPanier = async () => {
    try {
        const response = await client.get('/montres/panier');
        montres.value = response.data.montres;
        console.log("montre.value", montres.value);
    } catch (error) {
        console.error('Erreur lors de la récupération des montres dans le panier:', error.message);
    }
};

// Fonction pour mettre à jour la valeur du panier
const updatePanier = async (idMontre) => {
    try {
        await client.put(`/montres/${idMontre}/update-panier`, { panier: false });
        // Mettez à jour la liste des montres dans le panier après la modification
        await getMontresPanier();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du panier de la montre:', error.message);
    }
};

// Propriété calculée pour obtenir le total des prix des montres
const totalPrix = computed(() => {
    return montres.value.reduce((total, montre) => total + montre.montre_prix, 0);
});

// Appeler la fonction lors de la montée du composant
onMounted(() => {
    getMontresPanier();
});
</script>

<template>
    <div class="panier">
        <h1 class="panier__title">Montres dans le panier :</h1>

        <div class="panier__card" v-for="montre in montres" :key="montre.id_montre">
            <Threejs :fond="montre.boitier_fond" :boitier="montre.form_montre" :bracelet="montre.bracelet_texture" />
            <div>
                <p class="panier__card--text">{{ montre.montre_prix }}€</p>
                <button class="panier__card--button" @click="updatePanier(montre.id_montre)">Suppr</button>
            </div>
        </div>

        <!-- Afficher le total des prix -->
        <p class="panier__total">Total: {{ totalPrix }}€</p>
    </div>
</template>

<style lang="scss">
.panier {
    &__title {
        font-size: $h2;
        color: $secondary-color;
    }

    &__card {
        display: flex;

        &--text {
            font-size: $h2;
            color: $primary-color;
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

    &__total {
        font-size: $h2;
        color: $black;
    }
}
</style>
