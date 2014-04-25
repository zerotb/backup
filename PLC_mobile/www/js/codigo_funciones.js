function mensajeParaModal(mensaje,tipoMensaje){
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

function mensajeParaMantenedor(mensaje,tipoMensaje){
	//tipoMensaje: alert,alert-danger,alert-success,alert-info
	if(typeof mensaje =="undefined"){
		mensaje="";
	}
	//Si ya existe un mensaje previo, debemos eliminar el mensaje anterior.
	if($("#mensajeSuccess").html())	$("#mensajeSuccess").remove();
	
	if(typeof tipoMensaje=="undefined")	tipoMensaje="alert-success";
	//seccion
	if($('#content').length>0)
		$('#content').prepend('<div class="alert '+tipoMensaje+'" id="mensajeSuccess"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>'+mensaje+'</strong></div>');
	else
		$('.seccion:visible').prepend('<div class="alert '+tipoMensaje+'" id="mensajeSuccess"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>'+mensaje+'</strong></div>');
	$('html, body').animate({ scrollTop:0}, 1000);
	$("#mensajeSuccess").delay(7000).fadeOut(2000).delay(9000).queue(function() { $(this).remove(); });
}

//Función para validar el RUT Chileno
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

//Función para entregar el digito verificador del RUT.
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
//Función para calcular la edad de una persona por medio de su fecha de nacimiento.
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

	// console.log("FECHA ANTES : "+fecha);


	if(fecha == "" || typeof(fecha) == "undefined" || fecha === null){

		// console.log("undefined FECHA");

		return "";
	}else{
		date=fecha.split(' ');
		date=date[0].split('-');
		date=date[2]+'-'+date[1]+'-'+date[0];

		// console.log("FECHA :"+date);
		return date;	
	}

}

function formatFechaHora(fecha){
	// var fecha="2013-12-23 00:00:00";

	// console.log("FECHA ANTES : "+fecha);


	if(fecha == "" || typeof(fecha) == "undefined" || fecha === null){

		// console.log("undefined FECHA");

		return "";
	}else{
		date=fecha.split(' ');
		hora=date[1]
		date=date[0].split('-');
		date=date[2]+'-'+date[1]+'-'+date[0];

		// console.log("FECHA :"+date);
		return date+" ("+hora+")";	
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
}

//From YII
function afterAjaxUpdateSuccess(){
	$('.loader_message').remove();//Eliminar cargando
	if(typeof($('.glyphicon').parent('a[title!=\"\"]').tooltip)!="undefined")
		$('.glyphicon').parent('a[title!=\"\"]').tooltip({'placement': 'top'});//Agregar tooltip
}

function beforeAjaxUpdateSuccess(){
	mensajeCargando();
}

function afterAjaxSaveSuccess(){
	afterAjaxUpdateSuccess();
	mensajeParaMantenedor("Los registros fueron almacenados correctamente.");
}
