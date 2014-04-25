App.views.SolicitudesMainView = Backbone.View.extend({

	/**
	* @class SolicitudesMainView vista principal para administración de solicitudes
	*
	* @augments Backbone.View
	* @constructs
	*
	* @param {object} options parametros de incializacion
	* @param {string} options.el Identificador de elemento en DOM donde se despliegau la vista
	* @param {string} options.collection Colección (personas) utilizada en la administración de personas
	* 
	*/


	initialize: function() {
		var self = this;

		this.template = _.template($("#template_SolicitudesMainView").html());
		
		this.render();

		// this.servicioId=1;
		
		this.solicitudes = new App.collections.SolicitudesServicios();
		// this.solicitudes.setServicio(this.servicioId);
		//this.solicitudes.fetch();

		this.filtroView = new App.views.SolicitudesFiltroView()
		this.$(".filtro").html(this.filtroView.$el);
		this.listenTo(this.filtroView, "filtrar", this.filtrarSolicitudes);
		

		this.serviciosSolicitadosListView = new App.views.SolicitudesServiciosSolicitadosListView({collection:this.solicitudes})
		this.$(".servicios_solicitados").html(this.serviciosSolicitadosListView.$el)	
		this.listenTo(this.serviciosSolicitadosListView, "filtrar", this.filtrarSolicitudes);	

		//RCP this.filtrarSolicitudes([]);


	},


	render: function() {
		this.$el.html(this.template());
		


		return this;
	},


	consulta : function(rut) {
		var self = this;
		this.personaBuscada = new App.models.Persona();
		this.personaBuscada.set("rut", rut);


		this.personaBuscada.fetch();

		
	},
	

	filtrarSolicitudes : function(filtro) {
		mensajeCargando();
		this.solicitudes.setFilter(filtro);
		this.solicitudes.fetch({                  
		    success:function(model){
		    	ocultarMensajeCargando();
		    }
		});
	},

	setServicioId : function(id) {

		// mensajeCargando();
		this.servicioId = id;
		this.serviciosSolicitadosListView.paginaSeleccionada = 1;
		this.serviciosSolicitadosListView.paginacion();

		this.solicitudes.setServicio(id);
		if(typeof(id)!="undefined")
			this.solicitudes.fetch({                     
		    success:function(model){
		    	ocultarMensajeCargando();
		    }
		});



	}


});


/**
* SolicitudesFiltroView
*/
App.views.SolicitudesFiltroView = Backbone.View.extend({
	events: {
		"change input.filtro.rut": "filtrar",
		"change input.filtro.fecha_desde": "filtrar",
		"change input.filtro.fecha_hasta": "filtrar",
		"change select.options": "filtrar",
		"click input.filtro.fecha_desde": "datepicker",
		"click input.filtro.fecha_hasta": "datepicker"
		
	},


	initialize: function() {
		var self = this;

		this.template = _.template($("#template_SolicitudesFiltroView").html());
		
		this.estadoSolicitudView = new App.views.ParametrosEstadoSolicitudFiltroView();

		this.render();



	},


	render: function() {

		

		this.$el.html(this.template());
		
		this.$(".filtro.estado_solicitud").html(this.estadoSolicitudView.$el);

		return this;
	},

	filtrar: function(e) {

		var filtro = [];
		var rut = ""+$("input.filtro.rut").val();
		var fecha_desde = ""+formatFecha($("input.filtro.fecha_desde").val());
		var fecha_hasta = ""+formatFecha($("input.filtro.fecha_hasta").val());
		var estado = ""+$("select.options").val();
		var offset = "0";

		if (rut) {filtro.push({"filtro":"persona", valor:rut})}else if(e.currentTarget.classList[3] === "rut"){filtro.push({"filtro":"persona", valor:"vacio"})};
		if (fecha_desde) {filtro.push({"filtro":"fecha_desde", valor:fecha_desde})}else if(e.currentTarget.classList[3] === "fecha_desde"){filtro.push({"filtro":"fecha_desde", valor:"vacio"})};
		if (fecha_hasta) {filtro.push({"filtro":"fecha_hasta", valor:fecha_hasta})}else if(e.currentTarget.classList[3] === "fecha_hasta"){filtro.push({"filtro":"fecha_hasta", valor:"vacio"})};
		if (estado) {filtro.push({"filtro":"estado", valor:estado})}else if(e.currentTarget.classList[4] === "estado_solicitud"){filtro.push({"filtro":"estado", valor:"vacio"})};
		if (offset) {filtro.push({"filtro":"offset", valor:offset})};

		this.trigger("filtrar", filtro);

	},



	urlExcel: function() {
		var filtro = [];
		var rut = $("input.filtro.rut").val();
		var fecha_desde = $("input.filtro.fecha_desde").val();
		var fecha_hasta = $("input.filtro.fecha_hasta").val();
		var estado = $("select.options").val();


		if (rut) {filtro.push({"filtro":"persona", valor:rut})};
		if (fecha_desde) {filtro.push({"filtro":"fecha_desde", valor:fecha_desde})};
		if (fecha_hasta) {filtro.push({"filtro":"fecha_hasta", valor:fecha_hasta})};
		if (estado) {filtro.push({"filtro":"estado", valor:estado})};

		this.trigger("filtrar", filtro)

	},

	datepicker: function(e){
		
		this.$(e.currentTarget).datepicker({
			autoclose: true,
		    format: "dd-mm-yyyy",
		    language: "es"
		});
		this.$(e.currentTarget).datepicker().datepicker("show");
	}

});

/**
* SolicitudesServiciosSolicitadosListView
*/
App.views.SolicitudesServiciosSolicitadosListView = Backbone.View.extend({
	events:{
		"click .btn.nueva_solicitud":"nuevaSolicitud",
		"click .paginacion.numero": "paginacion"
	},

	initialize: function() {
		var self = this;

		this.template = _.template($("#template_SolicitudesServiciosSolicitadosListView").html());
		
		
		// this.listenTo(this.collection, "add", this.render);
		// this.listenTo(this.collection, "remove", this.render);
		// this.listenTo(this.collection, "change", this.render);
		
		this.listenTo(this.collection, "sync", this.render);

		this.paginaSeleccionada = 1;


	},


	render: function() {
		
		mensajeCargando();
		var self = this;
		
		var data = this.collection.toJSON();
		data.cantidadRegistros = this.collection.cantidadRegistros;
		this.$el.html(this.template(data));

		

		this.$('#urlExcel').attr('href',this.collection.getUrlExcel());
		this.collection.each(function(item) {
			var itemView = new App.views.SolicitudesServiciosSolicitadosItemView({model:item})
			self.$("table.solicitudes").append(itemView.$el);
		})

		//NUMERO FIJO SOLO PARA USO EN EL SERVIDOR LOCAL (CAMBIAR PARA URANIO)
		this.paginas = Math.ceil(data.cantidadRegistros/10);

		//this.paginas = 11;//****
		this.comienzo = 1;
		this.fin = this.paginas+1;

		if(this.paginas > 7){

			this.comienzo = Number(this.paginaSeleccionada) - 3;
			this.fin = Number(this.paginaSeleccionada) + 4;

			if(this.comienzo < 1){
				
				this.fin = Number(this.fin) + 4 ;
				
				if(this.comienzo == -2){ this.fin = this.fin - 1; }
				if(this.comienzo == -1){ this.fin = this.fin - 2; }
				if(this.comienzo == 0){ this.fin = this.fin - 3; }
				

				this.comienzo = 1;
				
			}


			if(this.fin > this.paginas){
				this.fin = this.paginas+1;

				var diferencia = Number(this.paginas) - Number(this.paginaSeleccionada) 

				
				if(diferencia == 2){ this.comienzo = this.comienzo - 1;}
				if(diferencia == 1){ this.comienzo = this.comienzo - 2;}
				if(diferencia == 0){ this.comienzo = this.comienzo - 3;}
				
			}
		}

		

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

		$(".titulo.servicio").html("<H3 class='imgLabel'>"+$('button.perfil_servicio'+this.collection.servicioId).html()+"</H3>");
		ocultarMensajeCargando();
		return this;
	},

	paginacion: function(e) {



		var filtro = [];
		
		if(typeof(e) === "undefined") {

		}else{
			this.paginaSeleccionada = e.currentTarget.innerHTML;
		}

		

		if(this.paginaSeleccionada == "«"){
			this.paginaSeleccionada = 1;
		}

		if(this.paginaSeleccionada == "»"){
			this.paginaSeleccionada = this.paginas;
		}

		var offset = ""+(this.paginaSeleccionada-1)*10;
		var limit = "10";

		

		if (offset) {filtro.push({"filtro":"offset", valor:offset})};
		if (limit) {filtro.push({"filtro":"limit", valor:limit})};

		this.trigger("filtrar", filtro)

		this.$(".paginacion.numero").parent().removeClass("active")
		// this.$(e.currentTarget.parentElement).addClass("active");
		// this.elementoPaginacion = e.currentTarget.parentElement;
		


	},

	nuevaSolicitud: function(){

		this.model = new App.models.Solicitud();
		this.model.set("servicio_id",this.collection.servicioId);
		this.model.attributes._embedded.servicio._label= $('button.perfil_servicio'+this.collection.servicioId).text();
		// this.model.attributes._embedded.servicio._label=this.collection.models[0].attributes._embedded.servicio._label;
		App.views.solicitudesNuevaSolicitudView.setModel(this.model);
	}


});


/**
* SolicitudesServiciosSolicitadosItemView
*/
App.views.SolicitudesServiciosSolicitadosItemView = Backbone.View.extend({
	tagName: "tr",

	events : {
		"click .boton.detalle" : "detalle",
		"click .boton.edicion" : "edicion",
		"click .boton.eliminar" : "eliminar"
	},

	initialize: function() {
		var self = this;

		this.template = _.template($("#template_SolicitudesServiciosSolicitadosItemView").html());


    	this.sectorGeografico = new App.collections.SectorGeograficoPersona();
		this.sectorGeografico.url = function() {
			return App.baseapiurl + "/personas/"+self.model.attributes.persona_rut+"/sectorGeografico";
		};
		this.sectorGeografico.fetch()

		this.listenTo(this.sectorGeografico, "sync", this.render);
		// this.render();




	},


	render: function() {
		

		var data = this.model.toJSON();
		data.fecha_estado_actual = formatFecha(data.fecha_estado_actual);
		data.fecha = formatFecha(data.fecha);
		data.sectorGeografico = this.sectorGeografico.models[0].attributes._label;
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

		
		App.views.solicitudesDetalleSolicitudView.setModel(this.model);
		
	},	

	edicion: function() {
		
		this.model.fetch();
		App.views.SolicitudesNuevaSolicitudView.saved=false;
		App.views.solicitudesNuevaSolicitudView.setModel(this.model);
		
	},	

	eliminar: function() {
		if (confirm('Desea eliminar solicitud '+this.model.get("id"))) { 
			this.model.destroy();
		}
	}

	
});


/**
* SolicitudesNuevaSolicitudView
*/
App.views.SolicitudesNuevaSolicitudView = Backbone.View.extend({
	
	className: "modal fade",

	events: {
		"click .btn.cancel": "hide",
		"click .btn.close": "hide",
		"click .btn.save": "save",
		"click .btn.calendar": "datepicker",
		"keyup .form-control.persona_rut":"botonDisabled",
		"keypress .form-control.fecha_estado":"validaSoloNumeros",
		"click .button_persona_rut":"buscaPersona"
	},

	initialize: function() {
		var self = this;

		this.template = _.template($("#template_SolicitudesNuevaSolicitudView").html());

		this.personaBuscada = new App.models.Persona(); 

		this.solicitudCreada = new App.models.Solicitud();

		this.collection = new App.collections.SolicitudesServicios();


		this.subtipoServicioView = new App.views.ParametrosSubtipoServicioView();
		this.estadoSolicitudView = new App.views.ParametrosEstadoSolicitudView();

		this.listenTo(this.solicitudCreada, "sync", this.renderAfterSave);

		this.saved = false;





	}, 

	datepicker: function(){

		$(".form-control.date").datepicker({
			autoclose: true,
		    format: "dd-mm-yyyy",
		    language: "es"
		});
		this.$(".form-control.date").datepicker().datepicker("show");
		$( ".datepicker.datepicker-dropdown" ).css( "z-index",99999);
	},
	botonDisabled:function(){
		this.$(".form-control.nombres").val('');
		this.$("a.btn.save").attr("disabled",true).html("Crear Solicitud");
	},
	setModel: function(model) {
		this.solicitudCreada = model;
		//RCP OJO debemos crear un nuevo render para despues de guardar.... 
		// this.listenTo(this.solicitudCreada, "sync", this.renderAfterSave);
		this.render();

		
	},


	buscaPersona: function(e) {		
		var self = this;

		var rutCompleto = this.$(".form-control.persona_rut").val();
		rutCompleto = rutCompleto.split(".").join(""); 
		var rut = rutCompleto.split("-");
		var consultarPersona=false;
		if(this.$(".form-control.persona_rut").is(':disabled')){			
			consultarPersona=true;
		}else{			
			if(typeof rut =="object"){//Es un array
				if(validarut(rut[0],rut[1])){
					consultarPersona=true;
				}else{
					mensajeParaModal(plcMensajes.servicios.msjIngresarRut, "alert-danger");
				}
			}else{
				mensajeParaModal(plcMensajes.servicios.msjIngresarDV, "alert-danger");
			}
		}	
		
		

		if(consultarPersona){
			//Una vez validado por JS el RUT debemos consultar al servidor por la persona.
			this.existePersona = false;

			this.personaBuscada.set("rut", rut[0])
			this.personaBuscada.fetch({
				error : function(model, response, options) {
					mensajeParaModal(plcMensajes.servicios.msjRutNoexiste, "alert-info");
					self.existePersona = false;
					self.$("a.btn.save").attr("disabled",true).html("Crear Solicitud");					
				},
				success: function(model, response, options, request) {

					self.existePersona = true;

					if(response.length===0){
						self.$("a.btn.save").attr("disabled",true).html("Crear Solicitud");
						mensajeParaModal(plcMensajes.servicios.msjRutNoexiste, "alert-info");
						self.$(".form-control.nombres").val("");
						self.$(".seccion_modal").hide();
						self.$(".seccion_modal.beneficiario").show();
					}else if(response.length===undefined){
										
						var nombre = model.attributes._label;
						self.$(".form-control.nombres").val(nombre);
						self.$("a.btn.save").removeAttr("disabled");
						if(self.$('.modal-body .idSolicitud').val()!=""){
							self.$("a.btn.save").html("Guardar");							
							self.$(".seccion_modal").show();
						}
					}

					// if(xhr.parse.getResponseHeader("X-Records")>0){
					
					// 	self.$(".seccion_modal").show();
					// }else{
					// 	self.$(".seccion_modal").hide();
					// 	self.$(".seccion_modal.beneficiario").show();
					// }

					
				}
			});
		}else{
			
		}

	},


	save: function() {
		var self = this;



		if(this.existePersona){

			var persona_rut = this.$(".form-control.persona_rut").val();
			var rutCompleto = persona_rut.split(".").join(""); 
			var rutCompleto = rutCompleto.split("-");						
			if(typeof rutCompleto =="object"){//Es un array
				persona_rut=rutCompleto[0];
			}
			var servicio_id = this.solicitudCreada.attributes.servicio_id;
			// var created_date = "0000-00-00 00:00:00";
			var detalle_publico = this.$(".form-control.detalle_publico").val();
			var detalle_privado = this.$(".form-control.detalle_privado").val();
			var monto_solicitud = this.$(".form-control.monto_solicitud").val();
			var referencia_solicitud = this.$(".form-control.referencia_solicitud").val();
			var servicio_subtipo_id = this.$(".form-control.subtipo_servicio").val();
			var tipo_estado_solicitud_id = this.$(".form-control.estado_solicitud").val();
			var fecha_estado_actual = formatFecha(this.$(".form-control.fecha_estado").val());


			var data = {
				"persona_rut": persona_rut,
				"servicio_id": servicio_id,
				// "created_date": created_date,
				"detalle_publico": detalle_publico,
				"detalle_privado": detalle_privado,
				"monto_solicitud": monto_solicitud,
				"servicio_subtipo_id": servicio_subtipo_id,
				"tipo_estado_solicitud_id": tipo_estado_solicitud_id,
				"fecha_estado_actual": fecha_estado_actual,
				"referencia_solicitud": referencia_solicitud
				};

			this.solicitudCreada.set(data);
			

			if(this.solicitudCreada.isNew()){
				


				this.collection.create(this.solicitudCreada, {
					wait: true,
					error:function(model,xqr,options) {
						var errorMsg = "Error al crear solicitud. "+ xqr.statusText+" ("+xqr.responseText + ")";
						
					}, 
					success: function(model,response,options) {						
						//return App.views.solicitudesNuevaSolicitudView.setModel(model);
						//Backbone.history.navigate('solicitudes/' +self.model.id', true);//RCP
						//app.navigate('solicitudes/' + self.model.id, false);//RCP
						var successMsg =  "Datos creados ("+model.id+")";
						
						self.setModel(model);
						self.solicitudCreada.fetch({
							success:function(){
								
								
							},
							error:function(){
								
							}
						});
					}
				});

			}else{
				
				this.solicitudCreada.save({},{
					error:function(model,xqr,options){
						var errorMsg = "Error al actualizar solicitud. "+ xqr.statusText+" ("+xqr.responseText + ")";
						
					},
					success:function(model,xqr,options){
						var successMsg =  "Datos actualizados ("+model.id+")";
				

						//RCP self.render();
						// self.solicitudCreada.fetch();
						self.setModel(model);
					}
					

				});
				this.saved = true;
				// this.renderAfterSave();
				// mensajeParaModal('Los datos fueron almacenados correctamente.', 'alert-success')


			}	



		}else{
			alert("Rut inválido");
		}




	},

	//RENDER PARA DESPUES DE GUARDAR LA NUEVA SOLICITUD EN EL MODAL
	renderAfterSave: function() {
		var self=this;



		var data = this.solicitudCreada.toJSON();
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
		
			

		this.subtipoServicioView.setSelectedOption(data.servicio_subtipo_id);		
		this.subtipoServicioView.setServicio(data.servicio_id);


		this.estadoSolicitudView.setSelectedOption(data.tipo_estado_solicitud_id);

		
		this.$(".estado_solicitud").html(this.estadoSolicitudView.$el);
		this.$(".subtipo_servicio").html(this.subtipoServicioView.$el);

		self.$el.modal("show");
		this.$(".seccion_modal").show();
		this.$(".seccion_modal.beneficiario").show();
		
		this.$(".form-control.persona_rut").attr("disabled",true);
		this.$(".button_persona_rut").attr("disabled",true);
		this.$("a.btn.save").removeAttr('disabled').html("Guardar");
		if(this.saved){
			mensajeParaModal(plcMensajes.servicios.msjExitoActualizar, 'alert-success');
			this.saved = false;
		}
	},

	//RENDER PARA ANTES DE GUARDAR LA NUEVA SOLICITUD EN EL MODAL
	render: function() {
		var self=this;



		var data = this.solicitudCreada.toJSON();
		data.fecha_estado_actual = formatFecha(data.fecha_estado_actual);

		

		if(data.fecha_estado_actual == ""){
			f = new Date();
			data.fecha_estado_actual = f.getDate()+"-"+(f.getMonth()+1)+"-"+f.getFullYear();
		}
		
		

		data.version_date = formatFechaHora(data.version_date);
		data.rut = data.persona_rut+"-"+entregarDigitoVerificador(data.persona_rut);

		data.baseurl = App.baseurl;

		
		if(data.rut == "-0"){
			data.rut = "";
		}

		for (member in data) {
		    if (data[member] == null){
		    	data[member] = ""
		    }
		}

		self.$el.html(self.template(data));
		
		//this.subtipoServicioView.setSelectedOption(data.servicio_subtipo_id);
		this.subtipoServicioView.setServicio(data.servicio_id);


		this.estadoSolicitudView.setSelectedOption(data.tipo_estado_solicitud_id);

		
		this.$(".estado_solicitud").html(this.estadoSolicitudView.$el);
		this.$(".subtipo_servicio").html(this.subtipoServicioView.$el);

		self.$el.modal("show");
		this.$(".seccion_modal").hide();
		this.$(".seccion_modal.beneficiario").show();
		
		if(this.solicitudCreada.id){
			this.$(".form-control.persona_rut").attr("disabled",true);
			this.$(".button_persona_rut").attr("disabled",true);
			this.$("a.btn.save").removeAttr('disabled').html("Guardar");
			this.buscaPersona();//OJO por eso se reinicia!!!!!!!!!
		}else{
			this.$("a.btn.save").attr("disabled",true).html("Crear Solicitud");
		}

		if(this.saved){
			mensajeParaModal(plcMensajes.servicios.msjExitoActualizar, 'alert-success')
			this.saved = false;
		}
	},

	validaSoloNumeros: function(e) {
		
		if(e.keyCode!=45){
			if ((e.keyCode < 48) || (e.keyCode > 57)){
			  	
			  	
			  	return false;
			  	
			}
		}

	},

	
	hide: function() {

		App.router.navigate("solicitudes/"+this.solicitudCreada.attributes.servicio_id, {trigger:true});
		fetchAbort();
		this.$el.modal("hide");
	},

	close: function() {	
		this.hide();
		this.undelegateEvents();
		this.remove();
	}
});


/**
* SolicitudesDetalleSolicitudView
*/
App.views.SolicitudesDetalleSolicitudView = Backbone.View.extend({
	
	className: "modal fade",

	events: {
		"click .btn.cancel": "hide",
		"click .btn.close": "hide",
		"change select.select.options.version_solicitud": "setVersionModel"
	},

	initialize: function() {
		var self = this;

		this.template = _.template($("#template_SolicitudesDetalleSolicitudView").html());

		this.versionSolicitudView = new App.views.ParametrosVersionSolicitudView({collection:this.versiones});


	}, 

	render: function() {
		var self=this;

		var data = this.model.toJSON();
		data.fecha_estado_actual = formatFecha(data.fecha_estado_actual);
		data.version_date = formatFechaHora(data.version_date);
		this.versionSolicitudView.setIdSolicitud(data.id);
		data.rut = data.persona_rut+"-"+entregarDigitoVerificador(data.persona_rut);
		
		data.baseurl = App.baseurl;


		for (member in data) {
		    if (data[member] == null){
		    	data[member] = ""
		    }
		}
		this.versionSolicitudView.setSelectedOption(data.version);
		self.$el.html(self.template(data));

		self.$(".version_solicitud").html(this.versionSolicitudView.$el);

		this.versiones = new App.collections.VersionSolicitud();
		this.versiones.setIdSolicitud(this.model.attributes.id);
		this.versiones.fetch();

		self.$el.modal("show");
	},

	setModel: function(model) {
		this.model = model;
		// this.listenTo(this.model, "sync", this.render);
		this.render();

	},

	setVersionModel: function(e) {
		
		var self=this;
		// alert(e.target.value);
		

		var modelo = "";

		this.versiones.each(function(item) {
			
			
			if(item.attributes.version === e.target.value){
				
				
				modelo = item;

			}
		});

		this.model.attributes._embedded.estado._label = modelo.attributes._embedded.estado._label;
		this.model.attributes.fecha_estado_actual = modelo.attributes.fecha_estado_actual;
		this.model.attributes._embedded.subtipo._label = modelo.attributes._embedded.subtipo._label;
		this.model.attributes.detalle_publico = modelo.attributes.detalle_publico;
		this.model.attributes.detalle_privado = modelo.attributes.detalle_privado;
		this.model.attributes.monto_solicitud = modelo.attributes.monto_solicitud;
		this.model.attributes.referencia_solicitud = modelo.attributes.referencia_solicitud;
		this.model.attributes.version = modelo.attributes.version;

		this.render();

		// var id = model.solicitud_id

		// this.model = model;
		// this.model.id = id;

		// this.listenTo(this.model, "change", this.render);
		// this.render();

	},


	hide: function() {

		App.router.navigate("solicitudes/"+this.model.attributes.servicio_id, {trigger:true});
		fetchAbort();
		this.model.fetch();
		this.$el.modal("hide");
	},

	close: function() {	
		this.hide();
		this.undelegateEvents();
		this.remove();
	}
});


/*function mensajeParaModal(mensaje,tipoMensaje){
	//tipoMensaje: alert,alert-danger,alert-success,alert-info
	if(typeof mensaje =="undefined"){
		mensaje="";
	}
	//Si ya existe un mensaje previo, debemos eliminar el mensaje anterior.
	if($("#mensajeSuccess").html())	$("#mensajeSuccess").remove();
	
	if(typeof tipoMensaje=="undefined")	tipoMensaje="";
	
	$('.modal-body').prepend('<div class="alert '+tipoMensaje+'" id="mensajeSuccess"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>'+mensaje+'</strong></div>');
	
	//$('html, body').animate({ scrollTop:0}, 1000);
	$('.modal').animate({ scrollTop:0}, 1000);
	$("#mensajeSuccess").delay(7000).fadeOut(2000).delay(9000).queue(function() { $(this).remove(); });
}


function validarut(ruti,dvi){
    var rut = ruti+"-"+dvi;
    if (rut.length<9)
    	return(false)
    i1=rut.indexOf("-");
    dv=rut.substr(i1+1);
    dv=dv.toUpperCase();
    nu=rut.substr(0,i1);
     
    cnt=0;
    suma=0;
    for (i=nu.length-1; i>=0; i--)
    {
	    dig=nu.substr(i,1);
	    fc=cnt+2;
	    suma += parseInt(dig)*fc;
	    cnt=(cnt+1) % 6;
    }
    dvok=11-(suma%11);
    if (dvok==11) dvokstr="0";
    if (dvok==10) dvokstr="K";
    if ((dvok!=11) && (dvok!=10)) dvokstr=""+dvok;
     
    if (dvokstr==dv)
    	return(true);
    else
    	return(false);
}


function entregarDigitoVerificador(rut){
    cnt=0;
    suma=0;
    rut=rut.toString();
    for (i=rut.length-1; i>=0; i--)
    {
	    dig=rut.substr(i,1);
	    fc=cnt+2;
	    suma += parseInt(dig)*fc;
	    cnt=(cnt+1) % 6;
    }
    dvok=11-(suma%11);
    if (dvok==11) dvokstr="0";
    if (dvok==10) dvokstr="K";
    if ((dvok!=11) && (dvok!=10)) dvokstr=""+dvok;
    
    return dvokstr;
}

//Formato de fecha YYYY-MM-DD
function calcularEdad(fecha) {
	
	if(typeof (fecha)!="undefined" && fecha!=null){
		if(fecha.length>0){
			// Si la fecha es correcta, calculamos la edad 
			var values=fecha.split("-"); 
			var dia = values[2]; 
			var mes = values[1]; 
			var ano = values[0]; 
			// cogemos los valores actuales 
			var fecha_hoy = new Date(); 
			var ahora_ano = fecha_hoy.getYear(); 
			var ahora_mes = fecha_hoy.getMonth(); 
			var ahora_dia = fecha_hoy.getDate(); 
			// realizamos el calculo 
			var edad = (ahora_ano + 1900) - ano; 
			if ( ahora_mes < (mes - 1))
				edad--;		
			if (((mes - 1) == ahora_mes) && (ahora_dia < dia))
				edad--; 
			if (edad > 1900)
				edad -= 1900;
			return edad;		
		}
	}else{
		return "";
	}	 
}

function formatFecha(fecha){
	// var fecha="2013-12-23 00:00:00";

	

	if(fecha ===""){
		

		return "";
	}else{
		date=fecha.split(' ');
		date=date[0].split('-');
		date=date[2]+'-'+date[1]+'-'+date[0];

		
		return date;	
	}

}

function mensajeCargando(mensaje){	
	if(typeof mensaje =="undefined"){
		mensaje="Espere un momento...";
	}
	$('.loader_message').remove();
	$('body').append('<div class="loader_message"><span class="icon-loading"></span><h1>'+mensaje+'</h1></div>');
}

function ocultarMensajeCargando(){
	$('[data-toggle="tooltip"]').tooltip({'placement': 'top'});
	$('.loader_message').remove();
}


function fetchAbort(){
	for (var i = 0; i < App.xhrPool.length; i++) {
	    if (App.xhrPool[i]['readyState'] > 0 && App.xhrPool[i]['readyState'] < 4) {
	      App.xhrPool[i].abort();
	      App.xhrPool.splice(i, 1);
	    }
	}
   ocultarMensajeCargando();
}*/
