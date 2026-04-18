/* ============================================
   THREE.JS 3D PHOTO CARD GALLERY
   Floating photo cards in 3D space
   Reacts to mouse + audio
   NO errors - Professional Grade
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
});

function initThreeJS() {
    const canvas = document.getElementById('canvas-3d');
    if (!canvas) return;

    // ===== SETUP =====
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x0A0A0A, 0.04);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ===== PHOTO URLS =====
    const unsplashIds = [
        // Original 12
        '1542038784456-1ea8e935640e', '1511895426328-dc8714191300', '1492691527719-9d1e07e534b4', '1519741497674-611481863552',
        '1537633552985-df8429e8048b', '1494790108377-be9c29b29330', '1529156069898-49953e39b3ac', '1516541196182-6bdb0516ed27',
        '1507003211169-0a1dd7228f2d', '1544005313-94ddf0286df2', '1524504388940-b1c1722653e1', '1506794778202-cad84cf45f1d',
        // New 33
        '1534528741775-53994a69daeb', '1500917293891-ef795e70e1f6', '1531746020798-e6953c6e8e04', '1488426862026-3ee34a7d66fc',
        '1517841905240-472988babdf9', '1509967419530-da38b4704bc6', '1534308143481-c55f00be8ab7', '1520813792240-56fc4a3765a7',
        '1526080652727-5b77f74eacd2', '1543132220-4bf5292c5e01', '1494354145959-25cb82edf23d', '1530268729831-4b0b9e170218',
        '1515150144380-bca9f1650ed9', '1521119989659-a83eee488004', '1514315384763-ba401779410f', '1500048993953-d23a436266cf',
        '1499996860815-9b62c4d68b31', '1485206412256-701452f99a39', '1531750026848-8df0c3451b72', '1508214751196-bcfd4ca60f91',
        '1496440737103-cd596325d314', '1514860475877-4c079ee5eef5', '1491349174775-aaaf10fcb416', '1501196354995-cbb51c65aaea',
        '1493106819501-66d381c466f1', '1485893086445-ed75865251be', '1512413913371-b718814c8109', '1522075469751-3a6694fb2f61',
        '1492562080023-e114092b376c', '1526510747440-1eb24602f3ea', '1515372039744-b8f04ce4e462', '1512331283953-19967202267a',
        '1504199367644-cb8853b03f0b'
    ];
    
    const photoUrls = unsplashIds.map(id => `https://images.unsplash.com/photo-${id}?w=256&h=256&fit=crop&q=60`);

    // ===== LOAD TEXTURES =====
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    const textures = [];
    let texturesLoaded = 0;

    // Create a simple gold placeholder while textures load
    const placeholderCanvas = document.createElement('canvas');
    placeholderCanvas.width = 64;
    placeholderCanvas.height = 64;
    const pCtx = placeholderCanvas.getContext('2d');
    const grad = pCtx.createLinearGradient(0, 0, 64, 64);
    grad.addColorStop(0, '#1C1917');
    grad.addColorStop(1, '#292524');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 64, 64);
    pCtx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    pCtx.lineWidth = 2;
    pCtx.strokeRect(2, 2, 60, 60);
    const placeholderTexture = new THREE.CanvasTexture(placeholderCanvas);

    // ===== CREATE PHOTO CARDS =====
    const cardGroup = new THREE.Group();
    const cardCount = photoUrls.length; // 45 unique photos
    const cards = [];
    const cardData = [];

    for (let i = 0; i < cardCount; i++) {
        // Card geometry (small rectangle)
        const w = 1.0 + Math.random() * 0.5;
        const h = w * (0.7 + Math.random() * 0.3);
        const cardGeom = new THREE.PlaneGeometry(w, h);

        // Initial material with placeholder
        const cardMat = new THREE.MeshBasicMaterial({
            map: placeholderTexture,
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const card = new THREE.Mesh(cardGeom, cardMat);

        // Position in 3D sphere/torus distribution
        const radius = 7 + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
        const z = radius * Math.cos(phi);

        card.position.set(x, y, z);

        // Random initial rotation
        card.rotation.x = Math.random() * Math.PI * 0.3;
        card.rotation.y = Math.random() * Math.PI * 0.3;
        card.rotation.z = (Math.random() - 0.5) * 0.4;

        cardGroup.add(card);
        cards.push(card);

        // Store animation data per card
        cardData.push({
            baseX: x,
            baseY: y,
            baseZ: z,
            floatSpeedX: 0.2 + Math.random() * 0.3,
            floatSpeedY: 0.3 + Math.random() * 0.4,
            floatSpeedZ: 0.15 + Math.random() * 0.25,
            floatAmplitude: 0.2 + Math.random() * 0.3,
            rotSpeed: 0.001 + Math.random() * 0.003,
            phaseOffset: Math.random() * Math.PI * 2,
            targetOpacity: 0.65 + Math.random() * 0.2,
        });
    }

    scene.add(cardGroup);

    // Load real photo textures
    photoUrls.forEach((url, idx) => {
        textureLoader.load(
            url,
            (texture) => {
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                textures.push(texture);
                texturesLoaded++;

                // Assign textures to cards (cycling through available textures)
                for (let j = idx; j < cardCount; j += photoUrls.length) {
                    if (cards[j]) {
                        cards[j].material.map = texture;
                        cards[j].material.needsUpdate = true;
                    }
                }
            },
            undefined,
            (err) => {
                // If a texture fails to load, keep placeholder
                console.warn('Texture load failed:', url);
                texturesLoaded++;
            }
        );
    });

    // ===== GOLD AMBIENT PARTICLES (subtle dust/fireflies) =====
    // Create a glowing particle texture
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const ctx = particleCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 223, 128, 0.8)');
    gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const dustCount = 3000;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
        dustPositions[i * 3] = (Math.random() - 0.5) * 40;
        dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        // Warm gold/champagne dust
        const warm = 0.6 + Math.random() * 0.4;
        dustColors[i * 3] = warm;
        dustColors[i * 3 + 1] = warm * 0.85;
        dustColors[i * 3 + 2] = warm * 0.4;
    }

    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeom.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
        size: 0.35, // Larger size for the glowing effect
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        map: particleTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const dustParticles = new THREE.Points(dustGeom, dustMat);
    scene.add(dustParticles);

    // ===== AUDIO REACTIVITY =====
    let audioContext;
    let analyser;
    let dataArray;
    let audioEnabled = false;
    let bassSmoothed = 0;

    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', async () => {
            if (audioEnabled) {
                if (audioContext) audioContext.suspend();
                audioEnabled = false;
                audioToggle.classList.remove('active');
            } else {
                try {
                    if (!audioContext) {
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        analyser = audioContext.createAnalyser();
                        analyser.fftSize = 256;
                        const bufferLength = analyser.frequencyBinCount;
                        dataArray = new Uint8Array(bufferLength);

                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        const source = audioContext.createMediaStreamSource(stream);
                        source.connect(analyser);
                    } else {
                        audioContext.resume();
                    }
                    audioEnabled = true;
                    audioToggle.classList.add('active');
                } catch (err) {
                    console.error('Microphone access error:', err);
                    alert("მიკროფონზე წვდომა აუცილებელია ხმის რეაგირებისთვის.");
                }
            }
        });
    }

    // ===== MOUSE INTERACTION =====
    const mouse = { x: 0, y: 0 };
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
        targetRotY = mouse.x * 0.4;
        targetRotX = mouse.y * 0.25;
    });

    // ===== ANIMATION LOOP =====
    let time = 0;
    let fadeInProgress = 0;

    function animate() {
        requestAnimationFrame(animate);

        // Fade in cards gradually
        if (fadeInProgress < 1) {
            fadeInProgress += 0.005;
        }

        // Audio analysis
        let bassImpact = 0;
        if (audioEnabled && analyser && dataArray) {
            analyser.getByteFrequencyData(dataArray);
            let bassSum = 0;
            for (let i = 0; i < 10; i++) bassSum += dataArray[i];
            const bassNormalized = (bassSum / 10) / 255;
            bassSmoothed += (bassNormalized - bassSmoothed) * 0.12;
            bassImpact = bassSmoothed;
        } else {
            bassSmoothed += (0 - bassSmoothed) * 0.05;
            bassImpact = bassSmoothed;
        }

        time += 0.004 + (bassImpact * 0.015);

        // Smooth rotation follow mouse
        currentRotX += (targetRotX - currentRotX) * 0.03;
        currentRotY += (targetRotY - currentRotY) * 0.03;

        cardGroup.rotation.x = currentRotX;
        cardGroup.rotation.y = currentRotY + time * 0.05;

        // Animate each card
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const data = cardData[i];
            const t = time + data.phaseOffset;

            // Gentle floating
            card.position.x = data.baseX + Math.sin(t * data.floatSpeedX) * data.floatAmplitude;
            card.position.y = data.baseY + Math.cos(t * data.floatSpeedY) * data.floatAmplitude;
            card.position.z = data.baseZ + Math.sin(t * data.floatSpeedZ) * data.floatAmplitude * 0.5;

            // Subtle rotation
            card.rotation.z += data.rotSpeed;

            // Audio impact: push cards outward and increase opacity
            if (bassImpact > 0.01) {
                const pushFactor = 1.0 + bassImpact * 0.35;
                card.position.x = data.baseX * pushFactor + Math.sin(t * data.floatSpeedX) * data.floatAmplitude;
                card.position.y = data.baseY * pushFactor + Math.cos(t * data.floatSpeedY) * data.floatAmplitude;
                card.position.z = data.baseZ * pushFactor + Math.sin(t * data.floatSpeedZ) * data.floatAmplitude * 0.5;
            }

            // Fade in opacity
            const targetOp = data.targetOpacity + (bassImpact * 0.2);
            card.material.opacity = Math.min(targetOp, 0.85) * Math.min(fadeInProgress, 1.0);
        }

        // Dust animation
        dustParticles.rotation.y = time * 0.02;
        dustParticles.rotation.x = Math.sin(time * 0.1) * 0.02;
        dustMat.opacity = 0.35 + bassImpact * 0.3;

        renderer.render(scene, camera);
    }

    animate();

    // ===== RESIZE =====
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ===== REDUCED MOTION =====
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleReducedMotion(e) {
        if (e.matches) {
            cards.forEach(card => { card.material.opacity = 0.2; });
            dustMat.opacity = 0.1;
        }
    }

    motionMediaQuery.addListener(handleReducedMotion);
    handleReducedMotion(motionMediaQuery);

    console.log('3D Photo Card Gallery Initialized');
}