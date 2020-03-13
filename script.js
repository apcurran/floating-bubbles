"use strict";

const canvas = document.getElementById("canvas");
/** @type { CanvasRenderingContext2D } */
const ctx = canvas.getContext("2d");

ctx.canvas.width = document.documentElement.clientWidth;
ctx.canvas.height = document.documentElement.clientHeight;

let particlesArr = [];
const colors = [
    "#0dc2fb",
    "#7890bf",
    "#b8bad9",
    "#515673"
];
const maxSize = 40;
const minSize = 0;
const mouseRadius = 60;

let mouse = {
    x: null,
    y: null
};

window.addEventListener("mousemove", event => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        const hitLeft = this.x - this.size * 2 < 0;
        const hitRight = this.x + this.size * 2 > canvas.width;
        const hitTop = this.y - this.size * 2 < 0;
        const hitBottom = this.y + this.size * 2 > canvas.height;

        if (hitLeft || hitRight) {
            this.directionX = -this.directionX;
        }

        if (hitTop || hitBottom) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        // mouse interaction
        if (   mouse.x - this.x <   mouseRadius
            && mouse.x - this.x >  -mouseRadius
            && mouse.y - this.y <   mouseRadius
            && mouse.y - this.y >  -mouseRadius) {
                if (this.size < maxSize) {
                    this.size += 3;
                }
            }
        else if (this.size > minSize) {
            this.size -= 0.1;
        }

        if (this.size < 0) {
            this.size = 0;
        }

        this.draw();
    }
}

window.addEventListener("resize", () => {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    init();
});

window.addEventListener("mouseout", () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// create particle arr
function init() {
    particlesArr = [];

    for (let i = 0; i < 1000; i++) {
        const size = 0;
        const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        const directionX = (Math.random() * 0.2) - 0.1;
        const directionY = (Math.random() * 0.2) - 0.1;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particlesArr.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// animate loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArr.length; i++) {
        particlesArr[i].update();
    }
}

init();
animate();