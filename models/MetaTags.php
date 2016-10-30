<?php

	namespace helpers\Website\models;
	
	class MetaTags
	{
		public function __construct( $pageID , $data )
		{
			$this->_pageID = $pageID;
			if ( array_key_exists( '@attributes' , $data ) )
			{
				if ( array_key_exists( 'callback' , $data[ '@attributes' ] ) )
				{
					$this->_callback = ptc_array_get( $data , '@attributes.callback' );
					\Event::listen( 'metatags.callback' , $this->_callback );
				}
				unset( $data[ '@attributes' ] );
			}
			$this->_data = $data;
		}
		
		public function __call( $method , $args = array( ) )
		{
			if ( 0 === strpos( $method , 'get_' ) )
			{
				if ( empty( $this->_data ) ){ return null; }
				if ( !$this->_data[ $field ] )
				{
					return null;
				}
				$field = substr( $method , 4 );
				$value = preg_replace( '/\s+/' , ' ' , $this->_data[ $field ] );
				return "\t" . '<meta name="' . $field . '" content="' . trim( $value ) . '">' . "\n";
			}
			return call_user_func_array( array( $this , $method ), $args );
		}
		
		public function render( )
		{
			$params = array( $this->_pageID , &$this->_data ); 
			ptc_log( $params , 'Website metatags are been compiled!' , 
					\App::option( 'website.debug_category' ) . ' Action' );
			if ( $this->_callback )
			{
				ptc_log( $params , 'Website metatags is beeing fired!' , 
						\App::option( 'website.debug_category' ) . ' Action' );
				\Event::fire( 'metatags.callback' , $params );
			}
			if ( empty( $this->_data ) ){ return null; }
			$tag = null;
			foreach ( $this->_data as $k => $v )
			{
				if ( !$v ){ continue; }
				$v= preg_replace( '/\s+/' , ' ' , $v );
				if ( 'title' === $k )
				{
					$tag .= "\t" . '<title>' . trim( $v ) . '</title>' . "\n";
				}
				else if ( 0 === strpos( strtolower( $k ) , 'og:' ) )
				{
					$tag .= "\t" . '<meta property="' . $k . '" content="' . trim( $v ) . '">' . "\n";
				}
				else
				{
					$tag .= "\t" . '<meta name="' . $k . '" content="' . trim( $v ) . '">' . "\n";
				}
			}
			return $tag;
		}
		/**
		*
		*/	
		public static function callback( $data , $callback )
		{
			foreach ( $data as $k => $v )
			{
				$count = preg_match_all( '#{.*?}#i' , $v , $matches );
				if ( $count > 0 ) 
				{
					$instance = new $callback( );
					$arr = array( );
					foreach ( $matches[ 0 ] as $match )
					{
						$match = preg_replace( '#{|}#' , '' , $match );
						if ( method_exists( $instance , $match ) )
						{
							$arr[ $match ] = call_user_func( array( $instance , $match ) );
						}
						else
						{
							$arr[ $match ] = '';
						}
					}
					if ( !empty( $arr ) )
					{
						foreach ( $arr as $key => $value )
						{
							$data[ $k ] = str_replace( '{' . $key . '}' , $value , $data[ $k ] );
						}
					}
				}
			}
			return $data;
		}
		
		protected $_data = array( );
		
		protected $_pageID = null;
		
		protected $_callback = null;
	}