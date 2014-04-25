define([
  'underscore',
  'backbone',
  'jquery',
  'models/universidad',
  'text!templates/universidades/itemLista.html',
	], function(_, Backbone,$, Universidad, templateUniversidad){
	var universidadDetalleView = Backbone.View.extend({
		tagName:"div",
		className:"detalleListaUniversidad",
		
  		events: {
    		"change input.nombre":  "contentChanged"
 		},

		initialize: function() {
			_.bindAll(this, "render", 'contentChanged'); // Needed for including "this" context in functions
			this.template = _.template(templateUniversidad);        
						
			this.model.on("change", this.render);
		},
		
		contentChanged: function(e) {
			
			var nuevonombre = $(e.target).val();
			this.model.set("nombre", nuevonombre);
			
			//Guardar en base de datos
			this.model.save({nombre: nuevonombre});

  		},		
				

				
		render: function() {
			var universidad = this.model;
			var data = universidad.toJSON();
			var html = this.template(data);
			
			this.$el.html(html);
			

								
			return this
		}
	
	});
  
  return universidadDetalleView;
});