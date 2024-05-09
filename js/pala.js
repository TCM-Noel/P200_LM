/*
* CLASSE PALA
*/

class Pala {
    
    constructor(puntPosicio, amplada, alcada){      
        this.amplada = amplada; // amplada de la pala
        this.alcada = alcada; // alcada de la pala
        this.posicio = puntPosicio; // posició inicial de la pala en el canvas
        this.vx = 2; // velocitat de la pala en l'eix x
        this.color = "#D30"; // color de la pala
    }
    
    // Funció per actualitzar la posició de la pala
    update(){
        if(this.Key.LEFT.pressed){ // si la tecla esquerra està premuda
            this.posicio.x -= this.vx; // mou la pala a l'esquerra
            if(this.posicio.x < 0){ // si la pala surt del canvas, la posicionem al límit
                this.posicio.x = 0;
            }
        }
        if(this.Key.RIGHT.pressed){ // si la tecla dreta està premuda
            this.posicio.x += this.vx; // mou la pala a la dreta
            if(this.posicio.x > this.amplada){ // si la pala surt del canvas, la posicionem al límit
                this.posicio.x = this.amplada;
            }
        }
    }
    
    // Funció per dibuixar la pala en el context del canvas
    draw(ctx) {
        ctx.save(); // guarda l'estat actual del context
        ctx.fillStyle = this.color; // estableix el color de la pala
        ctx.fillRect(this.posicio.x, this.posicio.y, this.amplada, this.alcada); // dibuixa la pala com un rectangle
        ctx.restore(); // recupera l'estat anterior del context
    }

    // Funció per moure la pala
    mou(x, y){
        this.posicio.x += x; // mou la pala en l'eix x
        this.posicio.y += y; // mou la pala en l'eix y
    }
}