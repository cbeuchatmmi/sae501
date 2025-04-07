<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Threejs from '../elements/ThreeJs.vue';

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

        <div class="panier__list">
            <div class="panier__card" v-for="montre in montres" :key="montre.id_montre">
                <Threejs :fond="montre.boitier_fond" :boitier="montre.form_montre" :bracelet="montre.bracelet_texture" />
                <div class="panier__card--details">
                    <p class="panier__card--text">Prix : {{ montre.montre_prix }}€</p>
                    <button class="panier__card--button" @click="updatePanier(montre.id_montre)">Supprimer</button>
                </div>
            </div>
        </div>

        <div class="panier__footer">
            <p class="panier__total">Total : {{ totalPrix }}€</p>
        </div>
    </div>
</template>

<style lang="scss">
.panier {
    padding: rem(20);
    background-color: $light-black;
    border-radius: rem(16);
    box-shadow: 0 rem(4) rem(8) rgba(0, 0, 0, 0.2);
    max-width: 1200px;
    margin: rem(20) auto;

    &__title {
        font-size: $h1;
        color: $secondary-color;
        text-align: center;
        margin-bottom: rem(20);
    }

    &__list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: rem(32);
    }
    
    &__card {
        background-color: $black;
        border-radius: rem(16);
        box-shadow: 0 rem(4) rem(8) rgba(0, 0, 0, 0.1);
        padding: rem(16);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
            transform: scale(1.05);
            box-shadow: 0 rem(8) rem(16) rgba(0, 0, 0, 0.2);
        }

        &--details {
            margin-top: rem(16);
            text-align: center;

            &--text {
                font-size: $body;
                color: $primary-color;
                margin-bottom: rem(8);
            }

        }
        &--button {
            background-color: $secondary-color;
            color: $white;
            font-size: $button;
            border: none;
            border-radius: rem(16);
            padding: rem(8);
            margin-top: rem(16); 
            cursor: pointer;
            transition: background-color 0.3s ease;

            &:hover {
                background-color: darken($primary-color, 10%);
            }
        }
    }

    &__footer {
        margin-top: rem(20);
        text-align: center;

    }
    p {
        font-size: $button;
        color: $secondary-color;
        font-weight: bold;
    }
}
</style>
