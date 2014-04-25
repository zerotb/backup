App.views.MenuMainView = Backbone.View.extend({

	/**
	* @class ConsultaMainView vista principal para administración de personas
	*
	* @augments Backbone.View
	* @constructs
	*
	* @param {object} options parametros de incializacion
	* @param {string} options.el Identificador de elemento en DOM donde se despliegau la vista
	* @param {string} options.collection Colección (personas) utilizada en la administración de personas
	* 
	* AdminPersonaMainView Construye las distintas vistas que administran el listado,
	* actualización, eliminación y creación de personas
	*/
	initialize: function() {
		var self = this;
		this.template = _.template($("#template_MenuMainView").html());		
		/*this.templateSesion = _.template($("#template_SesionMainView").html());
		this.sesion = new App.models.Sesiones();		
        this.sesion.fetch({success:function(model,resp){
        	
        }});*/
		self.render();        
	},
	render: function() {		
		this.$el.html(this.template());
		//var data = this.sesion.toJSON();
		//$("#sesionName").html(this.templateSesion(data));
		return this;
	}
});
