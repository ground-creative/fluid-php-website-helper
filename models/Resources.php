<?php

	namespace helpers\Website\models;
	
	use helpers\Website\Manager as Manager;
	
	class Resources
	{
		/**
		*
		*/
		public function __construct( $resources , $page )
		{ 
			$this->_resource = $resources;
			$this->_page = $page;
		}
		/**
		*
		*/
		public function css( )
		{
			return Resources::_mergeBlocks( $this->_page ,$this->_resource , 'css' );
		}
		/**
		*
		*/
		public function links( )
		{
			return Resources::_mergeBlocks( $this->_page ,$this->_resource , 'link' );
		}
		/**
		*
		*/
		public function js( )
		{
			return Resources::_mergeBlocks( $this->_page , $this->_resource , 'js' );
		}
		/**
		*
		*/
		public function raw($resourcesID, $type, $comment = null)
		{
			return Resources::_build($resourcesID, $type, $comment);
		}
		/**
		*
		*/
		protected $_resource = null;
		/**
		*
		*/
		protected $_page = null;
		/**
		*
		*/
		protected static $_xml = null;
		/**
		*
		*/
		protected static $_fireEvent = null;
		/**
		*
		*/
		protected static $_resources = array( );
		/**
		*
		*/
		protected static function _mergeBlocks( $page , $blocks , $type )
		{
			static::$_fireEvent = true;
			$blocks = is_array( $blocks ) ? $blocks : array( $blocks );
			$string = null;
			$a = 0;
			$lang = Manager::getLang( 'js' );
			if ( 'js' === $type && \App::option( 'website.use_app_prototype_js' ) )
			{
				$string .= "\t" . '<!-- js app prototype included automatically -->' . "\n";
				$path = Manager::getPath( ) . '/js/website-helper/app/App.js';
				$string .= "\t" . '<script type="text/javascript" src="' . $path . '"></script>' . "\n";
				$path = Manager::getPath( ) . '/js/website-helper/app/BaseModel.js';
				$string .= "\t" . '<script type="text/javascript" src="' . $path . '"></script>' . "\n";
				$path = Manager::getPath( ) . '/js/website-helper/app/BaseController.js';
				$string .= "\t" . '<script type="text/javascript" src="' . $path . '"></script>' . "\n";
				$path = Manager::getPath( ) . '/js/website-helper/app/BaseContainer.js';
				$string .= "\t" . '<script type="text/javascript" src="' . $path . '"></script>' . "\n";
				$path = Manager::getPath( ) . '/js/website-helper/app/BaseElements.js';
				$string .= "\t" . '<script type="text/javascript" src="' . $path . '"></script>' . "\n";
				$path = Manager::getPath( ) . '/js/website-helper/app/BaseForm.js';
				$string .= "\t" . '<script type="text/javascript" src="' . $path . '"></script>' . "\n";
				$path = Manager::getPath( ) . '/js/website-helper/app/Validator.js';
				$string .= "\t" . '<script type="text/javascript" src="' . $path . '"></script>' . "\n";
			}
			$helpers = \App::option( 'website.app_prototype_helpers' );
			if ( 'js' === $type && $helpers )
			{
				$helpers = explode( '|' , $helpers );
				$string .= "\t" . '<!-- js app prototype helpers included automatically -->' . "\n";
				foreach ( $helpers as $helper )
				{
					$path = Manager::getPath( ) . '/js/website-helper/app/helpers/' . $helper . '.js';
					$string .= "\t" . '<script type="text/javascript" src="' . $path . '"></script>' . "\n";
				}
			}	
			if ( 'js' === $type && \App::option( 'website.auto_include_js_lang' )  && $lang && 
						file_exists( \App::option( 'website.language_files_path' )  . '/' . $lang .'.js' ) )
			{
				$path = Manager::getPath( ) . '/js/website-helper/lang/' . $lang . '.js';
				$string .= "\t" . '<!-- js language file included automaticaly -->' . "\n";
				$string .= "\t" . '<script type="text/javascript" src="' . $path . '"></script>' . "\n";
				
			}
			foreach ( $blocks as $block_id ){ $string .= static::_getBlock( $page , $block_id , $type ); }
			return ltrim( $string );
		}
		/**
		*
		*/
		protected static function _build($items, $type, $comment = null)
		{
			if ( !static::_initialize( ) ){ return false; }
			$tpl = ( 'css' === $type || 'link' === $type) ? 
				'<link rel="{rel}" type="{type}" href="{path}" />' : 
					'<script type="text/javascript" src="{path}"></script>';
			$dep = ($comment) ? "\t" . '<!-- ' . $comment . '-->' . "\n" : null;
			$items = (is_array($items)) ? $items : [$items];
			foreach ($items as $item)
			{
				if (!isset(static::$_resources[$item]))
				{
					trigger_error('Resource id "' . $item . '" is not set!', E_USER_ERROR);
					return false;
				}
				$path = (!static::$_resources[$item]['external']) ? Manager::getPath() : null;
				$_item = static::$_resources[$item]['file'];
				$rel = ($r = static::$_resources[$item]['rel']) ? $r : 'stylesheet';
				$type = ($r = static::$_resources[$item]['type']) ? $r : 'text/css';
				$dep .=  "\t" . str_replace( ['{path}', '{type}', '{rel}'],  [$path . $_item , $type, $rel], $tpl) . "\n";
			}
			return $dep;
		}
		/**
		*
		*/
		protected static function _getBlock( $page , $blockID , $type )
		{
			if ( !static::_initialize( ) ){ return false; }
			$block = static::$_xml->xpath("//block[@id='" . $blockID . "']");
			if ( !$block )
			{
				trigger_error( 'Block id "' . $blockID . '" not found in xml config file!' , E_USER_ERROR );
				return false;
			}
			$children = $block[ 0 ]->{$type};
			$string = null;
			if ( isset( $children->resource ) )
			{
				for ( $i = 0; $i < count( $children ); $i++ )
				{ 
					$items = array( );
					for ( $a = 0; $a < count( $children->{$i}->resource ); $a++ )
					{
						$resource_id = ( string ) $children->{$i}->resource->{$a};
						$items[ ] = $resource_id;
					}
					if ( $comment = $children->{$i}->attributes( ) ){ $comment = $comment->type; }
					$listeners = \Event::get('website');
					if (is_array($listeners) && isset($listeners['compiling_resource_block']))
					{
						ptc_fire('website.compiling_resource_block', [$page , $blockID, &$items , $type]);
					}
					$string .= static::_build( $items , $type , $comment );
				}
			}
			if ( $listener = $block[ 0 ]->listener )
			{
				for ( $b = 0; $b < count( $listener ); $b++ )
				{
					$listener_type = ( string ) $listener->{$b}->attributes( )->type;
					if ( $type === $listener_type || 'any' === $listener_type )
					{ 
						$params = array( $page , &$string , $type );
						if ( false === ptc_fire( 'website.' . ( string ) $listener->{$b}[ 0 ] , $params ) )
						{
							static::$_fireEvent = false;
						}
					}
				}
			}
			$event = \Event::getEvents( 'website' );
			if ( $page && static::$_fireEvent && is_array( $event ) && 
								ptc_array_get( $event , 'resources' , false ) )
			{
				ptc_fire( 'website.resources' , array( $page , &$string , $type , $blockID ) );
			}
			if ( $raw = $block[ 0 ]->{$type}->raw )
			{
				$string .= ( 'js' === $type ) ? '<script>' . "\n" : '<style>' . "\n";
				for ( $c = 0; $c < count( $raw ); $c++ )
				{
					$string .= "\t" . $raw->{$c} . ( ( ';' !== 
								substr( trim( $raw->{$c} ) , -1 ) ) ? ';' : null ) . "\n";
				}
				$string .= ( 'js' === $type ) ? '</script>' . "\n" : '</style>' . "\n";
			}
			return $string;
		}
		/**
		*
		*/
		protected static function _initialize()
		{
			if (!static::$_xml)
			{
				static::$_xml = simplexml_load_file(\App::option('website.xml_config_path') . '/resources.xml');
				$listeners = \Event::get('website');
				if (is_array($listeners) && isset($listeners['load_resources_xml']))
				{
					ptc_fire('website.load_resources_xml', [&static::$_xml]);
				}
				$resources = static::$_xml->xpath("//resources");
				foreach ($resources[0]->file as $file)
				{
					$resource = (array)$file;
					$id = (string)$file->attributes()->id;
					if (isset(static::$_resources[$id]))
					{
						trigger_error('Resource id "' . $id . '" already set!' , E_USER_ERROR);
						return false;
					}
					if (\App::option('app.test_env'))
					{
						$resource = (($file->attributes()->rand) ? $resource[0] . 
										'?rand=' . rand(100, 999) : $resource[0]);
					}
					else
					{
						$resource = (($rev = \App::option('revision.number')) ? 
												$resource[0] . '?rev=' . $rev : $resource[0]);
					}
					static::$_resources[$id] = ['file' => $resource, 'external' => false, 'rel' => null, 'type' => null];
					foreach ($file->attributes() as $attKey => $attValue)
					{
						if ($attKey == 'id' || $attKey == 'file')
						{
							continue;
						}
						static::$_resources[$id][$attKey] = (string)$attValue;
					}
				}
				return static::$_xml;
			}
			return true;
		}
	}