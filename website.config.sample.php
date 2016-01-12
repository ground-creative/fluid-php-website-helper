<?php

	/*
	| ---------------------------------------------------
	| Wesite Helper Cofiguration File
	| ---------------------------------------------------
	|
	*/

	return array
	(
		'_load'				=>	'\helpers\Website\Website::loadConfig' , 
		
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
		
		'auto_include_js_lang'	=>	true ,
		
		'use_app_prototype_js'	=>	true ,
		
		'debug_category'		=>	'Website Helper' ,
		
		'listener_priority'		=>	0
	);