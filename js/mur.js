/*
* CLASSE MUR
*/

class Mur {
    
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.filaCount = 5; // Nombre de files de totxos
        this.columnaCount = 10; // Nombre de columnes de totxos
        this.totxoAmplada; // Amplada de cada totxo
        this.totxoAlcada; // Alçada de cada totxo
        this.padding; // Espai entre totxos
        this.totxos = [];
    }

    generaMur(modalidad){
        this.offsetTop = 5;
        this.offsetLeft = 6.5;
        this.totxoAmplada = (joc.amplada-this.offsetLeft*2-2*this.columnaCount) / this.columnaCount;
        this.totxoAlcada = joc.alcada / (this.filaCount * 2+2); 
        this.padding = (joc.amplada-(this.totxoAmplada*this.columnaCount))/this.columnaCount-1; 

        let nivellSeleccionat = this.defineixNivells()[modalidad];

        for (let c = 0; c < this.columnaCount; c++) {
            this.totxos[c] = [];
            for (let r = 0; r < this.filaCount; r++) {
                if (nivellSeleccionat.totxos[r][c] === 'a') {
                    const totxoX = (c * (this.totxoAmplada + this.padding)) + this.offsetLeft;
                    const totxoY = (r * (this.totxoAlcada + this.padding)) + this.offsetTop;
                    const puntPosicio = { x: totxoX, y: totxoY };
                    const totxo = new Totxo(puntPosicio, this.totxoAmplada, this.totxoAlcada);
                    totxo.color = nivellSeleccionat.color;
                    this.totxos[c][r] = totxo;
                } else {
                    this.totxos[c][r] = null;
                }
            }
        }
    }

    draw(ctx){
        for (let c = 0; c < this.columnaCount; c++) {
            for (let r = 0; r < this.filaCount; r++) {
                const totxo = this.totxos[c][r];
                if (totxo !== null) {
                    totxo.draw(this.ctx);
                }
            }
        }
    }
     
    defineixNivells(){
        return {
            'modalidad1': {
                color: "#4CF", // blue cel
                totxos:[
                    "aaaaaaaaaa",
                    "aaaaaaaaaa",
                    "aaaaaaaaaa",
                    "aaaaaaaaaa",
                    "aaaaaaaaaa"
                ]
            },
            'modalidad2': {
                color: "#8D1", // verd
                totxos:[
                    "aaaaaaaaaa",
                    "    aa    ",
                    "  aaaaaa  ",
                    "  aaaaaa  ",
                    "    aa    ",
                ]
            },
            'modalidad3': {
                color: "#D30", // vermell
                totxos:[
                    "aaaaaaaaaa",
                    "a        a",
                    " a      a ",
                    "aa      aa",
                    "  aaaaaa  ",
                ]
            }
        };
    }
};
