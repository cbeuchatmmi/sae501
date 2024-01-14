<script setup>
import MyIcon from '../components/elements/MyIcon.vue';
import AddUser from '../components/elements/AddUser.vue';

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

    <AddUser />

    <template>
    </template>
</template>

<style lang="scss"></style>
