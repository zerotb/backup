App.views.AdminHogaresMainView = Backbone.View.extend({

	/**
	* @class AdminHogaresMainView vista principal para administración de Hogares
	*
	* @augments Backbone.View
	* @constructs
	*
	* @param {object} options parametros de inicializacion
	* @param {string} options.el Identificador de elemento en DOM donde se despliega la vista
	* @param {string} options.collection Colección (hogares) utilizada en la administración de hogares
	* 
	* AdminHogaresMainView Construye las distintas vistas que administran el listado,
	* actualización, eliminación y creación de hogares
	*/
	initialize: function() {
		var self = this;
		this.template = _.template($("#template_AdminHogaresMainView").html());		
		this.render();
		this.hogares = new App.collections.Hogares();	

		this.filtrarHogares([{"filtro" : "limit",	valor : 10}]);

		mensajeCargando();
		this.hogares.fetch({                     // se genera GET /usuarios/1
		    success:function(model){
		    	ocultarMensajeCargando();
		    }
		});
		
		this.filtroView = new App.views.HogaresFiltroView()
		this.$(".filtroHogares").html(this.filtroView.$el);
		this.listenTo(this.filtroView, "filtrar", this.filtrarHogares);
		
		this.hogaresListView = new App.views.HogaresListView({collection:this.hogares})
		this.$(".admin_hogares").html(this.hogaresListView.$el);
		this.listenTo(this.hogaresListView, "filtrar", this.filtrarHogares);
		
	},
	filtrarHogares : function(filtro) {
		this.hogares.setFilter(filtro);
		mensajeCargando();
		this.hogares.fetch({                    
		    success:function(model){
		    	ocultarMensajeCargando();
		    }
		});
	},
	// Muestra mensajes en la vista
	showAlert : function(msg) {
		this.$alert.html(msg);
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	}
});


/**
* PersonasListView
*/
App.views.HogaresListView = Backbone.View.extend({
	events:{
		"click .btn.nuevo_hogar":"nuevoHogar",
		"click .paginacion.numero": "paginacion"
	},
	initialize: function() {
		var self = this;	

	    this.template = _.template($("#template_HogaresListView").html());
		
		this.collection.on("sync", this.render, this);

		this.paginaSeleccionada = 1;
	},


	render: function() {
		var self=this;
	    var data = this.collection.toJSON();
	    data.cantidadRegistros = this.collection.cantidadRegistros;
	    this.$el.html(this.template(data));
		this.$('#urlExcel').attr('href',this.collection.getUrlExcel());
	    this.collection.each(function(item) {
			var itemView = new App.views.HogaresItemView({model:item})
			self.$("table.hogares").append(itemView.$el);
		});
	  //NUMERO FIJO SOLO PARA USO EN EL SERVIDOR LOCAL (CAMBIAR PARA URANIO)
	    this.paginas = Math.ceil(data.cantidadRegistros/10);
		// this.paginas = 11;//****
		this.comienzo = 1;
		this.fin = this.paginas+1;

		if(this.paginas > 7){

			this.comienzo = Number(this.paginaSeleccionada) - 3;
			this.fin = Number(this.paginaSeleccionada) + 4;

			if(this.comienzo < 1){
				
				this.fin = Number(this.fin) + 4 ;
				
				if(this.comienzo == -2){ this.fin = this.fin - 1;}
				if(this.comienzo == -1){ this.fin = this.fin - 2;}
				if(this.comienzo == 0){ this.fin = this.fin - 3; }
				

				this.comienzo = 1;
				
			}


			if(this.fin > this.paginas){
				this.fin = this.paginas+1;

				var diferencia = Number(this.paginas) - Number(this.paginaSeleccionada) 

				
				if(diferencia == 2){ this.comienzo = this.comienzo - 1; }
				if(diferencia == 1){ this.comienzo = this.comienzo - 2; }
				if(diferencia == 0){ this.comienzo = this.comienzo - 3; }
				
			}
		}

		

		var htmlPaginaInicio = "<li class='anterior'><a class='paginacion numero'>&laquo;</a></li>";
		var htmlPaginaSiguiente = "<li class='siguiente'><a class='paginacion numero'>&raquo;</a></li>"
		var htmlPaginas="";
		var mostrarInicio=true;
		var mostrarFin=true;
		for(var i=this.comienzo; i<this.fin; i++){			
			var numero = i;
			if(i==this.paginas) mostrarFin=false;
			if(i==1) mostrarInicio=false;			
			htmlPaginas = htmlPaginas+"<li><a class='paginacion numero "+numero+"'>"+numero+"</a></li>" 
		}
		
		if(mostrarInicio)
			htmlPaginas=htmlPaginaInicio+htmlPaginas;
		if(mostrarFin)
			htmlPaginas=htmlPaginas+htmlPaginaSiguiente;
		

		$("ul.pagination").html(htmlPaginas);
		this.$(".paginacion.numero."+this.paginaSeleccionada+"").parent().addClass("active");
		
		$("#titulo_hogar").html("<H3 class='imgLabel'><img src='img/hogares.png' class='img-circle img-responsive pull-left' height='35' width='35'/>Hogares</H3>");
		
	},
	nuevoHogar: function(){
		this.model = new App.models.Hogar();
		App.views.hogaresNuevoHogarView.setModel(this.model);
	},
	paginacion: function(e) {
		var filtro = [];
		
		this.paginaSeleccionada = $(e.currentTarget).html();

		if(this.paginaSeleccionada == "«"){
			this.paginaSeleccionada = 1;
		}

		if(this.paginaSeleccionada == "»"){
			this.paginaSeleccionada = this.paginas;
		}
		
		var offset = ""+($(e.currentTarget).html()-1)*10;
		var limit = "10";
		
		if (offset) {filtro.push({"filtro":"offset", valor:offset})};
		if (limit) {filtro.push({"filtro":"limit", valor:limit})};

		this.trigger("filtrar", filtro)

		
		this.$(".paginacion.numero").parent().removeClass("active")
		// this.$(e.currentTarget.parentElement).addClass("active");
		this.elementoPaginacion = $(e.currentTarget).parent();		
	}
});

App.views.HogaresItemView = Backbone.View.extend({
	tagName: "tr",

	events : {
		"click .boton.edicion" : "edicion",
		"click .boton.eliminar" : "eliminar"
	},

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_HogaresItemView").html());		
		this.render();
	},


	render: function() {
		var data = this.model.toJSON();
		this.$el.html(this.template(data));
		return this;
	},

	edicion: function() {
		App.views.hogaresNuevoHogarView.setModel(this.model);
	},	

	eliminar: function() {
		var self=this;
		jConfirm('¿Está seguro de eliminar el hogar '+self.model.get("id")+"?", 'Mensaje de confirmación', function(r) {
			if(r){
				mensajeCargando();
				self.model.destroy({
				      success: function() {
				    	    self.$el.remove();							
							mensajeParaMantenedor('El registro fue eliminado correctamente.', 'alert-success');
							ocultarMensajeCargando();
				        }
				});
			}			
		});
	}	
});


/**
* SolicitudesFiltroView
*/
App.views.HogaresFiltroView = Backbone.View.extend({
	events: {
		"change input.filtro.id_hogar": "filtrar",
		"change input.filtro.rut": "filtrar",
		"change input.filtro.nombre": "filtrar"
	},
	initialize: function() {
		var self = this;
		this.template = _.template($("#template_HogaresFiltroView").html());
		//this.estadoSolicitudView = new App.views.ParametrosEstadoSolicitudView();
		this.render();
	},
	render: function() {
		this.$el.html(this.template());
		//this.$(".filtro.estado_solicitud").html(this.estadoSolicitudView.$el);
		return this;
	},
	filtrar: function(e) {
		var filtro = [];
		var rut = $("input.filtro.rut:visible").val();
		var id_hogar = $("input.filtro.id_hogar:visible").val();
		var nombre = $("input.filtro.nombre:visible").val();	
		var offset = "0";
		
		if (rut) {filtro.push({"filtro":"jefeHogar", valor:limpiarRut(rut)})}else if($(e.currentTarget).hasClass('rut')){filtro.push({"filtro":"jefeHogar", valor:"vacio"})};
		if (id_hogar) {filtro.push({"filtro":"id", valor:id_hogar})}else if($(e.currentTarget).hasClass('id_hogar')){filtro.push({"filtro":"id", valor:"vacio"})};
		if (nombre) {filtro.push({"filtro":"search", valor:nombre});filtro.push({"filtro":"searchColumns", "valor":"jefeHogar.nombre,jefeHogar.apellido_paterno,jefeHogar.apellido_materno"});}else if($(e.currentTarget).hasClass('nombre')){filtro.push({"filtro":"search", valor:"vacio"})};
		if (offset) {filtro.push({"filtro":"offset", valor:offset})};
		
		this.trigger("filtrar", filtro)
	},

	urlExcel: function() {
		var filtro = [];
		/*var rut = $("input.filtro.rut").val();
		var fecha_desde = $("input.filtro.fecha_desde").val();
		var fecha_hasta = $("input.filtro.fecha_hasta").val();
		var estado = $("select.options").val();


		if (rut) {filtro.push({"filtro":"persona", valor:rut})};
		if (fecha_desde) {filtro.push({"filtro":"fecha_desde", valor:fecha_desde})};
		if (fecha_hasta) {filtro.push({"filtro":"fecha_hasta", valor:fecha_hasta})};
		if (estado) {filtro.push({"filtro":"estado", valor:estado})};
		*/
		this.trigger("filtrar", filtro)

	}
});



/**
* HogaresNuevoHogarView
*/
App.views.HogaresNuevoHogarView = Backbone.View.extend({
	
	className: "modal fade",

	events: {
		"click .btn.cancel": "hide",
		"click .btn.close": "hide",
		"click .btn.save": "save",
		"click .button_persona_rut":"buscaPersona",
		"click .btn.agregarIntegrante":"agregarIntegrante",
		"click .btn.registroNuevo":"agregarJefeHogar",
		"click .btn.btnNewPersona":"newPersona"
	},

	initialize: function() {
		var self = this;
		this.template = _.template($("#template_HogaresNuevoHogarView").html());
		this.personaBuscada = new App.models.Persona();
		this.nuevaPersona = new App.models.Persona();
		this.hogarCreado = new App.models.Hogar();
		this.miembroCreado = new App.models.MiembroDeHogar();
		//this.listenTo(this.hogarCreado, "change", this.render);
		this.listenTo(this.hogarCreado, "sync", this.render);
	}, 
	setModel: function(model) {		
		this.hogarCreado = model;
		this.stopListening(this.hogarCreado);
		this.listenTo(this.hogarCreado, "sync", this.render);
		this.render();
	},
	createHogarFromPersonas: function(rut) {	
		var self=this;
		mensajeCargando();		
		var rutCompleto = rut.split(".").join("");
		var rut = rutCompleto.split("-");
		if(rut.length==1){//El rut no contiene DV
			rut=rut+'-'+entregarDigitoVerificador(rut);
		}else{
			rut=rut.join("-");
		}		
		self.hogarCreado = new App.models.Hogar();
		self.stopListening(self.hogarCreado);
		self.listenTo(self.hogarCreado, "sync", self.render);
		
		var data = this.hogarCreado.toJSON();
		self.$el.html(self.template(data));
		self.$el.modal("show");		
		self.$("table.hogares_integrantes tbody").html("");
		self.$(".registroNuevo").hide();
		ocultarMensajeCargando();
		
		//Debemos agregar el rut al campo busqueda y luego buscar...
		self.$(".form-control.persona_rut").val(rut);
		self.$(".button_persona_rut").click();
	},
	save: function() {
		mensajeCargando();
		var self = this;
		//Debemos actualizar el ROL Relación(si existen cambios)
		if(self.$('.DivContenedor .form-control.condicion_en_hogar').length>0){
			var miembroModel=new App.models.MiembroDeHogar();
			var cantidadActualizaciones=1;
			self.$('.DivContenedor .form-control.condicion_en_hogar').each(function(){				
				miembroModel.set({'id':$(this).attr('attrid'),'condicion_en_hogar':$(this).val()});
				miembroModel.save({},{
					success:function(model,xqr,options){
						if(cantidadActualizaciones>=self.$('.DivContenedor .form-control.condicion_en_hogar').length){
							self.actualizarJH();
							ocultarMensajeCargando();
							//RICARDO
							if($('.seccion.personas').is(':visible')){
								var personaBuscada = new App.models.Persona();
									personaBuscada.set("rut",$("#persona_rut").val().split("-")[0]);
									mensajeCargando();
									personaBuscada.fetch({
										success: function(){
											personaBuscada.hogares.fetch({
													success: function(){
																App.views.grupoHogarView = new App.views.PersonaGrupoHogarView({
																	collection : personaBuscada.hogares
																});
																$("#accordion2").html("");
																$(".persona.info.grupo_hogar").html(App.views.grupoHogarView.$el);
																ocultarMensajeCargando();

													}
											});
										}
									});
							}		
						}
						cantidadActualizaciones++;
					}
				});
			});	
		}else{
			self.actualizarJH();
		}
	},
	actualizarJH:function(){
		var self = this;
		//LA ACTUALIZACION Y CAMBIOS DE JH SE REALIZAN EN LA DB
		var persona_rut=self.$("table.hogares_integrantes input.radioJefeHogar:checked").val();
		var jefeHogar_rut=self.$("table.hogares_integrantes input.radioJefeHogar:checked").attr('jefehogar');
		var data = {
				"persona_rut": persona_rut
		};
		if(jefeHogar_rut!=persona_rut){
			mensajeCargando();
			self.hogarCreado.set(data);
			self.hogarCreado.save({},{
				success:function(model,xqr,options){
					var successMsg =  "Datos actualizados ("+model.id+")";
					ocultarMensajeCargando();
					//RICARDO
					if($('.seccion.personas').is(':visible')){
						var personaBuscada = new App.models.Persona();
							personaBuscada.set("rut",$("#persona_rut").val().split("-")[0]);
							mensajeCargando();
							personaBuscada.fetch({
								success: function(){
									personaBuscada.hogares.fetch({
											success: function(){
														App.views.grupoHogarView = new App.views.PersonaGrupoHogarView({
															collection : personaBuscada.hogares
														});
														$("#accordion2").html("");
														$(".persona.info.grupo_hogar").html(App.views.grupoHogarView.$el);
														ocultarMensajeCargando();

											}
									});
								}
							});
					}		
				}
			});
		}else{
			self.render();
		}		
	},
	render: function() {
		mensajeCargando();
		var self=this;
		var data = this.hogarCreado.toJSON();
		for (member in data) {
		    if (data[member] == null){
		    	data[member] = ""
		    }
		}

		self.$el.html(self.template(data));
		self.$el.modal("show");		
		self.$("table.hogares_integrantes tbody").html("");
		if(!self.hogarCreado.isNew()){
			//El usuario existe
			this.collection=this.hogarCreado.miembros;
			this.collection.url=App.baseapiurl + "/hogares/"+data.id+"/miembros";
			this.collection.fetch({                     // se genera GET /usuarios/1
			    success:function(model){
			    	var cantidadModel=model.length;
			    	var contadorRequest=1;
			    	model.each(function(item){		    		
			    		//Obteniendo datos de persona.
				    	var modelPersona=item.persona;
				    	modelPersona.url=App.baseapiurl + "/personas/"+item.attributes.persona_rut;			    	
				    	modelPersona.fetch({ 
						    success:function(modelP){					    	
						    	item.set("miembro", modelP.toJSON());
						    	var itemView = new App.views.HogaresIntegrantesItemView({model:item});					    	
								self.$("table.hogares_integrantes").append(itemView.$el);
								if(contadorRequest>=cantidadModel){
						    		ocultarMensajeCargando();
						    	}
						    	contadorRequest++;
						    }
				    	});					
					});
			    }
			});
		}else{
			self.$(".registroNuevo").hide();
			ocultarMensajeCargando();
		}		
	},
	buscaPersona: function(e) {
		var self = this;
		$(".alert").alert('close');
		self.$(".agregarIntegrante").hide();
		self.$("label.nombre_integrante_nuevo").html("");
		self.$('.newPersona').hide();
		var rutCompleto = this.$(".form-control.persona_rut").val();
		rutCompleto = rutCompleto.split(".").join(""); 
		var rut = rutCompleto.split("-");
		var consultarPersona=false;
					
		if(typeof rut =="object"){//Es un array
			if(validarut(rut[0],rut[1])){
				consultarPersona=true;
			}else{
				mensajeParaModal("Debe ingresar un RUT valido. Ej:12345678-1", "alert-danger");
			}
		}else{
			mensajeParaModal("Debe ingresar el digito verificador. Ej:12345678-1", "alert-danger");
		}		
		if(consultarPersona){
			this.existePersona = false;			
			$("table.hogares_integrantes input[type='radio']").each(function(){
				if(rut[0]==$(this).val()){
					self.existePersona = true;
				}
			});		
						
			if(!self.existePersona){
				mensajeCargando("Buscando a la persona ingresada...");
				//Una vez validado por JS el RUT debemos consultar al servidor por la persona.					
				this.personaBuscada.set("rut", rut[0]);
				this.personaBuscada.fetch({
					error : function(model, response, options) {
						mensajeParaModal("El RUT ingresado no existe. Favor crear el registro previamente en la sección de personas", "alert-info");						
						self.$(".agregarIntegrante").hide();
						ocultarMensajeCargando();
					},
					success: function(model, response, options, request) {
						
						self.existePersona = true;
						if(response.length===0){//No existen registros
							self.$(".agregarIntegrante").hide();
							self.$("label.nombre_integrante_nuevo").html("");
							jConfirm('El RUT ingresado no existe en nuestros registros. ¿Desea crear a la persona para ingresarla posteriormente como un nuevo integrante del hogar?', 'Mensaje de confirmación.', function(r) {
							    if(r){
									self.$('.newPersona').show();
									self.$('.newPersona input').val('');
									self.$('.newPersona input.newPersonaRut').val(rutCompleto);
									self.$('.newPersona label.newLabelPersonaRut').html(rutCompleto);
							    }
							});							
						}else if(response.length===undefined){//El rut existe como persona.
							var nombre = model.attributes._label;
							//Validando si se encuentra asociado a algun hogar.
							var hasHogar=false;
							if(typeof(model.attributes._links)!="undefined"){ 
								if(typeof(model.attributes._links.hogares)!="undefined"){
									hasHogar=true;
								}
								if(typeof(model.attributes._links.hogaresJefe)!="undefined"){
									hasHogar=true;
								}
							}
							if(!hasHogar){
								self.$("label.nombre_integrante_nuevo").html(nombre);
								self.$(".agregarIntegrante").show();
								//Debemos verificar si es un nuevo hogar.
								if(!self.hogarCreado.isNew()){
									//Hogar existente
									self.$(".form-control.persona_rol").show();
									self.$(".btn.agregarIntegrante").show();
									self.$(".btn.registroNuevo").hide();
								}else{
									//Nuevo Hogar
									self.$(".form-control.persona_rol").hide();
									self.$(".btn.agregarIntegrante").hide();
									self.$(".btn.registroNuevo").show();
								}
							}else{
								jConfirm('<center>El RUT ingresado ya se encuentra asociado a un Hogar.<br/></center> ¿Desea ver la información asociada a la persona, para posteriormente decidir si agregarla al hogar?', 'Mensaje de confirmación.', function(r) {
								    if(r){
								    	self.$("label.nombre_integrante_nuevo").html(nombre);
										self.$(".agregarIntegrante").show();
										//Debemos verificar si es un nuevo hogar.
										if(!self.hogarCreado.isNew()){
											//Hogar existente
											self.$(".form-control.persona_rol").show();
											self.$(".btn.agregarIntegrante").show();
											self.$(".btn.registroNuevo").hide();
										}else{
											//Nuevo Hogar
											self.$(".form-control.persona_rol").hide();
											self.$(".btn.agregarIntegrante").hide();
											self.$(".btn.registroNuevo").show();
										}
								    }
								});	
							}
						}
						ocultarMensajeCargando();
					}
				});
			}else{
				//La persona existe como miembro.
				mensajeParaModal("El RUT ingresado ya es parte del hogar. Favor ingresar un nuevo RUT");
			}
		}
	},
	newPersona:function(){
		var self=this;
		var persona_rut = self.$(".newPersona .form-control.newPersonaRut").val();		 
		var persona_nombre = self.$(".newPersona .form-control.newPersonaNombre").val();
		var persona_apellido_paterno = self.$(".newPersona .form-control.newPersonaApPaterno").val();
		var persona_apellido_materno = self.$(".newPersona .form-control.newPersonaApMaterno").val();
		var rutCompleto = persona_rut.split(".").join(""); 
		var persona_rutConDv=rutCompleto;
		var rutCompleto = rutCompleto.split("-");
		var dv="";
		if(typeof rutCompleto =="object"){//Es un array
			persona_rut=rutCompleto[0];
			dv=rutCompleto[1];
		}
		if($("#formPersona").valid()){
			jConfirm('¿Está seguro de crear una nueva persona con los registros proporcionados?', 'Mensaje de confirmación', function(r) {
				if(r){
					mensajeCargando();
					var data = {
							"rut": persona_rut,
							"dv":dv,
							"nombre": persona_nombre,
							"apellido_paterno": persona_apellido_paterno,
							"apellido_materno": persona_apellido_materno
							};
					self.nuevaPersona.set(data);
					self.nuevaPersona.save({},{
						error:function(model,xqr,options){
							mensajeParaModal('Error al momento de agregar la persona, favor volver a intentarlo. Si el problema persiste, recargar la página web.', 'alert-danger');
							ocultarMensajeCargando();
						},
						success:function(model,xqr,options){				
							mensajeParaModal('La persona fue creada correctamente.', 'alert-success');
							self.$(".form-control.persona_rut").val(persona_rutConDv);
							self.buscaPersona();
							ocultarMensajeCargando();
						}
					});
				}
			});
		}		
	},
	agregarIntegrante:function(){
		var self = this;		
		var persona_rut = this.$(".form-control.persona_rut").val();
		var persona_rol = this.$(".form-control.persona_rol").val();		
		var rutCompleto = persona_rut.split(".").join(""); 
		var rutCompleto = rutCompleto.split("-");						
		if(typeof rutCompleto =="object"){//Es un array
			persona_rut=rutCompleto[0];
		}
		jConfirm('¿Está seguro de agregar el RUT '+self.$(".form-control.persona_rut").val()+' como un nuevo integrante del hogar?', 'Mensaje de confirmación', function(r) {
			if(r){
				mensajeCargando();
				var data = {
						"persona_rut": persona_rut,
						"hogar_id": self.hogarCreado.attributes._id,
						"condicion_en_hogar": persona_rol
						};
				var nuevoMiembro=new App.models.MiembroDeHogar();
				nuevoMiembro.set(data);
				nuevoMiembro.save({},{
					error:function(model,xqr,options){
						var errorMsg = "Error al actualizar solicitud. "+ xqr.statusText+" ("+xqr.responseText + ")";
						mensajeParaModal('Los datos fueron almacenados correctamente.', 'alert-danger');
						ocultarMensajeCargando();
					},
					success:function(model,xqr,options){	
						mensajeParaModal('Los datos fueron almacenados correctamente.', 'alert-success');
						if($('.seccion.personas').is(':visible')){
							var personaBuscada = new App.models.Persona();
								personaBuscada.set("rut",$("#persona_rut").val().split("-")[0]);
								mensajeCargando();
								personaBuscada.fetch({
									success: function(){
										personaBuscada.hogares.fetch({
												success: function(){
															App.views.grupoHogarView = new App.views.PersonaGrupoHogarView({
																collection : personaBuscada.hogares
															});
															$("#accordion2").html("");
															$(".persona.info.grupo_hogar").html(App.views.grupoHogarView.$el);
															ocultarMensajeCargando();

												}
										});
									}
								});
						}
						
						self.render();
						ocultarMensajeCargando();
					}
				});
			}
		});		
	},
	agregarJefeHogar:function(){
		var self = this;
		var persona_rut = self.$(".form-control.persona_rut").val();	
		var rutCompleto = persona_rut.split(".").join("");
		var rutCompleto = rutCompleto.split("-");						
		if(typeof rutCompleto =="object"){//Es un array
			persona_rut=rutCompleto[0];
		}		
		jConfirm('¿Está seguro de crear el hogar y asociarlo al RUT '+self.$(".form-control.persona_rut").val()+" como jefe de hogar?", 'Mensaje de confirmación', function(r) {
			if(r){
				mensajeCargando();
				var data = {
						"persona_rut": persona_rut
						};
				self.hogarCreado.set(data);
				self.hogarCreado.save({},{
					success:function(model,xqr,options){
						//RICARDO
							if($('.seccion.personas').is(':visible')){
									var personaBuscada = new App.models.Persona();
										personaBuscada.set("rut",$("#persona_rut").val().split("-")[0]);
										mensajeCargando();
										personaBuscada.fetch({
											success: function(){
												personaBuscada.hogares.fetch({
														success: function(){
																	App.views.grupoHogarView = new App.views.PersonaGrupoHogarView({
																		collection : personaBuscada.hogares
																	});
																	$("#accordion2").html("");
																	$(".persona.info.grupo_hogar").html(App.views.grupoHogarView.$el);
																	ocultarMensajeCargando();

														}
												});
											}
										});
							}
						ocultarMensajeCargando();

					}
				});
			}
		});		
	},
	activarEdicion:function(){
		var self = this;
		self.$(".btn.save").show();
	},
	desactivarEdicion:function(){
		var self = this;
		var persona_rut=self.$("table.hogares_integrantes input.radioJefeHogar:checked").val();
		var jefeHogar_rut=self.$("table.hogares_integrantes input.radioJefeHogar:checked").attr('jefehogar');
		if(self.$('.DivContenedor .form-control.condicion_en_hogar').length==0 && persona_rut==jefeHogar_rut){
			self.$(".btn.save").hide();
		}		
	},
	hide: function() {

		//RICARDO
		// if($('.seccion.personas').is(':visible')){
		// 		var personaBuscada = new App.models.Persona();
		// 			personaBuscada.set("rut",$("#persona_rut").val().split("-")[0]);
		// 			mensajeCargando();
		// 			personaBuscada.fetch({
		// 				success: function(){
		// 					personaBuscada.hogares.fetch({
		// 							success: function(){
		// 										App.views.grupoHogarView = new App.views.PersonaGrupoHogarView({
		// 											collection : personaBuscada.hogares
		// 										});
		// 										$("#accordion2").html("");
		// 										$(".persona.info.grupo_hogar").html(App.views.grupoHogarView.$el);
		// 										ocultarMensajeCargando();

		// 							}
		// 					});
		// 				}
		// 			});
		// }
		//RICARDO		
		fetchAbort();
		this.$el.modal("hide");
	},

	close: function() {	
		this.hide();
		this.undelegateEvents();
		this.remove();
	}
});


App.views.HogaresAsociacionHogarView = Backbone.View.extend({
	
	className: "modal fade",

	events: {
		"click .btn.cancel": "hide",
		"click .btn.close": "hide",
		"click .btn.save": "save",
		"click .button_persona_rut":"buscaPersona"
		//"click .btn.agregarIntegrante":"agregarIntegrante",
		//"click .btn.registroNuevo":"agregarJefeHogar",
		//"click .btn.btnNewPersona":"newPersona",
	},
	initialize: function() {
		var self = this;
		self.template = _.template($("#template_HogaresAsociacionHogarView").html());
		//this.personaBuscada = new App.models.Persona();
		self.hogaresBusqueda = new App.collections.Hogares();		
		//self.hogarAsociado = new App.models.Hogar();
		self.rut="";
		if(typeof(self.options.rut)!='undefined'){
			self.rut=self.options.rut;
		}		
		//this.miembroCreado = new App.models.MiembroDeHogar();
		//self.listenTo(self.hogarAsociado, "change", self.render);		
	}, 
	save: function() {
		mensajeCargando();
		var self = this;
		//Debemos actualizar el ROL Relación(si existen cambios)		
		var miembroModel=new App.models.MiembroDeHogar();
		var hogar_id=self.$('.radioSeleccion:checked').val();
		var condicion_en_hogar=self.$('.radioSeleccion:checked').parent().siblings('.TDcondicion_hogar').children('input.persona_rol').val();
		miembroModel.set({'hogar_id':hogar_id,'condicion_en_hogar':condicion_en_hogar,'persona_rut':self.rut});
		miembroModel.save({},{
			success:function(model,xqr,options){
				ocultarMensajeCargando();	
				mensajeParaModal("El registro fue actualizado correctamente.", "alert-success");
				//Debemos verificar cual input se encuentra con datos para luego llamar al evento click
				if(self.$('.persona_nombre').val()!=""){
					self.$('button.busqueda_nombre').click();
				}else{
					self.$('button.busqueda_rut').click();
				}
				//RICARDO
				if($('.seccion.personas').is(':visible')){
					var personaBuscada = new App.models.Persona();
						personaBuscada.set("rut",$("#persona_rut").val().split("-")[0]);
						mensajeCargando();
						personaBuscada.fetch({
							success: function(){
								personaBuscada.hogares.fetch({
										success: function(){
													App.views.grupoHogarView = new App.views.PersonaGrupoHogarView({
														collection : personaBuscada.hogares
													});
													$("#accordion2").html("");
													$(".persona.info.grupo_hogar").html(App.views.grupoHogarView.$el);
													ocultarMensajeCargando();

										}
								});
							}
						});
				}				
			}
		});	
	},
	render: function() {		
		var self=this;
		self.$el.html(self.template());
		self.$el.modal("show");		
		self.$("table.hogares_integrantes tbody").html("");
		/*this.collection=this.hogarAsociado;
		this.collection.fetch({ 
			success:function(model){
				var itemView = new App.views.HogaresAsociacionItemView({model:item});					    	
				self.$("table.hogares_asociacion").append(itemView.$el);
				ocultarMensajeCargando();
			}
		});*/		
	},
	buscaPersona: function(e) {
		var self = this;
		self.$(".btn.save").hide();
		var consultarHogar=false;		
		var valorBusqueda="";
		$(".alert:not('.alert-success')").alert('close');
		var filtro = [];
		if($(e.currentTarget).hasClass('busqueda_rut')){
			self.$('.persona_nombre').val('');
			valorBusqueda=self.$('.persona_rut').val();			
			valorBusqueda = valorBusqueda.split(".").join(""); 
			var rut = valorBusqueda.split("-");
			if(typeof rut =="object"){//Es un array
				if(validarut(rut[0],rut[1])){
					consultarHogar=true;
					filtro.push({"filtro":"jefeHogar", valor:limpiarRut(rut[0])});
					filtro.push({"filtro":"search", valor:"vacio"});
				}else{
					mensajeParaModal("Debe ingresar un RUT valido. Ej:12345678-1", "alert-danger");
				}
			}else{
				mensajeParaModal("Debe ingresar el digito verificador. Ej:12345678-1", "alert-danger");
			}
		}else{
			self.$('.persona_rut').val('');
			valorBusqueda=self.$('.persona_nombre').val();
			if(valorBusqueda.length>0){
				consultarHogar=true;
				filtro.push({"filtro":"search", valor:valorBusqueda});filtro.push({"filtro":"searchColumns", "valor":"jefeHogar.nombre,jefeHogar.apellido_paterno,jefeHogar.apellido_materno"});
				filtro.push({"filtro":"jefeHogar", valor:"vacio"});
			}else{
				mensajeParaModal("Para realizar la búsqueda es necesario que el campo nombre no se encuentre vacio.", "alert-danger");
			}
		}
		
				
		if(consultarHogar){
				mensajeCargando("Buscando a la persona ingresada...");
				//Una vez validado por JS el RUT debemos consultar al servidor por la persona.					
				this.hogaresBusqueda.setFilter(filtro);
				this.hogaresBusqueda.fetch({
					error : function(model, response, options) {
						mensajeParaModal("El dato ingresado no contiene asociaciones con hogares", "alert-info");						
						self.$(".agregarIntegrante").hide();
						ocultarMensajeCargando();
					},
					success: function(model, response, options, request) {						
						self.existePersona = true;
						if(response.length===0){//No existen registros
							mensajeParaModal("El valor ingresado en la búsqueda no contiene asociaciones con hogares", "alert-info");						
						}else{//Si existen registros
							//Como es una colleccion enviamos los registros uno por uno
							self.$("table.hogares_asociacion tbody").html('');
							
							var personaHogares = new App.collections.Hogares();
							personaHogares.url = function() {
								return App.baseapiurl + "/personas/"+self.rut+"/hogares";
							};
							//var persona = new App.models.Persona({'rut':'15657542'});
							personaHogares.fetch({
								success: function(model2, response2, options2, request2) {
									var arrayHogaresPersona=new Array();
									$.each(model2.models,function(x,data){
										data=data.toJSON();
										arrayHogaresPersona.push(data);
									});
									$.each(model.models,function(x,valorModel){
										var itemView = new App.views.HogaresAsociacionItemView({model:valorModel,arrayHogaresPersona:arrayHogaresPersona});					    	
										self.$("table.hogares_asociacion").append(itemView.$el);
									});
								}
							});
						}
						ocultarMensajeCargando();
					}
				});
			
		}
	},
	activarEdicion:function(){
		var self = this;
		self.$(".btn.save").show();
	},
	hide: function() {		
		fetchAbort();
		this.$el.modal("hide");
	},

	close: function() {	
		this.hide();
		this.undelegateEvents();
		this.remove();
	}
});


App.views.HogaresAsociacionItemView = Backbone.View.extend({
	tagName: "tr",
	events : {				
		"change .radioSeleccion" : "activarInput"		
	},
	initialize: function() {
		var self = this;
		this.template = _.template($("#template_HogaresIntegrantesAsociacionesItemView").html());		
		this.render();
	},
	render: function() {
		var self=this;
		var data=this.model.toJSON();
		data.existeHogarAsociado=false;
		data.rolHogarAsociado="";
		if(typeof(self.options.arrayHogaresPersona) != "undefined"){
			var arrayHogares=self.options.arrayHogaresPersona;
			$.each(arrayHogares,function(i,hogarJson){
				if(data.id==hogarJson.hogar_id){
					data.existeHogarAsociado=true;
					data.rolHogarAsociado=hogarJson.condicion_en_hogar;
				}
			});		 
		}		
		this.$el.html(this.template(data));
        return this;
	},
	activarInput:function(e){
		var self=this;
		$(e.currentTarget).parent('td').parent('tr').parent('tbody').children('tr').each(function(){
			$(this).children('.TDcondicion_hogar').children('input').val('').hide();
		});
		$(e.currentTarget).parent().siblings('.TDcondicion_hogar').children('input').show();	
		App.views.hogaresAsociacionHogarView.activarEdicion();
	}
});

App.views.HogaresIntegrantesItemView = Backbone.View.extend({
	tagName: "tr",
	events : {
		"click .boton.eliminar" : "eliminar",
		"click .boton.edicion" : "edicion",
		"click .boton.cancelar_edicion" : "cancelar_edicion",		
		"change .radioJefeHogar" : "cambiarJH"		
	},
	initialize: function() {
		var self = this;
		this.template = _.template($("#template_HogaresIntegrantesItemView").html());		
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
        return this;
	},
	cambiarJH:function(){
		App.views.hogaresNuevoHogarView.activarEdicion();
	},
	edicion:function(){
		var self=this;
		self.$('.glyphicon.edicion').hide();
		self.$('.glyphicon.cancelar_edicion').show();		
		self.$('.TDcondicion_hogar .Divcontenedor').html('<input type="text" attrid="'+this.model.get("_id")+'" class="form-control input-sm condicion_en_hogar" value="'+self.$('.TDcondicion_hogar .hiddenCondicion').val()+'"/>');
		App.views.hogaresNuevoHogarView.activarEdicion();
	},
	cancelar_edicion:function(){
		var self=this;
		self.$('.glyphicon.edicion').show();
		self.$('.glyphicon.cancelar_edicion').hide();		
		self.$('.TDcondicion_hogar .Divcontenedor').html(self.$('.TDcondicion_hogar .hiddenCondicion').val());	
		App.views.hogaresNuevoHogarView.desactivarEdicion();
	},
	eliminar: function(){
		var self=this;
		if(self.model.get("_embedded").hogar._label==self.model.get("persona_rut")){
			mensajeParaModal('El registro no puede ser eliminado. Debe cambiar previamente la asociación del registro con el Jefe de Hogar', 'alert-danger');
		}else{
			jConfirm('¿Está seguro de eliminar el integrante con RUT: '+self.model.get("persona_rut")+"-"+entregarDigitoVerificador(self.model.get("persona_rut"))+"?", 'Mensaje de confirmación', function(r) {
				if(r){
					mensajeCargando();
					self.model.destroy({
					      success: function() {
					    	  App.views.hogaresNuevoHogarView.render();
					    	  mensajeParaModal('El registro fue eliminado correctamente.', 'alert-success');
					    	  ocultarMensajeCargando();
					        }
					});
				}
			});
		}
		
	}
});