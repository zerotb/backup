$(document).ready(function() {
	// initializeMapa();
});

var variableGlobales = {
	//MAPA REGION ARAUCANIA
    latitud: function() {
    	return -38.76531007926573;
    },

    longuitud: function() {
    	return -72.59960896301271;
    }
};

function initializeMapa(latitud,longuitud) {
	var myLatlng = new google.maps.LatLng(latitud,longuitud);
	var myOptions = {
		zoom : 13,
		center : myLatlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map($("#map_canvas").get(0), myOptions);

	marker = new google.maps.Marker({
		position : map.getCenter(),
		map : map,
		title : 'Pulsa aquí',
		cursor : 'default',
		draggable : true
	});

	google.maps.event.addListener(marker, 'click', function() {
		updatePosition(marker.getPosition());
	});
}



$('#search').live('click', function() {
	// Obtenemos la dirección y la asignamos a una variable
	var address = $('#address').val();
	// Creamos el Objeto Geocoder
	var geocoder = new google.maps.Geocoder();
	// Hacemos la petición indicando la dirección e invocamos la función
	// geocodeResult enviando todo el resultado obtenido
	geocoder.geocode({
		'address' : address
	}, geocodeResult);
});
$('#mapa').live('click', function() {
	initializeMapa();
});
function geocodeResult(results, status) {

	console.log(results);
	// Verificamos el estatus
	if (status == 'OK') {
		// Si hay resultados encontrados, centramos y repintamos el mapa
		// esto para eliminar cualquier pin antes puesto
		var mapOptions = {
			center : results[0].geometry.location,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map($("#map_canvas").get(0), mapOptions);
		// fitBounds acercará el mapa con el zoom adecuado de acuerdo a lo buscado
		map.fitBounds(results[0].geometry.viewport);
		// Dibujamos un marcador con la ubicación del primer resultado obtenido
		var markerOptions = {
			position : results[0].geometry.location,
			draggable : true
		};
		
		var marker = new google.maps.Marker(markerOptions);
		marker.setMap(map);
		google.maps.event.addListener(marker, 'click', function() {

			updatePosition(marker.getPosition());
		});

		$("#persona_direccion").val(results[0].formatted_address);

		updatePosition(results[0].geometry.location);

	} else {
		// En caso de no haber resultados o que haya ocurrido un error
		// lanzamos un mensaje con el error
		alert("Añada una direccion");
	}
}

//funcion que simplemente actualiza los campos del formulario
function updatePosition(latLng) {
	$('#latitud').val(latLng.nb);
	$('#longitud').val(latLng.ob);
}
// function updatePosition2(lat,lon) {
// 	$('#latitud').val(lat);
// 	$('#longitud').val(lon);
// }
