const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

let width;
let height;

let particles = [];

const particleCount = 65;
const maxDistance = 150;

// Mouse
const mouse = {
    x: null,
    y: null,
    radius: 150
};

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// Create particles
class Particle {

    constructor() {

        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;

        this.radius = Math.random() * 2.5 + 1;

        // different sizes
        this.pulse = Math.random() * Math.PI * 2;
    }


    update() {

        this.x += this.vx;
        this.y += this.vy;

        // screen borders
        if (this.x < 0 || this.x > width) {
            this.vx *= -1;
        }

        if (this.y < 0 || this.y > height) {
            this.vy *= -1;
        }


        // Mouse interaction
        if (mouse.x !== null) {

            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {

                const force = (mouse.radius - distance)
                            / mouse.radius;

                this.x += dx * force * 0.015;
                this.y += dy * force * 0.015;
            }
        }

        this.pulse += 0.03;
    }


    draw() {

        const glow =
            Math.sin(this.pulse) * 0.5 + 0.5;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius + glow * 0.7,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#e63946";

        ctx.shadowBlur = 10;
        ctx.shadowColor = "#e63946";

        ctx.fill();

        ctx.shadowBlur = 0;
    }
}


// Create particles
for (let i = 0; i < particleCount; i++) {

    particles.push(new Particle());

}


// Draw connections
function drawConnections() {

    for (let i = 0; i < particles.length; i++) {

        for (let j = i + 1; j < particles.length; j++) {

            const dx =
                particles[i].x - particles[j].x;

            const dy =
                particles[i].y - particles[j].y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);


            if (distance < maxDistance) {

                const opacity =
                    1 - distance / maxDistance;

                ctx.beginPath();

                ctx.moveTo(
                    particles[i].x,
                    particles[i].y
                );

                ctx.lineTo(
                    particles[j].x,
                    particles[j].y
                );

                ctx.strokeStyle =
                    `rgba(230, 57, 70, ${opacity * 0.25})`;

                ctx.lineWidth = 1;

                ctx.stroke();
            }
        }
    }
}


// Animation
function animate() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    drawConnections();

    particles.forEach(particle => {

        particle.update();
        particle.draw();

    });

    requestAnimationFrame(animate);
}

animate();


// Mouse
window.addEventListener("mousemove", (event) => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;

});


window.addEventListener("mouseleave", () => {

    mouse.x = null;
    mouse.y = null;

});