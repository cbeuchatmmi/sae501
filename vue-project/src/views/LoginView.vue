<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'

import AddUser from '../components/elements/AddUser.vue';

</script>

<template>
    <DefaultLayout>
        <template #header>
            <!-- Vous pouvez ajouter un en-tête si nécessaire -->
        </template>

        <AddUser />

        <template #footer>
            <!-- Vous pouvez ajouter un pied de page si nécessaire -->
        </template>
    </DefaultLayout>
</template>

<style lang="scss"></style>
