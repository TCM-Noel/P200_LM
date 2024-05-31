/*
* APLICACIÓ
*/
var puntuacionesStorage = []; // Inicializar la variable como un array vacío
var arrayMur = [];

$(document).ready(function() {

    const storedPuntuacions = localStorage.getItem('puntuaciones');
    if (storedPuntuacions) {
        $('#sensePuntuacio').hide();
        puntuacionesStorage = JSON.parse(storedPuntuacions);
        actualizarListaPuntuacions();
    } else {
        $('#sensePuntuacio').show();
    }

    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");
    
    joc = new Joc(myCanvas, ctx);

    prepararBotons();

    // Eventos para los botones de modalidad
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

function iniciarJuego(modalidad) {
    console.log(modalidad + " seleccionada");
    reproduceMusicaStop('startMusic');
    if(joc.musica){
        reproduceMusicaPlay('modeMusic');
    }
    joc.nomJugador = $('#nomJugador').val();
    joc.isGuardat = false;
    $('#menu').hide(); 
    $('#creadorNivell').hide();
    $('#principal').show(); 
    joc.inicialitza(modalidad); // Inicializa el juego con la modalidad seleccionada
    animacio();
}

function reproduceMusicaPlay(queMusica) {
    let startMusic = document.getElementById(`${queMusica}`);
    startMusic.play(); // Reproduce la música 
}

function reproduceMusicaStop(queMusica) {
    let startMusic = document.getElementById(`${queMusica}`);
    startMusic.currentTime = 0;
    startMusic.pause(); // Pausa la musica
}

function animacio() {
    joc.update();
    requestAnimationFrame(animacio);    
}

function tornarAlMenu(){ 
    location.href="index.html";
}

function afegirPuntuacio(nom, punts) {
    puntuacionesStorage.push({ namePlayer: nom, punts });
    localStorage.setItem('puntuaciones', JSON.stringify(puntuacionesStorage)); // Guardar en localStorage
    actualizarListaPuntuacions();
}

function actualizarListaPuntuacions() {
    //mètode bombolla per ordenar
    for(let i=0; i < puntuacionesStorage.length; i++){
        for(let j=1; j < puntuacionesStorage.length-i; j++){
            if(puntuacionesStorage[j-1].punts < puntuacionesStorage[j].punts){
                let aux = puntuacionesStorage[j-1];
                puntuacionesStorage[j-1] = puntuacionesStorage[j];
                puntuacionesStorage[j] = aux;
            }
        }
    }

    let llistaPuntuacions = document.getElementById('llistaPuntuacions');
    llistaPuntuacions.innerHTML = '';
    for (let i=0; i < puntuacionesStorage.length && i < 5; i++) {
        let puntuacioDiv = document.createElement('div'); // Crear un div
        puntuacioDiv.className = 'puntuacioFinal'; // Añadir la clase
        // Añadir el contenido del div con el nombre y la puntuación
        console.log(puntuacionesStorage)
        puntuacioDiv.innerHTML = `<span>${puntuacionesStorage[i]['namePlayer']}</span><span class="puntuacioJugador">${puntuacionesStorage[i].punts}</span>`;
        // Añadir el div a la lista
        llistaPuntuacions.appendChild(puntuacioDiv);
    }
}

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

function obrirCreadorNivell() {
    if(joc.musica){
        reproduceMusicaStop('startMusic');
        reproduceMusicaPlay('creatorMusic');
    }
    $('#menu').hide();
    $('#creadorNivell').show();
    crearMur();

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

    $('#btnCreadorReset').click(function() {
        resetBotons();
    });

    $('#btnCreadorJugar').click(function() {
        joc.creaNivell(arrayMur);
        reproduceMusicaStop('creatorMusic');
        iniciarJuego('modalidadPerso');
    });

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

function crearMur() {
    for (let i = 0; i < 5; i++) {
        arrayMur.push([]);
        $('#requadreCreadorNivell').append(`<div id="creadorFila${i}"></div>`);
        for (let j = 0; j < 10; j++) {
            arrayMur[i].push('');
            $(`#creadorFila${i}`).append(`<input type="button" class="btnCreador btnCreadorDesactivat" id="btnCreadorF${i}C${j}">`);
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