<?php

	namespace helpers\Website\models;	

	class Elements
	{
		public function __construct( $elements , $vars )
		{
			$this->_storage = $elements;
			$this->_vars = $vars;
		}
		
		public function __get( $key )
		{
			if ( !array_key_exists( $key , $this->_storage ) )
			{
				throw new \Exception( 'View element "' . $key . '" does not exist!' );
				return false;
			}
			if ( $this->_useCache && array_key_exists( $key , $this->_cache ) )
			{
				return $this->_cache[ $key ];
			}
			$this->_vars[ \App::option( 'website.elements_param' ) ] = $this;
			$vars = array_merge( $this->_vars , $this->_elVars );
			$listeners = \Event::get('website');
			if (is_array($listeners) && isset($listeners['compiling_view_element']))
			{
				ptc_fire('website.compiling_view_element', [$key, &$vars, &$this->_storage[$key]]);
			}
			$this->_cache[ $key ] = \View::make( \App::option( 'website.views_path' ) . '/' . 
									$this->_storage[ $key ] , $vars )->compile( );
			$this->_useCache = true;
			return $this->_cache[ $key ];
		}
		
		public function addValues( $values )
		{
			foreach ( $values as $k => $v )
			{
				$this->_elVars[ $k ] = $v;
			}
			return $this;
		}
		
		public function reset( )
		{
			$this->_elVars = array( );
			return $this;
		}
		
		public function fresh( )
		{
			$this->_useCache = false;
			return $this;
		}
		
		protected $_cache = array( );
		
		protected $_useCache = true;
	
		protected $_storage = array( );
		
		protected $_vars = null;
		
		protected $_elVars = array( );
	}