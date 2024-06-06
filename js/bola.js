/*
* CLASSE BOLA
*/

class Bola {
    constructor(puntPosicio, radi) {
        this.radi = radi;
        this.posicio = puntPosicio;
        this.vx = -1.3;
        this.vy = -1.3;
        this.color = "#fff";
    }

    /**
     * Funció que pinta la bola al canvas
     * @param {*} ctx context del canvas
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    /**
     * Funció que mou la bola
     * @param {*} x funció que canvia la posició x de la bola
     * @param {*} y funció que canvia la posició y de la bola
     */
    mou(x, y) {
        this.posicio.x += x;
        this.posicio.y += y;
    }

    /**
     * Funció update de la bola
     */
    update() {
        let puntActual = this.posicio;
        let puntSeguent = new Punt(this.posicio.x + this.vx, this.posicio.y + this.vy);
        let trajectoria = new Segment(puntActual, puntSeguent);
        let exces;
        let xoc = false;
        
        /**
         * XOC AMB ELS LATERALS DEL CANVAS
         * 
         * Cadascún dels ifs controla els laterals corresponents als que fan referència
         */

        if(trajectoria.puntB.y - this.radi <= 0){ //Xoc lateral superior
            exces = (trajectoria.puntB.y - this.radi)/this.vy;
            this.posicio.x = trajectoria.puntB.x - exces*this.vx;
            this.posicio.y = this.radi;
            xoc = true;
            this.vy = -this.vy;
        } 
        
        if (trajectoria.puntB.x + this.radi >= joc.amplada) { //Xoc lateral dret
            exces = ((trajectoria.puntB.x + this.radi) - joc.amplada)/this.vx;
            this.posicio.x = joc.amplada - this.radi;
            this.posicio.y = trajectoria.puntB.y - exces * this.vy;
            xoc = true;
            this.vx = -this.vx;
        }

        if (trajectoria.puntB.x - this.radi <= 0) { //Xoc lateral esquerra
            exces = (trajectoria.puntB.x - this.radi)/this.vx;
            this.posicio.x = this.radi;
            this.posicio.y = trajectoria.puntB.y - exces * this.vy;
            xoc = true;
            this.vx = -this.vx;
        }

        if (trajectoria.puntB.y - this.radi >= joc.alcada) { //Xoc lateral inferior
            joc.vides--;
            this.posicio.x = joc.amplada / 2;
            this.posicio.y = joc.alcada - joc.alcada / 4;
            xoc=true;
            this.vy = -this.vy;
            if (joc.vides !== 0) {
                joc.pala.posicio = new Punt((joc.canvas.width-60)/2,joc.canvas.height-15);
                joc.isCaigut = true;
                joc.cuentaAtras();
            }
        }
        
        // Part de codi que controla el xoc de la bola amb la pala
        let colisioPala = this.interseccioSegmentRectangle(trajectoria, joc.pala, false);
        if (colisioPala) {
            switch (colisioPala.vora) {
                case "superior":
                    // Determina la posició relativa a la pala on va passar la col·lisió
                    let palaCentroX = joc.pala.posicio.x + joc.pala.amplada / 2;
                    let impactPos = (this.posicio.x - palaCentroX) / (joc.pala.amplada / 2);
                    
                    // Ajusta vx i vy en funció de la posició d'impacte
                    let angleMax = Math.PI / 3;  // 60 graus
                    let angle = impactPos * angleMax;
                    let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    this.vx = speed * Math.sin(angle);
                    this.vy = -speed * Math.cos(angle);

                    break;
                case "esquerra":
                    this.vx = -Math.abs(this.vx); // Assegura que la bola reboti a l'esquerra
                    break;
                case "dreta":
                    this.vx = Math.abs(this.vx); // Assegura que la bola reboti a la dreta
                    break;
                case "inferior": // Ajusta la posició de la bola al segment superior de la pala en el cas de que reboti en la part inferior
                    this.posicio.y = joc.pala.posicio.y + joc.pala.alcada + this.radi+1; 
                    break;
            }
            xoc = true;
        }

        // Xoc amb els totxos del mur
        for (let c = 0; c < joc.mur.columnaCount && !xoc; c++) {
            for (let r = 0; r < joc.mur.filaCount && !xoc; r++) {
                const totxo = joc.mur.totxos[c][r];
                if (totxo && !totxo.tocat) {
                    let colisioTotxo = this.interseccioSegmentRectangle(trajectoria, totxo);
                    if (colisioTotxo) {
                        switch (colisioTotxo.vora) {
                            case "superior":
                            case "inferior":
                                this.vy = -this.vy;
                                break;
                            case "esquerra":
                            case "dreta":
                                this.vx = -this.vx;
                                break;
                        }
                        totxo.tocat = true;
                        xoc = true;
                    }
                    else {
                        // Verifica el rebot en les cantonades dels totxos
                        let colisioEsquina = this.interseccioSegmentEsquina(trajectoria, totxo);
                        if (colisioEsquina) {
                            // Cambia la direcció de la bola
                            this.vx = -this.vx;
                            this.vy = -this.vy;
                            totxo.tocat = true;
                            xoc = true;
                        }
                    }
                }
            }
        }
        
        if (!xoc) { // Condició que calcila la següent posició conforme la trajectoria
            this.posicio.x = trajectoria.puntB.x;
            this.posicio.y = trajectoria.puntB.y;
        }
    }
    
    /**
     * Funció que controla els rebots amb les cantonades dels totxos
     * @param {*} segment segment que representa la cantonada tocada
     * @param {*} rectangle mesures del bloc en el que fa referència la cantonada
     * @returns si s'ha tocat una cantonada o no
     */
    interseccioSegmentEsquina(segment, rectangle) {
        const esquinas = [
            new Punt(rectangle.posicio.x, rectangle.posicio.y),  // Cantonada superior izquierda
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y),  // Cantonada superior dreta
            new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada),  // Cantonada inferior esquerra
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada)  // Cantonada inferior dreta
        ];

        // For que controla l'impacte amb els punts de les cantonades
        for (let esquina of esquinas) {
            if (this.distancia(segment.puntB, esquina) <= this.radi) {
                return true;
            }
        }
        return false;
    }

    /**
     * Funció que controla l'impacte en tot un segment passat per paràmetre
     * @param {*} segment segment amb el que vol controlar-se l'impacte
     * @param {*} rectangle bloc del qual es vol controlar el rebot
     * @returns Informació genèrica del punt i segment que es tocarà
     */
    interseccioSegmentRectangle(segment, rectangle) {
        let puntI;
        let distanciaI;
        let puntIMin;
        let distanciaIMin = Infinity;
        let voraI;

        // Vora superior
        let segmentVoraSuperior = new Segment(
            new Punt(rectangle.posicio.x - this.radi, rectangle.posicio.y - this.radi),
            new Punt(rectangle.posicio.x + rectangle.amplada + this.radi, rectangle.posicio.y - this.radi)
        );
        //vora inferior
        let segmentVoraInferior = new Segment(
            new Punt(rectangle.posicio.x - this.radi, rectangle.posicio.y + rectangle.alcada + this.radi),
            new Punt(rectangle.posicio.x + rectangle.amplada + this.radi, rectangle.posicio.y + rectangle.alcada + this.radi)
        );
        // Vora esquerra
        let segmentVoraEsquerra = new Segment(
            new Punt(rectangle.posicio.x - this.radi, rectangle.posicio.y - this.radi),
            new Punt(rectangle.posicio.x - this.radi, rectangle.posicio.y + rectangle.alcada + this.radi)
        );
        // Vora dreta
        let segmentVoraDreta = new Segment(
            new Punt(rectangle.posicio.x + rectangle.amplada + this.radi, rectangle.posicio.y - this.radi),
            new Punt(rectangle.posicio.x + rectangle.amplada + this.radi, rectangle.posicio.y + rectangle.alcada + this.radi)
        );

        // Vora superior
        puntI = segment.puntInterseccio(segmentVoraSuperior);
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) {
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "superior";
            }
        }
        // Vora inferior
        puntI = segment.puntInterseccio(segmentVoraInferior);
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) {
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "inferior";
            }
        }
        
        // Vora esquerra
        puntI = segment.puntInterseccio(segmentVoraEsquerra);
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) {
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "esquerra";
            }
        }
        // Vora dreta
        puntI = segment.puntInterseccio(segmentVoraDreta);
        if (puntI) {
            distanciaI = Punt.distanciaDosPunts(segment.puntA, puntI);
            if (distanciaI < distanciaIMin) {
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "dreta";
            }
        }

        if (voraI) {
            return { pI: puntIMin, vora: voraI };
        }
    }

    /**
     * Funció que contorla la dinstància entre dos punts
     * @param {*} p1 punt 1
     * @param {*} p2 punt 2
     * @returns retorna la distància exacta
     */
    distancia(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }
}