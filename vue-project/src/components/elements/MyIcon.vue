<script setup>
import { computed } from 'vue'
import MyLogo from '../icons/MyLogo.vue';
import MyPanier from '../icons/MyPanier.vue';
import MyProfil from '../icons/MyProfil.vue';

const props = defineProps({
    name: String,
    color: String,

})

const getIcon = computed(() => {
    switch (props.name) {
        case 'panier':
            return MyPanier
        case 'profil':
            return MyProfil
        default:
            return MyLogo

    }

})

const className = computed(() => ({

    ' -none': props.color === 'none',
    ' -primary': props.color === 'primary',
    ' -secondary': props.color === 'secondary',
}))

</script>

<template>
    <i class="icon" :class="className">
        <component :is="getIcon" />
    </i>
</template>
<style lang='scss' scoped>
.icon {
    align-items: center;

    color: $secondary-color;
    display: inline-flex;
    justify-content: center;

    &.-white {
        color: $white;
    }

    &.-primary {
        color: $primary-color
    }

    &.-secondary {
        color: $secondary-color;
    }

}
</style>