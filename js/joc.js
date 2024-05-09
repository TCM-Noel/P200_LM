/*
* CLASSE JOC
*/

class Joc {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;
        this.bola = new Bola(new Punt(this.canvas.width / 2, this.canvas.height / 2), 3);
        this.pala = new Pala(new Punt((this.canvas.width - 60) / 2, this.canvas.height - 15), 60, 4);
        this.totxo = new Totxo(new Punt((this.canvas.width - 120) / 2, (this.canvas.height - 20) / 3), 120, 20, "#0ad");

        this.key = { // Cambio aquí para mantener consistencia
            LEFT: {code: 37, pressed: false},
            RIGHT: {code: 39, pressed: false},
            A: {code: 65, pressed: false},
            D: {code: 68, pressed: false}
        };
        this.jugando = false; // Control de estado del juego
    }

    inicialitza() {
        $(document).on("keydown", {joc: this}, function(e) {
            var key = e.which;
            var self = e.data.joc;
            if (key === self.key.LEFT.code || key === self.key.A.code) {
                self.key.LEFT.pressed = true;
                self.key.A.pressed = true;
            } else if (key === self.key.RIGHT.code || key === self.key.D.code) {
                self.key.RIGHT.pressed = true;
                self.key.D.pressed = true;
            }
        });

        $(document).on("keyup", {joc: this}, function(e) {
            var key = e.which;
            var self = e.data.joc;
            if (key === self.key.LEFT.code || key === self.key.A.code) {
                self.key.LEFT.pressed = false;
                self.key.A.pressed = false;
            } else if (key === self.key.RIGHT.code || key === self.key.D.code) {
                self.key.RIGHT.pressed = false;
                self.key.D.pressed = false;
            }
        });

        this.jugando = true;
        this.bucleJuego(); // Inicia el bucle de juego
    }

    bucleJuego() {
        if (this.jugando) {
            this.update();
            this.draw();
            requestAnimationFrame(this.bucleJuego.bind(this));
        }
    }

    update() {
        if (this.key.LEFT.pressed || this.key.A.pressed) {
            this.pala.posicio.x -= this.pala.vx;
            if (this.pala.posicio.x < 0) {
                this.pala.posicio.x = 0;
            }
        }
        if (this.key.RIGHT.pressed || this.key.D.pressed) {
            this.pala.posicio.x += this.pala.vx;
            if (this.pala.posicio.x > this.canvas.width - this.pala.amplada) {
                this.pala.posicio.x = this.canvas.width - this.pala.amplada;
            }
        }
    }

    draw() {
        this.clearCanvas();
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.totxo.draw(this.ctx);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
