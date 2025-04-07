<script setup>
defineProps({
    p: String,
    content: String,
})

const p1 = 'p1';
const p2 = 'p2';

</script>

<template>
    <div class="paragraph">
        <p v-if="p === p1" class="paragraph__p1">{{ content }}</p>
        <p v-if="p === p2" class="paragraph__p2">{{ content }}</p>
    </div>
</template>

<style lang="scss" scoped>
.paragraph {


    &__p1 {
        font-size: $mirror ;
    }

    &__p2 {
        font-size: $body;
    }


}
</style>



