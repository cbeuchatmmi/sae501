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
let sol = null;
let texture_sol = null;
let illuminateHands = false;  // Variable pour suivre l'état d'illumination des aiguilles
let illuminationTimeout = null;  // Variable pour suivre le délai d'illumination
const canvasRef = ref(null);




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
    camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 0.25;
    camera.position.x = 0.25; // Augmentez la valeur pour déplacer la caméra plus loin de l'objet
    camera.position.z = 0.25; // Augmentez la valeur pour déplacer la caméra plus loin de l'objet


    scene.background = new THREE.Color(0x0000ff);
    // const backgroundTexture = new THREE.TextureLoader().load('/images/background.jpg');
    // scene.background = backgroundTexture;

    // Ajout de la lumière ambiante
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Couleur, Intensité
    scene.add(ambientLight);

    // Ajout de la brume
    scene.fog = new THREE.Fog(0x222222, 1, 5); // Couleur, Proche, Loin


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
        // Appliquer l'auto-illumination si illuminateHands est vrai
        if (illuminateHands) {
            aiguille_heures.material.emissive.set(0xffffff);
        } else {
            // Réinitialiser la couleur si l'auto-illumination n'est pas activée
            aiguille_heures.material.emissive.set(0x000000);
        }
    }

    if (aiguille_minutes) {
        const minutesRotation = minutes * (Math.PI / 30); // 6 degrés par minute
        aiguille_minutes.rotation.z = -minutesRotation;
        // Appliquer l'auto-illumination si illuminateHands est vrai
        if (illuminateHands) {
            aiguille_minutes.material.emissive.set(0xffffff);
        } else {
            // Réinitialiser la couleur si l'auto-illumination n'est pas activée
            aiguille_minutes.material.emissive.set(0x000000);
        }
    }

    if (aiguille_secondes) {
        const secondsRotation = seconds * (Math.PI / 30); // 6 degrés par seconde
        aiguille_secondes.rotation.z = -secondsRotation;
        // Appliquer l'auto-illumination si illuminateHands est vrai
        if (illuminateHands) {
            aiguille_secondes.material.emissive.set(0xffffff);
        } else {
            // Réinitialiser la couleur si l'auto-illumination n'est pas activée
            aiguille_secondes.material.emissive.set(0x000000);
        }
    }
};


const animate = () => {
    const dt = clock.getDelta();
    animationId = requestAnimationFrame(animate);
    updateClockHands();
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
    texture_sol = textureLoader.load('/images/sol.jpg'); // Remplacez par votre chemin

    // Appliquer les textures aux objets
    boitier_carre.material[1].map = texture_boitier;
    bracelet.material.map = texture_bracelet;

    // Définir le matériau du sol
    const solMaterial = new THREE.MeshBasicMaterial({ map: texture_sol, side: THREE.DoubleSide });

    if (montre.boitier.value === 'carre') {
        boitier_carre.visible = true
        boitier_rond.visible = false
    } else if (montre.boitier.value === 'rond') {
        boitier_carre.visible = false
        boitier_rond.visible = true
    }

    const solGeometry = new THREE.CircleGeometry(2, 64);
    sol = new THREE.Mesh(solGeometry, solMaterial);
    sol.rotation.x = -Math.PI / 2;
    sol.position.y = -0.5;
    scene.add(sol);

    // Masquer les aiguilles qui ne sont pas en animation
    if (aiguille_heures) {
        aiguille_heures.visible = true;
        aiguille_heures.material.emissive.set(0x000000);
    }
    if (aiguille_minutes) {
        aiguille_minutes.visible = true;
        aiguille_minutes.material.emissive.set(0x000000);
    }
    if (aiguille_secondes) {
        aiguille_secondes.visible = true;
        aiguille_secondes.material.emissive.set(0x000000);
    }
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


const onClick = (event) => {
    // Vérifiez si le clic s'est produit sur l'élément canvas
    if (event.target === canvas.value) {
        console.log('canvas cliqué');

        // Activer l'illumination des aiguilles et définir le délai pour la désactiver après 10 secondes
        illuminateHands = true;
        clearTimeout(illuminationTimeout);
        illuminationTimeout = setTimeout(() => {
            illuminateHands = false;
        }, 10000);
    }
};

onMounted(() => {
    width = test.value.clientWidth;
    height = test.value.clientHeight;
    initScene();
    animate();

    // Attachez l'événement de clic à l'élément canvas
    canvas.value.addEventListener('click', onClick);

    document.addEventListener('click', onClick);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);

    // Détachez l'événement de clic lors de la destruction du composant
    canvas.value.removeEventListener('click', onClick);
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
  position: relative;
  width: 100%; 
  height: 100%; 
}

canvas {
  display: block;
  width: 100%; 
  height: 100%; 
}
</style>
