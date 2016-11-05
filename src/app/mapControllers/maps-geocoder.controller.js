
angular.module('mapaAngularTest').controller('MapGeocoder', ['$scope', 'leafletData',
    function($scope, leafletData) {
        leafletData.getMap().then(function(map) {
        	var vmap=map;
        	var scope = $scope;
        	
        	vmap.setView([-34.7694071, -58.2560052], 5);
        	
        	$scope.action = function(){
        		var HttpClient = function() {
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
        	
        		encodedQuery=scope.gmaps.calle + '+' + scope.gmaps.altura + '+' + scope.gmaps.partido + '+' + scope.gmaps.pais;
        		aQuery = new HttpClient();;
        		aQuery.get('https://maps.googleapis.com/maps/api/geocode/json?address='+encodedQuery+'+&key=AIzaSyD_8mUpLuoMmB6qSW_kI3vQXY7jpvbfnB4', function(response) {
        			if(JSON.parse(response).status == "OK"){
        				var json= JSON.parse(response).results[0].geometry.location;
        				var marker = L.marker([json.lat,json.lng]);
        				marker.addTo(vmap)
        				.bindPopup('<div>Te encuentras aca!<div>'+
        							'<div> Latitud:'+json.lat +'</div>'+
        							'<div> Longitud:'+ json.lng+'</div>')
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
