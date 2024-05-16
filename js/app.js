/*
* APLICACIÓ
*/

$(document).ready(function() {

    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");

    joc = new Joc(myCanvas, ctx);

    $('#startButton').click(function() {
        $('#startButton').hide(); // Oculta el botón de inicio
        $('#modalidades').show(); // Muestra las modalidades
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
        $('#menu').hide(); // Oculta el menú
        $('#principal').show(); // Muestra el canvas
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