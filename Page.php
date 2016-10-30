<?php

	namespace helpers\Website;
	
	class Page
	{
		/**
		*
		*/
		public function __construct( $page , $xml )
		{ 
			$this->_page = $page; 
			$this->_xml = $xml;
		}
		/**
		*
		*/
		public function render( ){ echo $this->compile( $this->_page ); }
		/**
		*
		*/
		public function compile( )
		{
			return $this->_parseXML( $this->_page )->compile( );
		}
		/**
		*
		*/
		protected function _parseXML( )
		{
			$xml_block = $this->_xml->xpath( "//page[@id='" . $this->_page . "']" );
			if ( !$xml_block )
			{
				trigger_error( 'Page block "' . $this->_page . 
							'" was not set in pages.xml file!' , E_USER_ERROR );
				return false;
			}	
			$data = array
			( 
				\App::option( 'website.resources_param' ) 	=>	null , 
				\App::option( 'website.lang_param' ) 		=>	null , 
				\App::option( 'website.data_param' ) 		=>	null , 
				//\App::option( 'website.current_route_param' )  =>	Manager::currentRoute( ) ,	// DEPRECATED
				//\App::option( 'website.current_page_param' )  =>	$this->_page ,				// DEPRECATED
				\App::option( 'website.meta_tags_param' )	=>	Manager::getMetaTags( ) ,
				//\App::option( 'website.current_path_param' )  =>	Manager::getPath( ) ,		// DEPRECATED
				\App::option( 'website.router_param' )		=>	new models\Router( $this->_page )
			);
			//$data[ \App::option( 'website.current_route_param' ) . 'raw' ] = 
			//		( Manager::currentRoute( ) && Manager::getLang( 'suffix' ) ) ? 
			//			str_replace( '_' . Manager::getLang( 'suffix' ) , '' ,  Manager::currentRoute( ) ) : null;
			$views = $xml_block[ 0 ]->views->view;
			if ( $resources = $xml_block[ 0 ]->resources )
			{
				$blocks = array( );
				foreach ( $resources[ 0 ] as $block )
				{
					$blocks[ ] = ( string ) $block;
				}
				$data[ \App::option( 'website.resources_param' ) ] = new models\Resources( $blocks , $this->_page );
			}
			$data[ \App::option( 'website.lang_param' ) ] = $this->_getTranslator( );
			$params = array( $this->_page , &$data[ \App::option( 'website.data_param' ) ] , 
											$data[ \App::option( 'website.lang_param' ) ] );
			if ( $call = ( string ) $xml_block[ 0 ]->attributes( )->callback )	// add precompile event
			{
				\Event::listen( 'view.callback' , $call );
			}
			$events = \Event::getEvent( 'view' );
			if ( @$events[ 'callback' ] )							// fire precompile event
			{
				\Event::fire( 'view.callback' , $params );
			}
			$elements =  $this->_xml->xpath( "//elements" );
			if ( $elements )
			{
				$storage = array( );
				foreach ( $elements[ 0 ]->element as $element )
				{
					$storage[ ( string ) $element->attributes( )->name ] = ( string ) $element;
				}
				$data[ \App::option( 'website.elements_param' ) ] =  new models\Elements( $storage , $data );
			}
			$view = \View::make( \App::option( 'website.views_path' ) . '/' . $views[ 0 ] , $data );
			if ( count( $views ) > 1 )
			{
				unset( $views[ 0 ] );
				foreach ( $views as $file )
				{
					$child = ( string ) $file->attributes( )->child;
					$view = $view->nest( $child , \App::option( 'website.views_path' ) . 
													'/' . $file , $view->getPageVars( ) );
				}
			}
			return $view;
		}
		/**
		*
		*/		
		protected function _getTranslator( )
		{
			if ( $xml = \App::storage( 'website.current_lang.xml' ) )
			{
				$fallback = \App::storage( 'website.fallback_lang.xml' );
				$translator = new \helpers\Translator\Core( $xml , $fallback );
				return $translator;
			}
			return null;
		}
		/**
		*
		*/		
		protected $_xml = null;
		/**
		*
		*/		
		protected $_page = null;
		/**
		*
		*/		
		protected $_translator = null;
	}