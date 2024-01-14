<script setup>
import AddMontre from '../components/elements/AddMontre.vue';
import MyIcon from '../components/elements/MyIcon.vue';


</script>



<template>
    <template>
        <nav>
            <div class="header">
                <div class="header__left">
                    <a href="/">
                        <MyIcon name="" />
                    </a>
                    <a href="/add" class="header__left--link">Création</a>
                </div>
                <div class="header__right">
                    <a href="/panier">
                        <MyIcon name="panier" />
                    </a>
                    <a href="/login">
                        <MyIcon name="profil" />
                    </a>
                </div>
            </div>
        </nav>
    </template>


    <AddMontre />


    <template>
        <p>salut</p>
    </template>
</template>
<style lang="scss">
/* Ajoutez du style si nécessaire */

.three {
    width: rem(20);
    height: rem(10);
}
</style>
  