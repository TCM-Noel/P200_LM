/*
* CLASSE PUNT
*/

class Punt {
    //constructor del punt
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    //funcio que calcula la distància entre dos punts
    static distanciaDosPunts(a, b) {
        return Math.sqrt(Math.pow(a.x-b.x,2)+ Math.pow(a.y-b.y,2));
    }
}