/*
* APLICACIÓ
*/

$(document).ready(function() {

    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");

<<<<<<< Updated upstream
=======
    let startMusic = document.getElementById("startMusic");
    let modeMusic = document.getElementById("modeMusic");
    let winMusic = document.getElementById("winMusic");
    let loseMusic = document.getElementById("loseMusic");
>>>>>>> Stashed changes
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

    function iniciarJuego(modalidad) {
        console.log(modalidad + " seleccionada");
        startMusic.pause(); 
        startMusic.currentTime = 0;
        modeMusic.play(); 
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
