var APP =
{
	id: 'APP' ,
	name: 'APP' ,
	Base: {} ,
	Controllers: this.Controllers || {} ,
	Forms: this.Forms || {} ,
	Views: this.View || {} ,
	Models: this.Models || {},
	Helpers: this.Helpers || {},
	Elements: this.Elements || {},
	Lang: this.Lang || {},
	Storage: this.Storage || {} ,
	Config: this.Config || 
	{
		url: null ,
		env: '/' ,
		test_env: 1 ,
		revision: '0.0.1'
	} ,
	Lang: this.Lang || {} ,
	Storage: // this.Storage || // Seems to be present as native code
	{
		get: function( key , defaultVal )
		{
			/*if ( ( undefined === this._Data[ key ] || 
					null === this._Data[ key ] ) && 
					undefined !== this._Defaults[ key ] )
			{
				return this._Defaults[ key ];
			}*/
			if ( ( undefined === this._Data[ key ] ) && 
					( typeof defaultVal !== 'undefined' ) )
			{
				return defaultVal;	
			}
			return this._Data[ key ];
		} ,
		set: function( key , value , persist )
		{
			// todo add persistent check
			this._Data[ key ] = value;
			if ( 1 == persist ){ this._Persist[ key ] = 1; }
			return this;
		} ,
		all: function( )
		{
			return this._Data;
		} ,
		_Data: {} ,
		_Persist: {}
	} ,
	Events: this.Events || 
	{
		add: function( event , el , fn , args )
		{
			fn = ( typeof fn === 'undefined' ) ? el[ event ] : fn;
			element = ( el.hasOwnProperty( 'xtype' ) ) ? APP.getElById( el.id ) : el;
			var handler = ( args ) ? 
						fn.bind.apply( fn , [ el ].concat( args ) ) : fn.bind( el );
			if ( element.addEventListener ) 
			{
				element.addEventListener( event , handler , true );
			}
			else if ( element.attachEvent ) 
			{
				element.attachEvent( 'on' + event , handler );
			}
		} ,
		remove: function( event , el , fn )
		{ 
			fn = ( typeof fn === 'undefined' ) ? el[ event ] : fn;
			element = ( el.hasOwnProperty( 'xtype' ) ) ? APP.getElById( el.id ) : el;
			if ( element.removeEventListener ) 
			{
				element.removeEventListener( event , handler );
			}
			else if ( element.detachEvent ) 
			{
				element.detachEvent( 'on' + event , handler );
			}
		} ,
		fire: function ( event , el )
		{
			element = ( el.hasOwnProperty( 'xtype' ) ) ? APP.getElById( el.id ) : el;
			if ( element.fireEvent ) 
			{
				element.fireEvent( event );
			}
			else if ( element.dispatchEvent ) 
			{
				element.dispatchEvent( event );
			}
		} ,
		async: function( fn , callback ) 
		{
			setTimeout( function( ) 
			{
				fn( );
				if ( callback ){ callback( ); }
			} , 0 );
		}
	} ,
	getUrlParam: function ( name , url ) 
	{
		url = ( !url ) ? location.href : url;
		name = name.replace( /[\[]/ ,"\\\[" ).replace( /[\]]/ ,"\\\]" );
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( url );
		return results == null ? null : results[ 1 ];
	} ,
	random: function( length )
	{
		var chars = '0123456789ABCDEFGHIJKLMNOPQRST' + 'UVWXTZabcdefghiklmnopqrstuvwxyz';
		var randomstring = '';
		for ( var i = 0; i < length; i++ )  
		{
			var rnum = Math.floor( Math.random( ) * chars.length );
			randomstring += chars.substring( rnum , rnum + 1 );
		}
		return randomstring;
	} ,
	start: function(controllers)
	{
		for ( var i in this._Exec )
		{
			if ( this._Exec[ i ].hasOwnProperty( 'attach' ) && 
						typeof this._Exec[ i ].attach === 'string' )
			{
				this._Exec[ i ].addEvents( this._Exec[ i ].attach );
			}
			if ( this._Exec[ i ].hasOwnProperty( 'exec' ) && this._Exec[ i ].exec != null )
			{
				if ( typeof this._Exec[ i ].exec === 'string' )
				{
					this._Exec[ i ][ this._Exec[ i ].exec ]( );
				}
				else
				{
					this._Exec[ i ].exec( );
				}
			}
		}
		controllers = (Array.isArray(controllers)) ? controllers : [controllers]; 
		for (var i = 0; i < controllers.length; i++) 
		{
			this.Controllers[controllers[i]].run( ); 
		}
		return true;
	} ,
	getController: function( name )
	{ 
		return this.Controllers[ name ]; 
	} ,
	getForm: function( name )
	{ 
		return this.Forms[ name ]; 
	} ,
	getView: function( name )
	{ 
		return this.Views[ name ]; 
	} ,
	getModel: function( name ) 
	{
		return this.Models[ name ];
	} ,
	getContainer: function( name )
	{ 
		return this.Elements[ name ]; 
	} ,
	getEl: function( selector )
	{
		var el = document.querySelectorAll( selector );
		if ( null === el )
		{
			this.log( 'HELPER NOTICE: coud not find any html elements with query selector "' + selector + '"' );
			return el;
		}
		return ( el.length > 1 ) ? el : el[ 0 ];
	} ,
	getElById: function( id )
	{
		var el = document.getElementById( id );
		if ( null === el )
		{
			this.log( 'HELPER NOTICE: coud not find any html elements with the id "' + id + '"' );
		}
		return el;
	} ,
	getElByClass: function( cls )
	{
		var el = document.getElementsByClassName( cls );
		if ( null === el )
		{
			this.log( 'HELPER NOTICE: coud not find any html elements with the class "' + cls + '"' );
		}
		return el;
	} ,
	getElByName: function( name )
	{
		var el = document.getElementsByName( name );
		if ( null === el )
		{
			this.log( 'HELPER NOTICE: coud not find any html elements with the name "' + name + '"' );
		}
		return el;
	} ,
	getElByTag: function( tag )
	{
		var el = document.getElementsByTagName( tag );
		if ( null === el )
		{
			this.log( 'HELPER NOTICE: coud not find any html elements with the tag "' + tag + '"' );
		}
		return el;
	} ,
	isVisible: function( selector )
	{
		return ( 'none' === APP.getEl( selector ).style.display ) ? false : true;
	} ,
	addEl: function( tag )
	{
		return document.createElement( tag );
	} ,
	hide: function( el )
	{
		if ( el instanceof Array )
		{
			for ( var i in el)
			{
				el[ i ].style.display = 'none';
			}
		}
		else
		{
			el.style.display = 'none';
		}
		return this;
	} ,
	show: function( el )
	{
		if ( el instanceof Array )
		{
			for ( var i in el )
			{
				el[ i ].style.display = 'block';
			}
		}
		else
		{
			el.style.display = 'block';
		}
		return this;
	} ,
	remove: function( el )
	{
		el.parentNode.removeChild( el );
		return this;
	} ,
	render: function( el , html )
	{
		el.innerHTML = html;
		return this;
	} ,
	hasClass: function( el , cls )
	{
		return ( el.classList.contains( cls ) ) ? true : false;
	} ,
	removeClass: function( el , cls )
	{
		return el.classList.remove( cls );
	} ,
	addClass: function( el , cls )
	{
		return el.classList.add( cls );
	} ,
	toggleClass: function( el , cls )
	{
		return el.classList.toggle( cls );
	} ,
	addEventsById: function( events , obj )
	{
		if ( null !== obj.getElById( ) )
		{
			var e = events.split( ',' );
			for ( var a in e )
			{
				APP.Events.add( e[ a ] , obj );
			}
		}			
	} ,
	addEventsByClass: function( events , obj )
	{
		var elements = APP.getElByClass( obj.cls );
		for ( var a = 0; a < elements.length; a++ )
		{
			var e = events.split( ',' );
			for ( var i in e )
			{
				APP.Events.add( e[ i ] , elements[ a ] , obj[ e[ i ] ] );
			}
		}
	} ,
	extend: function( obj ) 
	{
		obj._extended = true;
		return this._merge( this , obj , false );
	} ,
	log: function( )
	{
		// log function
		if ( this.Config.test_env && typeof console != 'undefined' )
		{
			for ( var i = 0; i < arguments.length; i++ )
			{
				console.log( arguments[ i ] );
			}
		}
	} ,
	_Exec: this._Exec || {} ,
	_create: function( obj )
	{
		switch ( obj.xtype )
		{
			case 'checkboxgroup':
			case 'checkbox':
				return this.Base.CheckBox.extend( obj );
			break;
			case 'radio':
			case 'radiobutton':
				return this.Base.RadioButton.extend( obj );
			break;
			case 'textfield':
				return this.Base.TextField.extend( obj );
			break;
			case 'textarea':
				return this.Base.TextArea.extend( obj );
			break;
			case 'element':
				return this.Base.Element.extend( obj );
			break;
			case 'select':
				return this.Base.Select.extend( obj );
			break;
			case 'multiselect':
				return this.Base.MultiSelect.extend( obj );
			break;
			case 'button':
				return this.Base.Button.extend( obj );
			break;
			case 'view':
				return this.Base.View.extend( obj );
			break;
			case 'form':
				return this.Base.Form.extend( obj );
			break;
			case 'model':
				return this.Base.Model.extend( obj );
			break;
			break;
			case 'tabs':
				return this.Base.Tabs.extend( obj );
			break;
			case 'tabitem':
				return this.Base.TabItem.extend( obj );
			break;
			//case 'controller': //controller is never an item
			//	return this.Base.Controller.extend( obj );
			//break;
		}
		return obj;
	} ,
	_merge: function( cls , obj , clone )
	{
		var cl = ( clone ) ? this._clone( cls ) : cls;
		for ( var i in obj )
		{ 
			if ( obj[ i ] instanceof Array || typeof obj[ i ] === 'object' )
			{
				if ( !cl.hasOwnProperty( i ) )
				{
					cl[ i ] = ( obj[ i ] instanceof Array ) ? [] : {};
				}
				for ( var a in obj[ i ] )
				{
					if ( 'items' !== i )
					{
						cl[ i ][ a ] = obj[ i ][ a ];  
					}
				}
			}
			else
			{ 
				cl[ i ] = obj[ i ]; 
			}
			if ( obj.hasOwnProperty( 'items' ) )
			{
				for ( var b in obj.items )
				{
					if ( 'items' === i && 
						!obj.items[ b ].hasOwnProperty( '_extended' ) && 
									obj.items[ b ].hasOwnProperty( 'xtype' ) )
					{
						obj.items[ b ] = this._create( obj.items[ b ] );
					}
					cl.items[ b ] = obj.items[ b ];  
					obj.items[ b ]._parent = cl;
				}
			}
			if ( ( cl.hasOwnProperty( 'attach' ) && typeof cl.attach === 'string' || 
							cl.hasOwnProperty( 'exec' ) && cl.exec != null ) && 
										!this._Exec.hasOwnProperty( cl.name ) )
			{
				this._Exec[ cl.name ] = cl;
			}
		}
		if ( cl.hasOwnProperty( 'xtype' ) )
		{
			this._xtype( cl );
		}
		return cl;
	} ,
	_clone: function( obj ) 
	{
		if ( obj == null || typeof( obj ) != 'object' )
		{
			return obj;
		}
		var temp = obj.constructor( );
		for ( var key in obj ) 
		{
			if ( obj.hasOwnProperty( key ) ) 
			{
				temp[ key ] = this._clone( obj[ key ] );
			}
		}
		return temp;
	} ,
	_xtype: function( cl )
	{
		switch( cl.xtype )
		{
			case 'form': 
				if ( cl.name !== 'BaseForm' )
				{
					this.Forms[ cl.name ] = cl;
				}
			break;
			case 'view': 
				if ( cl.name !== 'BaseView'  )
				{
					this.Views[ cl.name ] = cl;
				}
			break;
			case 'controller': 
				if ( cl.name !== 'BaseController'  )
				{
					this.Controllers[ cl.name ] = cl;
				}
			break;
			case 'model':
				if ( cl.name !== 'BaseModel'  )
				{
					this.Models[ cl.name ] = cl;
				}
			break;
			case 'element':
				if ( cl.name !== 'BaseElement'  )
				{
					this.Elements[ cl.name ] = cl;
				}
			break;
			case 'tabs':
				if ( cl.name !== 'BaseTabs' ) 
				{
					this.Elements[ cl.name ] = cl;
				}
			break;
		}
	}
};
