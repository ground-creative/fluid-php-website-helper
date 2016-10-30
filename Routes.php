<?php

	namespace helpers\Website;
	
	class Routes
	{
		/**
		*
		*/
		public function __construct( $controllerID , $xml )
		{
			$this->_xml = $xml;
			$this->_controllerID = $controllerID;
			if ( !defined( '_WEBSITE_HELPER_CHECKED_PATTERNS_' )  && 
					count( $block = $this->_xml->xpath( "//patterns" ) ) > 0 )
			{
				define( '_WEBSITE_HELPER_CHECKED_PATTERNS_' , true ); 
				Manager::setUrlPatterns( $block[ 0 ]->pattern );
			}
		}
		/**
		*
		*/
		public function compile( )
		{
			$block = $this->_xml->xpath( "//controller[@id='" . $this->_controllerID . "']" );
			if ( !$block )
			{
				trigger_error( 'Controller block "' . $this->_controllerID . 
						'" was not set in routes.xml file!' , E_USER_ERROR );
				return false;
			}
			$this->_prefix = ( $pref =  ( string ) $block[ 0 ]->attributes( )->prefix ) ? $pref : '';
			$this->_domain = ( $d = ( string ) $block[ 0 ]->attributes( )->domain ) ? $d : null; 
			$this->_protocol = ( $p = ( string ) $block[ 0 ]->attributes( )->protocol ) ? $p : null;
			if ( $block[ 0 ]->filter )
			{
				foreach ( $block[ 0 ]->filter as $filter )
				{
					$filters = array( );
					if ( $before = ( string ) $filter->attributes( )->before ){ $filters[ 'before' ] = $before; }
					if ( $after = ( string ) $filter->attributes( )->after ){ $filters[ 'after' ] = $after; }
					if ( $filter->route && !static::_buildRoutes( $block[ 0 ] , $filter->route , $filters ) ){ return false; }
				}
			}
			if ( !static::_buildRoutes( $block[ 0 ] , $block[ 0 ]->route ) ){ return false; }
			return $this;
		}
		/**
		*
		*/
		protected $_xml = null;
		/**
		*
		*/
		protected $_controllerID = null;
		/**
		*
		*/
		protected $_domain = null;
		/**
		*
		*/
		protected $_protocol = null;
		/**
		*
		*/
		protected $_prefix = '';
		/**
		*
		*/
		protected function _buildRoutes( $block , $routes , array $filters = array( ) )
		{
			$controller_id = $this->_controllerID;
			foreach ( $routes as $route )
			{
				if ( !$route->map )
				{
					trigger_error( 'Please add a map tag to route ' . 
						$route->attributes( )->url . '!' , E_USER_ERROR );
					return false;
				}
				if ( array_key_exists( 'before' , $filters ) )
				{
					$route->before = ( $b = ( string ) $route->attributes( )->before ) ? 
											$filters[ 'before' ] . '|' . $b : $filters[ 'before' ];
				}
				else if ( $b = ( string ) $route->attributes( )->before ){ $route->before = $b; }
				if ( array_key_exists( 'after' , $filters ) )
				{
					$route->after = ( $a = ( string ) $route->attributes( )->after ) ? 
											$filters[ 'after' ] . '|' . $a : $filters[ 'after' ];
				}
				else if ( $a = ( string ) $route->attributes( )->after ){ $route->after = $a; }
				$map = ( string ) $route->map[ 0 ];
				$route_params = null;
				if ( $route->params )
				{
					$route_params = [ ];
					foreach ( $route->params[ 0 ] as $param )
					{
						$route_params[ ( string ) $param->attributes( )->name ] = ( string ) $param;
					}
				}
				$callback = function ( ) use( $route , $controller_id , $map , $route_params )
				{
					\helpers\Website\Manager::currentController( $controller_id );
					\helpers\Website\Manager::currentRoute( $map );
					\helpers\Website\Manager::setLang( $controller_id );
					\helpers\Website\Manager::setRouteParams( $route_params );
					$metatags = ( $route->metatags ) ? ( array ) $route->metatags[ 0 ] : array( );
					\helpers\Website\Manager::setMetaTags( ( string ) $route->page[ 0 ] , $metatags );
					return \helpers\Website\Manager::page( ( string ) $route->page[ 0 ] );
				};
				$url = $route->attributes( )->url;
				if ( $this->_prefix )
				{
					$url = ( '/' === substr( $url , 0 , 1 ) ) ? substr( $url , 1 ) : $url;
					$this->_prefix  = ( '/' !== substr( $this->_prefix , -1 ) ) ? $this->_prefix . '/' : $this->_prefix;
					$url = $this->_prefix . $url;
				}
				$params = array( $url , $callback );
				$requests = ( $r = ( string ) $route->attributes( )->request ) ? explode( '|' , $r ) : array( 'get' );
				$a = 0;
				foreach ( $requests as $request )
				{
					$router = call_user_func_array( '\Router::' . $request , $params );
					foreach ( Manager::getUrlPatterns( ) as $k => $v )
					{
						if ( preg_match( '<{' . $k . '}|{' . $k . '\?}>' , $url ) )
						{ 
							$router->where( $k , $v ); 
						}
					}
					$router->map( ( string ) $route->map[ 0 ] );
					$router->set( 'controller' , $controller_id ); 
					if ( $route->protocol || $this->_protocol )
					{ 
						$prot = ( $p = ( string ) $route->protocol ) ? $p : $this->_protocol;
						$router->protocol( $prot ); 
					}
					if ( $route->domain || $this->_domain )
					{ 
						$dom = ( $d = ( string ) $route->domain ) ? $d : $this->_domain;
						$router->domain( $dom ); 
					}
					if ( $route->before ){ $router->before( ( string ) $route->before ); }
					if ( $route->after ){ $router->after( ( string ) $route->after ); }
					++$a;
				}
			}
			return true;
		}
	}