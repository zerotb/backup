
function validateForm() {
// 	$("#persona_rut").Rut({
//    format_on: 'keyup'
// })

	$.validator.addMethod("rut", function(value, element) {
		return this.optional(element) || $.Rut.validar(value);
	}, "Este campo debe ser un rut valido.");

	$.validator.addMethod("fechaESP", function(value, element) {
		var validator = this;
		var datePat = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
		var fechaCompleta = value.match(datePat);
		 if (fechaCompleta != null) {
		// 	$.validator.messages.fechaESP = "FECHA NO ES VALIDA ";
		// 	return false;
		// }
			dia = fechaCompleta[1];
			mes = fechaCompleta[3];
			anio = fechaCompleta[5];
			if (dia < 1 || dia > 31) {
				$.validator.messages.fechaESP = "El valor del día debe estar comprendido entre 1 y 31.";
				return false;
			}
			if (mes < 1 || mes > 12) {
				$.validator.messages.fechaESP = "El valor del mes debe estar comprendido entre 1 y 12.";
				return false;
			}
			if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) {
				$.validator.messages.fechaESP = "El mes " + mes + " no tiene 31 días!";
				return false;
			}
			if (mes == 2) {// bisiesto
				var bisiesto = (anio % 4 == 0 && (anio % 100 != 0 || anio % 400 == 0));
				if (dia > 29 || (dia == 29 && !bisiesto)) {
					$.validator.messages.fechaESP = "Febrero del " + anio + " no contiene " + dia + " dias!";
					return false;
				}
			}
		}
		return true;
	}, "El formato de la fecha no es valida (dd-mm-yyy)");

	$.validator.addMethod("usuarioRemoto", function(value, element, param) {
		console.log(value);
		var encontrado = false;
		this.personaBuscada = new App.models.Persona();
		var rut = value.split("-")[0]
		console.log("==> " + rut);
		this.personaBuscada.set("rut", rut);
		this.personaBuscada.fetch({
			async : false,
			error : function(model, response, options) {
				console.log("error");
			},
			success : function(model, response, options, request) {
				console.log("response");
				if (response.length === 0)
					encontrado = true;
				else
					encontrado = false;

			}
		});
		return encontrado;
	}, "El rut ya fue registrado");

	$.validator.addMethod("pjRemoto", function(value, element, param) {
		console.log(value);
		var encontrado = false;
		var filtro=[];
		filtro.push({"filtro":"n_pj","valor":value});
		var a= new App.collections.Personas();
		a.setFilter(filtro);
		a.fetch({
			async : false,
			error : function(model, response, options) {
				console.log("error");
			},
			success : function(model, response, options, request) {
				console.log(model,response);
				if (response.length === 0)
					encontrado = true;
				else
					encontrado = false;

			}
		});
		return encontrado;
	}, "El numero Pj ya fue registrado");


	$('#formLocalizacion').validate({
		onsubmit : false,
		rules : {


			persona_email : {
				email : true
			},

			latitud : {
				number : true
			},

			longitud:{
				number : true

			},

			/*persona_direccion : {
				required : true
			},
			persona_comuna : {
				required : true
			},
			persona_email : {
				required : true,
				email : true
			},
			persona_sector : {
				required : true
			},
			persona_localidad : {
				required : true
			},
			persona_comunidad : {
				required : true
			},*/
			 persona_telefono_fijo:{
			 	maxlength: 12,
			 	minlength: 7,

			  },
			 persona_telefono_celular:{
			 		maxlength: 12, 
			 		minlength: 7
			 },
			// persona_rut:{required : true}
		},
		messages : {
			persona_comuna : {
				email : "Debe ingresar un email valido"
			},

			/*persona_direccion : {
				required : "Campo requerido"
			},
			persona_direccion : {
				required : "Campo requerido"
			},
			persona_comuna : {
				required : "Campo requerido",
				email : "Debe ingresar un email valido"
			},
			persona_sector : {
				required : "Campo requerido"
			},
			persona_localidad : {
				required : "Campo requerido"
			},
			persona_comunidad : {
				required : "Campo requerido"
			},*/
		    persona_telefono_fijo : {
		     			maxlength : "esta campo acepta como máximo 12 dígitos",
		     			minlength : "este campo acepta como mínimo 7 dígitos"
		     			},
			persona_telefono_celular:{
			  	 		maxlength : "esta campo acepta como máximo 12 dígitos",
		    			minlength : "este campo acepta como mínimo 7 dígitos"
			},
			latitud:{
			  		number:"este campo solo acepta números",
			},
			longitud:{
			  		number:"este campo solo acepta números",
			}
			// persona_rut:{ required : "Campo requerido"}
		}
	});

	$('#formPersonaInfo').validate({
		onsubmit : false,
		rules : {
			/*persona_tipo_persona : {
				required : true
			},
			persona_genero : {
				required : true
			},*/
			n_pj:{
				required : true,
			//	digits:true,
				pjRemoto : true

			},

			persona_rut : {
				required : true,
				usuarioRemoto : true
			},
			persona_nombre : {
				required : true
			},
			persona_apellido_paterno : {
				required : true
			}/*,
			persona_apellido_materno : {
				required : true
			},*/

		},
		messages : {
			/*persona_tipo_persona : {
				required : "Campo requerido"
			},
			persona_genero : {
				required : "Campo requerido"
			},*/
			persona_rut : {
				required : "Campo requerido"
			},
			persona_nombre : {
				required : "Campo requerido"
			},
			persona_apellido_paterno : {
				required : "Campo requerido"
			},
			n_pj:{
				required : "Campo requerido",
			//	digits:"este campo solo acepta números"

			},
			/*,
			persona_apellido_materno : {
				required : "Campo requerido"
			}*/

		}
	});

	$('#formPersonasDatosPersonales').validate({
		onsubmit : false,
		rules : {
		/*	nExpediente : {
				required : true
			},
			fichaProteccion : {
				required : true
			},
			persona_estado_civil : {
				required : true
			},
			persona_tipo_prevision : {
				required : true
			},
			persona_tipo_escolaridad : {
				required : true
			},
			persona_tipo_actividad : {
				required : true
			}*/

		},
		messages : {
		/*	nExpediente : {
				required : "Campo requerido"
			},
			fichaProteccion : {
				required : "Campo requerido"
			},
			persona_estado_civil : {
				required : "Campo requerido"
			},
			persona_tipo_prevision : {
				required : "Campo requerido"
			},
			persona_tipo_escolaridad : {
				required : "Campo requerido"
			},
			persona_tipo_actividad : {
				required : "Campo requerido"
			}
	    */
		}
	});

}

