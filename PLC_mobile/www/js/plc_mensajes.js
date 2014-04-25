var plcMensajes = {

	plc:{
		// titulo :"Sistema de Registro y Control de Servicios Municipales",
		// texto1: "Para acceder al sistema por favor ingrese su nombre de usuario y contraseña",
		// texto2: "El acceso a este sistema está restringido únicamente a los funcionarios de la institución",
	},
	
	persona:{
		titulo: "Personas y Organizaciones",
		// msjExitoCrear : function(rut){
		// 		return "La persona "+ rut +" fue creada correctamente";
		// },

		//CREAR
		msjExitoCrear: "La persona fue creada correctamente",
		msjPreguntaCrear :"¿Está seguro que desea crear una nueva persona con los registros  proporcionados?",
		

		//ACTUALIZAR
		msjExitoActualizar : "La persona fue actualizada correctamente"	,
		msjErrorActualizar : "error al actualizar la persona. intente nuevamente",
		msjPreguntaActualizacion :"¿Está seguro de actualizar la persona seleccionada?",
		
		//ELIMINAR
		msjPreguntaEliminar: "¿Está  seguro que desea eliminar a la persona seleccionada?",
		msjExitoEliminar: "La persona fue eliminada correctamente",
		msjAvisoNOeliminar_tiene_Hogares: "Tiene Hogares asociados",
		msjAvisoNOeliminar_esJefe_Hogar: "Es jefe de Hogar",
		msjAvisoNOeliminar_tiene_Organizaciones: "Tiene organizaciones",
		msjNoSePuedeEliminar: "No es posible eliminar a la persona seleccionada, por los siguentes motivos ",
		msjNOeliminacion: "No es posible eliminar a la persona seleccionada, por los siguentes motivos :"

		// botonNuevaPersona: "Nueva Persona",
		
		// exportExel: "Exportar resultados a Excel"
		


	},
	organizacion:{
		// botonNuevaOrganizacion: "Nueva organización",
		msjExitoCrear : "La organización fue creada correctamente",
		msjPreguntaCrear :"¿Está seguro que desea crear una nueva organización con los registros  proporcionados?",
		
		
		//ACTUALIZAR
		msjPreguntaActualizacion :"¿Está seguro de actualizar la organización?",
		msjExitoActualizar : "La organizacion fue actualizada correctamente",
		msjErrorActualizar : "error al actualizar la organización. Intente nuevamente",

		//ELIMINAR
		msjPreguntaEliminar: "¿Está seguro que desea eliminar a la organización seleccionada?",
		msjNoSePuedeEliminar: "No es posible eliminar a la organizacion seleccionada, por los siguentes motivos: ",
		msjAvisoNOeliminar_tiene_Miembro: "Tiene Miembros",
		msjNOeliminacion: "No es posible eliminar a la organizacion seleccionada, por los siguentes motivos ",
		msjExitoEliminar: "La organizacion fue eliminada correctamente"

	},
	consulta:{
		//titulo : "CONSULTA FICHA BENEFICIARIO"
		msjRutNoexiste : "El RUT ingresado no existe",
		msjIngresarRut : "Debe ingresar un RUT"

	},

	servicios:{
		//titulo : "GESTIÓN DE SERVICIOS"
		msjIngresarRut : "Debe ingresar un RUT valido. Ej:12345678-1",
		msjIngresarDV : "Debe ingresar el digito verificador. Ej:12345678-1",
		msjRutNoexiste : "El RUT ingresado no existe. Favor crear el registro previamente en la sección de personas",
		msjExitoActualizar : 'Los datos fueron almacenados correctamente.'
	},


	hogares:{
		//tiulo: "Administracion Hogares"
	},
	//PERSONAS
	validaciones:{
		required: "Campo requerido "

	}
};