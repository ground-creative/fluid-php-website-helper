APP.Base.Model = APP.Base.Model ||
{
	id: 'BaseModel',
	name: 'BaseModel' ,
	xtype: 'model' ,
	Defaults: {} ,
	_Fields: { } ,
	get: function( key )
	{
		if ( null === this._Fields[ key ] && null !== this.Defaults[ key ] )
		{
			return this.Defaults[ key ];
		}
		return this._Fields[ key ];
	} ,
	set: function( key , value )
	{
		this._Fields[ key ] = value;
		return this;
	} ,
	all: function( )
	{
		return this._Fields;
	} ,
	create: function( fields )
	{
		this._Fields = fields;
		return this;
	} ,
	toArray: function( )
	{
		return this._Fields.keys( obj ).map( function( k )
		{ 
			return obj[ k ]; 
		} );
	} ,
	toJson: function( )
	{
		return JSON.stringify( this._Fields );
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