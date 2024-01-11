<script setup>
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { ref, toRefs, onMounted, onBeforeUnmount, onUpdated } from 'vue';
import * as THREE from 'three';

const canvas = ref(null);
const test = ref(null);
let controls = null;
let clock = new THREE.Clock();
let scene = null;
let camera = null;
let renderer = null;
let animationId = null;
let boitier_carre = null;
let boitier_rond = null;
let bouton = null;
let aiguille_heures = null;
let aiguille_minutes = null;
let aiguille_secondes = null;
let pierre = null;
let bracelet = null;
let fermoir = null;
let texture_boitier = null;
let texture_bracelet = null;


const props = defineProps({
    boitier: String,
    fond: String,
    bracelet: String,
})

const montre = toRefs(props);


let height, width;
let currentBoitier = ''; // Variable pour suivre le boitier actuel

const initScene = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
    renderer.setSize(width, height);
    renderer.setClearColor(0x222222, 1);
    controls = new OrbitControls(camera, renderer.domElement);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 1, 0);

    scene.add(pointLight);
    clock.start();
    const loader = new ColladaLoader();
    loader.load('/models/montre.dae', onLoaded, onProgress, onError);
};


const updateClockHands = () => {
    const now = new Date();
    const hours = now.getHours() % 12; // Modulo 12 pour convertir les heures en format 12 heures
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Mettez à jour les rotations des aiguilles
    if (aiguille_heures) {
        const hoursRotation = (hours + minutes / 60) * (Math.PI / 6); // 30 degrés par heure, 0.5 degré par minute
        aiguille_heures.rotation.z = -hoursRotation;
    }

    if (aiguille_minutes) {
        const minutesRotation = minutes * (Math.PI / 30); // 6 degrés par minute
        aiguille_minutes.rotation.z = -minutesRotation;
    }

    if (aiguille_secondes) {
        const secondsRotation = seconds * (Math.PI / 30); // 6 degrés par seconde
        aiguille_secondes.rotation.z = -secondsRotation;
    }
};


const animate = () => {
    const dt = clock.getDelta();
    animationId = requestAnimationFrame(animate);
    updateClockHands(); // Call the function to update watch hands rotation
    renderer.render(scene, camera);
};

const onLoaded = (collada) => {
    const objects = collada.scene;
    scene.add(objects);
    const dt = clock.getElapsedTime();
    console.log("Loading completed after " + dt + " s.");

    boitier_carre = objects.getObjectByName('boitier_carre');
    boitier_rond = objects.getObjectByName('boitier_rond');
    bouton = objects.getObjectByName('bouton');
    aiguille_heures = objects.getObjectByName('aiguille_heures');
    aiguille_minutes = objects.getObjectByName('aiguille_minutes');
    aiguille_secondes = objects.getObjectByName('aiguille_secondes');
    pierre = objects.getObjectByName('pierre');
    bracelet = objects.getObjectByName('bracelet');
    fermoir = objects.getObjectByName('fermoir');

    // Charger les textures
    const textureLoader = new THREE.TextureLoader();
    texture_boitier = textureLoader.load(`/images/background_${montre.fond.value}.png`);
    texture_bracelet = textureLoader.load(`/images/texture-${montre.bracelet.value}.jpg`);

    // Appliquer les textures aux objets
    boitier_carre.material[1].map = texture_boitier;
    bracelet.material.map = texture_bracelet;

    // Initialiser la scène avec le boitier carré

};

const onProgress = (data) => {
    if (data.lengthComputable) {
        const percentComplete = (data.loaded / data.total) * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};

const onError = (data) => {
    console.error(data);
};

const onClick = () => {
    console.log('document cliqué');

    // Basculer entre le boitier rond et carré lors du clic
    if (montre.boitier.value === 'carre') {
        boitier_carre.visible = true
        boitier_rond.visible = false
    } else if (montre.boitier.value === 'rond') {
        boitier_carre.visible = false
        boitier_rond.visible = true
    }
};

onMounted(() => {
    width = test.value.clientWidth;
    height = test.value.clientHeight;
    initScene();
    animate();

    document.addEventListener('click', onClick);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    document.removeEventListener('click', onClick);
});


onUpdated(() => {
    initScene();
})
</script>

<template>
    <div ref="test" class="test">
        <canvas ref="canvas" />
    </div>
</template>

<style lang="scss" scoped>
.test {
    height: rem(1000);
    width: rem(1000);
}

/* Ajoutez du style si nécessaire */
</style>
