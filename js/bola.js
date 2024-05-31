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

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    mou(x, y) {
        this.posicio.x += x;
        this.posicio.y += y;
    }

    update() {
        let puntActual = this.posicio;
        let puntSeguent = new Punt(this.posicio.x + this.vx, this.posicio.y + this.vy);
        let trajectoria = new Segment(puntActual, puntSeguent);
        let exces;
        let xoc = false;
        
        //XOC AMB ELS LATERALS DEL CANVAS
            
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
        
        //Xoc amb la pala
        let colisioPala = this.interseccioSegmentRectangle(trajectoria, joc.pala, false);
        if (colisioPala) {
            switch (colisioPala.vora) {
                case "superior":
                    // Determina la posición relativa en la pala donde ocurrió la colisión
                    let palaCentroX = joc.pala.posicio.x + joc.pala.amplada / 2;
                    let impactPos = (this.posicio.x - palaCentroX) / (joc.pala.amplada / 2);
                    
                    // Ajusta vx y vy en función de la posición de impacto
                    let angleMax = Math.PI / 3;  // 60 grados
                    let angle = impactPos * angleMax;
                    let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    this.vx = speed * Math.sin(angle);
                    this.vy = -speed * Math.cos(angle);

                    break;
                case "esquerra":
                    this.vx = -Math.abs(this.vx); // Asegurar que la bola rebote a la izquierda
                    //this.posicio.x = joc.pala.posicio.x - this.radi-1; // Mover la bola fuera de la pala
                    break;
                case "dreta":
                    this.vx = Math.abs(this.vx); // Asegurar que la bola rebote a la derecha
                    //this.posicio.x = joc.pala.posicio.x + joc.pala.amplada + this.radi+1; // Mover la bola fuera de la pala
                    break;
                case "inferior":
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
                        // Verificació colisió amb esquines totxos
                        let colisioEsquina = this.interseccioSegmentEsquina(trajectoria, totxo);
                        if (colisioEsquina) {
                            // Cambia la dirección de ambas componentes de la velocidad
                            this.vx = -this.vx;
                            this.vy = -this.vy;
                            totxo.tocat = true;
                            xoc = true;
                        }
                    }
                }
            }
        }
        
        if (!xoc) {
            this.posicio.x = trajectoria.puntB.x;
            this.posicio.y = trajectoria.puntB.y;
        }
    }
    
    interseccioSegmentEsquina(segment, rectangle) {
        const esquinas = [
            new Punt(rectangle.posicio.x, rectangle.posicio.y),  // Esquina superior izquierda
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y),  // Esquina superior derecha
            new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada),  // Esquina inferior izquierda
            new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada)  // Esquina inferior derecha
        ];

        for (let esquina of esquinas) {
            if (this.distancia(segment.puntB, esquina) <= this.radi) {
                return true;
            }
        }
        return false;
    }

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

    distancia(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }
}