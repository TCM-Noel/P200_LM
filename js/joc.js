/*
* CLASSE JOC
*/

class Joc {
    constructor(canvas, ctx) {
        this.musica = false; // Atribut que activa / desactiva la musica
        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;
        this.vides = 3; // Vides inicials del jugador
        this.modalidad = ''; // Modalitat seleccionada pel jugador
        this.isGuanyat = false; // boolea que controla si el jugador ha guanyat
        this.isCaigut = true; // boolea que controla si la bola ha caigut (s'usa per fer el compte enrere)
        this.comptadorEnrere = true; // boolea que controla si el comptador enrere està activat o no
        this.tempsInicial; // Variable que guarda el moment en el que es comença a jugar
        this.nomJugador = ''; // Varible que guarda el nom del jugador introduit en el input de text
        this.isGuardat = false; // boolea que controla si el jugador ha guanyat (li arriba desde la classe bola)
       
        // Inicialització de les classes del joc
        this.bola = new Bola(new Punt(this.canvas.width/2,this.canvas.height-this.canvas.height/4),3);
        this.pala = new Pala(new Punt((this.canvas.width-60)/2,this.canvas.height-15),60,4);
        this.mur = new Mur(this.canvas, this.ctx);

        // Variable que guarda el mapejat de les tecles per jugar
        this.key = {
            LEFT:{code:37, pressed:false},
            RIGHT:{code:39, pressed:false},
            A: {code: 65, pressed: false},
            D: {code: 68, pressed: false}
        };      
    }

    // Mètode que pinta tot el contingut del joc en el canvas
    draw(){
        this.clearCanvas();
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.mur.draw();
    }

    // Mètode que esborra el contingut anterior del canvas (refrescament)
    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    }

    // Funcio que es crida al iniciar el joc
    inicialitza(modalidad){
        this.cuentaAtras(); // Crida a la funció compte enrere
        setTimeout(() => {
            this.isCaigut = false;
            this.comptadorEnrere = false;
        }, 3000);
        // Inicialització de les velocitats
        this.bola.vx = 0;
        this.bola.vy = -1.3;

        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.mur.generaMur(modalidad); // Generació del mur segons modalitat seleccionada
        this.mur.draw();
        this.modalidad = modalidad; // Selecció de la modalitat arribada per paràmetre
        this.tempsInicial = Date.now(); // Asignació del moment en el que s'ha començat a jugar
        
        /**
         * Listeners que activen el mapejat de les tecles amb la que es comença a jugar
         */
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

    /**
     * Funció que actualitza el joc
     */
    update(){
        // Condicional que controla diferents situacions del joc
        if (this.vides==0) { // Si no queden vides, el jugador perd
            $('#missatgeModal').text('Has perdut!')
            $('#modal').fadeIn(200);
            if(this.musica){
                reproduceMusicaStop('modeMusic');
                reproduceMusicaPlay('loseMusic');
            }
        } else if (this.isGuanyat) { // Condicional que controla si el jugador ha guanyat
            $('#missatgeModal').text('Has guanyat!')
            $('#modal').fadeIn(200);
            if(this.musica){
                reproduceMusicaStop('modeMusic');
                reproduceMusicaPlay('winMusic');
            }
            let puntsJugador = this.calcularPuntuacio(); // Funció que calcula la puntuació a assignar
            if (!this.isGuardat) {
                afegirPuntuacio(this.nomJugador, puntsJugador);
                this.isGuardat = true;
            }
        } else if (!this.isCaigut) { // Condicional que actualitza el joc reiteradament
            this.bola.update();
            this.pala.update();
            this.draw();
            this.guanyat();
            this.actualizarVidas();
        } else if (!this.comptadorEnrere) { // Condicional que activa el comptador enrere en cas d'indicar-ho
            this.comptadorEnrere = true;
            setTimeout(() => {
                this.isCaigut = false;
                this.comptadorEnrere = false;
            }, 3000);
        }
    }

    /**
     * Funció que es comunica amb el mur per passar-li el nou mur creat pel jugador
     * @param {*} arrayMur Paràmetre que reb el mur del app.js
     */
    creaNivell(arrayMur) {
        this.mur.crearMur(arrayMur)
    }
    
    /**
     * Funció que actualitza les vides del jugador quan aquesta es cridada
     */
    actualizarVidas() {
        for (let i = 1; i <= 3; i++) {
            let corazón = $("#life" + i);
            if (i <= this.vides) {
                corazón.show();
            } else {
                corazón.hide();
            }
        }
    }
    
    /**
     * Funció que controla si el jugador ha guanyat recorrent tots els totxos del mur
     *  - Totxo buit = destruit
     *  - Totxo amb "a" = segueix en peu pel que encara no ha guanyat
     */
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
    
    /**
     * Funció que genera un comptador enrere de 3 segons
     */
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

    /**
     * Funció que genera un score depenent de múltiples paràmetres
     * @returns score
     */
    calcularPuntuacio(){
        // Fòrmula de blocs / temps * mode
        let destruits = 0;
        for (let i = 0; i < this.mur.columnaCount; i++) {
            for (let j = 0; j < this.mur.filaCount; j++) {
                if (this.mur.totxos[i][j] && this.mur.totxos[i][j].tocat == true) {
                    destruits++;
                }
            }
        }
        let tempsFinal = Date.now();
        let tmpsTransc = (tempsFinal - this.tempsInicial) / 1000; // Temps en segons
        let score = (destruits * tmpsTransc) * this.modeJoc();
        return Math.round(score);
    }

    /**
     * Funció que, segons la modalitat seleccionada, aplica un multiplicador d'experiència o un altre
     * @returns multiplicador d'xp
     */
    modeJoc() {
        switch (this.modalidad) {
            case 'modalidad1':
                return 1.25;
            case 'modalidadPerso':
            case 'modalidad2':
                return 1.50;
            case 'modalidad3':
                return 1.75;
        }
    }
}
