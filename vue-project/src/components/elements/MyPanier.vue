<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const montres = ref([]);

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
// Fonction pour obtenir les montres dans le panier
const getMontresPanier = async () => {
    try {
        const response = await client.get('/montres/panier');
        // Essayer de parser la réponse JSON
        montres.value = response.data.montres;
        console.log("montre.value", montres.value);


    } catch (error) {
        console.error('Erreur lors de la récupération des montres dans le panier:', error.message);
    }
};

// Appeler la fonction lors de la montée du composant
onMounted(() => {
    getMontresPanier();
});
</script>

<template>
    <div>
        <h1>Montres dans le panier :</h1>
        <ul>
            <li v-for="montre in montres" :key="montre.id_montre">
                {{ montre.montre_prix }}€
            </li>
        </ul>
    </div>
</template>

<style lang="scss"></style>
