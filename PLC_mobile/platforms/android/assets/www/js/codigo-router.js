// Router 
App.AppRouter = Backbone.Router.extend({
	routes:{
		"":"menu",
		
		"personas":"listarPersona",
		"persona/update/:rut": "updatePersona",
		"persona/delete/:rut": "deletePersona",
		"persona/create/": "createPersona",
		"persona/edit/:rut":"editPersona",

		"organizacion/create/": "createOrganizacion",
		"organizacion/edit/:rut":"editOrganizacion",
		
		"consulta":"consulta",
		"consulta/persona/:rut":"consultaPersona",
		"solicitudes/:id":"solicitudes",
		"hogares":"hogares",
		"hogares/update/:id":"updateHogar",
		"hogares/delete/:id":"deleteHogar",
		"hogares/create":"createHogar",
		"logout":"logout",
		"solicitudes/nuevaSolicitud":"nuevaSolicitud",
		"solicitudes/detalleSolicitud":"detalleSolicitud"
	},


	initialize: function() {		
		// Oculta todas las secciones (DIVS con clase 'seccion')		
		$(".seccion").hide();
	},
	// admin/create/persona
	consultaPersona: function(rut) {
		this.consulta();

		App.models.personaEnConsulta.set("rut", rut);
		App.models.personaEnConsulta.fetch();
		App.views.consultaMainView.consulta(rut);

	},
	
	

	createPersona:function(){
		
		this.reloadPage();
		App.views.personasEditPersonaView = new App.views.PersonasNuevaPersonaView({
			el : $(".seccion.personas")
		});
		App.views.personasEditPersonaView.consulta();
		
		$("#menuSuperior li.administracion").addClass("active");
	
		$(".seccion.personas").show();
		$(".breadcrumb").append('<li class="active"><a href="javascript:void(0)" onclick="IrAListapersonas()">Personas y Organizaciones</a></li><li class="active">Nueva Persona</li>');

	},

	editPersona:function(rut){
		
		 this.reloadPage();
	    App.views.personasEditPersonaView = new App.views.PersonasNuevaPersonaView({
	         el:$(".seccion.personas")
	     });
		App.views.personasEditPersonaView.consulta(rut);
	   
		$("#menuSuperior li.administracion").addClass("active");
		$(".seccion.personas").show();
		$(".breadcrumb").append('<li class="active"><a href="javascript:void(0)" onclick="IrAListapersonas()">Personas y Organizaciones</a></li><li class="active">Editar Persona</li>');

	},

	createOrganizacion:function(){
		
		this.reloadPage();
		App.views.orgnizacionEditOrganizacionView = new App.views.OrganizacionNuevaOrganizacionView({
			el : $(".seccion.personas")
		});
		App.views.orgnizacionEditOrganizacionView.consulta();
		
		$("#menuSuperior li.administracion").addClass("active");
	
		$(".seccion.personas").show();
		$(".breadcrumb").append('<li class="active"><a href="javascript:void(0)" onclick="IrAListapersonas()">Personas y Organizaciones</a></li><li class="active">Nueva Organización</li>');

	},

	editOrganizacion:function(rut){
		
		this.reloadPage();
	    App.views.orgnizacionEditOrganizacionView = new App.views.OrganizacionNuevaOrganizacionView({
	         el:$(".seccion.personas")
	    });
	    
		App.views.orgnizacionEditOrganizacionView.consulta(rut);
	   
		$("#menuSuperior li.administracion").addClass("active");
		$(".seccion.personas").show();
		$(".breadcrumb").append('<li class="active"><a href="javascript:void(0)" onclick="IrAListapersonas()">Personas y Organizaciones</a></li><li class="active">Editar Organización</li>');

	},


	solicitudesPersonaNuevaSolicitud: function(rut) {	
		
		App.models.personaEnConsulta.set("rut", rut);
		App.models.personaEnConsulta.fetch();

		this.nuevaSolicitud();

		App.views.solicitudesMainView.consulta(rut);

	},

	nuevaSolicitud:function () {
		App.views.solicitudesNuevaSolicitudView.render();
	},

	detalleSolicitud:function () {
		App.views.solicitudesNuevaSolicitudView.render();
	},

	// Otra sección
	menu:function () {		
		this.reloadPage();
		$('.breadcrumb').hide();
		$("#menuSuperior li.inicio").addClass("active");
		$(".seccion").hide();
		$(".seccion.menu").show();
	},
	// Otra sección
	consulta:function () {
		this.reloadPage();
		$("#menuSuperior li.consulta").addClass("active");
		$(".seccion").hide();
		$(".seccion.consulta").show();
		$(".breadcrumb").append('<li class="active">Consulta</li>');
	},

	solicitudes:function (id) {
		this.reloadPage();	
		$("#menuSuperior li.solicitudes").addClass("active");
		$(".seccion.solicitudes").show();
		$(".breadcrumb").append('<li class="active">Solicitudes</li>');

		App.views.solicitudesMainView.setServicioId(id);
		this.trigger("hola");
	},
	hogares:function () {		
		this.reloadPage();			
		$("#menuSuperior li.administracion").addClass("active");
		$(".seccion.adminHogares").show();
		$(".breadcrumb").append('<li class="active">Hogares</li>');		
        var hogares_collection = new App.collections.Hogares();
        var hogares_list_view = new App.views.AdminHogaresMainView({el: $('.seccion.adminHogares'), model: hogares_collection});
        App.views.hogaresNuevoHogarView = new App.views.HogaresNuevoHogarView({});
        //hogares_collection.fetch();
        
	},
	reloadPage:function(){
		$('.breadcrumb').show();
		$(".seccion").hide();
		$(".breadcrumb li:not(:first)").remove();//Eliminando breadcrums		
		$("#menuSuperior li").removeClass('active');		
	},
	logout:function(){
		location.href='../user/logout';
	},	


	listarPersona:function () {	
		
		this.reloadPage();
		$("#menuSuperior li.administracion").addClass("active");
		$(".seccion.personas").show();
		$(".breadcrumb").append('<li class="active">Personas y Organizaciones</li>');
		App.views.personasMainView = new App.views.PersonasOrganizacionesMainView({
       	 		el:$(".seccion.personas")
		});
	}


});

