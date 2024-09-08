// Configuración de la animación
const config = {
    numSpiders: 10,  // Número de arañas
    minSize: 20,    // Tamaño mínimo de las arañas
    maxSize: 40,    // Tamaño máximo de las arañas
    minSpeed: 0.5,  // Velocidad mínima
    maxSpeed: 2,    // Velocidad máxima
    gravity: 0.05,  // Fuerza de gravedad
    bounce: 0.7     // Factor de rebote
};

// Clase que representa una araña
class Spider {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = (Math.random() - 0.5) * speed;
        this.speedY = Math.random() * speed;
        this.legAngle = 0;
        this.legSpeed = 0.1;
    }

    // Método para dibujar la araña
    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        // Cuerpo de la araña
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size / 2, this.size / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cabeza de la araña
        ctx.beginPath();
        ctx.arc(this.x - this.size / 3, this.y, this.size / 4, 0, Math.PI * 2);
        ctx.fill();

        // Ojos de la araña
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x - this.size / 2.5, this.y - this.size / 10, this.size / 20, 0, Math.PI * 2);
        ctx.arc(this.x - this.size / 2.5, this.y + this.size / 10, this.size / 20, 0, Math.PI * 2);
        ctx.fill();

        // Patas de la araña
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            this.drawLeg(ctx, i, 1);
            this.drawLeg(ctx, i, -1);
        }
    }

    // Método para dibujar una pata de la araña
    drawLeg(ctx, index, side) {
        const angle = (Math.PI / 3) * index - Math.PI / 6 + Math.sin(this.legAngle + index) * 0.2;
        const length = this.size * 0.7;
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.quadraticCurveTo(
            this.x + Math.cos(angle) * length * 0.6 * side,
            this.y + Math.sin(angle) * length,
            this.x + Math.cos(angle) * length * side,
            this.y + Math.sin(angle) * length * 1.2
        );
        ctx.stroke();
    }

    // Método para actualizar la posición y velocidad de la araña
    update(width, height) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += config.gravity;
        this.legAngle += this.legSpeed;

        // Rebotar en los bordes
        if (this.x + this.size / 2 > width || this.x - this.size / 2 < 0) {
            this.speedX = -this.speedX * config.bounce;
        }
        if (this.y + this.size / 2 > height) {
            this.y = height - this.size / 2;
            this.speedY = -this.speedY * config.bounce;
        }
    }
}

// Función para inicializar y ejecutar la animación
function initAnimation() {
    // Crear y configurar el canvas
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';

    const ctx = canvas.getContext('2d');

    // Función para redimensionar el canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Agregar event listener para redimensionar el canvas cuando cambie el tamaño de la ventana
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const spiders = [];

    // Crear las arañas
    for (let i = 0; i < config.numSpiders; i++) {
        const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
        const x = Math.random() * (canvas.width - size) + size / 2;
        const y = Math.random() * (canvas.height - size) + size / 2;
        const speed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
        spiders.push(new Spider(x, y, size, speed));
    }

    // Función de animación principal
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        spiders.forEach(spider => {
            spider.update(canvas.width, canvas.height);
            spider.draw(ctx);
        });
        requestAnimationFrame(animate);
    }

    animate();
}

// Iniciar la animación cuando se carga la página
window.addEventListener('load', initAnimation);
