APP.Base.Controller = APP.Base.Controller || 
{
	id: 'BaseController' ,
	name: 'BaseController' ,
	xtype: 'controller' ,
	run: function( ){ } ,
	extend: function( obj ) 
	{
		obj._extended = true;
		return APP._merge( this , obj , true );
	}
};