// Filename: widget-areas.js
define([
	"jquery",
	"views/areas/areaSubmenuConveniosView"
	], 
	function($, AreaSubmenuConveniosView ) {
		var init = function(options) {
			// Obtiene parámetros:
			// container: elemento en el cual incorporar datos de carrera
			// codCarrera: código de la carrera a desplegar
			var idwidgetContainer = (options.container != null) ? options.container : "mywidget";
			var idArea = (options.idArea != null) ? options.idArea : "1";			
			var dataBaseUrl = (options.dataBaseUrl != null) ? options.dataBaseUrl : ".";
			
			// Genera vista listar las sedes respectiva
			var view = new AreaSubmenuConveniosView({el:$("#"+idwidgetContainer),idArea:idArea, dataBaseUrl:dataBaseUrl});
		};
		
		
		return { 
			init: init
		};
	}
);
		
		
