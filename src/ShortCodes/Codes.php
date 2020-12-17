<?php

namespace DwbnWpJwPlayer\ShortCodes;

use DwbnWpJwPlayer\Plugin\Plugin;

class Codes {

    public static function init () {
        add_shortcode('jw_player', [__CLASS__, 'jw_player']);
    }


    public static function jw_player ($attributes) {

        extract( shortcode_atts( array(
            'poster_img' => Plugin::get_option('default_poster_image'),
            'hls_url' => ''
        ), $attributes ) );

        /** @var $poster_img */
        /** @var $hls_url */

        return '<div class="k_player js-dwbn-jw-widget" data-widgets="video-player" data-hls_url="' . $hls_url . '" data-poster_img="' . $poster_img . '" style="background-image: url(' . $poster_img . ');">The JW player goes here.</div>';

    }

}