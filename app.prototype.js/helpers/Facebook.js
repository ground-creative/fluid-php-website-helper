APP.Helpers = APP.Helpers || {};

APP.Helpers.Facebook = 
{ 
	fields: 'email,id,name,first_name,last_name,birthday,link,' +
		'gender,age_range,locale,timezone,verified,location,hometown' ,
	Defaults:
	{
		appId: '{your-app-id}' ,
		cookie: true ,
		status: true , 
		xfbml: true ,
		oauth: true ,
		version: 'v2.4'
	} ,
	Config: {} ,
	init: function( config ) 
	{
		var _this = this;
		_this.Config = config;
		for ( var property in _this.Defaults )
		{
			if ( !_this.Config.hasOwnProperty( property ) )
			{
				_this.Config[ property ] = _this.Defaults[ property ];
			}
		}
		$.ajaxSetup( { cache: true } );
		$.getScript( '//connect.facebook.net/en_US/sdk.js' , function( )
		{
			FB.init( _this.Config );     

		} );
	} ,
	connect: function( scope , callback , errorCallback )
	{
		var _this = this;
		FB.getLoginStatus( function( response ) 
		{
			if ( response.status === 'connected' )
			{ 
				_this.getUserData( callback , errorCallback ); 
			} 
			else 
			{
				FB.login( function( response )
				{
					if ( response.authResponse )
					{ 
						_this.getUserData( callback , errorCallback ); 
					} 
					else { errorCallback( response ); }
				} , { scope: scope } );
			}
		} );
	} ,
	getUserData: function( callback , errorCallback )
	{
		var _this = this;
		FB.api( '/me', { fields: _this.fields }, function( response )
		{
			if ( !( response === undefined ) )
			{				
				callback( response );
			} 
			else{ errorCallback( response ); }
		} );
	}
}; 