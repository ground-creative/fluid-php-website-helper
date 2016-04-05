 
<?php

	/*
	| ---------------------------------------------------
	| Wesite Helper Cofiguration File
	| ----------------------------------------------------------
	|
	| This file should hold details for all your database connections
	| Refer to http://phptoolcase.com/ptc-db-guide.html to 
	| understand all available options
	|
	*/

	return array
	(
		'_load'				=>	'\helpers\Website\Manager::loadConfig' , 
		
		'controllers'			=>	array( 'main' ) ,
		
		'xml_config_path'		=>	ptc_path( 'xml' ) . '/config' ,
		
		'language_files_path'	=>	ptc_path( 'xml' ) . '/lang' ,
		
		'views_path'			=>	ptc_path( 'views' ) ,
		
		'lang_param'			=>	'_lang' ,
		
		'resources_param'		=>	'_resources' ,
		
		'data_param'			=>	'_data' ,
		
		'elements_param'		=>	'_elements' ,
		
		'current_route_param'	=>	'_currentRoute' ,
		
		'current_page_param'	=>	'_currentPage' ,
		
		'meta_tags_param'		=>	'_metatags' ,
		
		'current_path_param'	=>	'_path' ,
		
		'auto_include_js_lang'	=>	true ,
		
		'use_app_prototype_js'	=>	true ,
		
		'debug_category'		=>	'Website Helper' ,
		
		'listener_priority'		=>	0 ,
		
		'app_prototype_helpers'	=>	'Facebook' // add more libraries separated by "|"
	);