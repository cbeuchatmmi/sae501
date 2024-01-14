<script setup>
import ThreeJs from './threeJs.vue';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const montres = ref([]);
const priceFilter = ref('');
const braceletTextureFilter = ref('');
const boitierFondFilter = ref('');
const formMontreFilter = ref('');
const limit = ref(10); // Nombre initial de montres à afficher
const userId = ref(); // Utilisez userId directement


const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
const getMontres = async () => {
    try {
        if (userId.value) {
            const response = await client.get(`/montres?userId=${userId.value}`);
            montres.value = response.data.montres;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des montres :', error.message);
    }
};
onMounted(async () => {
    userId.value = localStorage.getItem('userId');
    if (!userId.value) {
        console.error('Erreur: userId est null');
        return;
    }

    getMontres();
}
);

// Extract unique values for each filter
const uniquePrices = computed(() => Array.from(new Set(montres.value.map(m => m.montre_prix))));
const uniqueBraceletTextures = computed(() => Array.from(new Set(montres.value.map(m => m.bracelet_texture))));
const uniqueBoitierFonds = computed(() => Array.from(new Set(montres.value.map(m => m.boitier_fond))));

// Apply filters and limit to the montres list
const filteredMontres = computed(() => {
    return montres.value
        .filter(montre => {
            const priceMatches = !priceFilter.value || montre.montre_prix === parseFloat(priceFilter.value);
            const braceletTextureMatches = !braceletTextureFilter.value || montre.bracelet_texture === braceletTextureFilter.value;
            const boitierFondMatches = !boitierFondFilter.value || montre.boitier_fond === boitierFondFilter.value;
            const formMontreMatches = !formMontreFilter.value || montre.form_montre === formMontreFilter.value;

            return priceMatches && braceletTextureMatches && boitierFondMatches && formMontreMatches;
        })
        .slice(0, limit.value); // Appliquer la limite ici
});

// Function to apply filters when any filter changes
const applyFilters = () => {
    // Vous pouvez ajouter une logique supplémentaire ici si nécessaire
};

// Fonction pour augmenter la limite d'affichage
const showAllMontres = () => {
    limit.value = montres.value.length;
};

// Fonction pour mettre à jour la valeur du panier
const updatePanierValue = async (idMontre, newValue) => {
    try {
        // Vérifier si l'utilisateur est connecté
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('Vous devez être connecté pour mettre à jour le panier.');
            return;
        }

        await client.put(`/montres/${idMontre}/update-panier`, { panier: newValue });
        // Mettez à jour la liste des montres après la modification
        await getMontres();
    } catch (error) {
        console.error('Erreur lors de la mise à jour du panier de la montre:', error.message);
    }
};
</script>

<template>
    <h1 class="title">Liste des Montres</h1>

    <!-- Filter Controls -->
    <div class="filters">
        <div>
            <label class="filters__label" for="priceFilter">Filtrer par prix:</label>
            <select class="filters__select" v-model="priceFilter" @change="applyFilters">
                <option class="filters__select--value">Tous</option>
                <option class="filters__select--value" v-for="price in uniquePrices" :key="price" :value="price">{{ price
                }}€
                </option>
            </select>
        </div>
        <div>
            <label class="filters__label" for="braceletTextureFilter">Filtrer par texture de bracelet:</label>
            <select class="filters__select" v-model="braceletTextureFilter" @change="applyFilters">
                <option class="filters__select--value" value="">Tous</option>
                <option class="filters__select--value" v-for="texture in uniqueBraceletTextures" :key="texture"
                    :value="texture">{{ texture }}</option>
            </select>
        </div>
        <div>
            <label class="filters__label" for="boitierFondFilter">Filtrer par fond de boitier:</label>
            <select class="filters__select" v-model="boitierFondFilter" @change="applyFilters">
                <option class="filters__select--value" value="">Tous</option>
                <option class="filters__select--value" v-for="fond in uniqueBoitierFonds" :key="fond" :value="fond">{{ fond
                }}</option>
            </select>
        </div>
        <div>
            <label class="filters__label" for="formMontreFilter">Filtrer par forme de montre:</label>
            <select class="filters__select" v-model="formMontreFilter" @change="applyFilters">
                <option class="filters__select--value" value="">Tous</option>
                <option class="filters__select--value" value="carre">Carre</option>
                <option class="filters__select--value" value="rond">Rond</option>
            </select>
        </div>
    </div>

    <!-- Montre List -->
    <div class="three">
        <div v-for="montre in filteredMontres" :key="montre.id_montre" class="three__card">
            <router-link :to="{ name: 'montre-detail', params: { id: montre.id_montre } }">

                <ThreeJs :fond="montre.boitier_fond" :boitier="montre.form_montre" :bracelet="montre.bracelet_texture" />

            </router-link>

            <!-- Ajouter un bouton pour mettre à jour la valeur du panier -->
            <button @click="updatePanierValue(montre.id_montre, !montre.panier)" class="three__card--button">
                {{ montre.panier ? 'delete' : 'add' }}
            </button>
        </div>
    </div>

    <!-- Bouton pour afficher toutes les montres -->
    <button @click="showAllMontres" class="show-all-button">
        Afficher toutes les montres
    </button>
</template>
<style lang="scss" scoped>
.title {
    font-size: $h1;
    color: $secondary-color;
}

.filters {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    &__label {
        color: $primary-color;
        font-size: $button;
    }

    &__select {
        background: none;
        border: none;
        border-color: rem(2) solid $primary-color;
        background-color: $white;
        color: $light-black;
        font-size: $body;

        &--value {
            background-color: $white;
            color: $black;
            font-size: $body;
        }
    }
}


.three {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    background-color: $light-black;
    width: 100%;
    height: 100%;

    &__card {
        margin: rem(64);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;

        &--button {
            background: none;
            background-color: $primary-color;
            color: $white;
            font-size: $button;
            border: none;
            border-radius: rem(16);
            padding: rem(6);
            margin-top: rem(16);
            cursor: pointer;
        }
    }
}

.show-all-button {
    margin: rem(20);
    background-color: $primary-color;
    color: $white;
    font-size: $button;
    border: none;
    border-radius: rem(16);
    padding: rem(10);
    cursor: pointer;
}
</style>
