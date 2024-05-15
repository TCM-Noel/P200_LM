class Bola {
    constructor(puntPosicio, radi) {
        this.radi = radi;
        this.posicio = puntPosicio;
        this.vx = -1;
        this.vy = -1;
        this.color = "#fff";
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    mou(x,y){
        this.posicio.x += x;
        this.posicio.y += y;
    }

    update(){

        let puntActual = this.posicio;
        let puntSeguent= new Punt(this.posicio.x + this.vx, // Punt següent x
                                  this.posicio.y + this.vy); // Punt següent y
        let trajectoria= new Segment(puntActual, puntSeguent); // Segment a recòrrer
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
        
        if (trajectoria.puntB.y + this.radi >= joc.alcada) { //Xoc lateral inferior
            exces = (trajectoria.puntB.y + this.radi)-joc.alcada/this.vy;
            this.posicio.x = trajectoria.puntB.x - exces*this.vx;
            this.posicio.y = joc.alcada - exces - this.radi;
            xoc = true;
            this.vy = -this.vy;
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

        //Xoc amb els totxos del mur
                    /*for (let c = 0; c < joc.mur.columnaCount; c++) {
                        for (let r = 0; r < joc.mur.filaCount; r++) {
                            const totxo = joc.mur.totxos[c][r];
                            if (!totxo.tocat && this.detectaXoc(totxo)) {
                                totxo.tocat = true;
                                this.vy = -this.vy; // Cambia la dirección de la bola
                                xoc = true;
                            }
                        }
                    }*/
        

        //Utilitzem el mètode INTERSECCIOSEGMENTRECTANGLE

        if (!xoc){
            this.posicio.x = trajectoria.puntB.x;
            this.posicio.y = trajectoria.puntB.y;
        }     
        
    }
    
    interseccioSegmentRectangle(segment, rectangle){

        //1r REVISAR SI EXISTEIX UN PUNT D'INTERSECCIÓ EN UN DELS 4 SEGMENTS
        //SI EXISTEIX, QUIN ÉS AQUEST PUNT
        //si hi ha més d'un, el més ajustat
        let puntI;
        let distanciaI;
        let puntIMin;
        let distanciaIMin = Infinity;
        let voraI;

        //calcular punt d'intersecció amb les 4 vores del rectangle
        //necessitem coneixer els 4 segments del rectangle
        //vora superior
        let segmentVoraSuperior = new Segment(
            new Punt(rectangle.posicio.x - this.radi, rectangle.posicio.y - this.radi),
            new Punt(rectangle.posicio.x + rectangle.amplada + this.radi, rectangle.posicio.y - this.radi),
        );
        //vora inferior
        let segmentVoraInferior = new Segment(
            new Punt(rectangle.posicio.x - this.radi, rectangle.posicio.y + rectangle.alcada + this.radi),
            new Punt(rectangle.posicio.x + rectangle.amplada + this.radi, rectangle.posicio.y + rectangle.alcada + this.radi)
        );
        //vora esquerra
        let segmentVoraEsquerra = new Segment(
            new Punt(rectangle.posicio.x - this.radi, rectangle.posicio.y - this.radi),
            new Punt(rectangle.posicio.x - this.radi, rectangle.posicio.y + rectangle.alcada + this.radi)
        );
        //vora dreta
        let segmentVoraDreta = new Segment(
            new Punt(rectangle.posicio.x + rectangle.amplada + this.radi, rectangle.posicio.y - this.radi),
            new Punt(rectangle.posicio.x + rectangle.amplada + this.radi, rectangle.posicio.y + rectangle.alcada + this.radi)
        );

        //2n REVISAR SI EXISTEIX UN PUNT D'INTERSECCIÓ EN UN DELS 4 SEGMENTS
        //SI EXISTEIX, QUIN ÉS AQUEST PUNT
        //si hi ha més d'n, el més ajustat
        
        //vora superior
        puntI = segment.puntInterseccio(segmentVoraSuperior);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "superior";
                /* return {pI: puntIMin, vora: voraI}; */
            }
        }
        //vora inferior
        puntI = segment.puntInterseccio(segmentVoraInferior);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "inferior";
                /* return {pI: puntIMin, vora: voraI}; */
            }
        }
        //vora esquerra
        puntI = segment.puntInterseccio(segmentVoraEsquerra);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "esquerra";
                /* return {pI: puntIMin, vora: voraI}; */
            }
        }
        //vora dreta
        puntI = segment.puntInterseccio(segmentVoraDreta);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "dreta";
                /* return {pI: puntIMin, vora: voraI};  */
            }
        }

        //Retorna la vora on s'ha produït la col·lisió, i el punt (x,y)
        if(voraI){
            return {pI: puntIMin, vora: voraI};
        }
    }

    distancia = function(p1,p2){
        return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
    }
}


