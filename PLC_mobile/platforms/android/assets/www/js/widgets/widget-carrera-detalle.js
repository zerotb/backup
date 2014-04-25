// Filename: app.js
define([
	"jquery",
	"views/carreras/carreraDetalleView"
	], 
	function($,CarreraDetalleView) {
		var init = function(options) {
			// Obtiene parámetros:
			// container: elemento en el cual incorporar datos de carrera
			// codCarrera: código de la carrera a desplegar
			var idwidgetContainer = (options.container != null) ? options.container : "mywidget";			
			var idCarrera = (options.idCarrera != null) ? options.idCarrera : "C1";
			var dataBaseUrl = (options.dataBaseUrl != null) ? options.dataBaseUrl : ".";
			
			// Genera vista para la carrera respectiva
			var view = new CarreraDetalleView({el:$("#"+idwidgetContainer), idCarrera:idCarrera, dataBaseUrl:dataBaseUrl});
		};
		
		
		return { 
			init: init
		};
	}
);
		
