class Joc {
    constructor(canvas, ctx) {
        this.canvas = canvas; // el canvas on es dibuixa el joc
        this.ctx = ctx; // context del canvas per dibuixar
        this.amplada = canvas.width; // amplada del canvas
        this.alcada = canvas.height; // alcada del canvas
        this.bola = new Bola(new Punt(this.canvas.width / 2, this.canvas.height / 2), 3); // crea una bola al centre
        this.pala = new Pala(new Punt((this.canvas.width - 60) / 2, this.canvas.height - 15), 60, 4); // crea la pala
        this.totxo = new Totxo(new Punt((this.canvas.width - 120) / 2, (this.canvas.height - 20) / 3), 120, 20, "#0ad"); // crea un totxo
        this.mur = new Mur(ctx, 0); // inicia un mur amb nivell 0
        this.key = { // controladors de tecles
            LEFT: {code: 37, pressed: false},
            RIGHT: {code: 39, pressed: false},
            A: {code: 65, pressed: false},
            D: {code: 68, pressed: false}
        };
        this.jugando = false; // estat del joc
    }

    inicialitza() {
        // gestiona els events de teclat
        $(document).on("keydown", {joc: this}, function(e) {
            var key = e.which;
            var self = e.data.joc;
            // actua segons la tecla premuda
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
            // actua quan es deixa de prémer la tecla
            if (key === self.key.LEFT.code || key === self.key.A.code) {
                self.key.LEFT.pressed = false;
                self.key.A.pressed = false;
            } else if (key === self.key.RIGHT.code || key === self.key.D.code) {
                self.key.RIGHT.pressed = false;
                self.key.D.pressed = false;
            }
        });

        this.jugando = true;
        this.bucleJuego(); // comença el bucle de joc
    }

    bucleJuego() {
        if (this.jugando) {
            this.update(); // actualitza l'estat del joc
            this.draw(); // dibuixa els elements del joc
            requestAnimationFrame(this.bucleJuego.bind(this)); // continua el bucle
        }
    }

    update() {
        // actualitza la posició de la pala segons les tecles premudes
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
        this.clearCanvas(); // neteja el canvas
        this.pala.draw(this.ctx); // dibuixa la pala
        this.bola.draw(this.ctx); // dibuixa la bola
        this.totxo.draw(this.ctx); // dibuixa el totxo
        this.mur.draw(); // dibuixa el mur
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // esborra tot el contingut del canvas
    }
}