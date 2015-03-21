<?php

	if (!class_exists('Timber')){
		add_action( 'admin_notices', function(){
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . admin_url('plugins.php#timber') . '">' . admin_url('plugins.php') . '</a></p></div>';
		});
		return;
	}

	/**
	* 	Add custom timber routes
	*/
	/*Timber::add_route('news/page/:paged', function($params){
    	Timber::load_template('page-news.php', false, 200, $params);
	});*/

	/*
	* Get First image in the content of a post.
	*/
	function get_relative_link($link) {
		echo wp_make_link_relative($link);
	}

	add_action('make_link_relative', 'get_relative_link');
	

	// Allow group write permissions on new files
	umask(0002);

	class GPompPortfolio extends TimberSite {

		function __construct(){
			add_theme_support('post-formats');
			add_theme_support('post-thumbnails');
			add_theme_support('menus');
			add_theme_support('soil-clean-up');

			add_filter('timber_context', array($this, 'add_to_context'));
			add_filter('get_twig', array($this, 'add_to_twig'));
			add_filter('wp_handle_upload', array($this, 'handle_upload'));

			update_option('large_size_w', 1100);
			update_option('large_size_h', 1920);

			add_filter('pre_site_transient_update_core', array($this, 'disable_updates'));
			add_filter('pre_site_transient_update_plugins', array($this, 'disable_updates'));
			add_filter('pre_site_transient_update_themes', array($this, 'disable_updates'));

			add_action('init', array($this, 'register_post_types'));			
			add_action('init', array($this, 'register_shortcodes'));			

			add_action('admin_menu', array($this, 'remove_menu'));	

			// This function call may trigger some actions to fire, which may
			// add scripts and such to the header queue
			get_header();

			parent::__construct();
		}

		function register_post_types(){
			//this is where you can register custom post types
			register_post_type( 'project',
				array(
					'labels' => array(
						'name' => __( 'Project' ),
						'singular_name' => __( 'Project' )
					),
					'public' => true,
					'has_archive' => false,
					'capability_type' => 'post',
					'rewrite' => array(
						'slug' => 'projects',
					)
				)
			);
		}

		function block_button_function($atts) {
			extract( shortcode_atts( array(
				'class' => '',
				'link' => '',
				'text' => ''
			), $atts ) );
			return do_shortcode( 	'<div class="enclosed-button">
										<a target="_blank" href="'.$link.'" class="mainButton ctn-button '.$class.'">
											<div class="inner-button">
										        <div class="bg1"></div>
										        <div class="bg2"></div>
										        <div class="container-text">
										          <div class="txt">'.$text.'</div>
										        </div>
										    </div>
										</a>
									</div>' );
		}

		function block_icon_function($atts) {
			extract( shortcode_atts( array(
				'icon' => ''
			), $atts ) );
			return do_shortcode( '<span class="icon-'.$icon.'"></span>' );
		}

		function register_shortcodes() {
			add_shortcode( 'block-icon', array($this, 'block_icon_function') );
			add_shortcode( 'block-button', array($this, 'block_button_function') );
		}

		function register_taxonomies(){
			//this is where you can register custom taxonomies
		}

		function add_to_context($context){
			$context['menu'] = new TimberMenu();
			$context['site'] = $this;

			return $context;
		}

		function add_to_twig($twig){
			$twig->addExtension(new Twig_Extension_StringLoader());
			$twig->addFilter('trailing_slash', new Twig_Filter_Function(array($this, 'add_trailing_slash')));
			return $twig;
		}

		function add_trailing_slash($text) {
			return rtrim($text, '/') . '/';
		}

		function remove_menu() {
			remove_menu_page('edit.php');
			remove_menu_page('edit-comments.php');
			remove_submenu_page( 'index.php', 'update-core.php' );
			remove_submenu_page('plugins.php', 'plugin-install.php');
		}

		/**
		 * Due to the fact we manage WordPress and related plugins via Composer
		 * we do not want the WordPress admin panel to report updates. All updates
		 * should be made in composer.json and then deployed to each environment.
		 *
		 * @return object
		 */
		function disable_updates() {
			global $wp_version;
			return (object) array(
				'last_checked' => time(),
				'version_checked' => $wp_version,
			);
		}

		/**
		 * Reduce all upload images to maximum size and quality
		 *
		 * @param $params
		 *
		 * @internal param $init
		 * @return mixed
		 */
		function handle_upload($params) {
			$filePath = $params['file'];
			if ((!is_wp_error($params)) && file_exists($filePath) && in_array($params['type'], array('image/png','image/gif','image/jpeg'))) {
				$quality                        = 85;
				list($largeWidth, $largeHeight) = array( get_option('large_size_w'), get_option('large_size_h'));
				list($oldWidth, $oldHeight)     = getimagesize($filePath);
				list($newWidth, $newHeight)     = wp_constrain_dimensions($oldWidth, $oldHeight, $largeWidth, $largeHeight);
				$resizeImageResult = image_resize($filePath, $newWidth, $newHeight, false, null, null, $quality);
				unlink($filePath);
				if (!is_wp_error($resizeImageResult)) {
					$newFilePath = $resizeImageResult;
					rename($newFilePath, $filePath);
				} else {
					$params = wp_handle_upload_error(
						$filePath,
						$resizeImageResult->get_error_message()
					);
				}
			}
			return $params;
		}

	}

	new GPompPortfolio();
