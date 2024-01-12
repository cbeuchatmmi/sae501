<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import ThreeJs from './ThreeJs.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const montres = ref([]);

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

onMounted(getMontres);

</script>

<template>
    <DefaultLayout>
        <h1>Liste des Montres</h1>
        <div class="three">
            <router-link :to="{ name: 'montre-detail', params: { id: montre.id_montre } }" v-for="montre in montres"
                :key="montre.id_montre">
                <div>
                    {{ montre.form_montre }} - {{ montre.boitier_fond }} - {{ montre.bracelet_texture }} - {{
                        montre.montre_prix }}€
                    <ThreeJs :fond="montre.boitier_fond" :boitier="montre.form_montre"
                        :bracelet="montre.bracelet_texture" />
                </div>
            </router-link>
        </div>
        <template #footer> Nouveau Footer </template>
    </DefaultLayout>
</template>
  
<style scoped>
.three {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    list-style: none;
    padding: 0;
}</style>