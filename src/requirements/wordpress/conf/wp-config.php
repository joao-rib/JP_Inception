<?php
define('DB_NAME', getenv('WORDPRESS_DB_NAME')); #default: wordpress
define('DB_USER', getenv('WORDPRESS_DB_USER')); #default: defaultuser
define('DB_HOST', getenv('WORDPRESS_DB_HOST')); #default: mariadb
define('DB_PASSWORD', trim(file_get_contents(getenv('WORDPRESS_DB_PASSWORD_FILE'))));

define('WP_DEBUG', true); # Enable debug mode in Wordpress
define('WP_DEBUG_LOG', true); # Enable writing logs to a log file
define('WP_DEBUG_DISPLAY', true); # Enable displaying errors in browser

define('WP_HOME', 'https://' . getenv('DOMAIN_NAME')); #default: https://joao-rib.42.fr
define('WP_SITEURL', 'https://' . getenv('DOMAIN_NAME')); #default: https://joao-rib.42.fr

$table_prefix = 'wp_'; # For database tables

if (! defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/'); #default: This file's path
}
require_once ABSPATH . 'wp-settings.php'; # Load Wordpress bootstrapping tools into this directory, once