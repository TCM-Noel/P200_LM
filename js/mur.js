/*
* CLASSE MUR
*/

class Mur {
    
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.filaCount = 4; // Nombre de files de totxos
        this.columnaCount = 10; // Nombre de columnes de totxos
        this.totxoAmplada; // Amplada de cada totxo
        this.totxoAlcada; // Alçada de cada totxo
        this.padding; // Espai entre totxos
        this.totxos = [];
        

        
        // Generem els totxos utilitzant la classe Totxo
        this.generaMur();
    }

    generaMur(){
        this.offsetTop = 5;
        this.offsetLeft = 6;
        //this.totxoAmplada = this.canvas.width / this.columnaCount -4;
        console.log(joc.amplada);
        this.totxoAmplada = (joc.amplada-this.offsetLeft*2-2*this.columnaCount) / this.columnaCount;
        this.totxoAlcada = joc.alcada / (this.filaCount * 2+2); 
        this.padding = (joc.amplada-(this.totxoAmplada*this.columnaCount))/this.columnaCount-1; 
        
    
        for (let c = 0; c < this.columnaCount; c++) {
            this.totxos[c] = [];
            for (let r = 0; r < this.filaCount; r++) {
                const totxoX = (c * (this.totxoAmplada + this.padding)) + this.offsetLeft;
                const totxoY = (r * (this.totxoAlcada + this.padding)) + this.offsetTop;
                const puntPosicio = { x: totxoX, y: totxoY };
                const totxo = new Totxo(puntPosicio, this.totxoAmplada, this.totxoAlcada);
                this.totxos[c][r] = totxo;
            }
        }
    }
    

    draw(ctx){
        for (let c = 0; c < this.columnaCount; c++) {
            for (let r = 0; r < this.filaCount; r++) {
                const totxo = this.totxos[c][r];
                totxo.draw(this.ctx);
            }
        }
    }
     
    defineixNivells(){
        this.nivells=[
            {
                color: "#4CF", // blue cel
                totxos:[
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                ]
            },
            {
                color: "#8D1", // verd
                totxos:[
                    "aaaaaaaaaaaa",
                    "     aa     ",
                    "   aaaaaa   ",
                    "   aaaaaa   ",
                    "     aa     ",
                ]
            },
            {
                color: "#D30", // vermell
                totxos:[
                    "aaaaaaaaaaaa",
                    "a          a",
                    " a        a ",
                    "aa        aa",
                    "  aaaaaaaa  ",
                ]
            }
        ];
    }

};