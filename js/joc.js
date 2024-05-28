/*
* CLASSE JOC
*/

class Joc {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;
        this.vides = 3;
        this.isGuanyat = false;
        this.isCaigut = false;
        this.comptadorEnrere = false; 
        this.nomJugador = '';
        this.isGuardat = true;
       
        this.bola = new Bola(new Punt(this.canvas.width/2,this.canvas.height-this.canvas.height/4),3);
        this.pala = new Pala(new Punt((this.canvas.width-60)/2,this.canvas.height-15),60,4);
        this.mur = new Mur(this.canvas, this.ctx);

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

    inicialitza(modalidad){
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.mur.generaMur(modalidad);
        this.mur.draw();
        this.tempsInicial = Date.now();
        
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
        if (this.vides==0) {
            $('#missatgeModal').text('Has perdut!')
            $('#modal').fadeIn(200);
        } else if (this.isGuanyat) {
            $('#missatgeModal').text('Has guanyat!')
            $('#modal').fadeIn(200);
            reproduceMusicaStop('modeMusic');
            reproduceMusicaPlay('winMusic');
            let puntsJugador = this.calcularPuntuacio(); // calculem puntuacio
            afegirPuntuacio(this.nomJugador, puntsJugador);
        } else if (!this.isCaigut) {
            this.bola.update();
            this.pala.update();
            this.draw();
            this.guanyat();
            this.actualizarVidas();
        } else if (!this.comptadorEnrere) {
            this.comptadorEnrere = true;
            setTimeout(() => {
                this.isCaigut = false;
                this.comptadorEnrere = false;
            }, 3000);
        }
        //console.log(joc.pala.posicio);
    }
    
    actualizarVidas() {
        // Oculta los corazones según la cantidad de vidas restantes
        for (let i = 1; i <= 3; i++) {
            let corazón = $("#life" + i);
            if (i <= this.vides) {
                corazón.show();
            } else {
                corazón.hide();
            }
        }
    }
    
    guanyat() {
        for (let c = 0; c < this.mur.columnaCount; c++) {
            for (let r = 0; r < this.mur.filaCount; r++) {
                if (this.mur.totxos[c][r] && this.mur.totxos[c][r].tocat == false) {
                    return;
                }
            }
        }
        this.isGuanyat = true;
    }
    
    cuentaAtras() {
        $('#cuentaAtras').fadeIn(100);
        $('#cuentaAtras').text('3');
        let tiempo = 3;
        const intervalo = setInterval(() => {
            tiempo--;
            $('#cuentaAtras').text(tiempo);
            if (tiempo === 0) {
                clearInterval(intervalo);
                $('#cuentaAtras').hide();
            }
        }, 1000);
    }

    calcularPuntuacio(){
        //basicamente la formula es bloques_destruidos / tiempo * modo
        let destruits = 0;
        for (let i = 0; i < this.mur.columnaCount; i++) {
            for (let j = 0; j < this.mur.filaCount; j++) {
                if (this.mur.totxos[i][j] && this.mur.totxos[i][j].tocat == true) {
                    destruits++;
                }
            }
        }
        let tempsFinal = Date.now();
        let tmpsTransc = (tempsFinal - this.startTime) / 1000; // Tiempo en segundos
        let score = ( destruits/ tmpsTransc) * this.getmode();
        return Math.round(score);
        
    }
    getmode() {
        switch (this.modalidad) {
            case 'modalidad1':
                return 1;
            case 'modalidad2':
                return 2;
            case 'modalidad3':
                return 3;
        }
    }
}
