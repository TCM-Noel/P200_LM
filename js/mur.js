class Mur {
    constructor(ctx, nivell) {
        this.ctx = ctx; // context per dibuixar
        this.totxos = []; // llista de totxos
        this.nivell = nivell; // nivell actual
        this.defineixNivells(); // defineix els nivells de totxos
        this.generaMur(); // genera el mur de totxos
    }

    generaMur() {
        let definicioNivell = this.nivells[this.nivell];
        // crea els totxos segons la definició del nivell
        for (let i = 0; i < definicioNivell.totxos.length; i++) {
            for (let j = 0; j < definicioNivell.totxos[i].length; j++) {
                if (definicioNivell.totxos[i][j] === 'a') {
                    let x = j * (22 + 2) + 1; // calcula la posició x
                    let y = i * (10 + 2) + 1; // calcula la posició y
                    let totxo = new Totxo(new Punt(x, y), 22, 10);
                    totxo.color = definicioNivell.color;
                    this.totxos.push(totxo);
                }
            }
        }
    }

    draw() {
        // dibuixa cada totxo que no ha estat tocat
        for (let totxo of this.totxos) {
            totxo.draw(this.ctx);
        }
    }

    defineixNivells() {
        // defineix els nivells dels mur amb colors i disposicions diferents
        this.nivells = [
            // nivell 1
            {
                color: "#4CF",
                totxos: [
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                ]
            },
            // nivell 2
            {
                color: "#8D1",
                totxos: [
                    "aaaaaaaaaaaa",
                    "     aa     ",
                    "   aaaaaa   ",
                    "   aaaaaa   ",
                    "     aa     ",
                ]
            },
            // nivell 3
            {
                color: "#D30",
                totxos: [
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