<?php

	/*
	| ---------------------------------------------------
	| Wesite Helper Cofiguration File
	| ---------------------------------------------------
	*/

	return array
	(
		'_load'				=>	'\helpers\Website\Manager::loadConfig' , 
		
		'controllers'			=>	[ 'main' ] ,
		
		'xml_config_path'		=>	ptc_path( 'xml' ) . '/config' ,
		
		'language_files_path'	=>	ptc_path( 'xml' ) . '/lang' ,
		
		'views_path'			=>	ptc_path( 'views' ) ,
		
		'lang_param'			=>	'_lang' ,
		
		'resources_param'		=>	'_resources' ,
		
		'data_param'			=>	'_data' ,
		
		'elements_param'		=>	'_elements' ,
		
		//'current_route_param'	=>	'_currentRoute' ,	// DEPRECATED
		
		//'current_page_param'	=>	'_currentPage' ,	// DEPRECATED
		
		'meta_tags_param'		=>	'_metatags' ,
		
		'router_param'			=>	'_router' ,
		
		//'current_path_param'	=>	'_path' ,			// DEPRECATED
		
		'auto_include_js_lang'	=>	true ,
		
		'use_app_prototype_js'	=>	true ,
		
		'debug_category'		=>	'Website Helper' ,
		
		'listener_priority'		=>	0 ,
		
		'app_prototype_helpers'	=>	'Facebook' // add more libraries separated by "|"
	);