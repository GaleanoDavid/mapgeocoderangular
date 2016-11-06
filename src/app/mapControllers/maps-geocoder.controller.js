
angular.module('mapaAngularTest').controller('MapGeocoder', ['$scope', 'leafletData',
    function($scope, leafletData) {
        leafletData.getMap().then(function(map) {
        	var vmap=map;
        	var scope = $scope;
        	var marker = null;
        	vmap.setView([-34.7694071, -58.2560052], 7);
        	
        	$scope.buscar = function(){
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
        		//guarda una funcion para setear markers;
        		var agregarMarker = function() {
        			//funcion primaria para setear el Marker
        			this.setMarker=function(lat,lng){
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
        		//Arma la query
        		encodedQuery=scope.gmaps.calle + '+' + scope.gmaps.altura + '+' + scope.gmaps.partido + '+' + scope.gmaps.pais;
        		aQuery = new HttpClient();
        		//Ejecuta la query y delega la respuesta (response) a la funcion anonima
        		aQuery.get('https://maps.googleapis.com/maps/api/geocode/json?address='+encodedQuery+'+&key=AIzaSyD_8mUpLuoMmB6qSW_kI3vQXY7jpvbfnB4', function(response) {
        			if(JSON.parse(response).status == "OK"){
        				var json= JSON.parse(response).results[0].geometry.location;
        				new agregarMarker().setMarker(json.lat,json.lng)
        				.addTo(vmap)        				
        				.openPopup();
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
