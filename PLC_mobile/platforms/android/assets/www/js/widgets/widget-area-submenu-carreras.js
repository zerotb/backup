// Filename: widget-areas.js
define([
	"jquery",
	"views/areas/areaSubmenuCarrerasView"
	], 
	function($,AreaSubmenuCarrerasView ) {
		var init = function(options) {
			// Obtiene parámetros:
			// container: elemento en el cual incorporar datos de carrera
			// codCarrera: código de la carrera a desplegar
			var idwidgetContainer = (options.container != null) ? options.container : "mywidget";
			var idArea = (options.idArea != null) ? options.idArea : "1";			
			var dataBaseUrl = (options.dataBaseUrl != null) ? options.dataBaseUrl : ".";
			
			//a=new AreaSubmenuCarrerasView();
			
			// Genera vista listar las sedes respectiva
			var view = new AreaSubmenuCarrerasView({el:$("#"+idwidgetContainer),idArea:idArea, dataBaseUrl:dataBaseUrl});
		};
		
		
		return { 
			init: init
		};
	}
);
		
		
