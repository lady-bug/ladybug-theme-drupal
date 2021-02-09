# ladybug-theme-drupal
theme for drupal 8 and 9 using bootstrap 4

DRUPAL
-------
8.4 minimum

COMPOSER
---------
php composer.phar require --dev drush/drush:9.*

settings.php ... if using MAMP for drush to work
-------------------------------------------------
//'host' => 'localhost',
'host' => '127.0.0.1',
//'port' => '3306',
'port' => '80',
...
'unix_socket' => '/Applications/MAMP/tmp/mysql/mysql.sock'

GULP
----
watch, compile, drush rebuild and clear the cache:
- scss
- js
- twig
- yml
