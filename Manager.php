<?php

	namespace helpers\Website;

	class Manager
	{
		/**
		*
		*/	
		public static function _load( $options )
		{
			$controllers = $options[ 'controllers' ];
			ptc_listen( 'app.start' , function( ) use ( $controllers )
			{ 
				\helpers\Website\Manager::autoload( $controllers ); 
			} , $options[ 'listener_priority' ] );
			return $options;
		}
		/**
		*
		*/		
		public static function autoload( $controllers )
		{
			$controllers = ( is_array( $controllers ) ) ? $controllers : array( $controllers );
			\Router::group( 'website.autoload' , function( ) use ( $controllers )
			{
				$xml = simplexml_load_file( \App::option( 'website.xml_config_path' ) . '/routes.xml' );
				foreach ( $controllers as $controller )
				{
					static::controller( $controller , $xml );
				}
				if ( \App::option( 'website.auto_include_js_lang' ) )
				{
					\Router::get( '/js/website-helper/lang/{lang}.js' , function( $lang )
					{
						header( 'Content-Type: application/javascript' );
						if ( file_exists( \App::option( 'website.language_files_path' )  . '/' . $lang .'.js' ) )
						{
							ob_start( );
							require_once( \App::option( 'website.language_files_path' )  . '/' . $lang .'.js' );
							return ob_get_clean( );
						}
						else{ return 'var _lang = _lang || {"key":"file not found"};'; }
					} );
				}
				if ( \App::option( 'website.use_app_prototype_js' ) )
				{
					\Router::get( '/js/website-helper/app/{prototype}.js' , function( $prototype )
					{
						header( 'Content-Type: application/javascript' );
						ob_start( );
						require_once( realpath( dirname( __FILE__ ) )  . '/app.prototype.js/' . $prototype .'.js' );
						return ob_get_clean( );
						
					} )->where( 'prototype' , 'App|BaseModel|BaseController|BaseForm|BaseContainer|BaseElements|Validator' );
				}
				$helpers = \App::option( 'website.app_prototype_helpers' );
				if ( $helpers )
				{
					\Router::get( '/js/website-helper/app/helpers/{helper}.js' , function( $helper )
					{
						header( 'Content-Type: application/javascript' );
						ob_start( );
						require_once(  realpath( dirname( __FILE__ ) )  . '/app.prototype.js/helpers/' . $helper .'.js' );
						return ob_get_clean( );
						
					} )->where( 'helper' , $helpers );
				}
			} )->prefix( \App::env( ) );
		}
		/**
		*
		*/
		public static function getMetaTags( )
		{	
			return static::$_metatags;
		}
		/**
		*
		*/
		public static function setMetaTags( $pageID , $data )
		{	
			return static::$_metatags = new models\MetaTags( $pageID , $data );
		}
		/**
		*
		*/
		public static function page( $page )
		{	
			ptc_log( $page , 'Website page is been compiled!' , 
					\App::option( 'website.debug_category' ) . ' Action' );
			$xml = simplexml_load_file( \App::option( 'website.xml_config_path' ) . '/pages.xml' );
			$listeners = \Event::get( 'website' );
			if ( is_array( $listeners ) && isset( $listeners[ 'load_pages_xml' ] ) )
			{
				ptc_fire( 'website.load_pages_xml' , array( $page , &$xml ) );
			}
			$html = new Page( $page , $xml );
			return $html->compile( $page );
		}
		/**
		*
		*/
		public static function controller( $id , $xml )
		{
			$msg = 'Adding controller "' . $id . '" routes with website router helper!';
			ptc_log( $msg , '' , \App::option( 'website.debug_category' ) . ' Config' );
			$listeners = \Event::get( 'website' );
			if ( is_array( $listeners ) && isset( $listeners[ 'load_routes_xml' ] ))
			{
				ptc_fire( 'website.load_routes_xml' , array( $id , &$xml ) );
			}
			$routes = new Routes( $id , $xml );
			$routes->compile( );
		}
		/**
		*
		*/
		public static function setLang( $controllerID )
		{
			static::getLanguages( );
			if ( $lang = \App::storage( 'website.languages.' . $controllerID ) )
			{
				$event = \Event::getEvents( 'website' );
				if ( is_array( $event ) && ptc_array_get( $event , 'setlang' , false ) )
				{ 
					ptc_fire( 'website.setlang' , array( $controllerID , &$lang ) ); 
				}
				\App::storage( 'website.current_lang' , $lang );
				$fallback_key = static::$_fallbackLang;
				$fallback_lang = ( $fallback_key && $fallback_key != $controllerID ) ? 
							\App::storage( 'website.languages.' . $fallback_key ) : null;
				\App::storage( 'website.fallback_lang' , $fallback_lang );
				return true;
			}
			return false;
		}
		/**
		*
		*/
		public static function getLang( $param = 'suffix' )
		{
			return \App::storage( 'website.current_lang.' . $param );
		}
		/**
		*
		*/
		public static function getPath( $full = true )
		{
			return ( $full ) ? static::host( ) . \App::env( ) : static::host( );
		}
		/**
		*
		*/
		public static function host( )
		{
			if ( !static::$_urlPath )
			{
				$protocol = \Router::getProtocol( );
				static::$_urlPath = $protocol . '://' . $_SERVER[ 'HTTP_HOST' ];
			}
			return static::$_urlPath;
		}
		/**
		*
		*/
		public static function getRoute( $name , $relative = false )
		{
			$name = str_replace( '{current_lang}' , static::getLang( 'suffix' ) , $name );
			$path = ( $relative ) ? null : static::host( ) . \Module::location( );
			return $path . \Router::getRoute( $name );
		}
		/**
		*
		*/
		public static function currentController( $controllerID = null )
		{
			if ( $controllerID ){ static::$_currentController = $controllerID; }
			return static::$_currentController;
		}
		/**
		*
		*/
		public static function currentRoute( $name = null )
		{
			if ( $name ){ static::$_currentRoute = $name; }
			return static::$_currentRoute;
		}
		/**
		*
		*/	
		public static function setUrlPatterns( $patterns )
		{
			foreach ( $patterns as $pattern )
			{
				$param = ( string ) $pattern->attributes( )->param;
				if ( isset( static::$_urlPatterns[ $param ] ) )
				{
					trigger_error( 'Pattern for param ' . $param . ' already exists!' , E_USER_ERROR );
					return false;
				}
				static::$_urlPatterns[ $param ] = ( string ) $pattern;
			}
			return static::$_urlPatterns;
		}
		/**
		*
		*/	
		public static function getUrlPatterns( $param = null )
		{
			return ( $param ) ? static::$_urlPatterns[ $param ] : static::$_urlPatterns;
		}
		/**
		*
		*/
		public static function buildJsVars( $vars )
		{
			$vars = ( is_object( $vars ) ) ? ( array ) $vars : $vars;
			$string = '<script>' . "\n";
			foreach ( $vars as $k => $v )
			{
				$string .="\t" . $k . ' = ';
				switch ( $v )
				{
					case is_array( $v ): $string .= json_encode( $v ); break;
					case is_string( $v ):
					default: 
						$string .= ( false !== strpos( $v , 'function(' ) ) ? $v : "'" . $v . "'";
				}
				$string .= ( ( ';' !== substr( $string , -1 ) ) ? ';' : null ) . "\n";
			}
			return $string .= '</script>';
		}
		/**
		*
		*/
		public static function getRouteParam( $name = null )
		{
			return static::getRouteParams( $name );
		}
		/**
		*
		*/
		public static function getRouteParams( $name = null )
		{
			return \App::storage( 'website.route_params' . ( ( $name ) ? '.' . $name : '' ) );
		}
		/**
		*
		*/
		public static function setRouteParams( $params )
		{
			return \App::storage( 'website.route_params' , $params );
		}
		/**
		*
		*/
		public static function getLanguages( )
		{
			if ( !static::$_languages )
			{
				$xml = simplexml_load_file( \App::option( 'website.xml_config_path' ) . '/languages.xml' );
				if ( $languages = $xml->xpath( "//lang" ) )
				{
					$path = \App::option( 'website.language_files_path' );
					foreach ( $languages as $language )
					{
						$array = array
						( 
							'prefix'		=>	( string ) $language->prefix ,
							'suffix'		=>	( string ) $language->suffix ,
							'controller'	=>	( string ) $language->attributes( )->controller
						);
						if ( $language->xml )
						{
							$array[ 'xml' ] = $path  . '/' . ( string ) $language->xml; 
						}
						if ( $language->js )
						{ 
							$array[ 'js' ] =  ( string ) $language->js; 
							$array[ 'script' ] = $path . '/' . ( string ) $language->js; 
						}
						if ( $language->attributes( )->main )
						{
							static::$_fallbackLang = ( string ) $language->attributes( )->controller;
						}
						\App::storage( 'website.languages.' . $language->attributes( )->controller , $array );
					}
				}
			}
			static::$_languages = true;
			return \App::storage( 'website.languages' );
		}
		/**
		*
		*/
		public static function mergePages( $xml1 , $xml2 ) 
		{
			$xml1 = static::mergeXML( $xml1 , $xml2 , '/package/page' );			
			if ( $xml2->elements )
			{
				foreach ( $xml2->elements[ 0 ]->element as $element )
				{
					$el = $xml1->elements->addChild( 'element' , $element );
					foreach ( $element->attributes( ) as $k => $v ) 
					{
						$el->addAttribute( $k , $v );
					}
				}
			}
			return $xml1;
		}
		/**
		*
		*/
		public static function mergeXML( \SimpleXMLElement $xml1 , \SimpleXMLElement $xml2 , $path ) 
		{
			$dom1 = new \DomDocument( ); 
			$dom2 = new \DomDocument( ); 
			$dom1->loadXML( $xml1->asXML( ) ); 
			$dom2->loadXML( $xml2->asXML( ) );    
			$xpath = new \domXPath( $dom2 ); 
			$xpathQuery = $xpath->query( $path ); 
			for ( $i = 0; $i < $xpathQuery->length; $i++ ) 
			{ 
				$dom1->documentElement->appendChild( $dom1->importNode( $xpathQuery->item( $i ) , true ) ); 
			}
			return $xml1 = simplexml_import_dom( $dom1 ); 
		}
		/**
		*
		*/
		protected static $_languages = null;
		/**
		*
		*/
		protected static $_currentController = null;
		/**
		*
		*/
		protected static $_currentRoute = null;
		/**
		*
		*/		
		protected static $_urlPath = null;
		/**
		*
		*/		
		protected static $_fallbackLang = null;
		/**
		*
		*/		
		protected static $_urlPatterns = array( );
		/**
		*
		*/
		protected static $_metatags = null;
	}