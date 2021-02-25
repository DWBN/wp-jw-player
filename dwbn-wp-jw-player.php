<?php
/*
Plugin Name: DWBN Player
Plugin URI: https://github.com/DWBN/wp-jw-player
Description: A simple plugin, which allows to include a hosted jw player powered responsive video player.
Version: 1.1.4
Author: Andreas Schönefeldt
Author URI: https://github.com/Andreas-Schoenefeldt
Contributors: Andreas Schönefeldt
Text Domain: dwbn-wp-jw-player
Domain Path: /languages
*/

use DwbnWpJwPlayer\Plugin\Admin;
use DwbnWpJwPlayer\Plugin\Plugin;

require __DIR__ . '/vendor/autoload.php';


$GLOBALS['dwbn-wp-jw-player'] = new Plugin(__FILE__);

if (is_admin()) {
    $my_admin_page = new Admin(__FILE__);
}