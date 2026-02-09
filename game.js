/*  Prensesimi Kurtarmalıyım - Phaser 3
    Tek asset klasörü: / (root)
      - efe_sheet.png
      - senam_sheet.png

    Özellikler:
    - Start screen
    - 3 Level
    - 3 Lives
    - Hearts %80 zorunlu
    - Mario-style enemy: üstten basınca ölür, yandan can götürür
    - Checkpoints
    - Senam level sonunda platform üstünde
*/

//////////////////////////
// CONFIG - FRAME SIZE  //
//////////////////////////
// Sprite'ın 32x32 ise 32 yap. Büyükse 128 yap.
// Sprite'ın boyutları (sheet 512x512 ama biz küçültücez)
const FRAME_W = 512;
const FRAME_H = 512;

// Hitbox
const HIT_W = 40;
const HIT_H = 80;
const FOOT_PAD = 4; // adjusted slightly back

const SPEED = 270;
const JUMP_V = 540;
const PLAYER_LIVES = 3;
const COYOTE_TIME = 110;
const JUMP_BUFFER = 120;

const GRAVITY_Y = 1200;
const ENEMY_SPEED = 80;

//////////////////////////
// LEVEL CONFIG         //
//////////////////////////
const LEVELS = [
    {
        id: 1,
        name: "Başlangıç Vadisi",
        width: 4500,
        hearts: 20,
        requiredHearts: 15,
        enemies: 10,
        checkpoints: [1600, 3200],  // Safe positions at 1/3 and 2/3
        platforms: [
            [0, 420, 2000, 600],
            [2200, 420, 2300, 600],
            [400, 300, 200, 30], [700, 250, 200, 30], [1000, 320, 200, 30],
            [1400, 300, 200, 30], [1700, 250, 200, 30], [2000, 350, 200, 30],
            [2500, 300, 200, 30], [2800, 250, 200, 30], [3100, 300, 200, 30],
            [3500, 280, 200, 30], [3900, 320, 200, 30]
        ],
        finalPlatform: [4100, 250, 300, 30],
    },
    {
        id: 2,
        name: "Dikenli Patika",
        width: 4200,  // EXTENDED to fit Senam!
        hearts: 20,
        requiredHearts: 15,
        enemies: 12,
        checkpoints: [650, 2200],  // Two checkpoints for longer map
        spikes: [
            // Section 1 spikes
            [550, 420, 3],
            [1300, 420, 4],
            // Section 2 spikes
            [2100, 420, 3],
            [2600, 420, 5],
            // Section 3 spikes
            [3200, 420, 4],
        ],
        platforms: [
            // Section 1: START (0-1000)
            [0, 420, 800, 600],
            [900, 350, 120, 30],      // Bridge
            [1000, 420, 800, 600],
            // Section 2: MID (1800-2800)
            [1900, 350, 120, 30],     // Bridge
            [2000, 420, 800, 600],
            [2900, 350, 120, 30],     // Bridge
            // Section 3: EXTENDED (3000-3800)
            [3000, 420, 900, 600],
            // Single jump platform to Senam
            [3800, 360, 150, 30],
        ],
        finalPlatform: [3940, 300, 150, 30],  // Senam at 4015
    },
    {
        id: 3,
        name: "Sakura Zirvesi",
        width: 4200,
        hearts: 20,
        requiredHearts: 15,
        enemies: 16,
        checkpoints: [400, 2000, 3400],  // All on solid platforms!
        spikes: [
            // On main platforms only
            [550, 450, 3],    // On platform 1 (0-1000)
            [1650, 450, 4],   // On platform 2 (1500-2500)
            [3200, 450, 3],   // On platform 3 (3000-3900)
        ],
        platforms: [
            // Main platforms like Level 2 style
            [0, 450, 1000, 600],          // Section 1
            [1250, 410, 120, 30],         // Bridge AFTER moving platform
            [1500, 450, 1000, 600],       // Section 2
            [2750, 410, 120, 30],         // Bridge AFTER moving platform
            [3000, 450, 900, 600],        // Section 3
            // Single jump platform to Senam
            [3800, 380, 150, 30],
        ],
        movingPlatforms: [
            { x: 1050, y: 400, w: 150, h: 30, moveX: 0, moveY: -70, duration: 2200 },
            { x: 2550, y: 400, w: 150, h: 30, moveX: 0, moveY: -70, duration: 2200 },
        ],
        finalPlatform: [3940, 300, 150, 30],
    }
];

// required hearts = %70 (ceil) - DISABLED, using hardcoded values
// LEVELS.forEach(l => l.requiredHearts = Math.ceil(l.hearts * 0.7));

//////////////////////////
// DOM HOOKS            //
//////////////////////////
const startOverlay = document.getElementById("startOverlay");
const startBtn = document.getElementById("startBtn");
const howBtn = document.getElementById("howBtn");
const howText = document.getElementById("howText");

// Level Menu
const menuBtn = document.getElementById("menuBtn");
const levelMenu = document.getElementById("levelMenu");

const rejectOverlay = document.getElementById("rejectOverlay");
const missingHeartsEl = document.getElementById("missingHearts");
const backToLevelBtn = document.getElementById("backToLevelBtn");

const levelOverlay = document.getElementById("levelOverlay");
const levelTitle = document.getElementById("levelTitle");
const levelDesc = document.getElementById("levelDesc");
const nextLevelBtn = document.getElementById("nextLevelBtn");

const gameOverOverlay = document.getElementById("gameOverOverlay");
const retryBtn = document.getElementById("retryBtn");

const victoryOverlay = document.getElementById("victoryOverlay");
const victoryDesc = document.getElementById("victoryDesc");
const playAgainBtn = document.getElementById("playAgainBtn");

const hudLevel = document.getElementById("hudLevel");
const hudLives = document.getElementById("hudLives");
const hudHearts = document.getElementById("hudHearts");

document.getElementById("backBtn")?.addEventListener("click", goBack);
document.getElementById("backBtn2")?.addEventListener("click", goBack);
document.getElementById("backBtn3")?.addEventListener("click", goBack);
document.getElementById("restartBtn")?.addEventListener("click", () => location.reload());

function goBack() {
    window.location.href = "senayicokseviyorum.html";
}

howBtn?.addEventListener("click", () => {
    howText.style.display = (howText.style.display === "none" ? "block" : "none");
});

// Menu toggle handler
menuBtn?.addEventListener("click", () => {
    levelMenu.classList.toggle("show");
});

// Level selection function (global for onclick)
window.selectLevel = function (levelIdx) {
    levelMenu.classList.remove("show");
    startOverlay.classList.remove("show");
    gameOverOverlay.classList.remove("show");
    startNewRun(levelIdx);
};

let sceneRef = null;
//////////////////////////
const mobile = { left: false, right: false, jump: false };

bindHold("btnLeft", v => mobile.left = v);
bindHold("btnRight", v => mobile.right = v);
bindHold("btnJump", v => mobile.jump = v);

function bindHold(id, setter) {
    const el = document.getElementById(id);
    if (!el) return;
    const down = (e) => { e.preventDefault(); setter(true); };
    const up = (e) => { e.preventDefault(); setter(false); };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerout", up);
}

//////////////////////////
// PHASER SETUP         //
//////////////////////////
const config = {
    type: Phaser.AUTO,
    parent: "game",
    width: 960,
    height: 540,
    backgroundColor: "#ffc2d1", // Sakura Pink Theme
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: { gravity: { y: GRAVITY_Y }, debug: false }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: { preload, create, update }
};

new Phaser.Game(config);

//////////////////////////
// GAME STATE           //
//////////////////////////
let cursors;

let levelIndex = 0; // 0..2
let currentLevel;

let platforms, hearts, checkpoints, enemies, spikes, movingPlatforms, decorations;
let player, goal;
let heartsCollected = 0;
let playerLives = PLAYER_LIVES;
let heartsTotal = 0;
let frozen = false;
let lastCheckpoint = { x: 120, y: 420 };
let invulnUntil = 0;
let coyoteTimer = 0;
let jumpBufferTimer = 0;
let levelCompleted = false;
let checkpointFlags = [];
//////////////////////////
// PRELOAD              //
//////////////////////////
function preload() {
    this.load.spritesheet("efe", "efe_sheet.png", { frameWidth: FRAME_W, frameHeight: FRAME_H });

    // Dual Load Strategy for Senam:
    // 1. Full Width (1024x512) for Frame 0 (Top Idle with Nametag)
    this.load.spritesheet("senam_full", "senam_sheet.png", { frameWidth: 1024, frameHeight: 512 });

    // 2. Grid (512x512) for Frame 4 (Bottom Left Jump)
    this.load.spritesheet("senam_grid", "senam_sheet.png", { frameWidth: 512, frameHeight: 512 });
}

//////////////////////////
// CREATE               //
//////////////////////////
function create() {
    sceneRef = this;
    makeTextures(this);
    safeCreateAnims(this);

    cursors = this.input.keyboard.createCursorKeys();

    // start overlay -> start game
    startBtn?.addEventListener("click", () => {
        startOverlay.classList.remove("show");
        startNewRun(0);
    });

    backToLevelBtn?.addEventListener("click", () => {
        rejectOverlay.classList.remove("show");
        unfreeze();
    });

    nextLevelBtn?.addEventListener("click", () => {
        levelOverlay.classList.remove("show");
        startNewRun(levelIndex + 1);
    });

    retryBtn?.addEventListener("click", () => location.reload());
    playAgainBtn?.addEventListener("click", () => location.reload());

    // World setup
    this.physics.world.setBounds(0, 0, 3000, 900);
    this.cameras.main.setBounds(0, 0, 3000, 900);

    // Background sky (Sakura Gradient)
    const sky = this.add.graphics();
    sky.fillGradientStyle(0xffc2d1, 0xffc2d1, 0xff9eb5, 0xff9eb5, 1);
    sky.fillRect(0, 0, 3000, 900);
    sky.setScrollFactor(0); // Fix background to camera

    // Falling Sakura Petals (Better Shape)
    const particles = this.add.particles('petal');
    if (!this.textures.exists('petal')) {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffebf0, 1);
        // Draw a tear-drop / petal shape
        g.beginPath();
        g.fillEllipse(8, 8, 8, 5); // Base oval
        g.fillCircle(4, 8, 3); // rounder end
        g.closePath();
        g.generateTexture('petal', 16, 16);
    }

    const emitter = this.add.particles(0, 0, 'petal', {
        x: { min: 0, max: 3000 },
        y: -50,
        lifespan: 8000,
        speedY: { min: 30, max: 80 },
        speedX: { min: -20, max: 20 },
        scale: { start: 0.8, end: 0.5 },
        alpha: { start: 1, end: 0 },
        rotate: { min: 0, max: 360 },
        quantity: 2,
        frequency: 200,
        blendMode: 'ADD'
    });
    emitter.setScrollFactor(0.1); // Parallax effect for petals

    // Soft white clouds (kept but tinted slightly pinkish/white)
    for (let i = 0; i < 12; i++) {
        const x = 100 + i * 400;
        const y = 80 + (i % 3) * 50;
        this.add.ellipse(x, y, 180, 70, 0xffffff, 0.4).setScrollFactor(0.2);
    }

    // Player (dummy, asıl spawn level ile)
    player = this.physics.add.sprite(120, 420, "efe", 0);
    player.setScale(0.15); // 512px -> ~76px
    setupPlayerPhysics(player);
    player.setVisible(false);

    // Camera follow
    this.cameras.main.startFollow(player, true, 0.10, 0.10);
    this.cameras.main.setFollowOffset(-120, 0);

    freeze(); // start ekran açık

    updateHUD();
}

//////////////////////////
// UPDATE               //
//////////////////////////
function update(time, delta) {
    if (frozen) {
        if (player) player.setVelocity(0, 0);
        return;
    }

    // Cutscene mode (Level transition)
    if (levelCompleted) {
        if (player) {
            player.setVelocityX(0); // Stop movement
            if (player.body.blocked.down) player.anims.play("efe-idle", true);
        }
        return; // Skip input processing
    }

    // timers
    coyoteTimer = Math.max(0, coyoteTimer - delta);
    jumpBufferTimer = Math.max(0, jumpBufferTimer - delta);

    const grounded = player.body.blocked.down || player.body.touching.down;
    if (grounded) coyoteTimer = COYOTE_TIME;

    const left = cursors.left.isDown || mobile.left;
    const right = cursors.right.isDown || mobile.right;

    const jumpPressed = Phaser.Input.Keyboard.JustDown(cursors.up) || mobile.jump;
    if (jumpPressed) jumpBufferTimer = JUMP_BUFFER;

    // movement
    if (left && !right) {
        player.setVelocityX(-SPEED);
        player.setFlipX(true);
        if (grounded) player.anims.play("efe-walk", true);
    } else if (right && !left) {
        player.setVelocityX(SPEED);
        player.setFlipX(false);
        if (grounded) player.anims.play("efe-walk", true);
    } else {
        player.setVelocityX(0);
        if (grounded) player.anims.play("efe-idle", true);
    }

    // jump (buffer + coyote)
    if (jumpBufferTimer > 0 && coyoteTimer > 0) {
        player.setVelocityY(-JUMP_V);
        jumpBufferTimer = 0;
        coyoteTimer = 0;
    }

    if (!grounded) player.anims.play("efe-jump", true);

    // enemies patrol + edge check
    enemies?.getChildren()?.forEach(e => enemyPatrolStep(e));

    // fall -> lose life
    if (player.y > 900) {
        loseLife();
    }
}

//////////////////////////
// GAME FLOW            //
//////////////////////////
function startNewRun(nextIndex) {
    if (nextIndex >= LEVELS.length) return;

    // reset overlays
    rejectOverlay.classList.remove("show");
    levelOverlay.classList.remove("show");
    gameOverOverlay.classList.remove("show");
    victoryOverlay.classList.remove("show");

    levelIndex = nextIndex;
    currentLevel = LEVELS[levelIndex];

    levelCompleted = false;

    // For Testing: Always reset lives to 10 on ANY level load!
    // This is temporary per user request
    playerLives = PLAYER_LIVES;

    heartsCollected = 0;
    heartsTotal = currentLevel.hearts;

    // clean previous
    destroyGroup(platforms);
    destroyGroup(hearts);
    destroyGroup(checkpoints);
    // Clear visual flags (since they are in an array, not a group)
    if (typeof checkpointFlags !== "undefined") {
        checkpointFlags.forEach(f => f.destroy());
        checkpointFlags = [];
    }
    destroyGroup(enemies);
    destroyGroup(spikes);
    if (movingPlatforms) movingPlatforms.clear(true, true);
    if (decorations) decorations.clear(true, true);
    if (goal) goal.destroy();

    // world bounds
    sceneRef.physics.world.setBounds(0, 0, currentLevel.width, 900);
    sceneRef.cameras.main.setBounds(0, 0, currentLevel.width, 900);

    // groups
    platforms = sceneRef.physics.add.staticGroup();
    decorations = sceneRef.add.group(); // Visuals only
    hearts = sceneRef.physics.add.group({ allowGravity: false, immovable: true });
    checkpoints = sceneRef.physics.add.staticGroup();
    // Enable Gravity for Enemies so they fall to platform
    enemies = sceneRef.physics.add.group({ allowGravity: true, immovable: false });
    spikes = sceneRef.physics.add.staticGroup();
    movingPlatforms = sceneRef.physics.add.group({ allowGravity: false, immovable: true });

    // build platforms
    currentLevel.platforms.forEach(p => addPlat(platforms, ...p));
    addPlat(platforms, ...currentLevel.finalPlatform); // final platform

    // Build Spikes (Level 2)
    if (currentLevel.spikes) {
        currentLevel.spikes.forEach(s => {
            // s: [x, y, count]
            for (let i = 0; i < s[2]; i++) {
                const sp = spikes.create(s[0] + i * 32, s[1], "spike");
                sp.setOrigin(0.5, 1);
                sp.refreshBody();
                // hitbox fix
                sp.body.setSize(10, 10);
                sp.body.setOffset(11, 22);
            }
        });
    }

    // Build Moving Platforms (Level 3)
    // Build Moving Platforms (Level 3)
    if (currentLevel.movingPlatforms) {
        currentLevel.movingPlatforms.forEach(mp => {
            // FIX: mp is Object {x,y,w,h}, NOT Array!
            // Using V3 texture
            const p = sceneRef.add.tileSprite(mp.x + mp.w / 2, mp.y + mp.h / 2, mp.w, mp.h, "plat_top_v3");
            sceneRef.physics.add.existing(p);
            p.body.setAllowGravity(false);
            p.body.setImmovable(true);
            p.body.moves = false;
            p.body.setSize(mp.w, mp.h); // Explicitly match visual size
            movingPlatforms.add(p);

            // Tween movement
            sceneRef.tweens.add({
                targets: p,
                y: p.y + mp.moveY,
                duration: mp.duration,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    // checkpoints on platforms
    checkpointFlags = [];
    currentLevel.checkpoints.forEach((x) => {
        // find a platform near x (pick first that covers that x)
        const plat = findPlatformCoveringX(platforms, x) || currentLevel.platforms[0];
        const yTop = plat.body ? plat.body.top : plat[1];
        const flag = checkpoints.create(x, yTop, "flag");
        flag.setOrigin(0.5, 1);
        flag.refreshBody();
        flag.setData("hit", false);
        checkpointFlags.push(flag);
    });

    // starting checkpoint (always start)
    lastCheckpoint = { x: 120, y: 420 };

    // distribute hearts on platforms (filtered by spikes)
    const realCount = placeHeartsOnPlatforms(hearts, platforms, heartsTotal, currentLevel.spikes, currentLevel.finalPlatform[0]);

    // Keep required hearts fixed at level config value (don't auto-adjust)

    // Also place hearts on Moving Platforms if any (Logic injection)
    // ...

    // enemies spawn
    placeEnemies(enemies, platforms, currentLevel.enemies);

    // Goal Senam
    const fp = currentLevel.finalPlatform;
    const fpCenterX = fp[0] + fp[2] / 2;
    const fpTopY = fp[1];

    // Use Full Width Sheet (Frame 0) for Idle to get Nametag
    goal = sceneRef.physics.add.staticSprite(fpCenterX, fpTopY, "senam_full", 0);
    goal.setScale(0.15);

    // Adjust collision body (since sprite is 1024px wide)
    // 1024 * 0.15 = 153px wide. We want ~50px width.
    // 50 / 0.15 = 333
    // Height 512 * 0.15 = 76px.
    goal.body.setSize(300, 500);
    goal.body.setOffset(362, 12); // Center it (1024-300)/2 = 362

    // Create Senam jump animation using Grid Sheet (Frame 4)
    if (!sceneRef.anims.exists('senam-jump')) {
        sceneRef.anims.create({
            key: 'senam-jump',
            frames: [{ key: 'senam_grid', frame: 4 }], // Frame 4 = Jump
            frameRate: 1,
            repeat: -1
        });
    }
    goal.setOrigin(0.5, 1);

    // player spawn
    player.setVisible(true);
    player.body.enable = true;
    respawnAtCheckpoint(true);

    // collisions
    sceneRef.physics.add.collider(player, platforms);
    sceneRef.physics.add.collider(enemies, platforms);

    // Colliders for new mechanics
    sceneRef.physics.add.collider(player, movingPlatforms, (p, mp) => {
        if (p.body.touching.down && mp.body.touching.up) {
            p.body.velocity.x += (mp.body.deltaX() * 60); // approx velocity transfer
        }
    });
    sceneRef.physics.add.collider(player, spikes, (p, s) => {
        loseLife();
        p.setVelocityY(-300); // small hop
    });

    sceneRef.physics.add.overlap(player, hearts, collectHeart, null, sceneRef);
    sceneRef.physics.add.overlap(player, checkpoints, hitCheckpoint, null, sceneRef);

    // player-goal overlap
    sceneRef.physics.add.overlap(player, goal, tryFinishLevel, null, sceneRef);

    // player-enemy overlap
    sceneRef.physics.add.overlap(player, enemies, playerVsEnemy, null, sceneRef);

    updateHUD();
    unfreeze();
}

//////////////////////////
// UPDATE               //
//////////////////////////
function update(time, delta) {
    if (frozen) {
        if (player) player.setVelocity(0, 0);
        return;
    }

    // Cutscene mode (Level transition)
    if (levelCompleted) {
        if (player) {
            player.setVelocityX(0); // Stop movement
            if (player.body.blocked.down) player.anims.play("efe-idle", true);
        }
        return; // Skip input processing
    }

    // timers
    coyoteTimer = Math.max(0, coyoteTimer - delta);
    jumpBufferTimer = Math.max(0, jumpBufferTimer - delta);

    const grounded = player.body.blocked.down || player.body.touching.down;
    if (grounded) coyoteTimer = COYOTE_TIME;

    const left = cursors.left.isDown || mobile.left;
    const right = cursors.right.isDown || mobile.right;

    const jumpPressed = Phaser.Input.Keyboard.JustDown(cursors.up) || mobile.jump;
    if (jumpPressed) jumpBufferTimer = JUMP_BUFFER;

    // movement
    if (left && !right) {
        player.setVelocityX(-SPEED);
        player.setFlipX(true);
        if (grounded) player.anims.play("efe-walk", true);
    } else if (right && !left) {
        player.setVelocityX(SPEED);
        player.setFlipX(false);
        if (grounded) player.anims.play("efe-walk", true);
    } else {
        player.setVelocityX(0);
        if (grounded) player.anims.play("efe-idle", true);
    }

    // jump (buffer + coyote)
    if (jumpBufferTimer > 0 && coyoteTimer > 0) {
        player.setVelocityY(-JUMP_V);
        jumpBufferTimer = 0;
        coyoteTimer = 0;
    }

    if (!grounded) player.anims.play("efe-jump", true);

    // enemies patrol + edge check
    enemies?.getChildren()?.forEach(e => enemyPatrolStep(e));

    // fall -> lose life
    if (player.y > 900) {
        loseLife();
    }
}

//////////////////////////
// GAME FLOW            //
//////////////////////////
function startNewRun(nextIndex) {
    if (nextIndex >= LEVELS.length) return;

    // reset overlays
    rejectOverlay.classList.remove("show");
    levelOverlay.classList.remove("show");
    gameOverOverlay.classList.remove("show");
    victoryOverlay.classList.remove("show");

    levelIndex = nextIndex;
    currentLevel = LEVELS[levelIndex];

    levelCompleted = false;

    // Lives only reset if starting from level 1
    if (levelIndex === 0) playerLives = PLAYER_LIVES;

    heartsCollected = 0;
    heartsTotal = currentLevel.hearts;

    // clean previous
    destroyGroup(platforms);
    destroyGroup(hearts);
    destroyGroup(checkpoints);
    // Clear visual flags (since they are in an array, not a group)
    if (typeof checkpointFlags !== "undefined") {
        checkpointFlags.forEach(f => f.destroy());
        checkpointFlags = [];
    }
    destroyGroup(enemies);
    destroyGroup(spikes);
    if (movingPlatforms) movingPlatforms.clear(true, true);
    if (decorations) decorations.clear(true, true);
    if (goal) goal.destroy();

    // world bounds
    sceneRef.physics.world.setBounds(0, 0, currentLevel.width, 900);
    sceneRef.cameras.main.setBounds(0, 0, currentLevel.width, 900);

    // groups
    platforms = sceneRef.physics.add.staticGroup();
    decorations = sceneRef.add.group(); // Visuals only
    hearts = sceneRef.physics.add.group({ allowGravity: false, immovable: true });
    checkpoints = sceneRef.physics.add.staticGroup();
    // Enable Gravity for Enemies so they fall to platform
    enemies = sceneRef.physics.add.group({ allowGravity: true, immovable: false });
    spikes = sceneRef.physics.add.staticGroup();
    movingPlatforms = sceneRef.physics.add.group({ allowGravity: false, immovable: true });

    // build platforms
    currentLevel.platforms.forEach(p => addPlat(platforms, ...p));
    addPlat(platforms, ...currentLevel.finalPlatform); // final platform

    // Build Spikes (Level 2)
    if (currentLevel.spikes) {
        currentLevel.spikes.forEach(s => {
            // s: [x, y, count]
            for (let i = 0; i < s[2]; i++) {
                const sp = spikes.create(s[0] + i * 32, s[1], "spike");
                sp.setOrigin(0.5, 1);
                sp.refreshBody();
                // hitbox fix
                sp.body.setSize(10, 10);
                sp.body.setOffset(11, 22);
            }
        });
    }

    // Build Moving Platforms (Level 3)
    // Build Moving Platforms (Level 3)
    if (currentLevel.movingPlatforms) {
        currentLevel.movingPlatforms.forEach(mp => {
            // FIX: mp is Object {x,y,w,h}, NOT Array!
            // Using V3 texture
            const p = sceneRef.add.tileSprite(mp.x + mp.w / 2, mp.y + mp.h / 2, mp.w, mp.h, "plat_top_v3");
            sceneRef.physics.add.existing(p);
            p.body.setAllowGravity(false);
            p.body.setImmovable(true);
            p.body.moves = false;
            p.body.setSize(mp.w, mp.h); // Explicitly match visual size
            movingPlatforms.add(p);

            // Tween movement
            sceneRef.tweens.add({
                targets: p,
                y: p.y + mp.moveY,
                duration: mp.duration,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    // checkpoints on platforms
    checkpointFlags = [];
    currentLevel.checkpoints.forEach((x) => {
        // find a platform near x (pick first that covers that x)
        const plat = findPlatformCoveringX(platforms, x) || currentLevel.platforms[0];
        const yTop = plat.body ? plat.body.top : plat[1];
        const flag = checkpoints.create(x, yTop, "flag");
        flag.setOrigin(0.5, 1);
        flag.refreshBody();
        flag.setData("hit", false);
        checkpointFlags.push(flag);
    });

    // starting checkpoint (always start)
    lastCheckpoint = { x: 120, y: 420 };

    // distribute hearts on platforms (filtered by spikes)
    const realCount = placeHeartsOnPlatforms(hearts, platforms, heartsTotal, currentLevel.spikes, currentLevel.finalPlatform[0]);

    // Also place hearts on Moving Platforms if any (Logic injection)
    // ...

    // enemies spawn
    placeEnemies(enemies, platforms, currentLevel.enemies);

    // Goal Senam
    const fp = currentLevel.finalPlatform;
    const fpCenterX = fp[0] + fp[2] / 2;
    const fpTopY = fp[1];

    // Use Full Width Sheet (Frame 0) for Idle to get Nametag
    goal = sceneRef.physics.add.staticSprite(fpCenterX, fpTopY, "senam_full", 0);
    goal.setScale(0.15);

    // Adjust collision body (since sprite is 1024px wide)
    // 1024 * 0.15 = 153px wide. We want ~50px width.
    // 50 / 0.15 = 333
    // Height 512 * 0.15 = 76px.
    goal.body.setSize(300, 500);
    goal.body.setOffset(362, 12); // Center it (1024-300)/2 = 362

    // Create Senam jump animation using Grid Sheet (Frame 4)
    if (!sceneRef.anims.exists('senam-jump')) {
        sceneRef.anims.create({
            key: 'senam-jump',
            frames: [{ key: 'senam_grid', frame: 4 }], // Frame 4 = Jump
            frameRate: 1,
            repeat: -1
        });
    }
    goal.setOrigin(0.5, 1);

    // player spawn
    player.setVisible(true);
    player.body.enable = true;
    respawnAtCheckpoint(true);

    // collisions
    sceneRef.physics.add.collider(player, platforms);
    sceneRef.physics.add.collider(enemies, platforms);

    // Colliders for new mechanics
    sceneRef.physics.add.collider(player, movingPlatforms, (p, mp) => {
        if (p.body.touching.down && mp.body.touching.up) {
            p.body.velocity.x += (mp.body.deltaX() * 60); // approx velocity transfer
        }
    });
    sceneRef.physics.add.collider(player, spikes, (p, s) => {
        loseLife();
        p.setVelocityY(-300); // small hop
    });

    sceneRef.physics.add.overlap(player, hearts, collectHeart, null, sceneRef);
    sceneRef.physics.add.overlap(player, checkpoints, hitCheckpoint, null, sceneRef);

    // player-goal overlap
    sceneRef.physics.add.overlap(player, goal, tryFinishLevel, null, sceneRef);

    // player-enemy overlap
    sceneRef.physics.add.overlap(player, enemies, playerVsEnemy, null, sceneRef);

    updateHUD();
    unfreeze();
}

function tryFinishLevel() {
    if (levelCompleted) return;

    // Prevent spamming the warning
    if (sceneRef.rejectionActive) return;

    const required = currentLevel.requiredHearts;
    if (heartsCollected >= required) {

        // STAGE 1: Check Vertical Alignment
        // Prevent triggering from below platform.
        // Player feet (y) must be close to Goal feet (y).
        if (Math.abs(player.y - goal.y) > 30) return;

        levelCompleted = true; // Disable input in update()

        // Turn player to face Senam if needed?
        // simple msg

        // Play Senam animation: Jump and return
        if (goal && goal.anims) {
            goal.play('senam-jump');
            // Small hop tween for visual pop
            sceneRef.tweens.add({
                targets: goal,
                y: '-=30',
                yoyo: true,
                duration: 300,
                repeat: 3
            });
        }

        // DELAYED TRANSITION (2 seconds)
        sceneRef.time.delayedCall(2000, () => {
            if (goal && goal.anims) goal.stop();
            if (goal) goal.setFrame(0);

            freeze(); // Now freeze everything

            if (levelIndex < LEVELS.length - 1) {
                levelTitle.textContent = `Bölüm ${levelIndex + 1} Tamam! 🌸`;
                levelDesc.textContent = `Kalpler: ${heartsCollected}/${heartsTotal} • Hazırsan devam!`;
                nextLevelBtn.textContent = "Sonraki Bölüm →";
                levelOverlay.classList.add("show");
            } else {
                victoryDesc.innerHTML = `Prensesini kurtardın! Sena artık güvende 🌸<br><br>Efe, Sena'yı o kadar çok seviyor ki<br>tüm engelleri aştı ve ona ulaştı! 💕<br><br>Kalpler: ${heartsCollected}/${heartsTotal}<br><br>Sonsuza kadar mutlu yaşadılar... ✨`;
                victoryOverlay.classList.add("show");
            }
        });

    } else {
        // NON-BLOCKING WARNING (Toast)
        // Do NOT freeze, do NOT show overlay.

        sceneRef.rejectionActive = true;

        const missing = required - heartsCollected;
        const msg = `⚠️ Yetersiz Kalp! (${missing} tane daha)`;

        const t = sceneRef.add.text(player.x, player.y - 60, msg, {
            fontFamily: "Arial",
            fontSize: "20px",
            color: "#ff0000",
            stroke: "#ffffff",
            strokeThickness: 4,
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Warning animation
        sceneRef.tweens.add({
            targets: t,
            y: t.y - 50,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                t.destroy();
                sceneRef.rejectionActive = false; // Reset cooldown
            }
        });
    }
}

//////////////////////////
// PLAYER / PHYSICS      //
//////////////////////////
function setupPlayerPhysics(p) {
    p.setOrigin(0.5, 1); // AYAK ORIGIN
    p.setSize(HIT_W, HIT_H);
    p.setOffset((FRAME_W - HIT_W) / 2, FRAME_H - HIT_H - FOOT_PAD);
    p.setCollideWorldBounds(true);
}

function respawnAtCheckpoint(instant = false) {
    if (!player) return;

    // Stop all momentum to prevent clipping
    player.setVelocity(0, 0);
    player.setAcceleration(0, 0);

    player.x = lastCheckpoint.x;
    player.y = lastCheckpoint.y - 10;
    player.setAlpha(1);

    if (!instant) {
        sceneRef.tweens.add({
            targets: player,
            alpha: 0.2,
            duration: 100,
            repeat: 5,
            yoyo: true,
            onComplete: () => player.setAlpha(1)
        });
    }

    invulnUntil = performance.now() + 1500;
}

function loseLife() {
    if (performance.now() < invulnUntil) {
        // prevent chain damage
        respawnAtCheckpoint(true);
        return;
    }

    playerLives--;
    updateHUD();

    if (playerLives > 0) {
        respawnAtCheckpoint(true);
    } else {
        // game over
        freeze();
        player.setVelocity(0, 0);
        player.body.enable = false;
        gameOverOverlay.classList.add("show");
    }
}

//////////////////////////
// HEARTS / CHECKPOINT   //
//////////////////////////
function collectHeart(p, h) {
    h.destroy();
    heartsCollected++;
    updateHUD();
}

function hitCheckpoint(p, flag) {
    if (flag.getData("hit")) return;
    flag.setData("hit", true);

    // respawn point: flag'ın üstü + platform top
    // flag origin bottom olduğundan flag.y platform top'ta duruyor.
    // player origin bottom: aynı y'ye koyabiliriz.
    lastCheckpoint = { x: flag.x, y: flag.y };

    // küçük yazı efekti
    const t = sceneRef.add.text(flag.x, flag.y - 70, "CHECKPOINT!", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        fontStyle: "bold"
    }).setOrigin(0.5);
    sceneRef.tweens.add({
        targets: t,
        y: t.y - 25,
        alpha: 0,
        duration: 700,
        ease: "Cubic.easeOut",
        onComplete: () => t.destroy()
    });
}

//////////////////////////
// ENEMIES (Mario-style) //
//////////////////////////
function placeEnemies(group, platformGroup, count) {
    const plats = platformGroup.getChildren();
    const levelWidth = currentLevel.width;

    // Filter platforms:
    // 1. Large enough (width >= 180) - LOWERED for smaller platforms!
    // 2. NOT in spawn zone (x < 800)
    // 3. NOT in final zone (x > levelWidth - 900)
    const validPlats = plats.filter(p => {
        const platCenterX = p.x;
        return p.width >= 180 && platCenterX > 800 && platCenterX < (levelWidth - 900);
    });

    if (validPlats.length === 0) return;

    // Track spawned positions to prevent overlaps
    const spawnedPositions = [];
    const MIN_SPACING = 150;

    let placed = 0;
    let attempts = 0;
    const MAX_ATTEMPTS = count * 20; // Try harder to place all enemies

    while (placed < count && attempts < MAX_ATTEMPTS) {
        attempts++;

        // Pick random valid platform
        const plat = validPlats[Math.floor(Math.random() * validPlats.length)];

        // Random position on this platform
        const minX = plat.x - (plat.width / 2) + 50;
        const maxX = plat.x + (plat.width / 2) - 50;

        // Try to find a non-overlapping position
        let positionAttempts = 0;
        let validPosition = false;
        let x, y;

        while (positionAttempts < 10 && !validPosition) {
            x = Phaser.Math.Between(minX, maxX);

            // Check if too close to any existing spawn
            validPosition = spawnedPositions.every(pos => Math.abs(pos - x) >= MIN_SPACING);
            positionAttempts++;
        }

        if (!validPosition) continue; // Skip this platform if can't find valid position

        // Spawn slightly above so they fall to surface
        y = plat.y - (plat.displayHeight / 2) - 50;

        const enemy = group.create(x, y, "enemy");
        enemy.setOrigin(0.5, 1);
        enemy.body.setSize(30, 30);
        enemy.body.setOffset(1, 2);
        enemy.setBounce(0);
        enemy.setDragX(100);

        // Assign patrol limits
        enemy.setData("minX", minX);
        enemy.setData("maxX", maxX);
        enemy.setData("speed", ENEMY_SPEED);
        enemy.setData("dir", Math.random() > 0.5 ? 1 : -1);
        enemy.setData("alive", true);

        enemy.setVelocityX(enemy.getData("dir") * ENEMY_SPEED);

        spawnedPositions.push(x);
        placed++;
    }
}

function enemyPatrolStep(e) {
    if (!e.getData("alive")) return;

    // platform edge detection: enemy'nin önünde 6px aşağıda zemin var mı?
    const dir = e.getData("dir");
    const aheadX = e.x + dir * 16;
    const footY = e.y + 2; // origin bottom, y ayak
    const groundCheckX = aheadX;
    const groundCheckY = footY + 6;

    const hasGround = pointHitsStatic(platforms, groundCheckX, groundCheckY);

    if (!hasGround) {
        flipEnemy(e);
    }

    // world bounds / blocked
    if (e.body.blocked.left || e.body.blocked.right) flipEnemy(e);

    e.setVelocityX(e.getData("dir") * ENEMY_SPEED);
}

function flipEnemy(e) {
    e.setData("dir", e.getData("dir") * -1);
    e.setFlipX(e.getData("dir") < 0);
}

function playerVsEnemy(p, e) {
    if (!e.getData("alive")) return;

    // IMPROVED STOMP CHECK
    // 1. Player must be falling (velocity.y > 0) or at least not jumping up strictly
    // 2. Player bottom must be roughly above Enemy center
    const playerBottom = p.body.bottom;
    const enemyTop = e.body.top;

    // More forgiving tolerance: 
    // If player is falling and their feet are within 20px of enemy top, count as hit.
    const isFalling = p.body.velocity.y > 0;
    const isAbove = playerBottom < enemyTop + 25; // Generous overlap allowed

    if (isFalling && isAbove) {
        // Mario-style stomp success
        e.setData("alive", false);

        // Squish animation/tween could go here
        sceneRef.tweens.add({
            targets: e,
            scaleY: 0.1,
            alpha: 0,
            duration: 100,
            onComplete: () => e.destroy()
        });

        // Small bounce
        p.setVelocityY(-250);
    } else {
        // Failed stomp -> Player takes damage
        // But add a small grace check: if very close to stomp, maybe push player away instead?
        // For now, strict damage if not stomp.
        if (performance.now() >= invulnUntil) {
            loseLife();
        }
    }
}

//////////////////////////
// HEART DISTRIBUTION    //
//////////////////////////
// [Modified] Excludes final platform and spike zones, guarantees exact count
function placeHeartsOnPlatforms(heartGroup, platformGroup, count, spikeData, finalPlatformX) {
    const plats = platformGroup.getChildren();

    // Create exclusions from spikeData
    const exclusions = [];
    if (spikeData) {
        spikeData.forEach(s => {
            // s: [x, y, count]
            // spike width 32
            const minX = s[0] - 20; // Extra padding
            const maxX = s[0] + s[2] * 32 + 20;
            exclusions.push({ min: minX, max: maxX });
        });
    }

    // Collect all valid positions (excluding final platform and spike zones)
    const validPositions = [];

    for (const p of plats) {
        // Skip final platform (and any platforms after it)
        if (finalPlatformX && p.body.left >= finalPlatformX - 50) {
            continue;
        }

        const platLeft = p.body.left + 40;
        const platRight = p.body.right - 40;
        const platY = p.body.top - 22;

        // Generate potential positions along this platform
        const step = 60; // Space between potential heart positions
        for (let x = platLeft; x < platRight; x += step) {
            // Check if position is in spike exclusion zone
            let blocked = false;
            for (const ex of exclusions) {
                if (x + 15 > ex.min && x - 15 < ex.max) {
                    blocked = true;
                    break;
                }
            }
            if (!blocked) {
                validPositions.push({ x, y: platY });
            }
        }
    }

    // Shuffle positions for variety
    for (let i = validPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [validPositions[i], validPositions[j]] = [validPositions[j], validPositions[i]];
    }

    // Place exactly 'count' hearts from valid positions
    const toPlace = Math.min(count, validPositions.length);
    for (let i = 0; i < toPlace; i++) {
        const pos = validPositions[i];
        const h = heartGroup.create(pos.x, pos.y, "heart");
        h.body.setCircle(20);
        h.body.setOffset(-4, -4);
    }

    return toPlace;
}

//////////////////////////
// HUD                  //
//////////////////////////
function updateHUD() {
    const total = currentLevel ? currentLevel.hearts : 0;
    const req = currentLevel ? currentLevel.requiredHearts : 0;

    // Safety check for undefined variables during initial create()
    const safeHearts = (typeof heartsCollected !== 'undefined') ? heartsCollected : 0;
    const safeLives = (typeof playerLives !== 'undefined') ? playerLives : 3;

    if (hudLevel) hudLevel.textContent = `🌸 Bölüm ${Math.min(levelIndex + 1, 3)}/3`;
    if (hudHearts) hudHearts.textContent = `💗 ${safeHearts}/${total} (Gerekli: ${req})`;

    // lives as hearts or text
    if (hudLives) {
        if (safeLives > 3) {
            hudLives.textContent = `❤️❤️❤️ (x${safeLives})`;
        } else {
            hudLives.textContent = (safeLives >= 3 ? "❤️❤️❤️" :
                safeLives === 2 ? "❤️❤️🖤" :
                    safeLives === 1 ? "❤️🖤🖤" : "🖤🖤🖤");
        }
    }
}

//////////////////////////
// FREEZE / UNFREEZE     //
//////////////////////////
function freeze() {
    frozen = true;
    if (player) player.setVelocity(0, 0);
    if (player) player.body.enable = false;
    enemies?.getChildren()?.forEach(e => e.body && (e.body.enable = false));
}

function unfreeze() {
    frozen = false;
    if (player) player.body.enable = true;
    enemies?.getChildren()?.forEach(e => e.body && (e.body.enable = true));
}

//////////////////////////
// HELPERS              //
//////////////////////////
function destroyGroup(g) {
    if (!g) return;
    g.clear(true, true);
}

function findPlatformCoveringX(platformGroup, x) {
    const plats = platformGroup.getChildren();
    for (const p of plats) {
        if (!p.body) continue;
        if (x >= p.body.left && x <= p.body.right) return p;
    }
    return null;
}

function pointHitsStatic(platformGroup, x, y) {
    const plats = platformGroup.getChildren();
    for (const p of plats) {
        if (!p.body) continue;
        // body.hitTest noktayı içeriyor mu?
        if (p.body.hitTest(x, y)) return true;
    }
    return false;
}

function safeCreateAnims(scene) {
    const tex = scene.textures.get("efe");
    const frameTotal = tex?.frameTotal || 1;

    if (!scene.anims.exists("efe-idle")) {
        scene.anims.create({
            key: "efe-idle",
            frames: [{ key: "efe", frame: 0 }],
            frameRate: 1,
            repeat: -1
        });
    }

    const walkFrames = [];
    if (frameTotal >= 3) {
        walkFrames.push({ key: "efe", frame: 1 });
        walkFrames.push({ key: "efe", frame: 2 });
    } else if (frameTotal >= 2) {
        walkFrames.push({ key: "efe", frame: 1 });
        walkFrames.push({ key: "efe", frame: 0 });
    } else {
        walkFrames.push({ key: "efe", frame: 0 });
    }

    if (!scene.anims.exists("efe-walk")) {
        scene.anims.create({
            key: "efe-walk",
            frames: walkFrames,
            frameRate: 8,
            repeat: -1
        });
    }

    const jumpFrame = frameTotal >= 4 ? 3 : 0;
    if (!scene.anims.exists("efe-jump")) {
        scene.anims.create({
            key: "efe-jump",
            frames: [{ key: "efe", frame: jumpFrame }],
            frameRate: 1,
            repeat: -1
        });
    }
}

function makeTextures(scene) {
    // A. Top Texture (Minecraft Grass Side - Dripping) - V3
    if (!scene.textures.exists("plat_top_v3")) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        // We simulate a 16x16 texture scaled to 32x32, so "pixels" are 2x2
        const pSize = 2; // Real pixel size
        const gridSize = 32 / pSize; // 16

        // Helper to get random variant
        const vary = (color, amount) => {
            const r = (color >> 16) & 0xFF;
            const gr = (color >> 8) & 0xFF;
            const b = color & 0xFF;
            const diff = Math.floor(Math.random() * amount * 2 - amount);
            const clamp = (v) => Math.max(0, Math.min(255, v + diff));
            return (clamp(r) << 16) | (clamp(gr) << 8) | clamp(b);
        };

        for (let yy = 0; yy < gridSize; yy++) {
            for (let xx = 0; xx < gridSize; xx++) {
                let isGrass = false;
                // Dripping Logic
                if (yy < 3) isGrass = true;
                else if (yy === 3 && Math.random() > 0.2) isGrass = true;
                else if (yy === 4 && Math.random() > 0.5) isGrass = true;
                else if (yy === 5 && Math.random() > 0.8) isGrass = true;

                let color;
                if (isGrass) {
                    // Deep Green
                    color = vary(0x228B22, 20);
                } else {
                    // Dirt
                    color = vary(0x8B4513, 20);
                }
                g.fillStyle(color, 1);
                g.fillRect(xx * pSize, yy * pSize, pSize, pSize);
            }
        }
        g.generateTexture("plat_top_v3", 32, 32);
        g.destroy();
    }

    // B. Body Texture (Full Dirt) - V3
    if (!scene.textures.exists("plat_body_v3")) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        const pSize = 2;
        const gridSize = 16;

        const vary = (color, amount) => {
            const r = (color >> 16) & 0xFF;
            const gr = (color >> 8) & 0xFF;
            const b = color & 0xFF;
            const diff = Math.floor(Math.random() * amount * 2 - amount);
            const clamp = (v) => Math.max(0, Math.min(255, v + diff));
            return (clamp(r) << 16) | (clamp(gr) << 8) | clamp(b);
        };

        for (let yy = 0; yy < gridSize; yy++) {
            for (let xx = 0; xx < gridSize; xx++) {
                let color = vary(0x8B4513, 15);
                if (Math.random() > 0.9) color = 0x5c4033;
                g.fillStyle(color, 1);
                g.fillRect(xx * pSize, yy * pSize, pSize, pSize);
            }
        }
        g.generateTexture("plat_body_v3", 32, 32);
        g.destroy();
    }

    // heart
    if (!scene.textures.exists("heart")) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xff4fa0, 1);
        const px = [
            "01100110",
            "11111111",
            "11111111",
            "11111111",
            "01111110",
            "00111100",
            "00011000",
            "00000000"
        ];
        const s = 4;
        for (let y = 0; y < px.length; y++) {
            for (let x = 0; x < px[y].length; x++) {
                if (px[y][x] === "1") g.fillRect(x * s, y * s, s, s);
            }
        }
        g.generateTexture("heart", 32, 32);
        g.destroy();
    }

    // flag
    if (!scene.textures.exists("flag")) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffffff, 1); g.fillRect(14, 4, 4, 52);
        g.fillStyle(0xff4fa0, 1); g.fillRect(18, 8, 28, 14);
        g.fillStyle(0xffffff, 1); g.fillCircle(30, 15, 3);
        g.generateTexture("flag", 48, 64);
        g.destroy();
    }

    // enemy (sakura temalı minik yaratık)
    if (!scene.textures.exists("enemy")) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        // body
        g.fillStyle(0xff61b0, 1);
        g.fillRoundedRect(6, 10, 28, 22, 10);
        // eyes
        g.fillStyle(0x111111, 1);
        g.fillCircle(16, 22, 2);
        g.fillCircle(28, 22, 2);
        // blush
        g.fillStyle(0xffa3cf, 1);
        g.fillCircle(12, 26, 2);
        g.fillCircle(32, 26, 2);
        g.generateTexture("enemy", 40, 40);
        g.destroy();
    }

    // spike (triangle)
    if (!scene.textures.exists("spike")) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x999999, 1);
        // Triangle: 0,32 -> 16,0 -> 32,32
        g.fillTriangle(0, 32, 16, 0, 32, 32);
        g.generateTexture("spike", 32, 32);
        g.destroy();
    }
}

function addPlat(group, x, y, w, h) {
    let p;
    // Decision: If platform is thick (ground), make it full dirt body + grass cap.
    // If thin (floating), just grass cap.
    if (h > 40) {
        // Thick Ground: Main physics body uses Body texture (Full Dirt)
        p = sceneRef.add.tileSprite(x + w / 2, y + h / 2, w, h, "plat_body_v3");
        sceneRef.physics.add.existing(p, true);
        group.add(p);

        // Visual Overlay: Grass Cap (Non-physics)
        const cap = sceneRef.add.tileSprite(x + w / 2, y + 16, w, 32, "plat_top_v3");
        // Add to decorations so it gets cleared on reset!
        if (decorations) decorations.add(cap);
    } else {
        // Thin/Floating Platform (Just Grass)
        p = sceneRef.add.tileSprite(x + w / 2, y + h / 2, w, h, "plat_top_v3");
        sceneRef.physics.add.existing(p, true);
        group.add(p);
    }
}

//////////////////////////
// BOOT: start overlay   //
//////////////////////////
startOverlay.classList.add("show");
freeze();
