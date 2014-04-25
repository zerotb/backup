// Filename: app.js
define([
	"jquery",
	"views/sedes/sedesSelectorView"
	], 
	function($,SedesSelectorView) {
		var init = function(options) {
			// Obtiene parámetros:
			// container: elemento en el cual incorporar datos de carrera
			// codCarrera: código de la carrera a desplegar
			var idwidgetContainer = (options.container != null) ? options.container : "mywidget";			
			var dataBaseUrl = (options.dataBaseUrl != null) ? options.dataBaseUrl : ".";
			var idSede = (options.idSede != null) ? options.idSede : "0";

			// Genera vista listar las sedes respectiva
			var view = new SedesSelectorView({el:$("#"+idwidgetContainer), idSede:idSede, dataBaseUrl:dataBaseUrl});
		};
		
		
		return { 
			init: init
		};
	}
);
		
