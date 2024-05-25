/*
* APLICACIÓ
*/

$(document).ready(function() {

    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");
    
    joc = new Joc(myCanvas, ctx);

    let colores = ['#4CF', '#8D1', '#D30'];
    for (let i = 1; i <= 3; i++) $(`#modo${i}`).css('color', `${colores[i-1]}`); 

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
        reproduceMusicaPlay('startMusic')
    });

    $('#desactivarVolum').click(function() {
        reproduceMusicaStop('startMusic')
    });

    function iniciarJuego(modalidad) {
        console.log(modalidad + " seleccionada");
        reproduceMusicaStop('startMusic')
        reproduceMusicaPlay('modeMusic')
        $('#menu').hide(); 
        $('#principal').show(); 
        joc.inicialitza(modalidad); // Inicializa el juego con la modalidad seleccionada
        animacio();
    }
});

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
    let llistaPuntuacions = document.getElementById('llistaPuntuacions');
    let puntuacio = document.createElement('div');
    //creem un element div amb la classe puntuacioFinal
    puntuacio.className = 'puntuacioFinal';
    //posem el nom i els punts dins l'element div
    puntuacio.innerHTML = `<span class="nomJugador">${nom}</span><span class="puntacioJugador">${punts}</span>`;
    //afegim l'element div a la llista de puntuacions
    llistaPuntuacions.appendChild(puntuacio);
}
