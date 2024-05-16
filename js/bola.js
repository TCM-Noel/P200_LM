/*
* CLASSE BOLA
*/

class Bola {
    constructor(puntPosicio, radi) {
        this.radi = radi;
        this.posicio = puntPosicio;
        this.vx = -1;
        this.vy = -1;
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

        //FIXME:
        //Xoc lateral inferior
        if (trajectoria.puntB.y - this.radi >= joc.alcada) {
            joc.vides--;
            this.posicio.x = joc.amplada / 2;
            this.posicio.y = joc.alcada - joc.alcada / 4;
            xoc=true;
        }
        
        //Xoc amb la pala
        let colisioPala = this.interseccioSegmentRectangle(trajectoria, joc.pala);
        if (colisioPala) {
            switch (colisioPala.vora) {
                case "superior":
                case "inferior":
                    this.vy = -this.vy;
                    break;
                case "esquerra":
                case "dreta":
                    this.vx = -this.vx;
                    break;
            }
            xoc = true;
        }

        // Xoc amb els totxos del mur
        for (let c = 0; c < joc.mur.columnaCount; c++) {
            for (let r = 0; r < joc.mur.filaCount; r++) {
                const totxo = joc.mur.totxos[c][r];
                if (!totxo.tocat) {
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
                }
            }
        }

        if (!xoc) {
            this.posicio.x = trajectoria.puntB.x;
            this.posicio.y = trajectoria.puntB.y;
        }
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

/*
    TODO:Metodo que le reste una vida si toca el borde inferior del canvas

    segmento zona de abajo--> (0, canvas.height)   to   (canvas.width, canvas.height)

    si toca el segmento joc.vides--;

    si toca el segmento mou(joc.canvas.width/2,joc.canvas.height-joc.canvas.height/4)

    si toca el segmento restablecer velocidad:         this.vx = -0.5; this.vy = -0.5;
    */
