<?php


namespace DwbnWpJwPlayer\Plugin;

class Admin {

    /**
     * Holds the values to be used in the fields callbacks
     */
    private $options;

    private $pluginFile;

    private $option_form = [];

    private $option_group_id;

    public function __construct($pluginFile) {

        $this->option_group_id = Plugin::plugin_name . '_group';

        $this->option_form = [
            'jw_settings' => array(
                'name' => 'Player Settings',
                'info' => '',
                'settings' => array(
                    [
                        'id' => 'jw_url',
                        'title' => 'Hosted JW Player Url',
                        'input' => 'text'
                    ],

                    [
                        'id' => 'default_poster_image',
                        'title' => 'Default Poster Image Url',
                        'input' => 'text'
                    ]
                )
            )
        ];

        $this->pluginFile = $pluginFile;

        add_action( 'admin_init', array( $this, 'page_init' ) );
        add_action( 'admin_menu', array( $this, 'add_plugin_pages' ) );

        add_filter( 'plugin_action_links_' . Plugin::plugin_name . '/' . Plugin::plugin_name . '.php', array( $this, 'settings_link' ) );
    }

    /**
     * Adds an additional link to the plugin list
     * @param $links
     * @return array
     */
    public function settings_link( $links) {
        // Build and escape the URL.
        $url = esc_url( add_query_arg(
            'page',
            Plugin::admin_page,
            get_admin_url() . 'admin.php'
        ) );

        // Create the link.
        $settings_link = '<a href="' . $url . '">' . __( 'Settings' ) . '</a>';

        // Adds the link to the end of the array.
        array_push($links, $settings_link);
        return $links;
    }

    public function add_plugin_pages() {
        // This page will be under "Settings"

        add_options_page(
            'JW Player Settings',
            'JW Player',
            'manage_options',
            Plugin::admin_page,
            array( $this, 'create_admin_page' )
        );
    }

    public function create_admin_page () {

        $this->options = get_option( Plugin::plugin_name );

        ?>
        <div class="wrap">
            <h1>JW Player Settings</h1>

            <p>Please do here the general jw player setup. The player itself can be included via shortcode:</p>
            <code>
                [jw_player hls_url="https://..."]
            </code>

            <p>Or optional:</p>
            <code>
                [jw_player hls_url="https://..." poster_img="/wp-content/..."]
            </code>

            <p>Or if you are only using a mp3 audio stream</p>
            <code>
                [k_audio_player audio_url="https://..." poster_img="/wp-content/..."]
            </code>

            <form method="post" action="options.php">
                <?php
                // This prints out all hidden setting fields
                settings_fields( $this->option_group_id );
                do_settings_sections( Plugin::admin_page );
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }

    /**
     * Register and add settings
     */
    public function page_init() {
        register_setting(
            $this->option_group_id, // Option group
            Plugin::plugin_name, // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        foreach ($this->option_form as $section_id => $section_config) {
            add_settings_section(
                $section_id, // ID
                $section_config['name'], // Title
                array( $this, 'print_section_info' ), // Callback
                Plugin::admin_page
            );

            foreach ($section_config['settings'] as $setting) {
                add_settings_field(
                    $setting['id'], // ID
                    $setting['title'], // Title
                    array( $this, $setting['input'] . '_callback' ), // Callback
                    Plugin::admin_page, // Page
                    $section_id, // Section
                    $setting
                );
            }
        }
    }

    /**
     * Sanitize each setting field as needed
     *
     * @param array $input Contains all settings fields as array keys
     * @return array
     */
    public function sanitize( $input ) {
        $new_input = array();

        foreach ($this->option_form as $section_id => $section_config) {
            foreach ($section_config['settings'] as $setting) {
                $id = $setting['id'];
                if( isset( $input[$id] ) ) {
                    $new_input[$id] = sanitize_text_field($input[$id]);
                }
            }
        }

        return $new_input;
    }

    /**
     * @param array $setting The select settings
     */
    public function select_callback(array $setting){

        $id = $setting['id'];
        $value = isset( $this->options[$id] ) ? $this->options[$id] : '';
        $name = Plugin::plugin_name . "[$id]";

        usort($setting['options'], function($a, $b){

            if (strtoupper($a['label']) == strtoupper($b['label'])) return 0;

            return strtoupper($a['label']) > strtoupper($b['label']) ? 1 : -1;
        });

        $field = '<select name="' . $name . '" id="' . $id .'">';
        foreach($setting['options'] as $option){
            $field .= '<option value="' . esc_attr( $option['value'] ) . '"' . ( $value == $option['value'] ? ' selected' : '' ) .'>' . $option['label'] . '</option>';
        }
        $field .= "</select>";

        echo $field;
        self::print_field_info($setting);
    }

    /**
     * @param array $setting
     */
    public function text_callback(array $setting){
        $id = $setting['id'];
        $name = Plugin::plugin_name . "[$id]";
        $value = isset( $this->options[$id] ) ? $this->options[$id] : '';

        printf(
            '<input type="text" id="%s" name="%s" value="%s" placeholder="%s" />',
            $id, $name, esc_attr($value), array_key_exists('placeholder', $setting) ? $setting['placeholder'] : ''
        );
        self::print_field_info($setting);
    }

    /**
     * @param array $setting
     */
    public function textarea_callback(array $setting){
        $id = $setting['id'];
        $name = Plugin::plugin_name . "[$id]";
        $value = isset( $this->options[$id] ) ? $this->options[$id] : '';

        printf(
            '<textarea id="%s" name="%s" placeholder="%s">%s</textarea>',
            $id, $name, array_key_exists('placeholder', $setting) ? $setting['placeholder'] : '', esc_attr($value)
        );
        self::print_field_info($setting);
    }

    /**
     * @param array $setting
     */
    public function checkbox_callback (array $setting) {
        $id = $setting['id'];
        $name = Plugin::plugin_name . "[$id]";
        $value = isset( $this->options[$id] ) ? $this->options[$id] : '';

        printf(
            '<input type="checkbox" id="%s" name="%s" value="true"%s/>',
            $id, $name, $value ? ' checked' : ''
        );
        self::print_field_info($setting);
    }


    /**
     * Print the Section text
     * @param array $section
     */
    public function print_section_info(array $section) {
        echo $this->option_form[$section['id']]['info'];
    }

    private function print_field_info($setting) {
        if (isset($setting['info'])) {
            printf('<p><em>%s</em></p>', $setting['info']);
        }
    }

}