APP.Base.View = APP.Base.View || APP.Base.Container.extend
( {
	id: 'BaseView',
	name: 'BaseView' ,
	xtype: 'view' ,
	items: [ ] ,
	getItem: function( name )
	{
		for ( var i in this.items )
		{
			if ( name === this.items[ i ].name )
			{
				return this.items[ i ];
			}
		}
		return null;
	} ,
	addListenersById: function( params )	// DEPRECATED
	{
		this.addEventsById( params );
	} ,
	addListenersByClass: function( params )	// DEPRECATED
	{
		this.addEventsByClass( params );
	} ,
	addEventsById: function( params )
	{
		for ( prop in params )
		{
			APP.addEventsById( params[ prop ] , this.getItem( prop ) );
		}
	} ,
	addEventsByClass: function( params )
	{
		for ( prop in params )
		{
			APP.addEventsByClass( params[ prop ] , this.getItem( prop ) );
		}
	}
} );

APP.Base.Element = APP.Base.Element || APP.Base.View.extend
( {
	id: 'BaseElement' ,
	name: 'BaseElement' ,
	xtype: 'element' ,
	attach: null ,
	addEvents: function( events )
	{
		APP.addEventsById( events , this );
	} ,
	addEventsByClass: function( events )
	{
		APP.addEventsByClass( events , this );
	} ,
	mouseover: function( event ){ } ,
	mouseout: function( event ){ } ,
	mouseenter: function( event ){ } ,
	mousemove: function( event ){ } ,
	click: function( event ){ } ,
	blur: function( event ){ } ,
	focus: function( event ){ }
} );

APP.Base.Select = APP.Base.Select || APP.Base.Element.extend
( {
	id: 'Select' ,
	name: 'Select' ,
	xtype: 'select' ,
	type: 'select' ,
	defaultValue: '' ,
	value: null ,
	getValue: function( )
	{ 
		return this.value = this.getElById( ).value;
	} ,
	setValue: function( value )
	{ 
		this.value = value;
		this.getElById( ).value = value;
		return this;
	} ,
	change: function( event ){ }
} );

APP.Base.MultiSelect = APP.Base.MultiSelect || APP.Base.Select.extend
( {
	id: 'MultiSelect' ,
	name: 'MultiSelect' ,
	xtype: 'multiselect' ,
	getValue: function( )
	{ 
		var result = [ ];
		var options = this.getElById( ).options;
		for ( var i = 0; i < options.length; i++ ) 
		{
			if ( options[ i ].selected )
			{
				result.push( options[ i ].value || options[ i ].text );
			}
		}
		return this.value = result;
	}
} );

APP.Base.Button = APP.Base.Button || APP.Base.Container.extend
( {
	id: 'Button' ,
	name: 'Button' ,
	xtype: 'button' ,
	type: 'button' ,
	defaultValue: '' ,
	value: null ,
	attach: null ,
	getValue: function( )
	{
		return this.value = this.getElById( ).value;
	} ,
	setValue: function( value )
	{ 
		this.getElById( ).value = value;
		this.value = value;
		return this;
	} ,
	addEvents: function( events )
	{
		APP.addEventsById( events , this );
	} ,
	addEventsByClass: function( events )
	{
		APP.addEventsByClass( events , this );
	} ,
	mouseover: function( event ){ } ,
	mouseout: function( event ){ } ,
	mouseenter: function( event ){ } ,
	mousemove: function( event ){ } ,
	click: function( event ){ } ,
	blur: function( event ){ } ,
	focus: function( event ){ }
} );

APP.Base.TextField = APP.Base.TextField || APP.Base.Button.extend
( {
	id: 'TextField' ,
	name: 'TextFiled' ,
	type: 'text' ,
	xtype: 'textfield' ,
	change: function( event ){ }
} );


APP.Base.TextArea = APP.Base.TextArea || APP.Base.Button.extend
( {
	id: 'TextArea' ,
	name: 'TextArea' ,
	type: 'text' ,
	xtype: 'textarea' ,
	change: function( event ){ }
} );

APP.Base.CheckBox = APP.Base.CheckBox || APP.Base.Container.extend
( {
	id: 'CheckBox' ,
	name: 'CheckBox' ,
	type: 'checkbox' ,
	xtype: 'checkbox' ,
	checked: '' ,
	attach: null ,
	check: function( checked )
	{
		this.getElByName( )[ 0 ].checked = checked;
		return this;
	} ,
	getValue: function( )
	{ 
		var el = this.getElByName( );
		for ( var i = 0; i < el.length; i++ ) 
		{
			if ( el[ i ].checked )
			{
				this.value = el[ i ].value;
				return this.value;
			}
		}
		return null;
	} ,
	addEvents: function( events )
	{
		APP.addEventsById( events , this );
	} ,
	addEventsByClass: function( events )
	{
		APP.addEventsByClass( events , this );
	} ,
	mouseover: function( event ){ } ,
	mouseout: function( event ){ } ,
	mouseenter: function( event ){ } ,
	mousemove: function( event ){ } ,
	click: function( event ){ } ,
	blur: function( event ){ } ,
	focus: function( event ){ } ,
	change: function( event ){ }
} );

APP.Base.RadioButton = APP.Base.RadioButton || APP.Base.CheckBox.extend
( {
	id: 'RadioButton' ,
	name: 'RadioButton' ,
	type: 'radio' ,
	xtype: 'radiobutton' ,
	items: [ ] ,
	check: function( key , checked )
	{
		this.getElByName( )[ key ].checked = checked;
		return this;
	} ,
	reset: function( )
	{
		var items = this.getElByName( );
		for ( var i = 0; i < items.length; i++ ) 
		{
			this.check( i , 0 );
		}
	}
} );

APP.Base.CheckBoxGroup = APP.Base.CheckBoxGroup || APP.Base.Element.extend
( {
	id: 'CheckBoxGroup' ,
	name: 'CheckBoxGroup[]' ,
	type: 'checkboxgroup' ,
	xtype: 'checkboxgroup' ,
	check: function( key , checked )
	{
		this.getElByName( )[ key ].checked = checked;
		return this;
	} ,
	getValue: function( )
	{ 
		this.value = null;
		var el = this.getElByName( );
		this.vaue = '';
		for ( var i = 0; i < el.length; i++ ) 
		{
			if ( el[ i ].checked ) 
			{
				this.value += ',' + el[ i ].value;
			}
		}
		return this.value = ( this.value.length < 1 ) ? null : this.value.substring( 1 );
	} ,
	reset: function( )
	{
		// to do
	} ,
	change: function( event ){ }
} );

APP.Base.Tabs = APP.Base.Tabs || APP.Base.View.extend
( {
	id: 'BaseTabs',
	name: 'BaseTabs' ,
	xtype: 'tabs' ,
	activeCls: 'active' ,
	activeTab: null ,
	previousTab: null ,
	attachHandlers: function( )
	{
		var items = this.items;
		for ( var a = 0; a < items.length; a++ )
		{
			if ( !items[ a ].handler ){ continue; }
			var el = APP.getElById( items[ a ].handler );
			var fn = ( typeof items[ a ].toggle === 'undefined' ) ? 
									this.toggle : items[ a ].toggle;
			APP.Events.add( items[ a ].handlerEvent , el , fn , [ this , items[ a ] ] );
		}
	} ,
	setActiveTab: function( tab )
	{
		this.previousTab = this.activeTab;
		this.activeTab = tab;
		tab.show( );
		return this;
	} ,
	setActiveCls: function( el )
	{
		APP.addClass( el , this.activeCls );
		return this;
	} ,
	getParentNode: function( node )
	{
		return node.parentNode;
	} ,
	toggle: function( tabs , tab , ev )
	{
		ev.preventDefault( );
		//if ( APP.isVisible( '#' + tab.id ) ){ return false; }
		tabs.setActiveCls( tabs.getParentNode( this ) ).setActiveTab( tab );
		var items = tabs.items;
		for ( var a = 0; a < items.length; a++ )
		{
			if ( items[ a ].handler != tab.handler )
			{
				items[ a ].hide( );
				var parent = tabs.getParentNode( APP.getElById( items[ a ].handler ) );
				APP.removeClass( parent , tabs.activeCls );
			}
		}
		return false;
	}
} );

APP.Base.TabItem = APP.Base.TabItem || APP.Base.View.extend
( {
	id: 'BaseTabItem',
	name: 'BaseTabItem' ,
	xtype: 'tabitem' ,
	handler: null ,
	handlerEvent: 'click' 
} );
