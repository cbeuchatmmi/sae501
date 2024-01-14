<script setup>
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import AddMontre from '../components/elements/AddMontre.vue';


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


        <AddMontre />


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
  