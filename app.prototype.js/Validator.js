APP.Validator = APP.Validator ||
{
	addMethod: function( rule , fn , message )
	{
		this.Methods[ rule ] = fn;
		this.Messages[ rule ] = message;
	} ,
	ErrorClasses:
	{
		label: 'label-error' , 
		input: 'input-error' ,
		hint: 'hint' ,
		hintControls: 'hint-control'
	} ,
	ErrorStyles:
	{
		label: 'color: red;' ,
		input: 'border-color: red !important;color: red !important;' , 
		hint: 'z-index: 1000000;color: red;display: none;position: absolute;min-width: 200px;margin-top: 2px;border: 1px solid red;padding: 6px 12px;background: #fff;' ,
		hintControls: 'top: 20px;'
	} ,
	Messages:
	{
		email			:	'Invalid email address' ,
		required			:	'This field is required' ,
		url				:	'Invalid URL' ,
		currency			:	'Invalid monetary value' ,
		alphanumeric		:	'Use digits and letters only' ,
		number			:	'Use digits only' ,
		numberSpace		:	'Use digits and spaces only' ,
		street_number		:	'Street number only' ,
		equalTo			:	'Please enter the same value' ,
		min				:	'Value must not be smaller then {min}' ,
		max				:	'Value must not be greater then {max}' ,
		minVal			:	'Value must not be smaller then {minVal}' ,
		maxVal			:	'Value must not be greater then {maxVal}' ,
		range			:	'Value must be between {min} and {max}' ,
		rangeVal			:	'Value must be between {minVal} and {maxVal}' ,
		postcode			:	'Invalid postcode' ,
		date				:	'Invalid date' ,
		phone			:	'Use digits and spaces only' ,
		match			:	'Invalid pattern' ,
		decimal			:	'Invalid decimal value'
	} ,
	Regex:
	{
		currency: /^\-?\$?\d{1,2}(,?\d{3})*(\.\d+)?$/ ,
		email: /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ,
		url: /^https?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/ ,
		alphanumeric: /^[0-9A-Za-z]+$/ ,
		street_number: /^\d+[A-Za-z]?(-\d+)?[A-Za-z]?$/ ,
		number: /^\d+$/ ,
		numberSpace: /^[\d\ ]+$/ ,
		postcode: /^\d{4}$/ ,
		date: /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/ ,
		phone: /^\+?[\d\s]+$/ ,
		decimal: /^\d+(,\d{3})*(\.\d+)?$/
	} ,
	Methods:
	{
		required: function( item )
		{
			if ( !item.value ){ return false; }
			return ( item.value.length < 1 ) ? false : true;
		} ,
		email: function( item )
		{
			return APP.Validator.Methods.match( item )
		} ,
		alphanumeric: function( item )
		{
			return APP.Validator.Methods.match( item )
		} ,
		equalTo: function( item , validator , values )
		{
			return ( item.value === values[ item.equalTo ] ) ? true : false;
		} ,
		min: function( item )
		{
			return ( item.min > item.value.length ) ? false : true;
		} ,
		max: function( item )
		{
			return ( item.max < item.value.length ) ? false : true;
		} ,
		minVal: function( item )
		{
			return ( parseInt( item.min ) > parseInt( item.value ) ) ? false : true;
		} ,
		maxVal: function( item )
		{
			return ( parseInt( item.max ) < parseInt( item.value ) ) ? false : true;
		} ,
		phone: function( item )
		{
			return APP.Validator.Methods.match( item );
		} ,
		range: function( item )
		{
			return ( item.min.length > item.value || item.value > item.max.length ) ? false : true;
		} ,
		rangeVal: function( item )
		{
			return ( parseInt( item.min ) > parseInt( item.value ) || 
					parseInt( item.value ) > parseInt( item.max ) ) ? false : true;
		} ,
		currency: function( item )
		{
			return APP.Validator.Methods.match( item );
		} ,
		number: function( item )
		{
			return APP.Validator.Methods.match( item );
		} ,
		numberSpace: function( item )
		{
			return APP.Validator.Methods.match( item );
		} ,
		postcode: function( item )
		{
			return APP.Validator.Methods.match( item );
		} ,
		date: function( item )
		{
			return APP.Validator.Methods.match( item );
		} ,
		url: function( item )
		{
			return APP.Validator.Methods.match( item );
		} ,
		street_number: function( item )
		{
			return APP.Validator.Methods.match( item );
		} ,
		match: function( item )
		{
			var re = new RegExp( APP.Validator._getOption( 'regex' , item ) );
			return ( item.value.match( re ) ) ? true : false;
		} ,
		decimal: function( item )
		{
			return APP.Validator.Methods.match( item );
		}
	} ,
	reset: function( items )
	{
		for ( var i =0; i < items.length; i++ )
		{
			switch( items[ i ].xtype )
			{
				case 'radio': // old code
				case 'radiobutton':
				case 'checkbox':
				case 'checkboxgroup':
					var inputs = items[ i ].getElByName( );
					for ( var c =0; c < inputs.length; c++ )
					{
						APP.removeClass( inputs[ c ] , this.ErrorClasses.input );
						this._setLabelError( inputs[ c ].id , 'remove' );
					}
				break;
				default:
					items[ i ].removeClass( this.ErrorClasses.input );
					this._setLabelError( items[ i ].id , 'remove' );
			}
		}
	} ,
	validate: function( items , values , formName )
	{
		values = ( typeof values === 'undefined' ) ? { } : values;
		var is_valid = true;
		this._Errors = { };
		this._ErrorMsgs = { };
		for ( var i =0; i < items.length; i++ )
		{
			if ( items[ i ].hasOwnProperty( 'validator' ) )
			{
				items[ i ].validatorError = false;
				var rules = this._formatRules( items[ i ].validator );
				for ( var a = 0; a < rules.length; a++ )
				{
					var item = rules[ a ];
					item.value = ( values.hasOwnProperty( item.name ) ) ? 
								values[ item.name ] : items[ i ].getValue( );
					item.message = ( item.hasOwnProperty( 'message' ) ) ?
									item.message : this.Messages[ item.rule ];
					var fn = ( item.hasOwnProperty( 'fn' ) ) ? item.fn : this.Methods[ item.rule ]; 
					if ( ( 'required' === item.rule || 'equalTo' === item.rule || item.value ) && !fn( item , this , values ) )
					{
						is_valid = false;
						if ( !( items[ i ].name in this._Errors ) )
						{
							this._Errors[ items[ i ].name ] = { };
							this._ErrorMsgs[ items[ i ].name ] = { };
						}
						this._Errors[ items[ i ].name ][ item.rule ] = 1; 
						this._ErrorMsgs[ items[ i ].name ][ item.rule ] = this._formatErrorMsg( item.message , item ); 
						if ( !items[ i ].validatorError )
						{
							items[ i ].validatorError = true;
							if ( items[ i ].hasOwnProperty( 'invalidHandler' ) )
							{
								items[ i ].invalidHandler( this , items[ i ] , item );
							}
							else
							{
								switch ( items[ i ].xtype )
								{
									case 'radio': // old code
									case 'radiobutton':
									case 'checkbox':
									case 'checkboxgroup':
										var inputs = items[ i ].getElByName( );
										for ( var c = 0; c < inputs.length; c++ )
										{
											this._setLabelError( inputs[ c ].id , 'add' );
											APP.addClass( inputs[ c ] , this.ErrorClasses.input );
											this._appendMsg( inputs[ c ].id , this._ErrorMsgs[ items[ i ].name ][ item.rule ] );
											this._scrollToEl( inputs[ c ].id );
											APP.Events.add( 'change' , inputs[ c ] , function( event )
											{
												APP.Validator.validateField( this, formName );
											}.bind( items[ i ] ) );
										}
									break;
									default:
										this._setLabelError( items[ i ].id , 'add' );
										items[ i ].addClass( this.ErrorClasses.input );
										this._appendMsg( items[ i ].id , this._ErrorMsgs[ items[ i ].name ][ item.rule ] );
										this._scrollToEl( items[ i ].id );
										APP.Events.add( 'change' , items[ i ] , function( event )
										{
											APP.Validator.validateField( this , formName );
										} );
								}
							}
						}
					}
				}
			}
		}
		this._scrolled = false;
		return { 'isValid': is_valid , 'errors': this._Errors , 'messages': this._ErrorMsgs };
	} ,
	validateField: function( item , formName )
	{
		var values = { };
		values[ item.name ] = item.getValue( );
		var rules = this._formatRules( item.validator );
		for ( var i = 0; i < rules.length; ++i )
		{
			if ( 'equalTo' === rules[ i ].rule )
			{ 
				var equal_to = APP.getForm( formName ).getItem( rules[ i ].equalTo ).id;
				values[ rules[ i ].equalTo ] = APP.getElById( equal_to ).value; 
			}
		}
		var items = [ item ];
		APP.Validator._scrolled = true;
		var validator = this.validate( items , values , formName );
		if ( validator.isValid )
		{
			if ( item.hasOwnProperty( 'validHandler' ) )
			{
				item.validHandler( this , item );
			}
			else
			{
				switch ( item.xtype )
				{
					case 'radio': // old code
					case 'radiobutton':
					case 'checkbox':
					case 'checkboxgroup':
					var inputs = item.getElByName( );
					for ( var c =0; c < inputs.length; c++ )
					{
						APP.removeClass( inputs[ c ] , this.ErrorClasses.input );
						this._setLabelError( inputs[ c ].id , 'remove' );
					}
					break;
					default:
						item.removeClass( this.ErrorClasses.input );
						this._setLabelError( item.id , 'remove' );
				}
			}
		}
	} ,
	setErrorStyle: function( element , css ) 
	{
		var style_sheet = APP.addEl( 'style' );
		if ( style_sheet ) 
		{
			style_sheet.setAttribute( 'type' , 'text/css' );
			var rules = document.createTextNode( element + ' {' + css + '}' );
			if ( style_sheet.styleSheet )
			{
				style_sheet.styleSheet.cssText = rules.nodeValue;
			} 
			else 
			{
				style_sheet.appendChild( rules );
			}
			var head = APP.getElByTag( 'head' )[ 0 ];
			if ( head ) 
			{
				head.appendChild( style_sheet );
			}
		}
	} ,
	_scrolled: false ,
	_Errors: { } ,
	_ErrorMsgs: { } ,
	_Labels: null ,
	_appendMsg: function( itemID , errMsg )
	{
		var item = APP.getElById( itemID );
		var span = APP.getElById( item.id + 'Hint' );
		if ( undefined === span || null === span ) 
		{
			APP.Events.add( 'mouseenter' , item , function( event )
			{
				if ( APP.hasClass( this , APP.Validator.ErrorClasses.input ) )
				{
					APP.getElById( this.id + 'Hint' ).style.display = 'inline';
				}
			} );
			APP.Events.add( 'mouseout' , item , function( event )
			{
				APP.getElById( this.id + 'Hint' ).style.display = 'none';
			} );
			APP.Events.add( 'blur' , item , function( event )
			{
				APP.getElById( this.id + 'Hint' ).style.display = 'none';
			} );
			if ( item.type !== 'checkbox' && item.type !== 'radio' )
			{
				APP.Events.add( 'focus' , item , function( event )
				{
					if ( APP.hasClass( this , APP.Validator.ErrorClasses.input ) )
					{
						APP.getElById( this.id + 'Hint' ).style.display = 'inline';
					}
				} );
			}
		}
		else
		{
			APP.remove( span );
		}
		var hint = APP.addEl( 'span' );
		hint.id = itemID + 'Hint';
		hint.appendChild( document.createTextNode( errMsg ) );			
		switch( item.type )
		{
			case 'checkbox':
			case 'radio': // old code
			case 'radiobutton':
				hint.className = APP.Validator.ErrorClasses.hint + ' ' + APP.Validator.ErrorClasses.hintControls;
				item.parentNode.insertBefore( hint , item );
			break;
			default:
				hint.className = APP.Validator.ErrorClasses.hint;
				item.parentNode.insertBefore( hint , item.nextSibling );
		}
	} ,
	_scrollToEl: function( id )
	{
		if ( !this._scrolled )
		{
			this._scrolled = true;
			APP.getElById( id + 'Hint' ).style.display = 'inline';
			APP.getElById( id ).scrollIntoView( false );
			APP.getElById( id ).focus( );
		}
	} ,
	_setLabelError: function( id , type )
	{
		if ( !this._Labels )
		{
			this._Labels = APP.getElByTag( 'label' );
		}
		for ( var i = 0; i < this._Labels.length; i++ ) 
		{
			if ( id === this._Labels[ i ].htmlFor ) 
			{
				if ( 'add' === type )
				{
					APP.addClass( this._Labels[ i ] , this.ErrorClasses.label );
				}
				else
				{
					APP.removeClass( this._Labels[ i ] , this.ErrorClasses.label );
				}
			}
		}
	} ,
	_getOption: function( propertyName , item )
	{
		var prop = propertyName.charAt( 0 ).toUpperCase( ) + propertyName.slice( 1 );
		//item.propertyName : this[ prop ][ item.rule ];
		return ( item.hasOwnProperty( propertyName ) ) ? 
				item[propertyName] : this[ prop ][ item.rule ];	
	} ,
	_formatErrorMsg: function( message , item )
	{
		return message.replace( '{min}' , item.min ).replace( '{max}' , item.max ).
				replace( '{minVal}' , item.minVal ).replace( '{maxVal}' , item.maxVal );
	} ,
	_formatRules: function( rules )
	{
		if ( rules.constructor === String )
		{ 
			var tmp_rules = rules.split( ',' );
			rules = [ ];
			for ( var c in tmp_rules )
			{
				rules[ c ] = { rule: tmp_rules[ c ] };
			}
		}
		else if ( rules.constructor === Object )
		{
			rules = [ rules ]; 
		}
		return rules;
	}
};
APP.Validator.setErrorStyle( '.' + APP.Validator.ErrorClasses.input , APP.Validator.ErrorStyles.input );
APP.Validator.setErrorStyle( '.' + APP.Validator.ErrorClasses.label , APP.Validator.ErrorStyles.label );
APP.Validator.setErrorStyle( '.' + APP.Validator.ErrorClasses.hint , APP.Validator.ErrorStyles.hint );
APP.Validator.setErrorStyle( '.' + APP.Validator.ErrorClasses.hintControls , APP.Validator.ErrorStyles.hintControls );
