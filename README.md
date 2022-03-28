 # FluidPhp Validator Helper

FluidPhp is a framework based on the PhpToolCase library, visit [phptoolcase.com](http://phptoolcase.com) for complete guides and examples.

This helper can be used to validated request parameters (GET,DELETE,PUT,POST).

## Installation

Add the package to your composer.json file, to install the helper.

With fluidphp framework:
```
"require": 
{
	"fluidphp/website-helper": "*"
} ,
"extra": 
{
	"installer-paths": 
	{
		"./vendor/fluidphp/helpers/Website": ["fluidphp/website-helper"] ,
		"./vendor/fluidphp/helpers/Translator": ["fluidphp/translator-helper"] ,
		"./vendor/fluidphp/helpers/ViewModel": ["fluidphp/viewmodel-helper"]
	}
}
```	
Stand-alone:
```		
"require": 
{
	"fluidphp/website-helper": "*"
}
```

## Project Info

### Project Home

http://phptoolcase.com

### Requirements

php version 5.4+