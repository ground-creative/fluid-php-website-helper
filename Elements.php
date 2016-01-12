<?php

	namespace helpers\Website;	

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
			return $this->_cache[ $key ] = \View::make( \App::option( 'website.views_path' ) . '/' . 
										$this->_storage[ $key ] , $this->_vars )->compile( );
			$this->_useCache = true;
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
	}