<?php

	namespace helpers\Website\models;
	
	use helpers\Website\Manager as Manager;
	
	class Router
	{
		public function __construct( $currentPage )
		{
			$params =  ( !$p = Manager::getRouteParams( ) ) ? new \StdClass( ) : $p;
			$this->_params = new \helpers\ViewModel\Base( $params );
			$this->_currentPage = $currentPage;
		}
	
		public function get( $name )
		{
			return Manager::getRoute( $name );
		}
		
		public function current( )
		{
			return Manager::currentRoute( );
		}
		
		public function raw( )
		{
			return ( Manager::currentRoute( ) && Manager::getLang( 'suffix' ) ) ? 
						str_replace( '_' . Manager::getLang( 'suffix' ) , '' ,  
										Manager::currentRoute( ) ) : null;
		}
		
		public function page( )
		{
			return $this->_currentPage;
		}
		
		public function params( )
		{
			return $this->_params;
		}
		
		public function path( )
		{
			return Manager::getPath( );
		}
		
		public function host( )
		{
			return Manager::host( );
		}
		
		public function __get( $name )
		{
			if ( 'params' === $name )
			{
				return $this->_params;
			}
			throw new \Exception( 'Property with name "' . $name . '" does not exist!' );
		}
		
		protected $_params = null;
		
		protected $_currentPage = null;
	}
