
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
    <form @submit.prevent="addMontre">
        <select v-model="newMontre.bracelet_texture" required>
            <option v-for="(bracelet, index) in bracelets" :key="index" :value="bracelet.bracelet_texture"
                :label="bracelet.bracelet_texture" />
        </select>
        <select v-model="newMontre.boitier_fond" required>
            <option v-for="(boitier, index) in boitiers" :key="index" :value="boitier.boitier_fond"
                :label="boitier.boitier_fond" />
        </select>
        <select v-model="newMontre.form_montre" required>
            <option value="carre" label="Carre"></option>
            <option value="rond" label="Rond"></option>
        </select>
        <input type="checkbox" v-model="newMontre.panier">
        <button type="submit">Ajouter</button>
        <div id="app" class="three">
            <ThreeJs :fond="newMontre.boitier_fond" :boitier="newMontre.form_montre"
                :bracelet="newMontre.bracelet_texture" />
        </div>
    </form>
</template>


<style lang="scss">
/* Ajoutez du style si nécessaire */

.three {
    width: rem(20);
    height: rem(10);
}
</style>