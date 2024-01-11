<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ThreeJs from '../components/elements/ThreeJs.vue';

const montres = ref([]);
const bracelets = ref([]);
const boitiers = ref([]);


const newMontre = ref({
    form_montre: 'carre',
    id_utilisateur_commande: '',
    id_utilisateur_enregistrer: '',
    boitier_fond: 'black01',
    bracelet_texture: 'tissus-or',
    id_heure: '',
    id_minute: '',
    id_seconde: '',
});


// Client axios global
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});


const getMontres = async () => {
    try {
        const response = await client.get('/montres');
        montres.value = response.data.montres;
        console.log(montres.value)
    } catch (error) {
        console.error('Erreur lors de la récupération des montres :', error.message);
    }
};

const getBracelets = async () => {
    try {
        const response = await client.get('/bracelets');
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Erreur lors de la récupération des bracelets :', error.message);
    }
};
const getBoitiers = async () => {
    try {
        const response = await client.get('/boitiers');
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Erreur lors de la récupération des boitiers :', error.message);
    }
};

const addMontre = async () => {
    try {
        await client.post('/montres/add', newMontre.value);
        // Actualisez la liste des montres après l'ajout
        await getMontres();
        // Réinitialisez le formulaire
        newMontre.value = {
            form_montre: '',
            id_utilisateur_commande: '',
            id_utilisateur_enregistrer: '',
            boitier_fond: '',
            bracelet_texture: '',
            id_heure: '',
            id_minute: '',
            id_seconde: '',
        };


    } catch (error) {
        console.error('Erreur lors de l\'ajout de la montre :', error.message);
    }
};

onMounted(async () => {
    getMontres();
    boitiers.value = await getBoitiers();
    bracelets.value = await getBracelets()
});

</script>

<template>
    <DefaultLayout>
        <template #header>
            <nav>
                <ul>
                    <li><a href="/three">three</a></li>
                    <li><a href="/about">about</a></li>
                    <li><a href="/contact">contact</a></li>
                </ul>
            </nav>
        </template>


        <div>
            <h1>Liste des Montres</h1>
            <ul>
                <li v-for="montre in montres" :key="montre.id_montre">
                    {{ montre.id_montre }}
                    {{ montre.id_utilisateur_commande }}
                    {{ montre.id_utilisateur_enregistrer }}
                    {{ montre.id_bracelet }}
                    {{ montre.bracelet }}
                    {{ montre.id_boitier }}
                    {{ montre.boitier }}
                    {{ montre.materiaux }}
                    {{ montre.id_heure }}
                    {{ montre.id_minute }}
                    {{ montre.id_seconde }}
                </li>
            </ul>
        </div>

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

            <label for="id_heure">Id Heure:</label>
            <input v-model="newMontre.id_heure" type="text" required>

            <label for="id_minute">Id Minute:</label>
            <input v-model="newMontre.id_minute" type="text" required>

            <label for="id_seconde">Id Seconde:</label>
            <input v-model="newMontre.id_seconde" type="text" required>

            <label for="id_utilisateur_commande">Id Utilisateur Commande:</label>
            <input v-model="newMontre.id_utilisateur_commande" type="text" required>

            <label for="id_utilisateur_enregistrer">Id Utilisateur Enregistrer:</label>
            <input v-model="newMontre.id_utilisateur_enregistrer" type="text" required>

            <button type="submit">Ajouter</button>

        </form>




        <!-- <div>
            <h2>Ajouter une Montre</h2>
            <form @submit.prevent="addMontre">
                <label for="id_utilisateur_commande">Id Utilisateur Commande:</label>
                <input v-model="newMontre.id_utilisateur_commande" type="text" required>

                <label for="id_utilisateur_enregistrer">Id Utilisateur Enregistrer:</label>
                <input v-model="newMontre.id_utilisateur_enregistrer" type="text" required>

                <label for="id_bracelet">Id Bracelet:</label>
                <input v-model="newMontre.id_bracelet" type="text" required>

                <label for="id_boitier">Id Boitier:</label>
                <input v-model="newMontre.id_boitier" type="text" required>

                <label for="id_heure">Id Heure:</label>
                <input v-model="newMontre.id_heure" type="text" required>

                <label for="id_minute">Id Minute:</label>
                <input v-model="newMontre.id_minute" type="text" required>

                <label for="id_seconde">Id Seconde:</label>
                <input v-model="newMontre.id_seconde" type="text" required>


                <button type="submit">Ajouter</button>
            </form>
        </div> -->


        <div id="app" class="three">
            <ThreeJs :fond="newMontre.boitier_fond" :boitier="newMontre.form_montre"
                :bracelet="newMontre.bracelet_texture" />
        </div>



        <template #footer>
            <p>salut</p>
        </template>
    </DefaultLayout>
</template>
<style lang="scss">
/* Ajoutez du style si nécessaire */

.three {
    width: rem(20);
    height: rem(10);
}
</style>
  