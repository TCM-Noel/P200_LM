/*
* APLICACIÓ
*/

$(document).ready(function() {
    var canvas = $('#joc')[0];
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var miJuego = new Joc(canvas, ctx);

        $('#startButton').click(function() {
            $('#menu').hide(); // Oculta el menú
            $('#principal').show(); // Muestra el canvas
            miJuego.inicialitza(); // Inicia el juego
        });
    }
});