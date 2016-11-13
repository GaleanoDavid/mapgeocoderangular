angular.module('mapaAngularTest').controller('MapGeocoder', ['$scope', '$q','leafletData',
    function($scope, $q, leafletData) {
		/*-------------------------------
		 *------Variables Generales------
		 *------------------------------*/
		var scope = $scope;
    	var calle;
    	var altura;
    	var partido;
    	var pais;
    	var latitud;
    	var longitud;
    	
		//guarda un httpRequest;
		var HttpClient = function() {
			//genera un httpGET request;
			this.get = function(aUrl, aCallback) {
				var anHttpRequest = new XMLHttpRequest();
				anHttpRequest.onreadystatechange = function() { 
					if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
						aCallback(anHttpRequest.responseText);
	            	}

				anHttpRequest.open( "GET", aUrl, true );            
				anHttpRequest.send( null );
			}
		}
		/*--------------------------------------
		 * ------ Fin Variables Generales ------
		 *-------------------------------------*/
        leafletData.getMap().then(function(map) {
        	//variables para callbacks
    		var ejecutarLocalizar = $q.all([$scope.localizar]);
        	var vmap=map;
        	var scope = $scope;
        	var marker = null;
        	vmap.setView([-34.7739,-58.5520]);
        	vmap.setZoom(9);
        	//guarda una funcion para setear markers;
    		var agregarMarker = function() {
    			//funcion primaria para setear el Marker
    			this.setMarker = function(lat,lng){
    				console.log("marking");
    				if(marker == null){
    					 marker = L.marker([lat,lng]);
    					 this.markerPopUp(marker,lat,lng);
    					 return marker;
    				}else{
    					marker.setLatLng([lat,lng])
    					this.markerPopUp(marker,lat,lng)
    					return marker
    				}
    			}
    			//Le agrega el PopUp al marker (usada internamente)
    			//puede ser unsada externamente
    			this.markerPopUp = function(marker, lat,lng){
    				marker.bindPopup('<div>Te encuentras aca!<div>'+
        							'<div> Latitud:'+lat +'</div>'+
        							'<div> Longitud:'+lng+'</div>')
    			}
    		}
    		
    		function marcar (){
        		new agregarMarker().setMarker(vmap.getCenter().lat,vmap.getCenter().lng)
        		.addTo(vmap)
        		.openPopup();
        		vmap.setView([vmap.getCenter().lat,vmap.getCenter().lng], 15);
        		reverseGeoCoding();
    		}
    		
        	$scope.localizar = function(){
        		 if (navigator.geolocation) {
        	          navigator.geolocation.getCurrentPosition(function(position) {
        	            var pos = {
        	              lat: position.coords.latitude,
        	              lng: position.coords.longitude
        	            };
        	            vmap.setView(pos);
        	            vmap.setZoom(15);
        	            marcar();
        	            
        	          });
        	     }
        	}
        	
        	function loadproperties(){
        		$scope.calle = calle;
        		$scope.altura = altura;
        		$scope.partido = partido;
        		$scope.pais = pais;
        		$scope.latitud = latitud;
        		$scope.longitud = longitud;
        		$scope.$apply();
        	}
        	
        	function validateArrayWithElement(array,compare){
        		var ret = false;
        		for (i in array){
        			if(!ret){
        				ret = array[i] == compare;
        			}
        		}
        		return ret;
        	}        	
        	
        	function getJsonDataComponents(jsonArray){
        		for(i in jsonArray){
        			var index = i;
        			var value = jsonArray[index].types;
        			if(validateArrayWithElement(value,'street_number')){
        				altura = jsonArray[index].long_name;
        			}
        			
        			if(validateArrayWithElement(value,'route')){
        				calle = jsonArray[index].long_name;
        			}
        			
        			if(validateArrayWithElement(value,'administrative_area_level_2')){
        				partido = jsonArray[index].long_name;
        			}
        			
        			if(validateArrayWithElement(value,'country')){
        				pais = jsonArray[index].long_name;
        			}
        			
        		}
        	}
        	
        	function reverseGeoCoding(){
        		var lat = marker.getLatLng().lat;
        		var lng = marker.getLatLng().lng;
        		aQuery = new HttpClient();
        		var httpquery = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyD_8mUpLuoMmB6qSW_kI3vQXY7jpvbfnB4';
        		console.log(httpquery);
        		aQuery.get(httpquery, function(response) {
        			if(JSON.parse(response).status == "OK"){
        				var jsonarray= JSON.parse(response).results[0].address_components;
        				var json= JSON.parse(response).results[0].geometry.location;
        				getJsonDataComponents(jsonarray);
            			latitud = json.lat;
            			longitud = json.lng;
        				loadproperties();
        				scope.result="success"
        				
        			}else{
        				scope.result = "Error!";
        			}
        		});        		
        	}
        
        	
        	$scope.buscar = function(){
        		
        		//Arma la query
        		encodedQuery=scope.calle + '+' + scope.altura + '+' + scope.partido + '+' + scope.pais;
        		aQuery = new HttpClient();
        		//Ejecuta la query y delega la respuesta (response) a la funcion anonima
        		aQuery.get('https://maps.googleapis.com/maps/api/geocode/json?address='+encodedQuery+'+&key=AIzaSyD_8mUpLuoMmB6qSW_kI3vQXY7jpvbfnB4', function(response) {
        			if(JSON.parse(response).status == "OK"){
        				var json= JSON.parse(response).results[0].geometry.location;
        				var jsonarray =JSON.parse(response).results[0].address_components
        				new agregarMarker().setMarker(json.lat,json.lng)
        				.addTo(vmap)        				
        				.openPopup();
        				getJsonDataComponents(jsonarray);
            			latitud = json.lat;
            			longitud = json.lng;
            			loadproperties();
        				vmap.setView([json.lat, json.lng], 15);
        				scope.result ="Success!";
        			}else{
        				console.log(encodedQuery);
        				scope.result = "Error!";
        			}
        		});
            }
      });
    }
]);