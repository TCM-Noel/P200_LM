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

    update(pala, mur){

        let puntActual = this.posicio;
        let puntSeguent= new Punt(this.posicio.x + this.vx, // Punt següent x
                                  this.posicio.y + this.vy); // Punt següent y
        let trajectoria= new Segment(puntActual, puntSeguent); // Segment a recòrrer
        let exces;
        let xoc = false;
        
        //XOC AMB ELS LATERALS DEL CANVAS
            
        if(trajectoria.puntB.y - this.radi < 0){ //Xoc lateral superior
            exces = (trajectoria.puntB.y - this.radi)/this.vy;
            this.posicio.x = trajectoria.puntB.x - exces*this.vx;
            this.posicio.y = this.radi;
            xoc = true;
            this.vy = -this.vy;
        } 
        
        if ((trajectoria.puntB.x + this.radi >= joc.amplada) && (this.vx > 0)) { //Xoc lateral dret
            exces = ((trajectoria.puntB.x + this.radi) - joc.amplada)/this.vx;
            this.posicio.x = (joc.amplada - exces) * this.vx;
            this.posicio.y = trajectoria.puntB.y;
            xoc = true;
            this.vx = -this.vx;
        }

        if ((trajectoria.puntB.x - this.radi <= 0) && (this.vx < 0)) { //Xoc lateral esquerra
            exces = (trajectoria.puntB.x - this.radi)/this.vx;
            this.posicio.x = (trajectoria.puntB.x + exces) * this.vx;
            this.posicio.y = trajectoria.puntB.y;
            xoc = true;
            this.vx = -this.vx;
        }
        //FIXME:
        //Xoc lateral inferior
        if ((trajectoria.puntB.y - this.radi >= joc.alcada) && (this.vy>0)) {
            const bola = this;
            //setTimeout(function() {
                joc.vides--;
                console.log(joc.amplada / 2);
                console.log(joc.alcada - joc.alcada / 4 );
                bola.posicio.x = joc.amplada / 2;
                bola.posicio.y = joc.alcada - joc.alcada / 4;
                //bola.vx = 0;
                //bola.vy = 0;
            //}, 1000);
            xoc=true;
            this.vx = -1;
            this.vy = -1;
        }
        
        //Xoc amb la pala
        if (trajectoria.puntB.y + this.radi >= pala.posicio.y && trajectoria.puntB.y + this.radi <= pala.posicio.y + pala.alcada &&
            trajectoria.puntB.x >= pala.posicio.x && trajectoria.puntB.x <= pala.posicio.x + pala.amplada) {
            this.posicio.y = pala.posicio.y - this.radi;
            this.vy = -this.vy;
            xoc = true;
        }
        //Xoc amb els totxos del mur
        for (let c = 0; c < mur.columnaCount; c++) {
            for (let r = 0; r < mur.filaCount; r++) {
                const totxo = mur.totxos[c][r];
                if (!totxo.tocat && this.detectaXoc(totxo)) {
                    totxo.tocat = true;
                    this.vy = -this.vy; // Cambia la dirección de la bola
                    xoc = true;
                }
            }
        }
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
       let segmentVoraSuperior = new  Segment(rectangle.posicio,
           new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y));
       //vora inferior
      
       //vora esquerra
      
       //vora dreta
      

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
           }
       }
       //vora inferior
       
       //vora esquerra
      
       //vora dreta
       
       //Retorna la vora on s'ha produït la col·lisió, i el punt (x,y)
       if(voraI){
           return {pI: puntIMin, vora: voraI};
       }
    }

    distancia = function(p1,p2){
        return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
    }
    detectaXoc(totxo) {
        // Detectar si la bola colisiona con el totxo
        let xDist = Math.abs(this.posicio.x - totxo.posicio.x - totxo.amplada / 2);
        let yDist = Math.abs(this.posicio.y - totxo.posicio.y - totxo.alcada / 2);

        if (xDist > (totxo.amplada / 2 + this.radi) || yDist > (totxo.alcada / 2 + this.radi)) {
            return false;
        }

        if (xDist <= (totxo.amplada / 2) || yDist <= (totxo.alcada / 2)) {
            return true;
        }

        let cornerDistanceSq = Math.pow((xDist - totxo.amplada / 2), 2) +
                               Math.pow((yDist - totxo.alcada / 2), 2);

        return (cornerDistanceSq <= Math.pow(this.radi, 2));
    }
    
    
    
    /*

    TODO:Metodo que le reste una vida si toca el borde inferior del canvas

    segmento zona de abajo--> (0, canvas.height)   to   (canvas.width, canvas.height)

    si toca el segmento joc.vides--;

    si toca el segmento mou(joc.canvas.width/2,joc.canvas.height-joc.canvas.height/4)

    si toca el segmento restablecer velocidad:         this.vx = -0.5; this.vy = -0.5;
    */
}


