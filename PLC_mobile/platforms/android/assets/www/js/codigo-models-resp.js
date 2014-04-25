
//PERSONA

App.models.Persona = Backbone.Model.extend({
	idAttribute: "rut",

	defaults:{
		    "_id": "",
		    "_label": "",
		    "rut": "",
		    "dv": "",
		    "tipo_persona_cod": "",
		    "n_pj": null,
		    "origen_pj": null,
		    "nombre": "",
		    "apellido_paterno": "",
		    "apellido_materno": "",
		    "tipo_genero_cod": "",
		    "tipo_estado_civil_cod": "",
		    "ocupacion": "",
		    "razon_social": "",
		    "representante_legal_rut": null,
		    "representante_legal_dv": "",
		    "fecha_nacimiento": null,
		    "tipo_prevision_cod": "",
		    "tipo_escolaridad_cod": "",
		    "tipo_actividad_laboral_id": null,
		    "programas_sociales": "",
		    "ficha_proteccion_social": "",
		    "numero_expediente": "",
		    "direccion": "",
		    "fono_fijo":"",
		    "fono_celular": "",
		    "email":"",
		    "latitud":"",
		    "longitud":"",
		    "sector_geografico_id":"1",
		    "comuna_id": "9112",
		    "referencia_ubicacion":""
	
	},

	url: function() {
		return App.baseapiurl + "/personas/"+this.get('rut');
	},
	
	initialize : function() {
		var self = this;

		this.set("nombrecompleto", this.getFullName);


		//-----------------------cambiar URL correspondiente a hogares
		// this.hogares = new App.collections.HogaresJ();
		// this.hogares.url = function() {
		// 	return App.baseapiurl + "/personas/"+self.id+"/hogaresJefe";
		// }

		this.hogares = new App.collections.HogaresJ();
		this.hogares.url = function() {
			return App.baseapiurl + "/personas/"+self.id+"/hogares";
		};

		this.organizaciones = new App.collections.Organizaciones();
		this.organizaciones.url = function() {
			return App.baseapiurl + "/personas/"+self.id+"/organizaciones";
		};

		//------------------------cambiar URL correspondiente a miembros de la organizacion
		this.miembros = new App.collections.Miembros();
		this.miembros.url = function() {
			return App.baseapiurl + "/personas/"+self.id+"/miembros";
		};


		this.solicitudes = new App.collections.Solicitudes();
		this.solicitudes.url = function() {
			var myurl = App.baseapiurl + "/personas/"+self.id+"/solicitudes"

			if (this.filter.length > 0) {
				myurl = myurl+"?";
				for (var i = 0; i < this.filter.length; i++) {
					if (i==0) {
						myurl = myurl + this.filter[i].filtro+"="+this.filter[i].valor;
					} else {
						myurl = myurl + "&"+this.filter[i].filtro+"="+this.filter[i].valor;
					}
				} 
				//var myurl =  App.baseapiurl + "/personas/"+this.filter[0].valor;
			}
			

			return myurl;
		};
	},

	getFullName: function() {
		if (this.get('tipo_persona_cod') == "natural")
			return this.get('apellido_paterno')+" "+this.get('apellido_materno')+", "+this.get('nombre');
		else
			return this.get('razon_social')

	},

	setFilter: function(filter) {

		this.filter = filter; 
	},



	isPersonaNatural: function() {
		return this.get("tipo_persona_cod")=="natural";
	}

});




App.collections.Personas = Backbone.Collection.extend({
	model: App.models.Persona,

	initialize: function() {
		console.log("initialize");
		this.filter = []; // [{filtro:"persona", valor:"99565570"}];
		this.cantidadRegistros=0;
	},

	// url: function() {
	// 	//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
	// 	return App.baseapiurl + "/personas";
	// },
	url: function() {
		console.log("url");
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		
		var myurl =  App.baseapiurl + "/personas/?limit=10";
		
		if (this.filter.length > 0) {
			myurl = myurl+"?";
			for (var i = 0; i < this.filter.length; i++) {
				if (i==0) {
					myurl = myurl + this.filter[i].filtro+"="+this.filter[i].valor;
				} else {
				myurl = myurl + "&"+this.filter[i].filtro+"="+this.filter[i].valor;
				}
			} 
			//var myurl =  App.baseapiurl + "/personas/"+this.filter[0].valor;
		}
		return myurl;

	},
	parse:function(resp,options){
		this.cantidadRegistros=options.xhr.getResponseHeader('Records');
		return resp;
	},

	getUrlExcel:function(){
		var myurl =  App.baseurl + "/reporte/?model=Personas";
		if (this.filter.length > 0){
			for (var i = 0; i < this.filter.length; i++) {
					myurl = myurl + "&"+this.filter[i].filtro+"="+this.filter[i].valor;				
			} 
		}
		return myurl;
	},

	setFilter: function(filter) {
		console.log("setFilter");
		this.filter = filter;
	}


});


//PARÁMETROS

//Genero
App.collections.Genero = Backbone.Collection.extend({

	url: function() {
		return App.baseapiurl + "/tipoGenero";
	}

});

//Genero
App.collections.EstadosEspeciales = Backbone.Collection.extend({

	url: function() {
		return App.baseapiurl + "/estadosEspeciales";
	}

});



//Comunidad
App.collections.Comunidad = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/Comunidad";
	}

});

//Comunas
App.collections.Comuna = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/comunas";
	}

});

//Localidad
App.collections.Localidad = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/localidad";
	}

});

//TIPO ORGANIZACION
App.collections.TipoOrganizacion = Backbone.Collection.extend({
	url: function() {
		return App.baseapiurl + "/TipoOrganizacion";
	}

});
//ORGANIZACION - origenPj
App.collections.OrigenPJ = Backbone.Collection.extend({
	url: function() {
		return App.baseapiurl + "/origenPj";
	}

});



//TIPO PERSONAS
App.collections.TipoPersona = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/tipoPersona";
	}

});

//SECTOR GEOGRAFICO
App.collections.SectorGeografico = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/SectorGeografico";
	}

});



//VERSION SOLICITUD
App.collections.VersionSolicitud = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/solicitudes/"+this.idSolicitud+"/historialDeSolicitudes?limit=-1";
	},

	setIdSolicitud: function(idSolicitud){

		this.idSolicitud = idSolicitud;
	}

});

//TIPO ESTADO CIVIL - COLLECTION
App.collections.TipoEstadoCivil = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/tipoEstadoCivil";
	}

});

//PREVISION - COLLECTION
App.collections.Prevision = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/tipoPrevision";
	}

});

//ESCOLARIDAD - COLLECTION
App.collections.Escolaridad = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/tipoEscolaridad";
	}

});

//ACTIVIDAD LABORAL - COLLECTION
App.collections.ActividadLaboral = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/tipoActividadLaboral";
	}

});

//SUBTIPO SERVICIO - COLLECTION
App.collections.SubtipoServicio = Backbone.Collection.extend({

	url: function() {
		
		// this.servicio = 1;


		return App.baseapiurl + "/servicios/"+this.servicio+"/subtipos";
	},

	setServicio: function(servicioId) {
		this.servicio = servicioId;
	}

});


//ESTADO SOLICITUD - COLLECTION
App.collections.EstadoSolicitud = Backbone.Collection.extend({

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/tipoEstadoSolicitud";
	}

});


App.collections.SectorGeograficoPersona = Backbone.Collection.extend({

	url: function() {
		
		return App.baseapiurl + "/personas/";
	}

});

App.collections.TipoRelacionOrganizacion = Backbone.Collection.extend({

	url: function() {
		
		return App.baseapiurl + "/tipoRelacionOrganizacion/";
	}

});



//SOLICITUDES

//SOLICITUD - MODEL
App.models.Solicitud = Backbone.Model.extend({

	
	defaults:{
        
        "id":null,
        "persona_rut":"",
        "servicio_id":"",
        "servicio_subtipo_id":"1",
        "detalle_publico":"",
        "detalle_privado":"",
        "monto_solicitud":0,
        "referencia_solicitud":"",
        "created_date":"",
        "version":"",
        "version_date":"",
        "version_by":"",
        "fecha_estado_actual":"",
        "_embedded":{"persona":{"_label":""},"servicio":{"_label":""}},	

        "_links":{"self":{"href":App.baseapiurl + "/solicitudes/"}}	

    },

	url: function() {

		var mylinks = this.get("_links");
		//var myurl =  App.baseapiurl + "/solicitudes";
		//return myurl;
	 	return mylinks.self.href;
	},

	setRut: function(rut){
		this.rut = rut;
	}


});

//SOLICITUDES FILTRADAS POR SERVICIO  - COLLECTION
App.collections.SolicitudesServicios = Backbone.Collection.extend({
	model: App.models.Solicitud,

	initialize: function() {

		this.filter = []; // [{filtro:"persona", valor:"99565570"}];
		this.cantidadRegistros=0;
	},


	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		
		var myurl =  App.baseapiurl + "/servicios/"+this.servicioId+"/solicitudes";
		if (this.filter.length > 0) {
			myurl = myurl+"?";
			for (var i = 0; i < this.filter.length; i++) {
				if (i==0) {
					myurl = myurl + this.filter[i].filtro+"="+this.filter[i].valor;
				} else {
				myurl = myurl + "&"+this.filter[i].filtro+"="+this.filter[i].valor;
				}
			} 
		}
	 	
		return myurl;

	},
	parse:function(resp,options){
		this.cantidadRegistros=options.xhr.getResponseHeader('Records');
		return resp;
	},

	setFilter: function(filter) {
		
		var self = this;

		_.each(filter,function(filtro){
			// console.log(filtro.filtro);
			// console.log(self.filter.length);
			var duplicado = false; 


			for (var i = 0; i < self.filter.length; i++) {
				// console.log(filtro.filtro);
				if(filtro.filtro === self.filter[i].filtro){
					self.filter[i].valor = filtro.valor;
					
					duplicado = true;

				}
				
			} 


			if(duplicado === false){
				self.filter.push(filtro);
				
			}

		});

		for (var i = 0; i < self.filter.length; i++) {
			// console.log(filtro.filtro);
			if(self.filter[i].valor === "vacio"){
				
				self.filter.splice(i,1);
			}
			
		} 



	},

	getUrlExcel:function(){
		var myurl =  App.baseurl + "/reporte/?model=Solicitudes&servicio_id="+this.servicioId;
		if (this.filter.length > 0){
			for (var i = 0; i < this.filter.length; i++) {
					myurl = myurl + "&"+this.filter[i].filtro+"="+this.filter[i].valor;				
			} 
		}
		return myurl;
	},


	setServicio: function(servicioId) {
		this.servicioId = servicioId;
		
	}

});

App.collections.HistorialEstadosSolicitud = Backbone.Collection.extend({
	
	initialize: function(){
		this.idSolicitud = 0;
	},

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/solicitudes/"+this.idSolicitud+"/estadoHistorial";
	},

	setIdSolicitud: function(idSolicitud){
		this.idSolicitud = idSolicitud;
	}

});



App.collections.Solicitudes = Backbone.Collection.extend({
	model: App.models.Solicitud,

	initialize: function() {

		this.filter = [];
		this.cantidadRegistros=0;
	},

	parse:function(resp,options){
		this.cantidadRegistros=options.xhr.getResponseHeader('Records');
		return resp;
	},

	setFilter: function(filter) {

		this.filter = filter; 
	},

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		var myurl =  App.baseapiurl + "/solicitudes";

		return myurl;
	}



});


//HOGARES


//PARCHE A CORREGIR OJO!!!!!!
App.models.HogarJ = Backbone.Model.extend({
	
	initialize : function() {
		this.miembros = new App.collections.MiembrosDeHogar();
		this.miembros.url = App.baseapiurl + "/hogares/"+this.get("_embedded").hogar.id+"/miembros";
	}

});

App.collections.HogaresJ = Backbone.Collection.extend({
	model: App.models.HogarJ,

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/hogares";
	}

});


App.models.Hogar = Backbone.Model.extend({
	defaults:{//NO AGREGAR EL ID COMO DEFAULT
        "persona_rut":"",        
        "_embedded":{"jefeHogar":{"id":"","_label":""}}
    },
	initialize : function() {
		this.miembros = new App.collections.MiembrosDeHogar();
		this.miembros.url = App.baseapiurl + "/hogares/"+(this.get('id')?this.get('id'):"")+"/miembros";
	},
	url: function() {
		return App.baseapiurl + "/hogares/"+(this.get('id')?this.get('id'):"");
	}
});


App.collections.Hogares = Backbone.Collection.extend({
	initialize: function() {
		this.filter = []; 
		this.cantidadRegistros=0;
	},
	model: App.models.Hogar,
	url: function() {		
		//return App.baseapiurl + "/hogares";

		var myurl =  App.baseapiurl + "/hogares";

		if (this.filter.length > 0){
			myurl+="?";
			for (var i = 0; i < this.filter.length; i++) {
					myurl = myurl + "&"+this.filter[i].filtro+"="+this.filter[i].valor;				
			} 
		}
		return myurl;
	},
	/*setFilter: function(filter) {
		this.filter = filter;
	},*/
	setFilter: function(filter) {
		
		var self = this;

		_.each(filter,function(filtro){
			// console.log(filtro.filtro);
			// console.log(self.filter.length);
			var duplicado = false; 


			for (var i = 0; i < self.filter.length; i++) {
				// console.log(filtro.filtro);
				if(filtro.filtro === self.filter[i].filtro){
					self.filter[i].valor = filtro.valor;
					
					duplicado = true;

				}
				
			} 


			if(duplicado === false){
				self.filter.push(filtro);
			}

		});

		for (var i = 0; i < self.filter.length; i++) {
			// console.log(filtro.filtro);
			if(self.filter[i].valor === "vacio"){
				self.filter.splice(i,1);
			}
			
		} 



	},
	getUrlExcel:function(){
		var myurl =  App.baseurl + "/reporte/?model=Hogares";
		if (this.filter.length > 0){
			for (var i = 0; i < this.filter.length; i++) {
					myurl = myurl + "&"+this.filter[i].filtro+"="+this.filter[i].valor;				
			} 
		}
		return myurl;
	},
	parse:function(resp,options){
		this.cantidadRegistros=options.xhr.getResponseHeader('Records');
		return resp;
	}
});

App.models.MiembroDeHogar = Backbone.Model.extend({
	defaults:{
		"miembro":""
    },
	initialize : function() {
		this.persona = new App.models.Persona();		
		this.persona.url = function() {
			return App.baseapiurl + "/personas/"+this.get('persona_rut');
		}
	},

	url: function() {
		return App.baseapiurl + "/personaHogar/"+(this.get('id')?this.get('id'):"");
	}

});

App.collections.MiembrosDeHogar = Backbone.Collection.extend({
	model: App.models.MiembroDeHogar,

	url: function(){
		return App.baseapiurl + "/personaHogar/"
	}
});


/////////////////////////////////////////////////////////////////////////

App.models.MiembroOrganizacion = Backbone.Model.extend({
	initialize : function() {
		
	},

	url: function() {
		return App.baseapiurl + "/miembroOrganizacion/"+(this.get('id')?this.get('id'):"");;
	}
});

App.collections.MiembrosOrganizacion = Backbone.Collection.extend({
	url: function(){
		return App.baseapiurl + "/miembroOrganizacion/"
	}
	
//	model: App.models.miembroOrganizacion

});
//////////////////////////////////////////////////////////////

//ORGANIZACIONES





App.models.MiembroDeOrganizacion = Backbone.Model.extend({
	initialize : function() {
		this.persona = new App.models.Persona();
		this.persona.url = function() {
			return App.baseapiurl + "/personas/"+this.get('persona_rut');
		}
	},
	url: function() {
		return App.baseapiurl + "/miembroOrganizacion/"+(this.get('id')?this.get('id'):"");
	}
});

App.collections.MiembrosDeOrganizacion = Backbone.Collection.extend({
	model: App.models.MiembroDeOrganizacion



});


App.collections.Organizacion = Backbone.Collection.extend({
	idAttribute: "rut",

	url: function() {
		//return "http://testphptide.azurewebsites.net/test/test/index.php/apiplc/persona"
		return App.baseapiurl + "/personas/"+this.id+"/organizaciones";
	}

});

App.collections.Organizaciones = Backbone.Collection.extend({
	//model: App.models.Organizacion,

	url: function() {
		return App.baseapiurl + "/personas/"+this.id+"/organizaciones";
	}

});

App.collections.Miembros = Backbone.Collection.extend({
	//model: App.models.Organizacion,

	url: function() {
		return App.baseapiurl + "/personas/"+this.id+"/miembros";
	}

});

/*ErrorHandlingModel = Backbone.Model.extend({
    initialize: function(attributes, options) {
        options || (options = {});
        this.bind("error", this.defaultErrorHandler);
        this.init && this.init(attributes, options);
    },
    defaultErrorHandler: function(model, error) {
        if (error.status == 401 || error.status == 403) {
            // trigger event or route to login here.
        }
    }
});*/


//SESIONES

App.models.Sesion = Backbone.Model.extend({
	url: function() {		
		return App.baseapiurl + "/user?token="+App.token;
	}
});

/*App.models.Sesion = ErrorHandlingModel.extend({url: function() {		
	return App.baseapiurl + "/user";
},});*/



App.collections.APIs = Backbone.Collection.extend({
	url: function() {
		return "./api.js";
	}

});




