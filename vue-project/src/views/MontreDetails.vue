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
    <DefaultLayout>
        <h1>Détails de la Montre</h1>
        {{ montre.form_montre }} - {{ montre.boitier_fond }} - {{ montre.bracelet_texture }} - {{ montre.montre_prix }}€
        <ThreeJs :fond="updatedMontre.boitier_fond" :boitier="updatedMontre.form_montre"
            :bracelet="updatedMontre.bracelet_texture" />
        <button @click="deleteMontre">Supprimer la Montre</button>


        <div>
            <h1>Modifier la Montre</h1>
            <form @submit.prevent="updateMontre">
                <label for="form_montre">Forme de la Montre:</label>
                <select v-model="updatedMontre.form_montre" required>
                    <option value="carre">Carre</option>
                    <option value="rond">Rond</option>
                </select>

                <label for="boitier_fond">Boîtier de Fond:</label>
                <select v-model="updatedMontre.boitier_fond" required>
                    <!-- Options dynamiques à partir des données récupérées précédemment -->
                    <option v-for="boitier in boitiers" :value="boitier.boitier_fond" :key="boitier.id_boitier">
                        {{ boitier.boitier_fond }}
                    </option>
                </select>

                <label for="bracelet_texture">Texture du Bracelet:</label>
                <select v-model="updatedMontre.bracelet_texture" required>
                    <!-- Options dynamiques à partir des données récupérées précédemment -->
                    <option v-for="bracelet in bracelets" :value="bracelet.bracelet_texture" :key="bracelet.id_bracelet">
                        {{ bracelet.bracelet_texture }}
                    </option>
                </select>

                <label for="panier">Ajouter au Panier:</label>
                <input type="checkbox" v-model="updatedMontre.panier" />

                <button type="submit">Modifier</button>
            </form>
        </div>
        <template #footer> Nouveau Footer </template>
    </DefaultLayout>
</template>