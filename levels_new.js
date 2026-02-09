// BRAND NEW LEVELS - SIMPLE & GUARANTEED TO WORK
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
            // Ground
            [0, 420, 2000, 600],
            [2200, 420, 2300, 600],
            // Upper platforms
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
        width: 3000, // GUARANTEED SMALL
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
            // Simple 3-platform layout
            [0, 420, 800, 600],       // START: 0-800
            [900, 350, 120, 30],      // BRIDGE
            [1000, 420, 1000, 600],   // MID: 1000-2000
            [2100, 350, 120, 30],     // BRIDGE
            [2200, 420, 600, 600],    // END: 2200-2800
        ],
        finalPlatform: [2900, 300, 300, 30], // 100px before 3000!
    },
    {
        id: 3,
        name: "Sakura Zirvesi",
        width: 3000, // SAME SIZE
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
            [0, 450, 800, 600],      // START
            [1400, 450, 800, 600],   // MID
            [2400, 450, 600, 600],   // END
        ],
        movingPlatforms: [
            { x: 1000, y: 380, w: 150, h: 30, moveX: 0, moveY: -80, duration: 2000 },
            { x: 1250, y: 350, w: 150, h: 30, moveX: 0, moveY: 80, duration: 2500 },
            { x: 2250, y: 380, w: 150, h: 30, moveX: 0, moveY: -80, duration: 2000 },
            { x: 2800, y: 350, w: 150, h: 30, moveX: 0, moveY: -70, duration: 1500 }
        ],
        finalPlatform: [2900, 280, 300, 30], // 100px before 3000!
    }
];

// NO AUTO CALCULATION
// LEVELS.forEach(l => l.requiredHearts = Math.ceil(l.hearts * 0.7));
