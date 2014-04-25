//Array  global para manejar los miembros de la organizacion ( para evitar que en una organizacion existan 2 veces el mismo usuario)
var miembrosOrganizacion = [];
//String para generar el select de los tipos de relacion (socio, presidente, otro, etx)
var htmlSelectRelacion = "";



App.views.PersonasOrganizacionesMainView = Backbone.View.extend({

	initialize : function() {
		var self = this;
		this.template = _.template($("#template_ListarPersonasOrganizacionesMainView").html());
		self.render();
		this.personas = new App.collections.Personas();
		//this.personas.fetch();
		mensajeCargando();
		this.personas.fetch({// se genera GET /usuarios/1
			success : function(model) {
				ocultarMensajeCargando();
			}
		});

		this.filtroView = new App.views.PersonasOrganizacionesFiltroView();
		this.$(".filtroPersonas").html(this.filtroView.$el);
		this.listenTo(this.filtroView, "filtrar", this.filtrarPersonas);

		this.personasListView = new App.views.PersonasOrganizacionesListView({
			collection : this.personas
		});
		this.$(".personas_solicitados").html(this.personasListView.$el);

		this.listenTo(this.personasListView, "filtrar", this.filtrarPersonas);
		//this.filtrarPersonas([]);
	},

	filtrarPersonas : function(filtro) {
		console.log(filtro);
		this.personas.setFilter(filtro);
		mensajeCargando();
		//this.personas.fetch();
		this.personas.fetch({
			success : function(model) {
				ocultarMensajeCargando();
			}
		});
	},

	render : function() {
		this.$el.html(this.template());
		return this;
	}
});

/**
 * PersonasFiltroView
 */
App.views.PersonasOrganizacionesFiltroView = Backbone.View.extend({
	events : {
		"change input.filtro.rut" : "filtrar",
		"change input.filtro.nombre" : "filtrar",
		"change select.options" : "filtrar"
	},

	initialize : function() {
		var self = this;
		this.template = _.template($("#template_PersonasOrganizacionesFiltroView").html());
		this.tipoPersonaView = new App.views.ParametrosTipoPersonaView({
			"todo" : "si"
		});
		this.sectorGeograficoView = new App.views.ParametrosSectorGeograficoView({
			"todo" : "si"
		});
		this.render();
	},

	render : function() {
		this.$el.html(this.template());
		this.$(".filtro.tipoPersona").html(this.tipoPersonaView.$el);
		this.$(".filtro.sector").html(this.sectorGeograficoView.$el);
		return this;
	},

	filtrar : function() {
		var filtro = [];
		var rut = $("#filtroPersonas .rut").val();
		var nombre = $("#filtroPersonas .nombre").val();
		var tipo = $("#persona_tipo_persona").val();
		var sector = $("#persona_sector").val();
		var offset = "0";

		if (rut) {
			filtro.push({"filtro" : "rut",
				valor : rut
			});
		};
		if (nombre) {
			filtro.push({"filtro" : "search",valor : nombre});
			filtro.push({"filtro":"searchColumns", "valor":"nombre,apellido_paterno,apellido_materno"});
		};
		if (tipo) {
			filtro.push({"filtro" : "tipo_persona_cod",
				valor : tipo
			});
		};
		if (sector) {
			filtro.push({
				"filtro" : "sectorGeografico",
				valor : sector
			});
		};
		if (offset) {
			filtro.push({
				"filtro" : "offset",
				valor : offset
			})
		};

		this.trigger("filtrar", filtro);
	}
});

/**
 * PersonasListView
 */
App.views.PersonasOrganizacionesListView = Backbone.View.extend({
	events : {
		"click .btn.nueva_organizacion" : "nuevaOrganizacion",
		"click .btn.nueva_persona" : "nuevaPersona",
		//	"click .btn.nuevo_hogar":"nuevoHogar",
		"click .paginacion.numero" : "paginacion"
	},

	initialize : function() {
		var self = this;
		this.template = _.template($("#template_PersonasOrganizacionesListView").html());

		this.listenTo(this.collection, "add", this.render);
		this.listenTo(this.collection, "remove", this.render);
		this.listenTo(this.collection, "change", this.render);
		this.collection.on("sync", this.render, this);
		this.paginaSeleccionada = 1;
	},

	render : function() {
		var self = this;
		var data = this.collection.toJSON();
		data.cantidadRegistros = this.collection.cantidadRegistros;
		this.$el.html(this.template(data));
		this.$('#urlExcel').attr('href', this.collection.getUrlExcel());
		this.collection.each(function(item) {
			var itemView = new App.views.PersonasOrganizacionesItemView({
				model : item
			});
			self.$("table.personas").append(itemView.$el);
		});

		//NUMERO FIJO SOLO PARA USO EN EL SERVIDOR LOCAL (CAMBIAR PARA URANIO)
		this.paginas = Math.ceil(data.cantidadRegistros / 10);
		//this.paginas = 11;//****
		this.comienzo = 1;
		this.fin = this.paginas + 1;

		if (this.paginas > 7) {

			this.comienzo = Number(this.paginaSeleccionada) - 3;
			this.fin = Number(this.paginaSeleccionada) + 4;

			if (this.comienzo < 1) {

				this.fin = Number(this.fin) + 4;

				if (this.comienzo == -2) {
					this.fin = this.fin - 1;
					console.log("fin - 1");
				}
				if (this.comienzo == -1) {
					this.fin = this.fin - 2;
					console.log("fin - 2");
				}
				if (this.comienzo == 0) {
					this.fin = this.fin - 3;
					console.log("fin - 3");
				}

				this.comienzo = 1;

			}

			if (this.fin > this.paginas) {
				this.fin = this.paginas + 1;

				var diferencia = Number(this.paginas) - Number(this.paginaSeleccionada)

				if (diferencia == 2) {
					this.comienzo = this.comienzo - 1;
					console.log("comienzo - 1");
				}
				if (diferencia == 1) {
					this.comienzo = this.comienzo - 2;
					console.log("comienzo - 2");
				}
				if (diferencia == 0) {
					this.comienzo = this.comienzo - 3;
					console.log("comienzo - 3");
				}

			}
		}
		var htmlPaginas = "<li><a class='paginacion numero'>&laquo;</a></li>";

		for (var i = this.comienzo; i < this.fin; i++) {
			var numero = i;
			htmlPaginas = htmlPaginas + "<li><a class='paginacion numero " + numero + "'>" + numero + "</a></li>"
		}

		htmlPaginas = htmlPaginas + "<li><a class='paginacion numero'>&raquo;</a></li>"

		$("ul.pagination").html(htmlPaginas);
		this.$(".paginacion.numero." + this.paginaSeleccionada + "").parent().addClass("active");

	},

	nuevaPersona : function() {
		location.href = "#persona/create/";
	},

	nuevaOrganizacion : function() {
		location.href = "#organizacion/create/";
	},

	paginacion : function(e) {
		var filtro = [];

		this.paginaSeleccionada = e.currentTarget.innerText;

		if (this.paginaSeleccionada == "«") {
			this.paginaSeleccionada = 1;
		}

		if (this.paginaSeleccionada == "»") {
			this.paginaSeleccionada = this.paginas;
		}

		var offset = "" + (this.paginaSeleccionada - 1) * 10;
		var limit = "10";

		console.log("OFFSET: " + offset + " LIMIT: " + limit);

		if (offset) {
			filtro.push({
				"filtro" : "offset",
				valor : offset
			})
		};
		if (limit) {
			filtro.push({
				"filtro" : "limit",
				valor : limit
			})
		};

		this.trigger("filtrar", filtro)

		console.log("pagination : " + e.currentTarget.innerText);
		this.$(".paginacion.numero").parent().removeClass("active")
		this.elementoPaginacion = e.currentTarget.parentElement;
	}
});

App.views.PersonasOrganizacionesItemView = Backbone.View.extend({
	tagName : "tr",

	events : {
		"click .boton.edicion" : "edicion",
		"click .boton.eliminar" : "eliminar"
	},

	initialize : function() {
		var self = this;
		this.template = _.template($("#template_PersonasOrganizacionesItemView").html());
		this.model.on("sync", this.render, this);
		this.render();
	},

	render : function() {
		var data = this.model.toJSON();
		for (member in data) {
			if (data[member] == null) {
				data[member] = "";
			}
		}
		this.$el.html(this.template(data));

		return this;
	},

	edicion : function() {
		console.log(this.model);

		if (this.model.attributes.tipo_persona_cod == "juridica") {
			location.href = "#organizacion/edit/" + this.model.attributes._id;
		} else {
			location.href = "#persona/edit/" + this.model.attributes._id;
		}
	},

	eliminar : function() {
		var self = this;
     	var mensaje = "";
		var tipoPersona = this.model.attributes.tipo_persona_cod;
		 if (tipoPersona == "natural") {
			mensaje = plcMensajes.persona.msjPreguntaEliminar;
		 } else {
		 	mensaje = plcMensajes.organizacion.msjPreguntaEliminar;
		 }
		//if (confirm('Desea eliminar a esta Persona ' + this.model.get("rut"))) {
		jConfirm(mensaje, 'Mensaje de confirmación', function(r) {
			if (r) {
				var mensaje = "";

				if (self.model.attributes._links.hogares || self.model.attributes.organizaciones || self.model.attributes.hogaresJefe || self.model.attributes._links.miembros) {
					if (self.model.attributes._links.hogares)
						mensaje = mensaje + "<li>"+plcMensajes.persona.msjAvisoNOeliminar_tiene_Hogares+"</li>";

					if (self.model.attributes._links.hogaresJefe)
						mensaje = mensaje + "<li> "+plcMensajes.persona.msjAvisoNOeliminar_esJefe_Hogar+"</li>";

					if (self.model.attributes._links.organizaciones)
						mensaje = mensaje + "<li>"+plcMensajes.persona.msjAvisoNOeliminar_tiene_Organizaciones+"</li> ";
					//ORGANIZACION
					if (self.model.attributes._links.miembros)
						mensaje = mensaje + "<li>"+plcMensajes.organizacion.msjAvisoNOeliminar_tiene_Miembro+"</li> ";

					if (tipoPersona == "natural")
						mensajeParaMantenedor(plcMensajes.persona.msjNOeliminacion+"<ul>  " + mensaje + " </ul>", 'alert-danger');

					if (tipoPersona == "juridica")
						mensajeParaMantenedor(plcMensajes.organizacion.msjNOeliminacion+"<ul> " + mensaje + " </ul>", 'alert-danger');

				} else {
					if (tipoPersona == "natural") {
						mensajeParaMantenedor(plcMensajes.persona.msjExitoEliminar, 'alert-success');
					} else {
						mensajeParaMantenedor(plcMensajes.organizacion.msjExitoEliminar, 'alert-success');
					}
					self.model.destroy();
					self.render();
				}
			}
		});
		//Jconfirm
	}//eliminar
});
// PersonasOrganizacionesItemView

/**
 *Crear/Editar Persona
 *
 */
App.views.PersonasNuevaPersonaView = Backbone.View.extend({
	initialize : function(rut) {
		var self = this;
		//this.personaCreada = new App.models.Persona();
		this.personaBuscada = new App.models.Persona();
		this.template = _.template($("#template_PersonaMainView").html());
		this.render();
		//this.listenTo(this.personaCreada, "change", this.render);
	},

	consulta : function(rut) {
		self = this;
		this.personaBuscada = new App.models.Persona();
		if (rut) {
			this.personaBuscada.set("rut", rut);

			this.personaBuscada.on("sync", function() {
				this.solicitudes.fetch();
				this.hogares.fetch();
				this.organizaciones.fetch();
				this.miembros.fetch();
			});

			this.personaBuscada.fetch({// se genera GET /usuarios/1
				success : function(model) {
					self.infoGeneralView = new App.views.PersonasInfoGeneralView({
						model : self.personaBuscada
					});

					self.$el.find(".personas.info_general").html(self.infoGeneralView.$el);
					// // Ficha
					self.fichaView = new App.views.PersonasFichaView({
						model : self.personaBuscada
					});
					self.$el.find(".personas.ficha").html(self.fichaView.$el);
					if (model.attributes.latitud)
						initializeMapa(model.attributes.latitud, model.attributes.longitud);
					else
						initializeMapa(variableGlobales.latitud(), variableGlobales.longuitud());
					validateForm();

					$('#myTab2 li:eq(5) a').hide();

				}
			});

		} else {

			this.personaBuscada = new App.models.Persona();
		//	this.personaBuscada.miembros.fetch();
			this.infoGeneralView = new App.views.PersonasInfoGeneralView({
				model : this.personaBuscada
			});

			this.$el.find(".personas.info_general").html(this.infoGeneralView.$el);

			// // Ficha
			this.fichaView = new App.views.PersonasFichaView({
				model : this.personaBuscada
			});
			this.$el.find(".personas.ficha").html(this.fichaView.$el);
			initializeMapa(variableGlobales.latitud(), variableGlobales.longuitud());
			validateForm();
			$('#myTab2 li:eq(2) a').hide();
			$('#myTab2 li:eq(3) a').hide();
			$('#myTab2 li:eq(4) a').hide();
			$('#myTab2 li:eq(5) a').hide();

		}

	},

	render : function() {
		var self = this;
		this.$el.html(this.template());
		return this;
	}
});

App.views.OrganizacionNuevaOrganizacionView = Backbone.View.extend({
	initialize : function(rut) {
		var self = this;
		//this.personaCreada = new App.models.Persona();
		this.personaBuscada = new App.models.Persona();
		this.template = _.template($("#template_PersonaMainView").html());
		this.render();
		//this.listenTo(this.personaCreada, "change", this.render);
	},

	consulta : function(rut) {
		self = this;
		this.personaBuscada = new App.models.Persona();
		if (rut) {
			this.personaBuscada.set("rut", rut);

			this.personaBuscada.on("sync", function() {
				this.solicitudes.fetch();
				this.hogares.fetch();
				this.organizaciones.fetch();
				this.miembros.fetch();
			});

			//   this.personaBuscada.fetch();

			this.personaBuscada.fetch({// se genera GET /usuarios/1
				success : function(model) {
					self.infoGeneralView = new App.views.PersonasJURIDICAInfoGeneralView({
						model : self.personaBuscada
					});

					self.$el.find(".personas.info_general").html(self.infoGeneralView.$el);
					// // Ficha
					self.fichaView = new App.views.PersonasFichaView({
						model : self.personaBuscada
					});
					self.$el.find(".personas.ficha").html(self.fichaView.$el);
					if (model.attributes.latitud)
						initializeMapa(model.attributes.latitud, model.attributes.longitud);
					else
						initializeMapa(variableGlobales.latitud(), variableGlobales.longuitud());

					validateForm();

					$('#myTab2 li:eq(1) a').hide();
					$('#myTab2 li:eq(3) a').hide();
					$('#myTab2 li:eq(4) a').hide();
				}
			});

		} else {

			this.personaBuscada = new App.models.Persona();

			this.infoGeneralView = new App.views.PersonasJURIDICAInfoGeneralView({
				model : this.personaBuscada
			});

			this.$el.find(".personas.info_general").html(this.infoGeneralView.$el);

			// // Ficha
			this.fichaView = new App.views.PersonasFichaView({
				model : this.personaBuscada
			});
			this.$el.find(".personas.ficha").html(this.fichaView.$el);
			initializeMapa(variableGlobales.latitud(), variableGlobales.longuitud());
			validateForm();

			//contenido TAB(servicio solicitado)
			App.views.serviciosSolicitadosView.render();

			// if(model.attributes.tipo_persona_cod =="juridica"){

			$('#myTab2 li:eq(1) a').hide();
			$('#myTab2 li:eq(3) a').hide();
			$('#myTab2 li:eq(4) a').hide();
			$('#myTab2 li:eq(5) a').hide();
			// }
		}

	},

	render : function() {
		var self = this;
		this.$el.html(this.template());
		return this;
	}
});

/**
 * PersonasInfoGeneralView
 */
App.views.PersonasInfoGeneralView = Backbone.View.extend({
	initialize : function() {
		var self = this;
		this.model.on("sync", this.render, this);
		this.template = _.template($("#template_PersonaInfoGeneralView").html());

		this.generoView = new App.views.ParametrosGeneroView({
			model : this.model
		});

		this.estadoEspecialView = new App.views.ParametrosEstadoEspecialView({
			model : this.model
		});


		this.tipoPersonaView = new App.views.ParametrosTipoPersonaView({
			model : this.model
		});

		this.render();
	},
	events : {

	},

	render : function() {
		var self = this;
		var data = this.model.toJSON();
		data.persona_rut = data.rut+"-"+data.dv
		this.$el.html(this.template(data));
		this.$(".genero").html(this.generoView.$el);
		this.$(".estadoEspecial").html(this.estadoEspecialView.$el);
		this.$(".tipoPersona").html(this.tipoPersonaView.$el);
		return this;
	},

	close : function() {
		this.remove();
		this.unbind();
	}
});

App.views.PersonasJURIDICAInfoGeneralView = Backbone.View.extend({
	initialize : function() {
		var self = this;
		//this.model.on("sync", this.render, this);
		this.template = _.template($("#template_PersonaJURIDICAInfoGeneralView").html());

		this.tipoOrganizacionView = new App.views.ParametrosTipoOrganizacionView({
			model : this.model
		});

		this.origenPjView = new App.views.ParametrosOrigenPjView({
			model : this.model
		});

		this.render();
	},
	events : {
	},

	render : function() {
		var self = this;
		var data = this.model.toJSON();

		data.persona_rut = data.rut+"-"+data.dv
		
		this.$el.html(this.template(data));
		this.$(".tipoOrganizacion").html(this.tipoOrganizacionView.$el);
		this.$(".origenPj").html(this.origenPjView.$el);
		return this;
	},

	close : function() {
		this.remove();
		this.unbind();
	}
});

/**
 * Persona
 */
App.views.PersonasFichaView = Backbone.View.extend({
	initialize : function() {
		var self = this;

		//this.model.on("sync", this.render, this);

		this.template = _.template($("#template_PersonaFichaView").html());

		this.localizacionView = new App.views.PersonaLocalizacionView({
			model : this.model
		});

		this.datosPersonalesView = new App.views.PersonaDatosPersonalesView({
			model : this.model
		});

		App.views.serviciosSolicitadosView = new App.views.ConsultaServiciosSolicitadosView({
			collection : this.model.solicitudes
		});

		App.views.grupoHogarView = new App.views.PersonaGrupoHogarView({
			collection : this.model.hogares
		});

		App.views.organizacionesView = new App.views.ConsultaOrganizacionesView({
			collection : this.model.organizaciones
		});

		App.views.miembrosView = new App.views.PersonaMiembrosView({
			collection : this.model.miembros
		});

		this.render();
	},

	render : function() {
		var self = this;

		this.$el.html(this.template());

		this.$(".persona.info.localizacion").html(this.localizacionView.$el);
		this.$(".persona.info.datos_personales").html(this.datosPersonalesView.$el);
		this.$(".persona.info.servicios_solicitados").html(App.views.serviciosSolicitadosView.$el);
		this.$(".persona.info.grupo_hogar").html(App.views.grupoHogarView.$el);
		this.$(".persona.info.organizaciones").html(App.views.organizacionesView.$el);
		this.$(".persona.info.miembros").html(App.views.miembrosView.$el);

		if (this.model.attributes.tipo_persona_cod == "juridica") {
			$('#myTab2 li:eq(1) a').hide();
			$('#myTab2 li:eq(3) a').hide();
			$('#myTab2 li:eq(4) a').hide();
		} else {

			$('#myTab2 li:eq(5) a').hide();
		}

		//	this.checkTipoPersona();

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

	close : function() {
		this.remove();
		this.unbind();
	}
});

/**
 * PersonaLocalizacionView
 */
App.views.PersonaLocalizacionView = Backbone.View.extend({
	initialize : function() {
		var self = this;
		//  this.model.on("sync", this.render, this);
		this.template = _.template($("#template_PersonaLocalizacionView").html());

		this.sectorGeograficoView = new App.views.ParametrosSectorGeograficoView({
			model : this.model
		});
		this.localidadView = new App.views.ParametrosLocalidadView({
			model : this.model
		});
		this.comunaView = new App.views.ParametrosComunaView({
			model : this.model
		});
		this.comunidadView = new App.views.ParametrosComunidadView({
			model : this.model
		});

		this.render();
	},
	events : {
		"click .btn.save" : "save",
		"click .btn.cancel" : "cancel",
		"click .btn.delete" : "eliminar"
	},

	render : function() {
		var self = this;

		var data = this.model.toJSON();
		for (member in data) {
			if (data[member] == null) {
				data[member] = "";
			}
		}
		this.$el.html(this.template(data));
		this.sectorGeograficoView.setSelectedOption(data.sector_geografico_id);

		this.$(".sector_geografico").html(this.sectorGeograficoView.$el);
		this.$(".localidad").html(this.localidadView.$el);
		this.$(".comuna").html(this.comunaView.$el);
		this.$(".comunidad").html(this.comunidadView.$el);
		return this;
	},
	cancel : function() {
		//location.href = "index.html?#personas";
		console.log("IrAListapersonas()");
		IrAListapersonas();
	},

	eliminar : function() {
		if (confirm('Desea eliminar solicitud ' + this.model.get("rut"))) {
			this.model.destroy();
			location.href = "index.html?#personas";
		}
	},

	save : function() {
		self = this;
		var tipoPersona = $("#tipo_persona_cod").val();
		/*var mensajePreguntaPersona =  "";
		var mensajeExitoPersona    =  "La persona fue actualizada correctamente";
		var mensajeErrorPersona    =  "";

		var mensajePreguntaOrganizacion = "";
		var mensajeExitoOrganizacion    =   "La organización fue actualizada correctamente";
		var mensajeErrorOrganizacion    =   "";*/

		/*if (tipoPersona == "natural"){
					mensaje = "La persona fue actualizada correctamente";
		}else{//PERSONA JURIDICA
				mensaje = "La organización fue actualizada correctamente";
		}	*/
				
		var rut = $("#persona_rut").val();

		//var mensaje = 

		if ($("#formLocalizacion").valid() & $("#formPersonaInfo").valid() & $("#formPersonasDatosPersonales").valid()) {
			self.persona = new App.models.Persona();
			var rut = $("#persona_rut").val();
			if ($('input[id="persona_rut"]').is(':disabled')) {
				if (tipoPersona == "natural") mensaje = plcMensajes.persona.msjPreguntaActualizacion
				else mensaje =plcMensajes.organizacion.msjPreguntaActualizacion
					
				jConfirm(mensaje, 'Mensaje de confirmación', function(r) {
						if (r) {
							//EDITAR
							self.persona.set("rut", rut.split("-")[0]);
							self.persona.fetch({
								success : function(model) {
									// var sector_geografico = 1
									// var comuna_id = 9112
									// sector_geografico = $("#persona_sector").val()
									// if (sector_geografico == "") {
									// 	sector_geografico = 1;
									// 	//ARREGLAR
									// }
									// persona_comuna = $("#persona_comuna").val()
									// if (persona_comuna == "") {
									// 	persona_comuna = 9112;
									// 	//ARREGLAR
									// }
									var data = {
										"tipo_persona_cod"     : $("#tipo_persona_cod").val(),
										"tipo_genero_cod"      : $("#persona_genero").val(),
										"nombre"               : $("#persona_nombre").val(),
										"estado_especial"       : $("#persona_estado_especiales").val(), 
										"apellido_paterno"     : $("#persona_apellido_paterno").val(),
										"apellido_materno"     : $("#persona_apellido_materno").val(),
										"direccion"            : $("#persona_direccion").val(),
										"comuna_id"            : $("#persona_comuna").val(),
										"sector_geografico_id" : $("#persona_sector").val(),
										"id_localidad"         : $("#persona_localidad").val(),
										"id_comunidad"         : $("#persona_comunidad").val(),
										"fono_fijo"            : $("#persona_telefono_fijo").val(),
										"fono_celular"         : $("#persona_telefono_celular").val(),
										"email"                : $("#persona_email").val(),
										"latitud"              : $("#latitud").val(),
										"longitud"             : $("#longitud").val(),
										"referencia_ubicacion" : $("#persona_referencia").val(),
										"origen_pj"            : $("#origenPj").val(),
										"n_pj"                 : $("#n_pj").val(),
										"tipo_organizacion_id" : $("#organizacion_tipo").val()

									};
									//data
									self.persona.set(data);

									self.persona.save({}, {
										success : function(model, response) {
											if (tipoPersona == "natural") mensaje = plcMensajes.persona.msjExitoActualizar
											else mensaje =plcMensajes.organizacion.msjExitoActualizar
											
											mensajeParaMantenedor(mensaje, 'alert-success');

											$('#myTab2 li:eq(2) a').show();
											//$('#myTab2 li:eq(3) a').show();
											$('#myTab2 li:eq(4) a').show();

										//	self.persona.miembros.fetch();
										},
										error : function() {
											if (tipoPersona == "natural") mensaje = plcMensajes.persona.msjErrorActualizar
											else mensaje =plcMensajes.organizacion.msjErrorActualizar
											mensajeParaMantenedor(mensaje, 'alert-danger');
										}
									});
									//obj.save
								}//IF
							});
							//jConfirm
						}

				});

			} else {
				//CREAR
				self = this;

				if (tipoPersona == "natural"){
					mensaje = plcMensajes.persona.msjPreguntaCrear;
				}
				else{
					//PERSONA JURIDICA
					mensaje = plcMensajes.organizacion.msjPreguntaCrear
				}
				

				jConfirm(mensaje, 'Mensaje de confirmación', function(r) {
						if (r) {

							var data = {
								"rut"                  : rut.split("-")[0],
								"dv"                   : rut.split("-")[1], //digiro verificador
								"tipo_persona_cod"     : $("#tipo_persona_cod").val(),
								"tipo_genero_cod"      : $("#persona_genero").val(),
								"nombre"               : $("#persona_nombre").val(),
								"estado_especial"      : $("#persona_estado_especiales").val(), 
								"apellido_paterno"     : $("#persona_apellido_paterno").val(),
								"apellido_materno"     : $("#persona_apellido_materno").val(),
								"direccion"            : $("#persona_direccion").val(),
								"comuna_id"            : $("#persona_comuna").val(),
								"sector_geografico_id" : $("#persona_sector").val(),
								"id_localidad"         : $("#persona_localidad").val(),
								"id_comunidad"         : $("#persona_comunidad").val(),
								"fono_fijo"            : $("#persona_telefono_fijo").val(),
								"fono_celular"         : $("#persona_telefono_celular").val(),
								"email"                : $("#persona_email").val(),
								"latitud"              : $("#latitud").val(),
								"longitud"             : $("#longitud").val(),
								"referencia_ubicacion" : $("#persona_referencia").val(),
								"origen_pj"            : $("#origenPj").val(),
								"n_pj"                 : $("#n_pj").val(),
								"tipo_organizacion_id" : $("#organizacion_tipo").val()
							};
							self.persona.set(data);
							self.persona.save({}, {
								success : function(model, response) {
									if (tipoPersona == "natural") {
										mensajeParaMantenedor(plcMensajes.persona.msjExitoCrear, 'alert-success');
										$('#myTab2 li:eq(2) a').show();
										$('#myTab2 li:eq(3) a').show();
										$('#myTab2 li:eq(4) a').show();

									} else {
										//PERSONA JURIDICA
										mensajeParaMantenedor(plcMensajes.organizacion.msjExitoCrear, 'alert-success');
										 $('#myTab2 li:eq(5) a').show();
									}
									self.persona.miembros.fetch();
									$("#persona_rut").attr('disabled', 'disabled');
									App.views.serviciosSolicitadosView.render(); //
									App.views.organizacionesView.render();
									App.views.grupoHogarView.render()
								},

								error : function() {
									mensajeParaMantenedor(plcMensajes.organizacion.msjErrorActualizar, 'alert-danger');
								}

							});//save
								self.persona.miembros.fetch();
						}
					});//jConfirm
			}//else
		}
	}
});

/**
 * ConsultaDatosPersonalesView
 */
App.views.PersonaDatosPersonalesView = Backbone.View.extend({

	"events" : {
		"click .btn.calendar" : "datepicker",
		"click .btn.save" : "save",
		"click .btn.cancel" : "cancelar"
	},

	initialize : function() {
		var self = this;
		//this.model.on("sync", this.render, this);
		this.template = _.template($("#template_PersonaDatosPersonalesView").html());
		//Parámetros
		this.estadoCivilView = new App.views.ParametrosTipoEstadoCivilView({
			model : this.model
		});
		this.previsionView = new App.views.ParametrosPrevisionView({
			model : this.model
		});
		this.escolaridadView = new App.views.ParametrosEscolaridadView({
			model : this.model
		});
		this.actividadLaboralView = new App.views.ParametrosActividadLaboralView({
			model : this.model
		});
		this.render();
	},

	render : function() {
		var self = this;
		var data = this.model.toJSON();
		data.fecha_estado_actual = formatFecha(data.fecha_nacimiento);

		for (member in data) {
			if (data[member] == null) {
				data[member] = "";
			}
		}
		this.$el.html(this.template(data));
		this.$(".estado_civil").html(this.estadoCivilView.$el);
		this.$(".prevision").html(this.previsionView.$el);
		this.$(".escolaridad").html(this.escolaridadView.$el);
		this.$(".actividad_laboral").html(this.actividadLaboralView.$el);
		return this;
	},
	cancelar : function() {
		IrAListapersonas();
	},
	save : function() {
		self = this;
		var tipoPersona = $("#tipo_persona_cod").val();
		var mensaje = "";
		if (tipoPersona == "natural"){
					mensaje = "La persona fue actualizada correctamente";
		}else{
					mensaje = "La organizacion fue actualizada correctamente";

		}
		if ($("#formLocalizacion").valid() & $("#formPersonaInfo").valid() & $("#formPersonasDatosPersonales").valid()) {
			this.persona = new App.models.Persona();

			rut = $("#persona_rut").val();

			if ($('input[id="persona_rut"]').is(':disabled')) {
				//EDITAR
				this.persona.set("rut", rut.split("-")[0]);
				this.persona.fetch({
					success : function(model) {
						var fecha = $("#fecha_nacimiento").val()
						fecha_ = fecha.split('-')[2] + "-" + fecha.split('-')[1] + "-" + fecha.split('-')[0];
						console.log(fecha);
						var data = {
							"tipo_persona_cod"          : $("#tipo_persona_cod").val(),
							"tipo_genero_cod"           : $("#persona_genero").val(),
							"nombre"                    : $("#persona_nombre").val(),
							"estado_especial"           : $("#persona_estado_especiales").val(), 
							"apellido_paterno"          : $("#persona_apellido_paterno").val(),
							"apellido_materno"          : $("#persona_apellido_materno").val(),
							"tipo_estado_civil_cod"     : $("#persona_estado_civil").val(),
							"tipo_escolaridad_cod"      : $("#persona_tipo_escolaridad").val(),
							"tipo_prevision_cod"        : $("#persona_tipo_prevision").val(),
							"tipo_actividad_laboral_id" : $("#persona_tipo_actividad").val(),

							"numero_expediente"          : $("#nExpediente").val(),
							"ficha_proteccion_social"    : $("#fichaProteccion").val(),
							"programas_sociales"         : $("#programas_sociales").val(),

							"fecha_nacimiento" : fecha_

						};
						//data
						self.persona.set(data);

						self.persona.save({}, {
							success : function(model, response) {
								mensajeParaMantenedor(mensaje, 'alert-success');
							},
							error : function() {
								mensajeParaMantenedor('Error al momento de actualizar la persona, favor volver a intentarlo. Si el problema persiste, recargar la página web.', 'alert-danger');
							}
						});
						//obj.save
					}
				});
			} else {
				//CREAR
				var data = {
					"rut"                       : rut.split("-")[0],
					"dv"                        : rut.split("-")[1],
					"tipo_persona_cod"          : $("#tipo_persona_cod").val(),
					"tipo_genero_cod"           : $("#persona_genero").val(),
					"nombre"                    : $("#persona_nombre").val(),
					"estado_especial"           : $("#persona_estado_especiales").val(), 
					"apellido_paterno"          : $("#persona_apellido_paterno").val(),
					"apellido_materno"          : $("#persona_apellido_materno").val(),
					"tipo_estado_civil_cod"     : $("#persona_estado_civil").val(),
					"tipo_prevision_cod"        : $("#persona_tipo_prevision").val(),
					"tipo_escolaridad_cod"      : $("#persona_tipo_escolaridad").val(),
					"tipo_actividad_laboral_id" : $("#persona_tipo_actividad").val()
				};
				this.persona.set(data)
				this.persona.save({}, {
					success : function(model, response) {
						mensajeParaMantenedor('La persona fue creada correctamente.', 'alert-success');
						$("#persona_rut").attr('disabled', 'disabled');
						//self.persona.miembros.fetch();
					},
					error : function() {
						mensajeParaMantenedor('Error al momento de crear a la persona, favor volver a intentarlo. Si el problema persiste, recargar la página web.', 'alert-danger');

					}
				});
					this.persona.miembros.fetch();
			}//else
		}
	},

	datepicker : function(e) {
		//this.$(".btn.calendar").datepicker();
		this.$(".fechaESP").datepicker({
			autoclose : true,
			format : "dd-mm-yyyy",
			language : "es"
		});
		this.$(".fechaESP").datepicker().datepicker("show");

	}
});

App.views.PersonaGrupoHogarView = Backbone.View.extend({
	initialize : function() {
		var self = this;
		this.template = _.template($("#template_PersonaGrupoHogarView").html());

		this.listenTo(this.collection, "sync", this.render);
		//listenTo(this.collection, "sync", this)
		//this.collection.on("sync", this.render, this);
		this.render()

	},
	events : {
		"click .btn.asociarHogar" : "asociarHogar",
		"click .btn.crearHogar" : "crearHogar",
		"click .btn.edicion" : "edicion",
		"click .btn.eliminar" : "eliminar"
	},
	asociarHogar : function() {
		$(".modal.fade").remove();
		var rut = $("#persona_rut").val().split("-")[0];
		// sin guion
		App.views.hogaresAsociacionHogarView = new App.views.HogaresAsociacionHogarView({
			rut : rut
		});
		//Debes enviar el rut SIN DV
		App.views.hogaresAsociacionHogarView.render();
	},
	crearHogar : function() {
		$(".modal.fade").remove();
		var rut = $("#persona_rut").val()
		App.views.hogaresNuevoHogarView = new App.views.HogaresNuevoHogarView({});
		App.views.hogaresNuevoHogarView.createHogarFromPersonas(rut);
		//Enviar el RUT completo de la persona a crear el hogar
	},
	edicion : function() {
		console.log("editar");
	},
	eliminar : function() {
		console.log("eliminar");
	},
	render : function() {
		var self = this;
		var data = this.collection.toJSON();
		this.$el.html(this.template(data));
		self.$(".accordion.hogares").html('');
		this.collection.each(function(item) {
			var itemView = new App.views.PersonaGrupoHogarItemView({
				model : item
			});
			self.$(".accordion.hogares").append(itemView.$el);
		});
		return this;
	}
});

/**
 * ConsultaGrupoHogarView
 */
App.views.PersonaGrupoHogarItemView = Backbone.View.extend({
	initialize : function() {
		var self = this;

		this.template = _.template($("#template_PersonaGrupoHogarItemView").html());
		this.miembros = this.model.miembros;
		this.listenTo(this.miembros, "sync", this.render)
		this.miembros.fetch();
	},
	events : {
		"click .btn.eliminarHogar" : "eliminarHogar",
		"click .btn.eliminarRelacion" : "eliminarRelacion"
	},
	eliminarHogar : function(e) {

		var self = this;
		jConfirm("¿esta seguro(a) que desea  eliminar el hogar?", 'Mensaje de confirmación', function(r) {
			if (r) {
				console.log($(e.target).attr("data"));
				var data = $(e.target).attr("data");

				var pHogar = new App.models.Hogar();

				pHogar.set("id", data);

				pHogar.destroy();
				self.reloadListaHogares();

			}
		});
	},
	eliminarRelacion : function(e) {
		var self = this;
		jConfirm("¿esta seguro(a) que desea  eliminar la asociacion?", 'Mensaje de confirmación', function(r) {
			if (r) {

				console.log($(e.target).attr("data"));
				var data = $(e.target).attr("data");

				var pHogar = new App.models.MiembroDeHogar();

				pHogar.set("id", data);

				pHogar.destroy();
				self.reloadListaHogares();
			}
		});
	},

	reloadListaHogares : function() {
		var personaBuscada = new App.models.Persona();
		personaBuscada.set("rut", $("#persona_rut").val().split("-")[0]);
		mensajeCargando();
		personaBuscada.fetch({
			success : function() {
				personaBuscada.hogares.fetch({
					success : function() {
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
	},

	render : function() {
		var self = this;
		var data = this.model.toJSON();
		data.cantmiembros = this.miembros.length;
		this.$el.html(this.template(data));

		this.miembros.each(function(item) {
			var itemView = new App.views.PersonaGrupoHogarMiembrosItemView({
				model : item
			});
			self.$el.find("table.miembros").append(itemView.render().$el);
			console.log(itemView.render().$el);
		});
		return this;
	}
});

/**
 * ConsultaGrupoHogarView
 */
App.views.PersonaGrupoHogarMiembrosItemView = Backbone.View.extend({
	tagName : "tr",

	initialize : function() {
		var self = this;
		this.template = _.template($("#template_PersonaGrupoHogarMiembrosItemView").html());
	},

	events : {
		"click .btn.edicion" : "editarRelacion",
		"click .btn.guardar" : "guardarRelacion",
		"click .btn.cancelar" : "cancelarRelacion"
	},

	editarRelacion : function(e) {
		console.log("editar relacion");
		var id = this.model.attributes.id
		var relacion = $("#hidden_condicion_" + id).val()
		var html = '<input id="nuevaRelacion_' + id + '" value="' + relacion + '" type="text" /><button  class="btn guardar">Guardar</button>';

		self.$('#edit_condicion_' + this.model.attributes.id).html(html);
		//muestra solo el indicado
		self.$('#cancelar_' + id).show();
		self.$('#editar_' + id).hide();

	},
	guardarRelacion : function() {
		var id = this.model.attributes.id
		console.log("guardar relacion");
		var nuevaRelacion = $("#nuevaRelacion_" + id).val();
		var pHogar = new App.models.MiembroDeHogar();
		pHogar.set("id", id);
		pHogar.fetch()
		pHogar.set("condicion_en_hogar", nuevaRelacion)
		pHogar.save()

		//volver a la forma de DIV
		//var texto = $("#nuevaRelacion_"+id).val()
		$("#edit_condicion_" + id).html(nuevaRelacion)
		//cambiar estado de botones
		self.$('#cancelar_' + id).hide();
		self.$('#editar_' + id).show();
	},
	cancelarRelacion : function() {
		var id = this.model.attributes.id
		var texto = $("#nuevaRelacion_" + id).val()
		$("#edit_condicion_" + id).html(texto)
		self.$('#cancelar_' + id).hide();
		self.$('#editar_' + id).show();
		console.log("cancelar relacion");
	},
	render : function() {
		var self = this;
		// Create subsection for this household member
		var data = this.model.toJSON();
		data.persona_rut = data.persona_rut + "-" + entregarDigitoVerificador(data.persona_rut);
		this.$el.html(this.template(data));
		//data.rut = data.persona_rut+"-"+entregarDigitoVerificador(data.persona_rut);
		return this;
	},

	close : function() {
		this.remove();
		this.unbind();
	}
});

/**
 * ConsultaMiembrosView
 */
App.views.PersonaMiembrosView = Backbone.View.extend({
	initialize : function() {
		var self = this;
		//html dinamico para añadir miembros a la organizacion (input editable)
		htmlSelectRelacion = "<select id='edit_tipoRelacionOrganizacion' name='edit_tipoRelacionOrganizacion' class='form-control input-sm select options'>";

		this.tipoRelacionOrganizacionView = new App.views.ParametrosTipoRelacionOrganizacionView({
			model : this.model,
			"todo" : "no"
		});
		this.template = _.template($("#template_PersonaMiembrosView").html());

		this.listenTo(this.collection, "sync", this.render)

		var listaTipoRelaciones = new App.collections.TipoRelacionOrganizacion()

		listaTipoRelaciones.fetch({
			success : function(model) {
				for ( i = 0; i < model.length; i++) {
					htmlSelectRelacion = htmlSelectRelacion + "<option value='" + model.models[i].attributes.id + "'>" + model.models[i].attributes.descripcion + "</option>";
				}
				htmlSelectRelacion = htmlSelectRelacion + "</select>";
			}
		});

		this.render()

	},
	events : {
		"click .btn.save" : "save",
		"click .btn.button_persona_rut" : "buscarPersona"
	},

	render : function() {
		var self = this;

		var data = this.collection.toJSON();
		this.$el.html(this.template(data));
		this.collection.each(function(item) {
			var itemView = new App.views.PersonaMiembrosItemView({
				model : item
			})
			//añadir rut a la organizacion
			miembrosOrganizacion.push(item.attributes.persona_natural_rut);
			self.$("table.miembros").append(itemView.render().$el);
		})

		this.$(".tipoRelacionOrganizacionView").html(this.tipoRelacionOrganizacionView.$el);
		return this;

	},
	buscarPersona : function() {
		//self.$(".btn.save").hide();
		var consultarPersona = false;
		var valorBusqueda = "";
		//$("#persona_rut_natural").val()

		var rut = $("#persona_rut_natural").val().split("-");
		if (validarut(rut[0], rut[1])) {
			consultarPersona = true;
			//filtro.push({"filtro":"jefeHogar", valor:limpiarRut(rut[0])});
			//filtro.push({"filtro":"search", valor:"vacio"});
		} else {
			mensajeParaModal("Debe ingresar un RUT valido. Ej:12345678-1", "alert-danger");
		}

		miembrosOrganizacion = _.intersection(miembrosOrganizacion)

		var existe = _.find(miembrosOrganizacion, function(num) {
			return num == rut[0];
		});

		if (existe) {
			mensajeParaModal("Esta persona ya existe en su organizacion", "alert-danger");

			return false;
		}

		if (consultarPersona) {
			mensajeCargando("Buscando a la persona ingresada...");
			this.persona = new App.models.Persona()
			this.persona.set("rut", rut[0])
			this.persona.fetch({
				success : function(model, response, options, request) {
					if (model.attributes._id == "") {
						mensajeParaModal("No existe ninguna persona asociada al rut ingresado", "alert-danger");
						ocultarMensajeCargando();
					}
					if (model.attributes.tipo_persona_cod == "juridica") {
						mensajeParaModal("No puede añadir una persona juridica a su organizacion", "alert-danger");
						ocultarMensajeCargando();
					}
					if (model.attributes.tipo_persona_cod == "natural") {
						$("#modal_nombre_persona").text(response._label)

						$("#btn-save-miembros").removeAttr("disabled");
						ocultarMensajeCargando();
					}
				},
				error : function(model, response, options) {
					console.log("kok");

				}
			})
		}
	},

	save : function() {
		self = this;

		var rut = $("#persona_rut_natural").val().split("-")[0]

		this.miembro = new App.models.MiembroOrganizacion();

		this.data = {
			"persona_natural_rut" : $("#persona_rut_natural").val().split("-")[0],
			"persona_juridica_rut" : $("#persona_rut").val().split("-")[0],
			"tipo_relacion_organizacion_id" : $("#tipoRelacionOrganizacion").val()
		}

		miembrosOrganizacion.push($("#persona_rut_natural").val().split("-")[0]);
		this.miembro.set(this.data)

		this.miembro.save();
		var personaBuscada = new App.models.Persona();
								personaBuscada.set("rut",$("#persona_rut").val().split("-")[0]);
								mensajeCargando();
								personaBuscada.fetch({
									success: function(){
										personaBuscada.miembros.fetch({
												success: function(){
															App.views.miembros= new App.views.PersonaMiembrosView({
																collection : personaBuscada.miembros
															});
															//$("#accordion2").html("");
															$(".persona.info.miembros").html("");
															$(".persona.info.miembros ").html(App.views.miembros.$el);
															ocultarMensajeCargando();

												}
										});
									}
								});


		$("#myModal").modal("hide")



// var personaBuscada = new App.models.Persona();
// 								personaBuscada.set("rut",$("#persona_rut").val().split("-")[0]);
// 								mensajeCargando();
// 								personaBuscada.fetch({
// 									success: function(){
// 										personaBuscada.miembros.fetch({
// 												success: function(){
// 															App.views.miembros= new App.views.PersonaMiembrosView({
// 																collection : personaBuscada.hogares
// 															});
// 															//$("#accordion2").html("");
// 															$(".persona.info.miembros ").html(App.views.grupoHogarView.$el);
// 															ocultarMensajeCargando();

// 												}
// 										});
// 									}
// 								});


		// this.miembro.save()
		// //cerrar el modal
		// $("#myModal").modal("hide")
		// //llamar a los miembros, para refrescar el tab

		// //solicion parche (no me actualiza la lista de miembros al crear la organizacion, pero si al editar)
		// App.views.miembrosView.collection.url = window.App.baseapiurl+"/personas/"+$("#persona_rut").val().split("-")[0]+"/miembros"

		// App.views.miembrosView.collection.fetch({
		// 	cache : false,
		// 	success : function() {
		// 	}
		// });
		// 	//resetear los campos cuando se añaden los miembros a la organizacion
		 $("#persona_rut_natural").val("");
		$("#tipoRelacionOrganizacion").val(0)
		 miembrosOrganizacion = _.intersection(miembrosOrganizacion)

	}
});

/**
 * ConsultaMiembrosItemView
 */

App.views.PersonaMiembrosItemView = Backbone.View.extend({
	tagName : "tr",

	initialize : function() {
		var self = this;
		this.model.on("sync", this.render, this);
		this.template = _.template($("#template_PersonaMiembrosItemView").html());
		this.render();

	},
	events : {
		"click .btn.edicion" : "editar",
		"click .btn.eliminar" : "eliminar",
		"click .btn.cancelar_edicion" : "cancelar_edicion",
		"click .actualizar" : "actualizar"
	},

	editar : function() {
		var id = this.model.attributes.id
		$("#edit_" + id).hide();
		$("#candel_edit_" + id).show()
		//ARREGLAR
		var html = htmlSelectRelacion + "<input type='button' value='actualizar' class='actualizar btn btn-small btn-primary' />";
		$('#Divcontenedor_' + id).html(html);
		//muestra solo el indicado
		var relacion_id = $("#rol_id_" + id).attr("relacion");
		//obtener el ID para seelccione el seldct

		$("#edit_tipoRelacionOrganizacion").val(relacion_id)
		//App.views.hogaresNuevoHogarView.activarEdicion();
	},
	actualizar : function() {
		console.log("actualizar");
		var id = this.model.attributes.id
		$("#edit_" + id).show();
		$("#candel_edit_" + id).hide()

		var miembro = new App.models.MiembroOrganizacion();

		miembro.set("id", this.model.attributes.id)
		miembro.fetch()
		miembro.set("tipo_relacion_organizacion_id", $("#edit_tipoRelacionOrganizacion").val())
		miembro.save()

		$("#rol_id_" + id).attr("relacion", $("#edit_tipoRelacionOrganizacion").val())
		$("#rol_id_" + id).val($("#edit_tipoRelacionOrganizacion option:selected").html())
		$('#Divcontenedor_' + id).html($("#edit_tipoRelacionOrganizacion option:selected").html());

	},

	cancelar_edicion : function() {
		var id = this.model.attributes.id
		var self = this;
		var id = this.model.attributes.id
		$("#edit_" + id).show();
		$("#candel_edit_" + id).hide()
		self.$('#Divcontenedor_' + id).html(self.$('.TDcondicion_hogar .hiddenCondicion').val());
		//App.views.hogaresNuevoHogarView.desactivarEdicion();
	},
	eliminar : function() {
		var id = this.model.attributes.id
		var self = this;
		console.log(this.model.attributes);
		jConfirm('Esta seguro que desea eliminar este Mienbro de la organizacion', 'Mensaje de Confirmacion', function(r) {
			if (r) {

				var miembro = new App.models.MiembroOrganizacion();

				miembro.set("id", self.model.attributes.id)

				miembro.destroy();

				var personaBuscada = new App.models.Persona();
								personaBuscada.set("rut",$("#persona_rut").val().split("-")[0]);
								mensajeCargando();
								personaBuscada.fetch({
									success: function(){
										personaBuscada.miembros.fetch({
												success: function(){
															App.views.miembros= new App.views.PersonaMiembrosView({
																collection : personaBuscada.miembros
															});
															$(".persona.info.miembros").html("");
															$(".persona.info.miembros ").html(App.views.miembros.$el);
															ocultarMensajeCargando();

												}
										});
									}
								});

				// App.views.miembrosView.collection.fetch({
				// 	cache : false,
				// 	success : function() {
				// 	}
				// });

				miembrosOrganizacion = _.intersection(miembrosOrganizacion)
				//eliminar miembro de la organizacion
				miembrosOrganizacion = _.without(miembrosOrganizacion, self.model.attributes.persona_natural_rut);

			}
		});
	},

	render : function() {
		var self = this;
		var data = this.model.toJSON();
		data.persona_rut = data.persona_natural_rut + "-" + entregarDigitoVerificador(data.persona_natural_rut);
		this.$el.html(this.template(data));
		miembrosOrganizacion = _.intersection(miembrosOrganizacion)

		return this;
	}
});

