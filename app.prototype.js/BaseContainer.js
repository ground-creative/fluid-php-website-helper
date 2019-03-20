APP.Base.Container = APP.Base.Container ||
{
	id: 'BaseContainer',
	name: 'BaseContainer' ,
	xtype: 'container' ,
	html: null ,
	cls: null ,
	tag: null ,
	exec: null ,
	parent: function( )
	{
		return this._parent;
	} ,
	child: function( )
	{
		// to do
	} ,
	setHtml: function( html )
	{
		this.html = html;
		return this;
	} ,
	getHtml: function( )
	{
		return this.html;
	} ,
	hasClass: function( cls )
	{
		return APP.hasClass( this.getElById( ) , cls );
	} ,
	removeClass: function( cls )
	{
		APP.removeClass( this.getElById( ) , cls );
		return this;
	} ,
	addClass: function( cls )
	{
		APP.addClass( this.getElById( ) , cls );
		return this;
	} ,
	toggleClass: function( cls )
	{
		APP.toggleClass( this.getElById( ) , cls );
		return this;
	} ,
	getAttribute: function( attr )
	{
            try {
		return this.getElById( ).getAttribute( attr );
            }
            catch(err) {
                return false;
            }

	} ,
	setAttribute: function( attr , value )
	{
		this.getElById( ).setAttribute( attr , value );
		return this;
	} ,
	removeAttribute: function( attr )
	{
		this.getElById( ).removeAttribute( attr );
		return this;
	} ,
	isVisible: function( )
	{
		return ( 'none' === this.getElById( ).style.display ) ? false : true;
	} ,
	getCss: function( )
	{
		return this.getElById( ).css;
	} ,
	setCss: function( value )
	{
		this.getElById( ).css = value;
		return this;
	} ,
	getElById: function( )
	{
		return APP.getElById( this.id );
	} ,
	getElByClass: function( )
	{
		return APP.getElByClass( this.cls );
	} ,
	getElByName: function( )
	{
		return APP.getElByName( this.name );
	} ,
	getElByTag: function( )
	{
		return APP.getElByTag( this.tag );
	} ,
	show: function( )
	{
		APP.Events.async( function( )
		{ 
			this.listeners.beforeShow( this ); 
		}.bind( this ) , function( )
		{
			APP.Events.async( function( )
			{ 
				APP.show( this.getElById( ) );
			}.bind( this ) , function( )
			{
				this.listeners.afterShow( this );
			}.bind( this ) );
		}.bind( this ) );
		return this;
	} ,
	hide: function( )
	{
		APP.Events.async( function( )
		{ 
			this.listeners.beforeHide( this ); 
		}.bind( this ) , function( )
		{
			APP.Events.async( function( )
			{ 
				APP.hide( this.getElById( ) );
			}.bind( this ) , function( )
			{
				this.listeners.afterHide( this );
			}.bind( this ) );
		}.bind( this ) );
		return this;
	} ,
	render: function( )
	{
		APP.Events.async( function( )
		{ 
			this.listeners.beforeRender( this ); 
		}.bind( this ) , function( )
		{
			APP.Events.async( function( )
			{ 
				APP.render( this.getElById( ) , this.html );
			}.bind( this ) , function( )
			{
				this.listeners.afterRender( this );
			}.bind( this ) );
		}.bind( this ) );
		return this;
	} ,
	remove: function( )
	{
		APP.Events.async( function( )
		{ 
			this.listeners.beforeRemove( this ); 
		}.bind( this ) , function( )
		{
			APP.Events.async( function( )
			{ 
				APP.remove( APP.getElById( this.id ) );
			}.bind( this ) , function( )
			{
				this.listeners.afterRemove( this );
			}.bind( this ) );
		}.bind( this ) );
		return this;
	} ,
	destroy: function( )
	{
		APP.Events.async( function( )
		{ 
			this.listeners.beforeDestroy( this ); 
		}.bind( this ) , function( )
		{
			APP.Events.async( function( )
			{ 
				APP.remove( this.getElById( ) );
			}.bind( this ) , function( )
			{
				this.listeners.afterDestroy( this );
			}.bind( this ) );
		}.bind( this ) );
		return this;
	} ,
	listeners:
	{
		beforeRender: function( obj ){ } ,
		afterRender: function( obj ){ } ,
		beforeShow: function( obj ){ } ,
		afterShow: function( obj ){ } ,
		beforeHide: function( obj ){ } ,
		afterHide: function( obj ){ } ,
		beforeRemove: function( obj ){ } ,
		afterRemove: function( obj ){ } ,
		beforeDestroy: function( obj ){ } ,
		afterDestroy: function( obj ){ }
	} ,
	extend: function( obj ) 
	{
		obj._extended = true;
		return APP._merge( this , obj , true );
	} ,
	log: function( data )
	{
		APP.log( data );
	}
};
