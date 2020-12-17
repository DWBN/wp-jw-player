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


    console.log(elem.dataset);


    var playerCtnr = elem,
        restartTimeout,
        playRetries = 0,
        currentBufferWaitingTime = INITIAL_BUFFER_MAX_TIME,
        currentErrorWaitingTime = INITIAL_ERROR_MAX_TIME,
        playerId = playerCtnr.attr('id'),
        width =  parseInt(elem.data('width'), 10),
        height =  parseInt(elem.data('height'), 10),
        image = (app.root + elem.data('image')).replace('//', '/'),
        file = elem.data('file'),
        aspectratio = width + ':' + height,
        aspectPercent = height / width * 100,

        config = {
            width: '100%',
            cast:{ }
            , aspectratio: aspectratio
            , primary: "flash"
            , hlshtml: true
            // , skin:  app.root + 'js/jw6/skins/dwbn2.xml'
        },

        initPlayer = function (startRightAway) {

            if (config.playlist) {
                config.playlist = [{
                    sources : state.sources,
                    image: image
                }]
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

        hideAutoplay = function(){
            elem.find('.streaming-video-area__autoplay').hide();
        },

        showAutoplay = function(){
            elem.find('.streaming-video-area__autoplay').show();
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

            jwplayer(playerId).on('fullscreen', function (data) {
                state.fullscreen = data.fullscreen;
                update_status_every(data.fullscreen ? UPDATE_TIME_FULLSCREEN : getBestUpdateTime());
            });

            jwplayer(playerId).on('resize', function (stats) {
                if (state.fullscreen && $(document).width() > stats.width) {
                    state.fullscreen = false;
                    update_status_every(getBestUpdateTime());
                }
            });

            // if we start playing - hide the autoplay
            jwplayer(playerId).on('buffer', function(){
                hideAutoplay();

                // in case we get two buffer events shortly after each other
                clearTimeout(restartTimeout);

                // if it buffers too long, we assume that the stream broke down and do an automatic reset
                restartTimeout = setTimeout(function(){
                    initPlayer(true);
                    currentBufferWaitingTime = currentBufferWaitingTime * 2;
                }, currentBufferWaitingTime);
            });

            jwplayer(playerId).on('play', function(){
                hideAutoplay();
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

            // show the thank you, please donate if you can overlay
            jwplayer(playerId).on('complete', function(){
                showAutoplay();
                // elem.find('.streaming-video-area__overlay').show(); // taken out, because complete is also fired, once the stream breaks
            });
        }
    ;

    elem.css('padding-bottom', aspectPercent + '%');

    if (file) {
        config.file = file;
        config.image = image;
    } else {
        // general streaming fallback
        config.playlist = [{
            sources : state.sources,
            image: image
        }];
    }

    console.log('player config init %o', config);
    initPlayer();

    elem.click(function(){
        var state = jwplayer(playerId).getState().toLocaleLowerCase();

        switch (state){
            case 'error':
                jwplayer(playerId).setup(config);
                addPlayerEvents(playerId);

                jwplayer(playerId).on('ready', function(){
                    jwplayer(playerId).play(true);
                });
                break;
        }

    });

    // reset the player
    $(document).on('click', '.trigger--player-reset', initPlayer.bind(null, false));
});