/*
* CLASSE PALA
*/

class Pala {
    //constructor de la pala
    constructor(puntPosicio, amplada, alcada){      
        this.amplada = amplada;
        this.alcada = alcada;
        this.posicio = puntPosicio;
        this.vy = 0;     
        this.vx = 2; // velocitat = 10 píxels per fotograma
        this.color = "#D30"; 
    }

    //actualitzar pala: control de teclat i moviment
    update(){
        if (joc.key.LEFT.pressed || joc.key.RIGHT.pressed) {
            if (joc.key.LEFT.pressed) {
                this.mou(-this.vx, this.vy)
            } else {
                this.mou(this.vx, this.vy)
            }
        }
    }
    //dibuixat de la pala
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posicio.x, this.posicio.y, this.amplada, this.alcada);
        ctx.restore();
    }

    //funció que controla el moviment i controla que no surti del canvas
    mou(x,y){
        if (this.posicio.x >= 0 /* LEFT */ && this.posicio.x <= joc.canvas.width - this.amplada /* RIGHT */) {
            this.posicio.x += x;
            if (this.posicio.x === -this.vx) this.posicio.x = 0;
            if (this.posicio.x === joc.canvas.width - this.amplada + this.vx) this.posicio.x = joc.canvas.width - this.amplada;
        }
        this.posicio.y += y;
    }
}