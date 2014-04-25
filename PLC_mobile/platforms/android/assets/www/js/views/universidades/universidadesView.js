define([
  'underscore',
  'backbone',
  'jquery',
  'facebook',
  'collections/universidades',
  'views/universidades/universidadDetalleView',
  'text!templates/universidades/listaUniversidades.html',
	], function(_, Backbone,$,FB, Universidades, UniversidadDetalleView,templateUniversidades){
	var UniversidadesView = Backbone.View.extend({
			
		events : {
		},
		
	
		initialize: function() {
			_.bindAll(this, "render"); // Needed for including "this" context in functions
			this.template = _.template(templateUniversidades);   
			
			this.myfbtoken = "";
			var me = this;
			FB.login();     
			
						
			this.universidades = new Universidades();
			col = this.universidades;
			this.universidades.on("reset", this.render);
			this.universidades.fetch();
			
			FB.getLoginStatus(function(response) {
			  if (response.status === 'connected') {
				// the user is logged in and has authenticated your
				// app, and response.authResponse supplies
				// the user's ID, a valid access token, a signed
				// request, and the time the access token 
				// and signed request each expire
				var accessToken = response.authResponse.accessToken;
				me.myfbtoken = accessToken;
				me.universidades.setToken(accessToken);
			  } else if (response.status === 'not_authorized') {
				// the user is logged in to Facebook, 
				// but has not authenticated your app
			  } else {
				// the user isn't logged in to Facebook.
			  }
			 });

		},
		

		
		render: function() {
			var universidades = this.universidades;
			var myElement = this.$el;
			var template = this.template;
			
			var html = template();
			
			myElement.html(html);
		
			
			// Recorre cada sede y construye página con selector
			universidades.each(function(universidad) {
				var viewSede = new UniversidadDetalleView({model:universidad});
				
				elementSedeIndividual = viewSede.render().$el;
				
				myElement.find("#lista_universidades").append(elementSedeIndividual);
			
				
			});
			
		
			return this
		}
	
	});
  
  return UniversidadesView;
});