<?php


namespace DwbnWpJwPlayer\Plugin;


use DwbnWpJwPlayer\ShortCodes\Codes;

class Plugin {

    const version = '1.0.2';
    const plugin_name = 'dwbn-wp-jw-player';
    const admin_page = 'dwbn-wp-jw-player-admin';
    /**
     * @var string
     */
    private static $cssNamespace;
    /**
     * @var string
     */
    private static $jsNamespace;
    /**
     * @var string
     */
    private static $jsJwNamespace;

    private $pluginFile;

    public function __construct($pluginFile) {

        $this->pluginFile = $pluginFile;

        self::$cssNamespace = self::plugin_name . '-style';
        self::$jsNamespace = self::plugin_name . '-js';
        self::$jsJwNamespace = self::plugin_name . '-jw-js';

        // shortcode Area
        add_action( 'init', [Codes::class, 'init']);
        add_action( "admin_init", array( $this, "admin_init") );
        add_action( 'wp_enqueue_scripts', array( $this, "init_assets") );
    }

    public static function getCacheDirBase() {
        return __DIR__ . '/../../../../wp-content/uploads/' . self::plugin_name .  '/cache/';
    }

    public static function get_option($name, $default = '') {
        $options = get_option( self::plugin_name );
        return isset($options[$name]) ? $options[$name] : $default;
    }

    public function init_assets () {

        if (self::get_option('jw_url')) {
            wp_register_script(self::$jsJwNamespace, self::get_option('jw_url'));
            wp_enqueue_script(self::$jsJwNamespace);
        }

        wp_register_style(self::$cssNamespace, plugins_url('assets/css/frontend.css', $this->pluginFile));
        wp_enqueue_style(self::$cssNamespace);

        wp_register_script(self::$jsNamespace, plugins_url('assets/js/app.js', $this->pluginFile));
        wp_enqueue_script(self::$jsNamespace);
    }

    public function admin_init () {

    }

}