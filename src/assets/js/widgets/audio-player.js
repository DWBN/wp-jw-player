import Widgets from "js-widget-hooks";

Widgets.register('audio-player', function(elem){

    var audio = elem.querySelector('audio');
    var image = elem.querySelector('.js-start-stop');

    image.onclick = function () {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    };

    audio.addEventListener('play', function () {
        image.classList.add('k_audio_player__area--playing');
        audio.classList.add('k_audio--playing');
        image.title = 'Click to stop';

    });

    audio.addEventListener('pause', function () {
        image.classList.remove('k_audio_player__area--playing');
        image.title = 'Click to start';
    });


});