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
                <!-- Ajoutez le bouton pour mettre à jour le panier -->
                <button @click="updatePanier(montre.id_montre)">Suppr</button>
            </li>
        </ul>
    </div>
</template>

<style lang="scss"></style>
