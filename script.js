// Scene setup with Three.js
let scene, camera, renderer;
let particles = [];
let soundEnabled = true;
let lightIntensity = 1;

function initScene() {
    const container = document.getElementById('canvas-container');
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);
    
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 0.1);
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x660099, 0.3);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xff0064, 1, 100);
    pointLight1.position.set(50, 50, 50);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x6600cc, 0.5, 100);
    pointLight2.position.set(-50, -50, 50);
    scene.add(pointLight2);
    
    // Create particles
    createParticles();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse tracking for custom cursor
    document.addEventListener('mousemove', onMouseMove);
    
    animate();
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    
    for (let i = 0; i < 100; i++) {
        positions.push(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200
        );
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xff0064,
        size: 0.5,
        sizeAttenuation: true
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    particles.push(points);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particles.forEach(particle => {
        particle.rotation.x += 0.0001;
        particle.rotation.y += 0.0002;
    });
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    const cursor = document.querySelector('.cursor-glow');
    cursor.style.left = event.clientX - 15 + 'px';
    cursor.style.top = event.clientY - 15 + 'px';
}

// Navigation
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Game interactions
function startGame() {
    alert('🎮 Game Starting...\n\nNavigiere durch das Herrenhaus und entdecke seine dunklen Geheimnisse!\n\nSound für bessere Atmosphäre aktivieren! 🔊');
    playAmbientSound();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = event.target;
    btn.style.opacity = soundEnabled ? '1' : '0.5';
    if (soundEnabled) {
        playAmbientSound();
    }
}

function toggleLight() {
    lightIntensity = lightIntensity === 1 ? 0.3 : 1;
    scene.children.forEach(child => {
        if (child.isLight) {
            child.intensity = child.intensity > 0.5 ? lightIntensity : lightIntensity * 0.5;
        }
    });
}

function triggerScream() {
    // Jump scare effect
    const jumpScare = document.getElementById('jump-scare');
    jumpScare.classList.remove('active');
    setTimeout(() => {
        jumpScare.classList.add('active');
    }, 10);
    
    playScream();
    
    // Screen shake
    const content = document.querySelector('.content');
    content.style.animation = 'none';
    setTimeout(() => {
        content.style.animation = 'screen-shake 0.5s';
    }, 10);
}

// Sound effects
function playAmbientSound() {
    if (!soundEnabled) return;
    
    // Create a simple beep using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 50;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
}

function playScream() {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // High pitched scary sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Screen shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes screen-shake {
        0% { transform: translate(0); }
        10% { transform: translate(-5px, -5px); }
        20% { transform: translate(5px, 5px); }
        30% { transform: translate(-5px, 5px); }
        40% { transform: translate(5px, -5px); }
        50% { transform: translate(-5px, -5px); }
        60% { transform: translate(5px, 5px); }
        70% { transform: translate(-5px, 5px); }
        80% { transform: translate(5px, -5px); }
        90% { transform: translate(-5px, -5px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(style);

// Initialize on page load
window.addEventListener('DOMContentLoaded', initScene);