/*
* CLASSE SEGMENT
*/

class Segment{
    constructor(puntA, puntB){
        this.puntA = puntA;
        this.puntB = puntB;
        this.color = "#3F3";
    }

    puntInterseccio(segment2){


        if (this.esTallen(segment2)){
            // converteix segment1 a la forma general de recta: Ax+By = C
            var a1 = this.puntB.y - this.puntA.y;
            var b1 = this.puntA.x -  this.puntB.x;
            var c1 = a1 * this.puntA.x + b1 * this.puntA.y;

            // converteix segment2 a la forma general de recta: Ax+By = C
            var a2 = segment2.puntB.y - segment2.puntA.y;
            var b2 = segment2.puntA.x - segment2.puntB.x;
            var c2 = a2 * segment2.puntA.x + b2 * segment2.puntA.y;

            //Punt interssecció 2 rectes
            // calculem el punt intersecció
            var d = a1*b2 - a2*b1;
            // línies paral·leles quan d és 0
            if (d != 0) {

                var x = (b2 * c1 - b1 * c2) / d;
                var y = (a1 * c2 - a2 * c1) / d;
                var puntInterseccio = new Punt(x, y);	// aquest punt pertany a les dues rectes
                  
                return puntInterseccio;
            }

            if(d==0){
                return false;
            }
            else{
                var x = (b2 * c1 - b1 * c2) / d;
                var y = (a1 * c2 - a2 * c1) / d;
                var puntInterseccio = new Punt(x, y);	// aquest punt pertany a les dues rectes
                if (this.contePunt(this.puntA, this.puntB, puntInterseccio)
                && this.contePunt(segment2.puntA, segment2.puntB, puntInterseccio)){
                    return puntInterseccio;
                }        

            } 

        }

    }
    esTallen (segment2){
        let s1p1 = this.puntA;
        let s1p2 = this.puntB;
        let s2p1 = segment2.puntA;
        let s2p2 = segment2.puntB;

        function control(punta, puntb, puntc){
            return(puntb.y-punta.y)*(puntc.x-punta.x)<(puntc.y-punta.y)*(puntb.x-punta.x);
        }
        return (control(s1p1,s1p2,s2p1) != control(s1p1,s1p2,s2p2) &&
                    control(s1p1,s2p1,s2p2) != control(s1p2,s2p1,s2p2));

    }
    contePunt(p1,p2, punt){
        return (this.valorDinsInterval(p1.x, punt.x, p2.x) || this.valorDinsInterval(p1.y, punt.y, p2.y)); 
    }
    	// funció interna
	valorDinsInterval(a, b, c) {  
        // retorna cert si b està entre a i b, ambdos exclosos
        if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) { // no podem fer a==b amb valors reals!!
            return false;
        }
        return (a < b && b < c) || (c < b && b < a);
    }
}
    
    

