<script setup>
defineProps({
    h: String,
    content: String,
})

const h1 = 'h1';
const h2 = 'h2';

</script>

<template>
    <div class="title">
        <h1 v-if="h === h1" class="title__h1">{{ content }}</h1>
        <h2 v-if="h === h2" class="title__h2">{{ content }}</h2>
    </div>
</template>

<style lang="scss" scoped>
.title {



    &__h1 {
        font-size: $h1;
    }

    &__h2 {
        font-size: $h2;
    }



}
</style>



