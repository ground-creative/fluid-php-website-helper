APP.Base.Form = APP.Base.Form || APP.Base.View.extend
( {
	id: 'BaseForm' ,
	name: 'BaseForm' ,
	xtype: 'form' ,
	values: { } ,
	handler: null ,
	action: null ,
	success: function( values ){ } ,
	invalid: function( values , validator )
	{ 
		this.log( [ 'form is invalid' , values , validator ] ); 
	} ,
	getValues: function( )
	{
		this.values = { };
		for ( var i in this.items )
		{
			if ( 'function' === typeof this.items[ i ].getValue )
			{
				this.values[ this.items[ i ].name ] = this.items[ i ].getValue( );
			}
		}
		return this.values;
	} ,
	setValues: function( values )
	{
		for ( var key in values )
		{
			this.values[ key ] = this.getItem( key ).setValue( values[ key ] );
		}
		return this;
	} ,
	reset: function( )
	{
		var value, xtype;
		this.values = { };
		for ( var i in this.items )
		{
			xtype = this.items[ i ].xtype;
			switch ( xtype )
			{
				case 'checkboxgroup':
					// todo
				break;
				case 'checkbox':
					this.items[ i ].check( this.items[ i ].checked );
				break;
				case 'radio':
				case 'radiobutton':
					this.items[ i ].reset( );
					if ( this.items[ i ].checked.length > 0 )
					{
						this.items[ i ].check( this.items[ i ].checked , 1 );
					}
				break;
				default:
					this.items[ i ].setValue( this.items[ i ].defaultValue );
			}
			this.items[ i ].value = null;
		}
		APP.Validator.reset( this.items );
		return this;
	} ,
	submit: function( )
	{
		APP.Events.async( function( )
		{
			this.listeners.beforeSubmit( this ); 
		}.bind( this ) , function( )
		{
			APP.Events.async( function( )
			{ 
				this.validate( );
			}.bind( this ) , function( )
			{
				this.listeners.afterSubmit( this );
			}.bind( this ) );
		}.bind( this ) );
	} ,
	validate: function( )
	{
		var validator = APP.Validator.validate( this.items , this.getValues( ) , this.name );
		if ( validator.isValid )
		{
			this.success( this.values );
		}
		else
		{
			this.invalid( this.values , validator );
		}
		return false;
	} ,
	attachHandler: function( event )
	{
		event = ( typeof event === 'undefined' ) ? 'click' : event;
		APP.Events.add( event , this.getItem( this.handler ) , function( event )
		{
			this.submit( );
			//if ( !this.action )
			//{
				event.preventDefault( );
				event.stopPropagation( );
				return false;
			//}
		}.bind( this ) );
		for ( var i in this.items )
		{
			if ( this.items[ i ].hasOwnProperty( 'fn' ) )
			{
				this.items[ i ].fn( );
			}
		}
		return this;
	} ,
	listeners:
	{
		beforeSubmit: function( obj ){ } ,
		afterSubmit: function( obj ){ }
	}
} );
