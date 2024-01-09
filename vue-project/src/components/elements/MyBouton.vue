<script setup>
import { defineProps, computed } from 'vue';

const { href, label } = defineProps(['href', 'label']);

const className = computed(() => ({

}));
</script>

<template>
    <a :href="href" :class="['button', className]">{{ label }}</a>
</template>

<style lang="scss" scoped>
.button {
    align-items: center;
    border: none;
    border-radius: rem(30);
    color: $white;
    background-color: $primary-color;
    display: inline-flex;
    font-size: $body;
    text-decoration: none;
    padding: rem(10);
}
</style>
