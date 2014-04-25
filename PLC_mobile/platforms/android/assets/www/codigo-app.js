window.App = {
        models : {},
        collections : {},
        views : {},
        token:"",
        sesion:{},
        baseurl : "http://uranio.tide.cl/plc", 
        baseapiurl : "http://uranio.tide.cl/plc/apiplc",  
        xhrPool:[]
}

$().ready(function() {
		var sync = Backbone.sync;
		Backbone.sync = function (method, model, options) {	
			if(model && (method === 'create' || method === 'update'|| method === 'delete'|| method === 'options'|| method === 'read')) {
				options.beforeSend = function (xhr) {
				    xhr.setRequestHeader('Token', App.token);
				};							
			}
		    var success = options.success;
		    options.success = function (resp, status, xhr) {		    	
		        if (success){
		        	//console.log(resp.cantidadRegistros);
		        	if(method === 'read'){
		        		$('[data-toggle="tooltip"]').tooltip({'placement': 'top'});
		        	}
		        	//success(resp.data, status, xhr);
		        	success(resp, status, xhr);
		        }
		    };
		    options.error = function (xhr, ajaxOptions, thrownError) {
		    	ocultarMensajeCargando();
		    	if(xhr.status==401 || ajaxOptions=='timeout'){//No login
		    		window.location = App.baseurl+"/user/logout";
		    	}	        
		    }
		  //Debemos detener los fetch que no llegaron las llamadas.
		    if (model &&  method === 'read'){
		    	//Agregando tooltip		    	
			    if (options.abortPending == true) {      
			      for (var i = 0; i < App.xhrPool.length; i++) {
			        if (App.xhrPool[i]['readyState'] > 0 && App.xhrPool[i]['readyState'] < 4) {
			          App.xhrPool[i].abort();
			          App.xhrPool.splice(i, 1);
			        }
			      }
			      ocultarMensajeCargando();
			    }	
			    // cleanup xhrPool
			    // todo: make removal from the pool an 'always' jqXHR callback
			    // instead of cleanup on every read?
			    for (var i = 0; i < App.xhrPool.length; i++) {
			      if (App.xhrPool[i]['readyState'] === 4) {			    	  
			    	  App.xhrPool.splice(i, 1);
			      }
			    }	
			    var xhr = sync(method, model, options);
			    App.xhrPool.push(xhr);
		  }else{
			  sync(method, model, options);  
		  }			    
		};		
		
        // Definición de datos a utilizar en la App

        // CONSTRUCCION DE MODELOS Y COLECCIONES
        // =====================================

		// personas - utilizado en administración de personas
		//App.collections.personas = new App.collections.Personas();
	
		// personaEnConsulta - utilizado en módulo de consulta
		//App.models.personaEnConsulta = new App.models.Persona();
		
		//this.templateSesion = _.template($("#template_SesionMainView").html());
		App.models.sesion = new App.models.Sesion();
		
		App.views.sesionMainView = new App.views.SesionView({
	        el:$("#sesionName"),
	        model:App.models.sesion
		});
		App.models.sesion.on("sync",function(){			
			callMainView();
		});		
	
});

function callMainView(){
    // personas - utilizado en administración de personas
    App.collections.personas = new App.collections.Personas();
    // hogares - utilizado en administración de hogares
    App.collections.hogares = new App.collections.Hogares();
    // personaEnConsulta - utilizado en módulo de consulta
    App.models.personaEnConsulta = new App.models.Persona();
    App.models.personaEnConsulta.on("sync", function() {
        this.solicitudes.fetch();
        this.hogares.fetch();
        this.organizaciones.fetch();
        this.miembros.fetch();
    })

	


	 // App.views.personasNuevaPersonaView = new App.views.PersonasNuevaPersonaView({
	 //        el:$(".seccion.createPersona")
	 // });
	
	// consultaMainView - Consulta de persona
	App.views.consultaMainView = new App.views.ConsultaMainView({
	        el:$(".seccion.consulta"),
	        model:App.models.personaEnConsulta
	});
	
	App.views.solicitudesMainView = new App.views.SolicitudesMainView({
	        el:$(".seccion.solicitudes")
	});


	// App.views.personasNuevaPersonaView = new App.views.PersonasNuevaPersonaView({
 //     	});

   
	App.views.solicitudesNuevaSolicitudView = new App.views.SolicitudesNuevaSolicitudView({
	});

	App.views.solicitudesDetalleSolicitudView = new App.views.SolicitudesDetalleSolicitudView({
	});

	App.views.consultaDetalleSolicitudView = new App.views.ConsultaDetalleSolicitudView({
	});

	// App.views.personasEditPersonaView = new App.views.PersonasNuevaPersonaView({
	//         el:$(".seccion.editPersona")
	// });


	
	// App.views.consultaBusquedaView = new App.views.ConsultaBusquedaView({
	        // el:$(".consulta.busqueda"),
	        // model:App.models.personaEnConsulta
	// });
	//
	// App.views.consultaInfoGeneralView = new App.views.ConsultaInfoGeneralView({
	        // el:$(".consulta.info_general"),
	        // model:App.models.personaEnConsulta
	// });
	App.router = new App.AppRouter({app:window.app });
	Backbone.history.start();
}


// Intercepta links para tener navegación con rutas (urls) normales (/ en vez de #)
// Globally capture clicks. If they are internal and not in the pass 
// through list, route them through Backbone's navigate method.
$(document).on("click", "a[href^='/']", function(event){
	var href = $(event.currentTarget).attr('href');

	// chain 'or's for other black list routes
  	var passThrough = href.indexOf('sign_out') >= 0;

	// Allow shift+click for new tabs, etc.
	if (!passThrough && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) 
		event.preventDefault()

	// Remove leading slashes and hash bangs (backward compatablility)
	var url = href.replace(/^\//,'').replace('\#\!\/','');

	// Instruct Backbone to trigger routing events
	App.router.navigate(url, {trigger:true});

	return false
});


function limpiarRut(rut){
	strRut = rut.split('.').join('').split('-');
	strRut=(typeof(strRut)=="object")?strRut[0]:strRut;
	return strRut;	
}
