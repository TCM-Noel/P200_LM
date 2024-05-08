/*
* CLASSE JOC
*/

class Joc{
    
    constructor(canvas,ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;
        this.totxoamplada = 22;
        this.totxoalcada = 10; // MIDES DEL TOTXO EN PÍXELS
        this.totxocolor = 20;
       
        this.bola = new Bola(new Punt(this.canvas.width/2,this.canvas.height/2),3);
        this.pala = new Pala(new Punt((this.canvas.width-60)/2,this.canvas.height-15),60,4);
        this.totxo = new Totxo(new Punt((this.canvas.width-120)/2,(this.canvas.height-20)/3), 120, 20, "#0ad");  // només posem un totxo gegant

        this.key = {
            LEFT:{code:37, pressed:false},
            RIGHT:{code:39, pressed:false},
            A: {code: 65, pressed: false},      // A
            D: {code: 68, pressed: false}       // D
        };      
    }

    draw(){
        this.clearCanvas();
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.totxo.draw(this.ctx);
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    }

    inicialitza() {
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.totxo.draw(this.ctx);
        
        $(document).on("keydown", {joc: this}, function(e) {
            var key = e.which;
            var self = e.data.joc;
            if (key === self.key.LEFT.code || key === self.key.A.code) {
                self.key.LEFT.pressed = true;
                self.key.A.pressed = true;
            }
            if (key === self.key.RIGHT.code || key === self.key.D.code) {
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
            }
            if (key === self.key.RIGHT.code || key === self.key.D.code) {
                self.key.RIGHT.pressed = false;
                self.key.D.pressed = false;
            }
        });
    }

    update() {
        if (this.Key.LEFT.pressed || this.Key.A.pressed) {
            this.posicio.x -= this.vx;
            if (this.posicio.x < 0) {
                this.posicio.x = 0;
            }
        }
        if (this.Key.RIGHT.pressed || this.Key.D.pressed) {
            this.posicio.x += this.vx;
            if (this.posicio.x > this.amplada) {
                this.posicio.x = this.amplada;
            }
        }
    }
}