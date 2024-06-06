/*
* APLICACIÓ
*/
var puntuacionesStorage = []; // Array que guarda les puntuacions del localStorage
var arrayMur = []; // Array que es crea quan iniciem el mode personalitzat

/**
 * Funció que s'executa al iniciar el document
 */
$(document).ready(function() {

    // Part de codi que guarda les puntiacions del localStorage en cas de que hi hagin registres
    const storedPuntuacions = localStorage.getItem('puntuaciones');
    if (storedPuntuacions) {
        $('#sensePuntuacio').hide();
        puntuacionesStorage = JSON.parse(storedPuntuacions);
        actualizarListaPuntuacions();
    } else {
        $('#sensePuntuacio').show();
    }

    // Creador del canvas
    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");
    
    joc = new Joc(myCanvas, ctx); // Creador de la classe joc

    prepararBotons(); // Funció que prepara tots els botons del menú


    /**
     * Listeners dels diferents botons
     */
    $('#modo1').click(function() {
        iniciarJuego('modalidad1');
    });

    $('#modo2').click(function() {
        iniciarJuego('modalidad2');
    });
    
    $('#modo3').click(function() {
        iniciarJuego('modalidad3');
    });

    $('#creaNivell').click(function() {
        obrirCreadorNivell();
    });
    
    $('#activarVolum').click(function() {
        joc.musica=true;
        reproduceMusicaPlay('startMusic');
    });

    $('#desactivarVolum').click(function() {
        joc.musica=false;
        reproduceMusicaStop('startMusic');
    });
});

/**
 * Funció que s'executa quan es selecciona una modalitat o es crea el nivell en el creador de nivells
 * Amaga el menu o el creador de nivell i mostra el tauler de joc. Crida a la funcio "inicialitza" del joc.
 * @param modalidad paràmetre que reb la modalitat seleccionada 
 */
function iniciarJuego(modalidad) {
    reproduceMusicaStop('startMusic');
    if(joc.musica){
        reproduceMusicaPlay('modeMusic');
    }
    joc.nomJugador = $('#nomJugador').val();
    joc.isGuardat = false;
    $('#menu').hide(); 
    $('#creadorNivell').hide();
    $('#principal').show(); 
    joc.inicialitza(modalidad); // Inicialitza el joc en la modalitat seleccionada
    animacio();
}

/**
 * Funció que activa la música
 * @param {*} queMusica paràmetre que defineix la cançó a reproduir
 */
function reproduceMusicaPlay(queMusica) {
    let startMusic = document.getElementById(`${queMusica}`);
    startMusic.play(); 
}

/**
 * Funció que atura la música
 * @param {*} queMusica paràmetre que defineix la cançó a aturar
 */
function reproduceMusicaStop(queMusica) {
    let startMusic = document.getElementById(`${queMusica}`);
    startMusic.currentTime = 0;
    startMusic.pause(); 
}

/**
 * Funció per inicialitzar el bucle d'animació
 */
function animacio() {
    joc.update();
    requestAnimationFrame(animacio);    
}

/**
 * Funció que es fa servir per tornar al menú principal
 */
function tornarAlMenu(){ 
    location.href="index.html";
}

/**
 * Funció que guarda una puntuació al localStorage
 * @param {*} nom Paràmetre que indica el nom del jugador 
 * @param {*} punts Paràmetre que indica els punts del jugador
 */
function afegirPuntuacio(nom, punts) {
    puntuacionesStorage.push({ namePlayer: nom, punts });
    localStorage.setItem('puntuaciones', JSON.stringify(puntuacionesStorage)); // Guardar en localStorage
    actualizarListaPuntuacions();
}

/**
 * Funció que actualitza el panell de puntuacions
 */
function actualizarListaPuntuacions() {
    // Recursivitat que endreça els resultats del panell de puntuacions
    for(let i=0; i < puntuacionesStorage.length; i++){
        for(let j=1; j < puntuacionesStorage.length-i; j++){
            if(puntuacionesStorage[j-1].punts < puntuacionesStorage[j].punts){
                let aux = puntuacionesStorage[j-1];
                puntuacionesStorage[j-1] = puntuacionesStorage[j];
                puntuacionesStorage[j] = aux;
            }
        }
    }

    // Part de codi que afegeix la puntuació al div de puntuacions
    let llistaPuntuacions = document.getElementById('llistaPuntuacions'); 
    llistaPuntuacions.innerHTML = '';
    for (let i=0; i < puntuacionesStorage.length && i < 5; i++) {
        let puntuacioDiv = document.createElement('div'); // Crea un div
        puntuacioDiv.className = 'puntuacioFinal'; // Afegim la classe
        // Afegim el contingut del div amb el nom i la puntuació
        puntuacioDiv.innerHTML = `<span>${puntuacionesStorage[i]['namePlayer']}</span><span class="puntuacioJugador">${puntuacionesStorage[i].punts}</span>`;
        // Afegim el div a la llista
        llistaPuntuacions.appendChild(puntuacioDiv);
    }
}

/**
 * Funciño que li dona els colors i funcionalitats als botons del menú
 */
function prepararBotons() {
    let colores = ['#36a3cc', '#6aa01e', '#9f3212']
    for (let i = 1; i <= 3; i++) $(`#modo${i}`).css({
        'color': `${colores[i-1]}`,
        'pointer-events': 'none'
    });
    $('#creaNivell').css({
        'pointer-events': 'none',
        'color': '#838383'
    })
    $('#nomJugador').on('keyup', () => {
        let colores = [];
        let eventos = 'none';
        let colorCrearNivell = '#838383'
        if ($('#nomJugador').val() != "") {
            colores = ['#4CF', '#8D1', '#D30'];
            eventos = 'all'
            colorCrearNivell = '#aaaaaa'
        } else {
            colores = ['#36a3cc', '#6aa01e', '#9f3212']
            eventos = 'none'
            colorCrearNivell = '#838383'
        }
        for (let i = 1; i <= 3; i++) $(`#modo${i}`).css({
            'color': `${colores[i-1]}`,
            'pointer-events': `${eventos}`
        });
        $('#creaNivell').css({
            'pointer-events': `${eventos}`,
            'color': `${colorCrearNivell}`
        })
    });
}

/**
 * Funció que obre el creador de nivells
 */
function obrirCreadorNivell() {
    if(joc.musica){ // Si la música està activa, aquesta sona
        reproduceMusicaStop('startMusic');
        reproduceMusicaPlay('creatorMusic');
    }
    $('#menu').hide(); 
    $('#creadorNivell').show();
    crearMur(); // Funció que crea els inputs del creador de nivells

    // Listener que retorna al jugdor al menú, borrant els botons del creador de nivells i cambiant la música
    $('#btnCreadorVolver').click(() => {
        resetBotons();
        if(joc.musica){
            reproduceMusicaStop('creatorMusic');
            reproduceMusicaPlay('startMusic');
        }
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 10; j++) {
                $(`#btnCreadorF${i}C${j}`).remove();
            }
        }
        $('#menu').show();
        $('#creadorNivell').hide();
    })

    // Listener que reseteja el taulell del creador de nivells
    $('#btnCreadorReset').click(function() {
        resetBotons();
    });

    // Botó que envia l'array creat a l'hora de fer el mur personalitzat a joc. Inicialització d'aquest.
    $('#btnCreadorJugar').click(function() {
        joc.creaNivell(arrayMur);
        reproduceMusicaStop('creatorMusic');
        iniciarJuego('modalidadPerso');
    });

    /**
     * Funció interna que reseteja els botons del taulell
     * Busca la classe "btnCreadorActivat" cambiant-la per "btnCreadorDesactivat" i buidant aquella posició de l'array.
     */
    function resetBotons() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 10; j++) {
                if ($(`#btnCreadorF${i}C${j}`).hasClass('btnCreadorActivat')) {
                    $(`#btnCreadorF${i}C${j}`).removeClass('btnCreadorActivat');
                    $(`#btnCreadorF${i}C${j}`).addClass('btnCreadorDesactivat');
                    arrayMur[i][j] = '';
                }
            }
        }
    }
}

/**
 * Funció que crea inputs i omple posicions de l'array segons aquest es va recorrent
 */
function crearMur() {
    for (let i = 0; i < 5; i++) {
        arrayMur.push([]);
        $('#requadreCreadorNivell').append(`<div id="creadorFila${i}"></div>`);
        for (let j = 0; j < 10; j++) {
            arrayMur[i].push('');
            $(`#creadorFila${i}`).append(`<input type="button" class="btnCreador btnCreadorDesactivat" id="btnCreadorF${i}C${j}">`);
            // Listener dels inputs que posa els inputs activats o desactivats segons el seu estat. Omple o buida la posició de l'array a la vegada
            $(`#btnCreadorF${i}C${j}`).click( () => { 
                if ($(`#btnCreadorF${i}C${j}`).hasClass('btnCreadorActivat')) {
                    $(`#btnCreadorF${i}C${j}`).removeClass('btnCreadorActivat')
                    arrayMur[i][j] = '';
                } else {
                    $(`#btnCreadorF${i}C${j}`).addClass('btnCreadorActivat')
                    arrayMur[i][j] = 'a';
                }
            })
        }
    }
    
}