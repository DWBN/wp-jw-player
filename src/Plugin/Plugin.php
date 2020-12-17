<?php


namespace DwbnWpJwPlayer\Plugin;


use DwbnWpJwPlayer\ShortCodes\Codes;

class Plugin {

    const version = '1.0.0';
    const plugin_name = 'dwbn-wp-jw-player';
    const admin_page = 'dwbn-wp-jw-player-admin';

    public function __construct($pluginFile) {;
        // shortcode Area
        add_action( 'init', [Codes::class, 'init']);

        add_action( "admin_init", array( $this, "admin_init") );

        add_action( 'wp_enqueue_scripts', array( Template::class, "includeAssets") );
    }

    public static function getCacheDirBase() {
        return __DIR__ . '/../../../../wp-content/uploads/' . self::plugin_name .  '/cache/';
    }

    public static function get_option($name, $default = '') {
        $options = get_option( self::plugin_name );
        return isset($options[$name]) ? $options[$name] : $default;
    }

    public function admin_init () {

    }

}