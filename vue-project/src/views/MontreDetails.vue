<template>
    <DefaultLayout>
        <h1>Détails de la Montre</h1>
        <div v-if="montre">
            {{ montre.form_montre }} - {{ montre.boitier_fond }} - {{ montre.bracelet_texture }} - {{ montre.montre_prix }}€
            <ThreeJs :fond="montre.boitier_fond" :boitier="montre.form_montre" :bracelet="montre.bracelet_texture" />
            <button @click="deleteMontre">Supprimer la Montre</button>
        </div>
        <div v-else>
            Chargement des détails de la montre...
        </div>
        <template #footer> Nouveau Footer </template>
    </DefaultLayout>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
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

const getMontreDetails = async () => {
    try {
        const response = await client.get(`/montres/id/${montreId.value}`);
        montre.value = response.data;
        console.log("montre", montre.value)
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

onMounted(() => {
    getMontreDetails();
});
</script>
  