<template>
    <DefaultLayout>
        <h1>Liste des Montres</h1>

        <!-- Filter Controls -->
        <div class="filters">
            <label for="priceFilter">Filtrer par prix:</label>
            <select v-model="priceFilter" @change="applyFilters">
                <option value="">Tous</option>
                <option v-for="price in uniquePrices" :key="price" :value="price">{{ price }}€</option>
            </select>

            <label for="braceletTextureFilter">Filtrer par texture de bracelet:</label>
            <select v-model="braceletTextureFilter" @change="applyFilters">
                <option value="">Tous</option>
                <option v-for="texture in uniqueBraceletTextures" :key="texture" :value="texture">{{ texture }}</option>
            </select>

            <label for="boitierFondFilter">Filtrer par fond de boitier:</label>
            <select v-model="boitierFondFilter" @change="applyFilters">
                <option value="">Tous</option>
                <option v-for="fond in uniqueBoitierFonds" :key="fond" :value="fond">{{ fond }}</option>
            </select>

            <label for="formMontreFilter">Filtrer par forme de montre:</label>
            <select v-model="formMontreFilter" @change="applyFilters">
                <option value="">Tous</option>
                <option value="carre">Carre</option>
                <option value="rond">Rond</option>
            </select>
        </div>

        <!-- Montre List -->
        <div class="three">
            <router-link :to="{ name: 'montre-detail', params: { id: montre.id_montre } }" v-for="montre in filteredMontres"
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
  
<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import ThreeJs from './ThreeJs.vue';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const montres = ref([]);
const priceFilter = ref('');
const braceletTextureFilter = ref('');
const boitierFondFilter = ref('');
const formMontreFilter = ref('');

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

// Extract unique values for each filter
const uniquePrices = computed(() => Array.from(new Set(montres.value.map(m => m.montre_prix))));
const uniqueBraceletTextures = computed(() => Array.from(new Set(montres.value.map(m => m.bracelet_texture))));
const uniqueBoitierFonds = computed(() => Array.from(new Set(montres.value.map(m => m.boitier_fond))));

// Apply filters to the montres list
const filteredMontres = computed(() => {
    return montres.value.filter(montre => {
        const priceMatches = !priceFilter.value || montre.montre_prix === parseFloat(priceFilter.value);
        const braceletTextureMatches = !braceletTextureFilter.value || montre.bracelet_texture === braceletTextureFilter.value;
        const boitierFondMatches = !boitierFondFilter.value || montre.boitier_fond === boitierFondFilter.value;
        const formMontreMatches = !formMontreFilter.value || montre.form_montre === formMontreFilter.value;

        return priceMatches && braceletTextureMatches && boitierFondMatches && formMontreMatches;
    });
});

// Function to apply filters when any filter changes
const applyFilters = () => {
    // You can add additional logic here if needed
};
</script>
  
<style scoped>
.three {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    list-style: none;
    padding: 0;
}

.filters {
    margin-bottom: 20px;
}

.filters label {
    margin-right: 10px;
}
</style>
  