<script setup>
import ThreeJs from "../components/elements/ThreeJs.vue"
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'

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


        <div id="app" class="three">
            <ThreeJs />
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
  