<?php

namespace DwbnWpJwPlayer\ShortCodes;

use DwbnWpJwPlayer\Plugin\Plugin;

class Codes {

    public static function init () {
        add_shortcode('jw_player', [__CLASS__, 'jw_player']);
        add_shortcode('k_audio_player', [__CLASS__, 'audio_player']);
    }


    public static function jw_player ($attributes) {

        extract( shortcode_atts( array(
            'poster_img' => Plugin::get_option('default_poster_image'),
            'hls_url' => ''
        ), $attributes ) );

        /** @var $poster_img */
        /** @var $hls_url */

        return '<div class="k_player js-dwbn-jw-widget" data-widgets="video-player" data-hls_url="' . $hls_url . '" data-poster_img="' . $poster_img . '" style="background-image: url(' . $poster_img . ');"></div>';
    }

    public static function audio_player ($attributes) {

        extract( shortcode_atts( array(
            'poster_img' => Plugin::get_option('default_poster_image'),
            'audio_url' => ''
        ), $attributes ) );

        /** @var $poster_img */
        /** @var $audio_url */

        return '<div class="k_audio_player js-dwbn-jw-widget" data-widgets="audio-player" data-audio="'. $audio_url .'">
            <div class="k_audio_player__area js-start-stop" title="Click to start">
                <img class="k_audio_player__cover" src="' . $poster_img . '" alt="">
            </div>
            <audio controls="controls" class="k_audio">
          <source src="' . $audio_url . '" type="audio/mpeg" />
        Your browser does not support the audio element.
        </audio></div>';
    }

}