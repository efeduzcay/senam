// ==========================
// SENAM PLATFORMER - CLEAN VERSION
// ==========================

//////////////////////////
// CONSTANTS
//////////////////////////
const PLAYER_SPEED = 200;
const PLAYER_JUMP = -420;
const ENEMY_SPEED = 50;
const HURT_INVINCIBILITY_MS = 1500;

//////////////////////////
// LEVELS - SIMPLE & GUARANTEED TO WORK
//////////////////////////
const LEVELS = [
    {
        id: 1,
        name: "Başlangıç Vadisi",
        width: 4500,
        hearts: 30,
        requiredHearts: 20,
        enemies: 6,
        checkpoints: [1500, 3000],
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
        width: 3000,
        hearts: 30,
        requiredHearts: 20,
        enemies: 5,
        checkpoints: [1400],
        spikes: [
            [500, 420, 3],
            [1200, 420, 4],
            [2000, 420, 3],
        ],
        platforms: [
            [0, 420, 800, 600],
            [900, 350, 120, 30],
            [1000, 420, 1000, 600],
            [2100, 350, 120, 30],
            [2200, 420, 700, 600],
        ],
        finalPlatform: [2950, 300, 200, 30],
    },
    {
        id: 3,
        name: "Sakura Zirvesi",
        width: 3000,
        hearts: 30,
        requiredHearts: 20,
        enemies: 5,
        checkpoints: [1400],
        spikes: [
            [1050, 600, 8],
            [1150, 600, 8],
            [2050, 600, 8],
            [2150, 600, 8],
        ],
        platforms: [
            [0, 450, 800, 600],
            [1400, 450, 800, 600],
            [2400, 450, 600, 600],
        ],
        movingPlatforms: [
            { x: 1000, y: 380, w: 150, h: 30, moveX: 0, moveY: -80, duration: 2000 },
            { x: 1250, y: 350, w: 150, h: 30, moveX: 0, moveY: 80, duration: 2500 },
            { x: 2250, y: 380, w: 150, h: 30, moveX: 0, moveY: -80, duration: 2000 },
            { x: 2800, y: 350, w: 150, h: 30, moveX: 0, moveY: -70, duration: 1500 }
        ],
        finalPlatform: [2950, 280, 200, 30],
    }
];
