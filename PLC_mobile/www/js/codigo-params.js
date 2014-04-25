/**
* Parametros - TIPO ORGANIZACIOM
*/
App.views.ParametrosEstadoEspecialView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.EstadosEspeciales();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosEstadosEspecialesView").html());

		/*this.render();*/
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		//if(this.options.todo=="si")
		this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosEstadosEspecialesItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})
		try{
			if(this.model.attributes.estado_especial)
				this.$(".select.options").attr("value", this.model.attributes.estado_especial)
		}
		catch(ex){
			
		}

		return this;
	},
	setSelectedOption: function(option){
		this.$(".select.options").attr("value", option)
	},


	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosSectorGeograficoItemView 
*/
App.views.ParametrosEstadosEspecialesItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosEstadosEspecialesItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});












/**
* Parametros - TIPO ORGANIZACIOM
*/
App.views.ParametrosTipoRelacionOrganizacionView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.TipoRelacionOrganizacion();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosTipoRelacionOrganizacionView").html());

		/*this.render();*/
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		if(this.options.todo=="si")
			this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosTipoRelacionOrganizacionItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})
		// try{
		// 	if(this.model.attributes.origen_pj)
		// 		this.$(".select.options").attr("value", this.model.attributes.origen_pj)
		// }
		// catch(ex){
		// 	console.log("corregir esto");
		// }

		return this;
	},
	setSelectedOption: function(option){
		this.$(".select.options").attr("value", option)
	},


	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosSectorGeograficoItemView 
*/
App.views.ParametrosTipoRelacionOrganizacionItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosTipoRelacionOrganizacionItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});







/**
* Parametros - TIPO ORGANIZACIOM
*/
App.views.ParametrosOrigenPjView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.OrigenPJ();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosOrigenPjView").html());

		/*this.render();*/
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosOrigenPjItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})
		try{
			if(this.model.attributes.origen_pj)
				this.$(".select.options").attr("value", this.model.attributes.origen_pj)
		}
		catch(ex){
			
		}

		return this;
	},
	setSelectedOption: function(option){
		this.$(".select.options").attr("value", option)
	},


	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosSectorGeograficoItemView 
*/
App.views.ParametrosOrigenPjItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosOrigenPjItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});




/**
* Parametros - TIPO ORGANIZACIOM
*/
App.views.ParametrosTipoOrganizacionView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.TipoOrganizacion();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosTipoOrganizacionView").html());

		/*this.render();*/
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosTipoOrganizacionItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})
		try{
			if(this.model.attributes.tipo_organizacion_id)
				this.$(".select.options").attr("value", this.model.attributes.tipo_organizacion_id)
		}
		catch(ex){
			
		}

		return this;
	},
	setSelectedOption: function(option){
		this.$(".select.options").attr("value", option)
	},


	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosSectorGeograficoItemView 
*/
App.views.ParametrosTipoOrganizacionItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosTipoOrganizacionItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});







/**
* Parametros - Comuna
*/
App.views.ParametrosComunaView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.Comuna();
		this.collection.fetch();

		

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosComunaView").html());
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		//this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {

			var itemView = new App.views.ParametrosComunaItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})
		if(this.model.attributes.comuna_id)
			this.$(".select.options").attr("value", this.model.attributes.comuna_id)
		return this;
	},

	setSelectedOption: function(option){
		this.$(".select.options").attr("value", option)
	},

	close: function() {
		this.remove();
		this.unbind();
	}
});

/**
* @class Comuna
*/
App.views.ParametrosComunaItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosComunaItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});


/**
* Parametros - Comunidad
*/
App.views.ParametrosComunidadView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.Comunidad();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosComunidadView").html());
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosComunidadItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})
		if(this.model.attributes.id_comunidad)
			this.$(".select.options").attr("value", this.model.attributes.id_comunidad)

		return this;
	},

	setSelectedOption: function(option){
		this.$(".select.options").attr("value", option)
	},

	close: function() {
		this.remove();
		this.unbind();
	}
});

/**
* @class Comunidad
*/
App.views.ParametrosComunidadItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosComunidadItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id_comunidad);

		return this;
	},


	close: function() {
		this.remove();
		this.unbind();
	}

});








/**
* Parametros - LOCALIDAD
*/
App.views.ParametrosLocalidadView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.Localidad();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosLocalidadView").html());
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosLocalidadItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})
		if(this.model.attributes.id_localidad)
			this.$(".select.options").attr("value", this.model.attributes.id_localidad)


		return this;
	},

	setSelectedOption: function(option){
		this.$(".select.options").attr("value", option)
	},

	close: function() {
		this.remove();
		this.unbind();
	}
});

/**
* @class ParametrosLocalidadItemView
*/
App.views.ParametrosLocalidadItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosLocalidadItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id_localidad);

		return this;
	},


	close: function() {
		this.remove();
		this.unbind();
	}

});


/**
* Parametros - SectorGeografico
*/
App.views.ParametrosSectorGeograficoView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.SectorGeografico();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosSectorGeograficoView").html());

		/*this.render();*/
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		if(this.options.todo=="si")
			this.$(".select.options").append("<option value=''>Todos</option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosSectorGeograficoItemView({model:item})
			//self.$el.find(".select.options").append(itemView.render().$el);
			self.$(".select.options").append(itemView.render().$el);
		})
		try{
			if(this.model.attributes.sector_geografico_id)
				this.$(".select.options").attr("value", this.model.attributes.sector_geografico_id)
		}
		catch(ex){
			
		}

		return this;
	},
	setSelectedOption: function(option){
		this.$(".select.options").attr("value", option)
	},


	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosSectorGeograficoItemView 
*/
App.views.ParametrosSectorGeograficoItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosSectorGeograficoItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});


/**
* Parametros - GENERO
*/
App.views.ParametrosGeneroView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.Genero();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosGeneroView").html());

		/*this.render();*/
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosGeneroItemView({model:item})
			self.$el.find(".select.options").append(itemView.render().$el);
		})
		if(this.model.attributes.tipo_genero_cod)
			this.$(".select.options").attr("value", this.model.attributes.tipo_genero_cod)

		return this;
	},


	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosGeneroItemView 
*/
App.views.ParametrosGeneroItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosGeneroItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.cod);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});
 

/**
* Parametros - Tipo Persona
*/
App.views.ParametrosTipoPersonaView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.TipoPersona();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosTipoPersonaView").html());

		/*this.render();*/
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		if(this.options.todo=="si")
			this.$(".select.options").append("<option value=''>Todos</option>");
	//	this.$(".select.options").append("<option value=''>Todo</option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosTipoPersonaItemView({model:item})
			self.$el.find(".select.options").append(itemView.render().$el);
		})
		try{
			if(this.model.attributes.tipo_persona_cod)
				this.$(".select.options").attr("value", this.model.attributes.tipo_persona_cod)
		}
		catch(ex){
				
		}

		return this;
	},


	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosTipoPersonaItemView 
*/
App.views.ParametrosTipoPersonaItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosTipoPersonaItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.cod);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});

/**
* Parametros - Tipo Estado Civil
*/
App.views.ParametrosTipoEstadoCivilView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.TipoEstadoCivil();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosTipoEstadoCivilView").html());

		/*this.render();*/
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosTipoEstadoCivilItemView({model:item})
			self.$el.find(".select.options").append(itemView.render().$el);
		})
		try{
			if(this.model.attributes.tipo_estado_civil_cod)
				this.$(".select.options").attr("value", this.model.attributes.tipo_estado_civil_cod)
			}
		catch(ex){
			
		}

		return this;
	},


	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosTipoEstadoCivilItemView 
*/
App.views.ParametrosTipoEstadoCivilItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosTipoEstadoCivilItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.cod);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});


/**
* Parametros - Prevision
*/
App.views.ParametrosPrevisionView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.Prevision();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosPrevisionView").html());
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosPrevisionItemView({model:item})
			self.$el.find(".select.options").append(itemView.render().$el);
		})
		try{
			if(this.model.attributes.tipo_prevision_cod)
				this.$(".select.options").attr("value", this.model.attributes.tipo_prevision_cod)
		}
		catch(ex){
			
		}

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosPrevisionItemView
*/
App.views.ParametrosPrevisionItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosPrevisionItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.cod);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});


/**
* Parametros - Escolaridad
*/
App.views.ParametrosEscolaridadView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.Escolaridad();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosEscolaridadView").html());
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosEscolaridadItemView({model:item})
			self.$el.find(".select.options").append(itemView.render().$el);
		})
		try{
			if(this.model.attributes.tipo_escolaridad_cod)
				this.$(".select.options").attr("value", this.model.attributes.tipo_escolaridad_cod)
			}
		catch(ex){
			
		}


		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosEscolaridadItemView
*/
App.views.ParametrosEscolaridadItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosEscolaridadItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.cod);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});



/**
* Parametros - ActividadLaboral
*/
App.views.ParametrosActividadLaboralView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.ActividadLaboral();
		this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosActividadLaboralView").html());
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		this.$(".select.options").append("<option value=''></option>");
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosActividadLaboralItemView({model:item})
			self.$el.find(".select.options").append(itemView.render().$el);
		})
		try{
			if(this.model.attributes.tipo_actividad_laboral_id)
				this.$(".select.options").attr("value", this.model.attributes.tipo_actividad_laboral_id)
			}
		catch(ex){
			
		}

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosActividadLaboralItemView
*/
App.views.ParametrosActividadLaboralItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosActividadLaboralItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id);

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}

});



/**
* Parametros - SubtipoServicio
*/
App.views.ParametrosSubtipoServicioView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.SubtipoServicio();
		// this.collection.fetch();

		this.collection.on("sync", this.render, this);

		this.template = _.template($("#template_ParametrosSubtipoServicioView").html());
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosSubtipoServicioItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})

		this.$(".select.options").attr("value", this.option)

		return this;
	},

	setSelectedOption: function(option){
		this.option = option;
	},


	setServicio: function(servicioId){
		var self=this;

		this.collection.setServicio(servicioId);
		this.collection.fetch({
			success: function(){
				self.render();
			}
		});
	},

	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosSubtipoServicioItemView
*/
App.views.ParametrosSubtipoServicioItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosSubtipoServicioItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id);

		return this;
	},


	close: function() {
		this.remove();
		this.unbind();
	}

});




/**
* Parametros - EstadoSolicitud
*/
App.views.ParametrosEstadoSolicitudView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.EstadoSolicitud();
		this.collection.fetch();

		//this.collection.on("sync", this.render, this);
		this.listenTo(this.collection,"sync",this.render)

		this.template = _.template($("#template_ParametrosEstadoSolicitudView").html());
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		// this.$(".select.options").append("<option value=''></option>");

		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosEstadoSolicitudItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})

		return this;
	},

	setSelectedOption: function(option){
		this.$(".select.options").attr("value", option)
	},

	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosEstadoSolicitudItemView
*/
App.views.ParametrosEstadoSolicitudItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosEstadoSolicitudItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id);

		return this;
	},


	close: function() {
		this.remove();
		this.unbind();
	}

});


/**
* Parametros - EstadoSolicitudFiltro
*/
App.views.ParametrosEstadoSolicitudFiltroView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.EstadoSolicitud();
		this.collection.fetch();

		//this.collection.on("sync", this.render, this);
		this.listenTo(this.collection,"sync",this.render)

		this.template = _.template($("#template_ParametrosEstadoSolicitudView").html());
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());
		this.$(".select.options").append("<option value=''>Todos</option>");

		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosEstadoSolicitudFiltroItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})

		return this;
	},

	setSelectedOption: function(option){
		this.$(".select.options").attr("value", option)
	},

	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosEstadoSolicitudFiltroItemView
*/
App.views.ParametrosEstadoSolicitudFiltroItemView = Backbone.View.extend({
	tagName: "option",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosEstadoSolicitudItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();

		this.$el.html(this.template(data));
		this.$el.attr("value", data.id);

		return this;
	},


	close: function() {
		this.remove();
		this.unbind();
	}

});



/**
* Parametros - VersionSolicitud
*/
App.views.ParametrosVersionSolicitudView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.collection = new App.collections.VersionSolicitud();
		

		//this.collection.on("sync", this.render, this);
		this.listenTo(this.collection,"sync",this.render)

		this.isReverse = false;

		this.template = _.template($("#template_ParametrosVersionSolicitudView").html());
			
	}, 

	render: function() {
		var self=this;

		this.$el.html(this.template());

		if(this.isReverse===false){
			this.collection.models.reverse();
			this.isReverse=true;
		}
		
		this.collection.each(function(item) {
			var itemView = new App.views.ParametrosVersionSolicitudItemView({model:item})
			self.$(".select.options").append(itemView.render().$el);
		})

		this.$(".select.options").attr("value", this.option);
		return this;
	},

	setSelectedOption: function(option){
		this.option = option;
	},

	setIdSolicitud: function(idSolicitud){
		this.idSolicitud = idSolicitud;
		this.collection.setIdSolicitud(this.idSolicitud);
		this.collection.fetch();
		
	},

	close: function() {
		this.remove();
		this.unbind();
	}



});

/**
* @class ParametrosVersionSolicitudItemView
*/
App.views.ParametrosVersionSolicitudItemView = Backbone.View.extend({
	tagName: "option",


	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ParametrosVersionSolicitudItemView").html());
		this.render();
	}, 

	render: function() {
		var self=this;
		var data = this.model.toJSON();
		data.version_date = formatFechaHora(data.version_date);

		for (member in data) {
		    if (data[member] == null){
		    	data[member] = ""
		    }
		}

		this.$el.html(this.template(data));
		this.$el.attr("value", data.version);

		return this;
	},


	close: function() {
		this.remove();
		this.unbind();
	}

});

/**
* @class ParametrosEstadoSolicitudItemView
*/
App.views.SesionView = Backbone.View.extend({	
	initialize: function() {
		var self = this;
		this.template = _.template($("#template_SesionMainView").html());
		App.models.sesion.fetch({dataType: "jsonp",timeout: 3000,success:function(model,resp){    		
			var data = model.toJSON();			
			App.token=data.token;
			App.views.menuMainView = new App.views.MenuMainView({
		        el:$(".seccion.menu")
			});
			self.render();
        }});
	},
	render: function(){		
		var self=this;
		var data = this.model.toJSON();
		this.$el.html(this.template(data));
		if(typeof(data['auth'])!="undefined"){
			$.each(data['auth'], function(index, value) {
				$('.perfil_'+value['perfil']).addClass('permit');
			});
		}
		
		$('.perfiles:not(.permit)').each(function() {
			$(this).addClass('disabled').attr('disabled',true);
			$(this).children('a').attr('href','#');
		});
		
		//Ocultando opciones no disponibles para el perfil
		/*if($('#menuSuperior .perfil_servicios ul.dropdown-menu li').length==0){
			$('.perfil_servicios').remove();
		}
		if($('#menuSuperior .perfil_gestion_administracion ul.dropdown-menu li').length==0){
			$('.perfil_gestion_administracion').remove();
		}*/
		
		
		$('.seccion.menu').show();
		$('#menuSuperior').show();
		return this;
	}
});
