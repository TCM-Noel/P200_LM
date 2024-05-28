var puntuacionesStorage = []; // Inicializar la variable como un array vacío

$(document).ready(function() {
    
    const storedPuntuacions = localStorage.getItem('puntuaciones');
    if (storedPuntuacions) {
        puntuacionesStorage = JSON.parse(storedPuntuacions);
        actualizarListaPuntuacions();
    }
    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");
    
    let startMusic = document.getElementById("startMusic");
    let modeMusic = document.getElementById("modeMusic");
    let winMusic = document.getElementById("winMusic");
    let loseMusic = document.getElementById("loseMusic");
    joc = new Joc(myCanvas, ctx);

    $('#startButton').click(function() {
        $('#startButton').hide(); // Oculta el botón de inicio
        $('#modalidades').show(); // Muestra las modalidades
        startMusic.play(); // Reproduce la música de inicio
    });

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

    $('#activarVolum').click(function() {
        reproduceMusicaPlay('startMusic');
    });

    $('#desactivarVolum').click(function() {
        reproduceMusicaStop('startMusic');
    });

    function iniciarJuego(modalidad) {
        console.log(modalidad + " seleccionada");
        reproduceMusicaStop('startMusic');
        reproduceMusicaPlay('modeMusic');
        $('#menu').hide(); 
        $('#principal').show(); 
        joc.inicialitza(modalidad); // Inicializa el juego con la modalidad seleccionada
        animacio();
    }
});

function animacio() {
    joc.update();
    requestAnimationFrame(animacio);    
}

function tornarAlMenu(){ 
    location.href="index.html";
}

function afegirPuntuacio(nom, punts) {
    puntuacionesStorage.push({ nom, punts });
    localStorage.setItem('puntuaciones', JSON.stringify(puntuacionesStorage)); // Guardar en localStorage
    actualizarListaPuntuacions();
}

function actualizarListaPuntuacions() {
    let llistaPuntuacions = document.getElementById('llistaPuntuacions');
    llistaPuntuacions.innerHTML = '';
    puntuacionesStorage.forEach(puntuacio => {
        let puntuacioDiv = document.createElement('div'); // Crear un div
        puntuacioDiv.className = 'puntuacioFinal'; // Añadir la clase
        // Añadir el contenido del div con el nombre y la puntuación
        puntuacioDiv.innerHTML = `<span class="nomJugador">${puntuacio.nom}</span><span class="puntuacioJugador">${puntuacio.punts}</span>`;
        // Añadir el div a la lista
        llistaPuntuacions.appendChild(puntuacioDiv);
    });
}
