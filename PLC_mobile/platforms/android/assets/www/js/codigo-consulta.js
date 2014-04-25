App.views.ConsultaMainView = Backbone.View.extend({

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

		this.template = _.template($("#template_ConsultaMainView").html());
		
		this.render();


		// Header View
		this.personaBuscada = new App.models.Persona({rut:""}); // Persona nueva con rut vacío

		this.busquedaView = new App.views.ConsultaBusquedaView({model:this.personaBuscada})
		this.$el.find(".consulta.busqueda").html(this.busquedaView.$el)

		this.infoGeneralView = new App.views.ConsultaInfoGeneralView({model:this.personaBuscada})
		this.$el.find(".consulta.info_general").html(this.infoGeneralView.$el)

		this.fichaView = new App.views.ConsultaFichaView({model:this.personaBuscada})
		this.$el.find(".consulta.ficha").html(this.fichaView.$el)

		// this.$(".consulta.info_general").hide();
		// this.$(".consulta.ficha").hide();


	},

	// Muestra mensajes en la vista
	showAlert : function(msg) {
		this.$alert.html(msg);
	},

	render: function() {
		this.$el.html(this.template());

		return this;
	},


	consulta : function(rut) {
		var self = this;
		this.personaBuscada = new App.models.Persona();
		this.personaBuscada.set("rut", rut);

		mensajeCargando();
		this.personaBuscada.fetch({
			success:function(){
				ocultarMensajeCargando();
			}
		});

		this.personaBuscada.on("sync", function() {
			this.solicitudes.fetch();
			this.hogares.fetch();
			this.organizaciones.fetch();
			this.miembros.fetch();


		});

		this.listenTo(this.personaBuscada, "sync", function(){
			if(self.personaBuscada.attributes._id == ""){
				mensajeParaMantenedor(plcMensajes.consulta.msjRutNoexiste, "alert-danger");


				// Info General
				if (self.infoGeneralView) self.infoGeneralView.close();

				
				// Ficha
				if (self.fichaView) self.fichaView.close();

				
				// Localizacion
				if (self.localizacionView) self.localizacionView.close();
			}

		});

					// Busqueda
				if (self.busquedaView) self.busquedaView.close();
				self.busquedaView = new App.views.ConsultaBusquedaView({model:self.personaBuscada})
				self.$el.find(".consulta.busqueda").html(self.busquedaView.$el)

				// Info General
				if (self.infoGeneralView) self.infoGeneralView.close();
				self.infoGeneralView = new App.views.ConsultaInfoGeneralView({model:self.personaBuscada});
				self.$el.find(".consulta.info_general").html(self.infoGeneralView.$el);
				
				// Ficha
				if (self.fichaView) self.fichaView.close();
				self.fichaView = new App.views.ConsultaFichaView({model:self.personaBuscada});
				self.$el.find(".consulta.ficha").html(self.fichaView.$el);
				
				// Localizacion
				if (self.localizacionView) self.localizacionView.close();
				self.localizacionView = new App.views.ConsultaLocalizacionView({model:self.personaBuscada});
				self.$el.find(".consulta.localizacion").html(self.localizacionView.$el);


	}




});

/**
* @class ConsultaBusquedaView vista con listado de personas
* 
* Construye una grilla con el listado de personas, incluyendo opciones para editar y eliminar los items
* permite también agregar nuevos items
*/
App.views.ConsultaBusquedaView = Backbone.View.extend({
	events: {
		"change .form-control.rut":"buscaPersona"
	},

	initialize: function() {
		var self = this;

		this.template = _.template($("#template_ConsultaBusquedaView").html());
		this.render();
	}, 

	render: function() {
		var self=this;

		var data = this.model.toJSON();
		

		data.rut_digito = data.rut+"-"+entregarDigitoVerificador(data.rut);

		if(data.rut_digito == "-0"){
			data.rut_digito = "";
		}
		this.$el.html(this.template(data));

		return this;
	},
	
	buscaPersona: function(e) {
		var self = this;

		var rutCompleto = ""+$(e.currentTarget).val();

		if(rutCompleto == ""){
			mensajeParaMantenedor(plcMensajes.consulta.msjIngresarRut,"alert-danger");
		}else{
			rutCompleto = rutCompleto.split(".").join(""); 
			var rut = rutCompleto.split("-");

			App.router.navigate("consulta/persona/"+rut[0], {trigger: true});

			App.views.consultaMainView.$(".consulta.info_general").show();
			App.views.consultaMainView.$(".consulta.ficha").show();
		}
	},

	close: function() {
		this.remove();
		this.unbind();
	}


});

/**
* ConsultaInfoGeneralView
*/
App.views.ConsultaInfoGeneralView = Backbone.View.extend({
	initialize: function() {
		var self = this;

		this.model.on("sync", this.render, this);
		
		this.template = _.template($("#template_ConsultaInfoGeneralView").html());
		
	}, 

	render: function() {
		var self=this;


		var data = this.model.toJSON();
		for (member in data) {
		    if (data[member] == null){
		    	data[member] = ""
		    }
		}
		data.rut_digito = data.rut+"-"+entregarDigitoVerificador(data.rut);
		if(typeof data._embedded.tipoOrganizacion == "undefined"){
			data._embedded.tipoOrganizacion = {"_label":""};
		} 
		this.$el.html(this.template(data));

		this.checkTipoPersona();


		return this;
	},

	checkTipoPersona : function() {
		if (this.model.isPersonaNatural()) {

			this.$("div.apellidos").show();
			this.$("div.datos_pj").hide();
			

		} else {
			
			this.$("div.apellidos").hide();
			this.$("div.datos_pj").show();
			

		}
	},

	close: function() {
		this.remove();
		this.unbind();
	}


});


/**
* ConsultaFichaView
*/
App.views.ConsultaFichaView = Backbone.View.extend({
	initialize: function() {
		var self = this;

		this.model.on("sync", this.render, this);
		this.template = _.template($("#template_ConsultaFichaView").html());
		



		this.localizacionView = new App.views.ConsultaLocalizacionView({model:this.model})

		this.datosPersonalesView = new App.views.ConsultaDatosPersonalesView({model:this.model})
	
		this.serviciosSolicitadosView = new App.views.ConsultaServiciosSolicitadosView({collection:this.model.solicitudes})
		// this.serviciosSolicitadosView = new App.views.ConsultaServiciosSolicitadosView();

		this.grupoHogarView = new App.views.ConsultaGrupoHogarView({collection:this.model.hogares})

		this.organizacionesView = new App.views.ConsultaOrganizacionesView({collection:this.model.organizaciones})

		this.miembrosView = new App.views.ConsultaMiembrosView({collection:this.model.miembros})
		
	}, 

	render: function() {
		var self=this;


		this.$el.html(this.template());

		this.$(".consulta.info.localizacion").html(this.localizacionView.$el);

		this.$(".consulta.info.datos_personales").html(this.datosPersonalesView.$el);

		this.$(".consulta.info.servicios_solicitados").html(this.serviciosSolicitadosView.$el);

		this.$(".consulta.info.grupo_hogar").html(this.grupoHogarView.$el);

		this.$(".consulta.info.organizaciones").html(this.organizacionesView.$el);

		this.$(".consulta.info.miembros").html(this.miembrosView.$el);

		this.checkTipoPersona();

		return this;
	},

	checkTipoPersona : function() {
		if (this.model.isPersonaNatural()) {

			this.$(".tab.miembros").hide();

		} else {
			
			this.$(".tab.datos_personales").hide();
			this.$(".tab.grupo_hogar").hide();
			this.$(".tab.organizaciones").hide();

		}
	},
	
	close: function() {
		this.remove();
		this.unbind();
	}





});



/**
* ConsultaLocalizacionView
*/
App.views.ConsultaLocalizacionView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		
		this.model.on("sync", this.render, this);

		this.template = _.template($("#template_ConsultaLocalizacionView").html());
			
	}, 

	render: function() {
		var self=this;

		var data = this.model.toJSON();
		for (member in data) {
		    if (data[member] == null){
		    	data[member] = ""
		    }
		}

		if(typeof data._embedded.comuna == "undefined"){
			data._embedded.comuna = {"_label":""};
		} 
		if(typeof data._embedded.sectorGeografico == "undefined"){
			data._embedded.sectorGeografico = {"_label":""};
		}
		if(typeof data._embedded.localidad == "undefined"){
			data._embedded.localidad = {"_label":""};
		}
		if(typeof data._embedded.comunidad == "undefined"){
			data._embedded.comunidad = {"_label":""};
		}

		this.$el.html(this.template(data));

			if(this.model.attributes.latitud)
				initializeMapa(this.model.attributes.latitud, this.model.attributes.longitud);
			else
				initializeMapa(variableGlobales.latitud(), variableGlobales.longuitud());

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}



});



/**
* ConsultaDatosPersonalesView
*/
App.views.ConsultaDatosPersonalesView = Backbone.View.extend({
	
	"events":{
		"click .btn.calendar": "datepicker"

	},

	initialize: function() {
		var self = this;

		this.model.on("sync", this.render, this);

		this.template = _.template($("#template_ConsultaDatosPersonalesView").html());


	}, 

	render: function() {
		var self=this;

		var data = this.model.toJSON();
		data.fecha_nacimiento = formatFecha(data.fecha_nacimiento);
		for (member in data) {
		    if (data[member] == null){
		    	data[member] = ""
		    }
		}

		if(typeof data._embedded.actividadLaboral == "undefined"){
			data._embedded.actividadLaboral = {"_label":""};
		} 
		if(typeof data._embedded.escolaridad == "undefined"){
			data._embedded.escolaridad = {"_label":""};
			console.log("");
		}

		this.$el.html(this.template(data));


		

		return this;
	},

	datepicker: function(){
		this.$(".btn.calendar").datepicker();
	}





});



/**
* ConsultaServiciosSolicitadosView
*/
App.views.ConsultaServiciosSolicitadosView = Backbone.View.extend({
	events:{
		"click .paginacion.numero": "paginacion"
	},


	initialize: function() {
		var self = this;


		this.template = _.template($("#template_ConsultaServiciosSolicitadosView").html());

		this.listenTo(this.collection, "sync", this.render);
		// this.collection.on("sync", this.render, this)
		this.listenTo(this, "filtrar", this.filtrarSolicitudes);

		this.paginaSeleccionada = 1;
	}, 

	render: function() {
		var self=this;

		var data = this.collection.toJSON();
		data.cantidadRegistros = this.collection.cantidadRegistros;
		this.$el.html(this.template(data));

		this.collection.each(function(item) {
			var itemView = new App.views.ConsultaServiciosSolicitadosItemView({model:item})
			self.$el.find("table.solicitudes").append(itemView.$el);
		})

		//NUMERO FIJO SOLO PARA USO EN EL SERVIDOR LOCAL (CAMBIAR PARA URANIO)
		this.paginas = Math.ceil(data.cantidadRegistros/10);

		// this.paginas = 3;//****
		this.comienzo = 1;
		this.fin = this.paginas+1;

		if(this.paginas > 7){

			this.comienzo = Number(this.paginaSeleccionada) - 3;
			this.fin = Number(this.paginaSeleccionada) + 4;

			if(this.comienzo < 1){
				
				this.fin = Number(this.fin) + 4 ;
				
				if(this.comienzo == -2){ this.fin = this.fin - 1; console.log("fin - 1");}
				if(this.comienzo == -1){ this.fin = this.fin - 2; console.log("fin - 2");}
				if(this.comienzo == 0){ this.fin = this.fin - 3; console.log("fin - 3");}
				

				this.comienzo = 1;
				
			}


			if(this.fin > this.paginas){
				this.fin = this.paginas+1;

				var diferencia = Number(this.paginas) - Number(this.paginaSeleccionada) 

				
				if(diferencia == 2){ this.comienzo = this.comienzo - 1; console.log("comienzo - 1");}
				if(diferencia == 1){ this.comienzo = this.comienzo - 2; console.log("comienzo - 2");}
				if(diferencia == 0){ this.comienzo = this.comienzo - 3; console.log("comienzo - 3");}
				
			}
		}

		console.log("paginas : "+this.paginas+" - comienzo : "+this.comienzo+" - fin : "+this.fin);

		var htmlPaginas = "<li><a class='paginacion numero'>&laquo;</a></li>";

		for(var i=this.comienzo; i<this.fin; i++){
			var numero = i;
			htmlPaginas = htmlPaginas+"<li><a class='paginacion numero "+numero+"'>"+numero+"</a></li>" 
		}

		htmlPaginas = htmlPaginas+"<li><a class='paginacion numero'>&raquo;</a></li>" 

		if(this.paginas == 0){
			htmlPaginas = "";

		}
		

		$("ul.pagination").html(htmlPaginas);
		this.$(".paginacion.numero."+this.paginaSeleccionada+"").parent().addClass("active");

		return this;
	},

	paginacion: function(e) {



		var filtro = [];
		
		this.paginaSeleccionada = e.currentTarget.innerText;

		if(this.paginaSeleccionada == "«"){
			this.paginaSeleccionada = 1;
		}

		if(this.paginaSeleccionada == "»"){
			this.paginaSeleccionada = this.paginas;
		}

		var offset = ""+(this.paginaSeleccionada-1)*10;
		var limit = "20";

		console.log("OFFSET: "+offset+" LIMIT: "+limit);

		if (offset) {filtro.push({"filtro":"offset", valor:offset})};
		if (limit) {filtro.push({"filtro":"limit", valor:limit})};

		this.trigger("filtrar", filtro)

		console.log("pagination : "+e.currentTarget.innerText);
		this.$(".paginacion.numero").parent().removeClass("active")
		// this.$(e.currentTarget.parentElement).addClass("active");
		this.elementoPaginacion = e.currentTarget.parentElement;
		


	},

	filtrarSolicitudes : function(filtro) {
		
		var self = this;

		mensajeCargando();
		this.collection.setFilter(filtro);
		this.collection.fetch({                  
		    success:function(collection){
		    	ocultarMensajeCargando();
		    	self.render();
		    }
		});
	}




});


/**
* ConsultaServiciosSolicitadosItemView
*/
App.views.ConsultaServiciosSolicitadosItemView = Backbone.View.extend({
	tagName: "tr",

	events : {
		"click .boton.detalle" : "detalle"
	},

	initialize: function() {
		var self = this;


		this.template = _.template($("#template_ConsultaServiciosSolicitadosItemView").html());

		this.render();

	}, 

	render: function() {
		var self=this;


		var data = this.model.toJSON();
		data.fecha_estado_actual = formatFecha(data.fecha_estado_actual);
		data.version_date = formatFecha(data.version_date);
		data.rut = data.persona_rut+"-"+entregarDigitoVerificador(data.persona_rut);
		for (member in data) {
		    if (data[member] == null){
		    	data[member] = ""
		    }
		}
		this.$el.html(this.template(data));

		return this;
	},

	detalle: function() {
		App.views.consultaDetalleSolicitudView.setModel(this.model);
	}




});



/**
* ConsultaGrupoHogarView
*/
App.views.ConsultaGrupoHogarView = Backbone.View.extend({
	initialize: function() {
		var self = this;


		this.template = _.template($("#template_ConsultaGrupoHogarView").html());

		this.collection.on("sync", this.render, this);
	}, 

	render: function() {
		var self = this;


		var data = this.collection.toJSON();
		this.$el.html(this.template(data));
		this.collection.each(function(item) {
			var itemView = new App.views.ConsultaGrupoHogarItemView({model:item})
			self.$(".accordion.hogares").append(itemView.$el);
		})

		if(this.collection.length == 0){
			this.$el.html("<label>No se encontraron hogares asociados ...</label>");
		}

		return this;
	}




});


/**
* ConsultaGrupoHogarView
*/
App.views.ConsultaGrupoHogarItemView = Backbone.View.extend({
	initialize: function() {
		var self = this;


		this.template = _.template($("#template_ConsultaGrupoHogarItemView").html());
		this.miembros = this.model.miembros;
		this.listenTo(this.miembros, "sync", this.render)
		this.miembros.fetch();
	}, 

	render: function() {
		var self = this;


		var data = this.model.toJSON();
		data.cantmiembros = this.miembros.length;
		this.$el.html(this.template(data));

		this.miembros.each(function(item) {
			var itemView = new App.views.ConsultaGrupoHogarMiembrosItemView({model:item});
			self.$el.find("table.miembros").append(itemView.render().$el);
		})

		return this;
	}




});


/**
* ConsultaGrupoHogarView
*/
App.views.ConsultaGrupoHogarMiembrosItemView = Backbone.View.extend({
	tagName : "tr",

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_ConsultaGrupoHogarMiembrosItemView").html());

	}, 


	render: function() {
		var self=this;

		var data = this.model.toJSON()
		data.rut = data.persona_rut+"-"+entregarDigitoVerificador(data.persona_rut);
		this.$el.html(this.template(data));	

		return this;
	},

	close: function() {
		this.remove();
		this.unbind();
	}




});



/**
* ConsultaOrganizacionesView
*/
App.views.ConsultaOrganizacionesView = Backbone.View.extend({
	initialize: function() {
		var self = this;


		this.template = _.template($("#template_ConsultaOrganizacionesView").html());

		this.collection.on("sync", this.render, this);
	}, 

	render: function() {
		var self=this;


		var data = this.collection.toJSON();

		this.$el.html(this.template(data));
		this.collection.each(function(item) {
			var itemView = new App.views.ConsultaOrganizacionesItemView({model:item})
			self.$("table.organizaciones").append(itemView.render().$el);
		})

		return this;
	}




});

/**
* ConsultaGrupoHogarView
*/
App.views.ConsultaOrganizacionesItemView = Backbone.View.extend({
	tagName: "tr",

	initialize: function() {
		var self = this;


		this.template = _.template($("#template_ConsultaOrganizacionesItemView").html());

		this.render();
	}, 

	render: function() {
		var self=this;

		var data = this.model.toJSON();
		data.rut = data.persona_juridica_rut+"-"+entregarDigitoVerificador(data.persona_juridica_rut);
		this.$el.html(this.template(data));

		return this;
	}




});


/**
* ConsultaMiembrosView
*/
App.views.ConsultaMiembrosView = Backbone.View.extend({
	initialize: function() {
		var self = this;


		this.template = _.template($("#template_ConsultaMiembrosView").html());


		this.collection.on("sync", this.render, this);
	}, 

	render: function() {
		var self=this;


		var data = this.collection.toJSON();
		this.$el.html(this.template(data));
		this.collection.each(function(item) {
			var itemView = new App.views.ConsultaMiembrosItemView({model:item})
			self.$("table.miembros").append(itemView.render().$el);
		})

		return this;
	}




});


/**
* ConsultaMiembrosItemView
*/

App.views.ConsultaMiembrosItemView = Backbone.View.extend({
	tagName: "tr",

	initialize: function() {
		var self = this;


		this.template = _.template($("#template_ConsultaMiembrosItemView").html());

		this.render();
	}, 

	render: function() {
		var self=this;

		var data = this.model.toJSON();
		data.rut = data.persona_natural_rut+"-"+entregarDigitoVerificador(data.persona_natural_rut);
		this.$el.html(this.template(data));

		return this;
	}




});


/**
* ConsultaDetalleSolicitudView
*/
App.views.ConsultaDetalleSolicitudView = Backbone.View.extend({
	
	className: "modal fade",

	events: {
		"click .btn.cancel": "hide",
		"click .btn.close": "hide"
	},

	initialize: function() {
		var self = this;

		this.template = _.template($("#template_ConsultaDetalleSolicitudView").html());
		this.historialEstadosView = new App.views.ConsultaHistorialEstadosSolicitudView();
		this.historial = new App.collections.HistorialEstadosSolicitud();



	}, 

	render: function() {
		var self=this;


		this.historialEstadosView.setCollection(this.historial);
		

		var data = this.model.toJSON();
		data.fecha_estado_actual = formatFecha(data.fecha_estado_actual);
		data.version_date = formatFechaHora(data.version_date);
		data.rut = data.persona_rut+"-"+entregarDigitoVerificador(data.persona_rut);

		data.baseurl = App.baseurl;

		for (member in data) {
		    if (data[member] == null){
		    	data[member] = ""
		    }
		}
		self.$el.html(self.template(data));

		self.$(".historial_estados").html(this.historialEstadosView.$el);

		self.$el.modal("show");
	},

	setModel: function(model) {
		this.model = model;
		this.historial.setIdSolicitud(this.model.id);
		this.historial.fetch();
		this.listenTo(this.historial, "sync", this.render);
		// this.render();

	},


	hide: function() {

		App.router.navigate("consulta/persona/"+this.model.attributes.persona_rut, {trigger:true});
		this.$el.modal("hide");
	},

	close: function() {	
		this.hide();
		this.undelegateEvents();
		this.remove();
	}
});

/**
* ConsultaHistorialEstadosSolicitudView
*/
App.views.ConsultaHistorialEstadosSolicitudView = Backbone.View.extend({
	

	events: {

	},

	initialize: function() {
		var self = this;

		
		this.template = _.template($("#template_ConsultaHistorialEstadosSolicitudView").html());
		

		

	}, 

	render: function() {
		var self=this;

		var data = this.collection.toJSON();
		this.$el.html(this.template(data));
		this.collection.each(function(item) {
			var itemView = new App.views.ConsultaHistorialEstadosSolicitudItemView({model:item})
			self.$("table.historial_estados").append(itemView.render().$el);
		})

		return this;
		// var data = this.model.toJSON();
		// data.fecha_estado_actual = formatFecha(data.fecha_estado_actual);
		// data.version_date = formatFecha(data.version_date);		

		// for (member in data) {
		//     if (data[member] == null){
		//     	data[member] = ""
		//     }
		// }

	},

	setCollection: function(collection) {
		this.collection = collection;
		this.listenTo(this.collection, "change", this.render);
		this.render();

	}

});



/**
* ConsultaHistorialEstadosSolicitudItemView
*/

App.views.ConsultaHistorialEstadosSolicitudItemView = Backbone.View.extend({
	tagName: "tr",

	initialize: function() {
		var self = this;


		this.template = _.template($("#template_ConsultaHistorialEstadosSolicitudItemView").html());

		this.render();
	}, 

	render: function() {
		var self=this;

		var data = this.model.toJSON();
		data.fecha = formatFechaHora(data.fecha);
		this.$el.html(this.template(data));

		return this;
	}




});