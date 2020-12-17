import Widgets from 'js-widget-hooks';

const INITIAL_BUFFER_MAX_TIME = 5000; // the initial waiting time on buffer state before reload
const INITIAL_ERROR_MAX_TIME = 500; // the initial waiting time on error state before reload
const MAX_PLAY_RETRIES = 5;

const FINAL_ERROR_MESSAGES = [
    'You do not have permission to access this content', // legacy error?
    'There was a problem providing access to protected content.',
    'no level found in manifest'
];

Widgets.register('video-player', function(elem){

    var playerCtnr = elem,
        restartTimeout,
        playRetries = 0,
        currentBufferWaitingTime = INITIAL_BUFFER_MAX_TIME,
        currentErrorWaitingTime = INITIAL_ERROR_MAX_TIME,
        playerId = playerCtnr.id || 'player' + Math.round(Math.random() * 1000),
        width = 889,
        height = 500,
        image = elem.dataset.poster_img,
        file = elem.dataset.hls_url,
        aspectratio = width + ':' + height,
        aspectPercent = height / width * 100,

        config = {
            width: '100%',
            cast: { },
            aspectratio: aspectratio,
            // primary: "flash",
            hlshtml: true,
            playlist: [{
                sources: [{file: file}],
                image: image
            }]
            // , skin:  app.root + 'js/jw6/skins/dwbn2.xml'
        },

        initPlayer = function (startRightAway) {

            if (!playerCtnr.id) {
                playerCtnr.id = playerId;
            }

            jwplayer(playerId).setup(config);
            addPlayerEvents(playerId);

            if (startRightAway) {
                jwplayer(playerId).on('ready', function (viewable) {
                    if (viewable && playRetries < MAX_PLAY_RETRIES) {
                        playRetries++;

                        if (playRetries > 1) {
                            jwplayer(playerId).play();
                        } else {
                            // wait half a second, if the first restart went wrong already
                            window.setTimeout(function () {
                                jwplayer(playerId).play();
                            }, 500)
                        }

                        console.log('Automated Player Reset & Restart %o/%o', playRetries, MAX_PLAY_RETRIES);
                    }
                });
            }

        },

        addPlayerEvents = function(playerId){
            if (window.location.hash === '#debug') {
                jwplayer(playerId).on('all', function (eventName, eventData) {
                    if ( ['time', 'userActive', 'userInactive', 'viewable'].indexOf(eventName) < 0) {
                        console.log("%o - %o", eventName, eventData);
                        // fullscreen - fullscreen: true - false
                        // resize - sometimes the fullscreen fall does not come, then resize definetley means, that the player is small again
                    }
                });
            }

            // if we start playing - hide the autoplay
            jwplayer(playerId).on('buffer', function(){

                // in case we get two buffer events shortly after each other
                clearTimeout(restartTimeout);

                // if it buffers too long, we assume that the stream broke down and do an automatic reset
                restartTimeout = setTimeout(function(){
                    initPlayer(true);
                    currentBufferWaitingTime = currentBufferWaitingTime * 2;
                }, currentBufferWaitingTime);
            });

            jwplayer(playerId).on('play', function(){
                clearTimeout(restartTimeout);
                currentBufferWaitingTime = INITIAL_BUFFER_MAX_TIME;
                currentErrorWaitingTime = INITIAL_ERROR_MAX_TIME;
                playRetries = 0;
            });

            jwplayer(playerId).on('error', function(err){

                console.log(err);

                let isFinalError = false;
                isFinalError = FINAL_ERROR_MESSAGES.some(function (msgPart) {
                    if (err.sourceError && err.sourceError.reason && err.sourceError.reason.indexOf(msgPart) > -1) {
                        return true;
                    }

                    return err.message.indexOf(msgPart) > -1;
                });

                clearTimeout(restartTimeout);

                if (!isFinalError) {
                    restartTimeout = setTimeout(function () {
                        initPlayer(true);
                        currentErrorWaitingTime = currentErrorWaitingTime * 2;
                    }, currentErrorWaitingTime);
                }
            });
        }
    ;

    console.log('player config init %o', config);
    initPlayer();

    // reset the player button
    // $(document).on('click', '.trigger--player-reset', initPlayer.bind(null, false));
});