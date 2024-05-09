/*
* CLASSE JOC
*/

class Joc{
    constructor(canvas,ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;
       
        this.bola = new Bola(new Punt(this.canvas.width/2,this.canvas.height/2),3);
        this.pala = new Pala(new Punt((this.canvas.width-60)/2,this.canvas.height-15),60,4);
        this.mur = new Mur(this.canvas, this.ctx);
        //this.totxo = new Totxo(new Punt((this.canvas.width-120)/2,(this.canvas.height-20)/3), 120, 20, "#0ad");  // només posem un totxo gegant

        this.key = {
            LEFT:{code:37, pressed:false},
            RIGHT:{code:39, pressed:false},
            A: {code: 65, pressed: false},
            D: {code: 68, pressed: false}
        };      
    }

    draw(){
        this.clearCanvas();
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.mur.draw();
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    }

    inicialitza(){
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.mur.generaMur();
        this.mur.draw();
        
        $(document).on("keydown", {joc:this}, (e) => {
            if (e.keyCode === joc.key.LEFT.code || e.keyCode === joc.key.A.code) {
                joc.key.LEFT.pressed = true;
                joc.key.A.pressed = true;
            } else if (e.keyCode === joc.key.RIGHT.code || e.keyCode === joc.key.D.code) {
                joc.key.RIGHT.pressed = true;
                joc.key.D.pressed = true;
            }
        });
        $(document).on("keyup", {joc:this}, (e) => {
            if (e.keyCode === joc.key.LEFT.code || e.keyCode === joc.key.A.code) {
                joc.key.LEFT.pressed = false;
                joc.key.A.pressed = false;
            } else if (e.keyCode === joc.key.RIGHT.code || e.keyCode === joc.key.D.code) {
                joc.key.RIGHT.pressed = false;
                joc.key.D.pressed = false;
            }
        });
    }

    update(){
        this.bola.update();
        this.pala.update();
        this.draw();
    }
}