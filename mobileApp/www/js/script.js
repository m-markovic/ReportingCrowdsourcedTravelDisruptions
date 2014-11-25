/* Author: David Corsar

 */
irp = {
	getthere : {
		constants : {
			BusJourney : 'http://www.dotrural.ac.uk/irp/uploads/ontologies/user/BusJourney',
			Location : "http://www.dotrural.ac.uk/irp/uploads/ontologies/sensors/location"
		},
		servers : {
			transport : "transport",
			timetable : "timetable",
			user : "user",
			observation : "observation",
			journey : "journey"
		},
		funcs : {
			getNptgRegions : function(success) {
				irp.getthere.funcs.ajaxGet(irp.getthere.servers.transport,
						"getNptgRegions", {
							regionUri : "regionUri"
						}, success, function(jqXHR, textStatus, errorThrown) {
							alert("error" + errorThrown);
						});
			},
			getNptgAdminAreas : function(regionUri, success) {
				irp.getthere.funcs.ajaxGet(irp.getthere.servers.transport,
						"getNptgAdminAreas", {
							regionUri : regionUri
						}, success, function(jqXHR, textStatus, errorThrown) {
							alert("error" + errorThrown);
						});
			},
			getRoutesInArea : function(areaUri, success, error) {
				irp.getthere.funcs.ajaxGet(irp.getthere.servers.timetable,
						"getRoutesInAdminArea", {
							"adminAreaUri" : areaUri,
							"includeDirections" : "TRUE"
						}, success, error);
			},
			getTimetableBusLocations : function(routeUri, direction, success,
					error) {
				irp.getthere.funcs.ajaxGet(irp.getthere.servers.timetable,
						"getBusLocationsOnRoute", {
							"lineUri" : routeUri,
							"direction" : direction
						}, success, error);
			},
			getRealtimeBusLocations : function(routeUri, direction, success,
					error) {
				irp.getthere.funcs.ajaxGet(irp.getthere.servers.observation,
						"getBusLocationsOnRoute", {
							"lineUri" : routeUri,
							"direction" : direction
						}, success, error);
			},
			// makes a get ajax request to a service via the proxy.php
			ajaxGet : function(service, method, params, s, e) {
				//var data = params;
				//data['service'] = service;
				//data['method'] = method;
				$.ajax({
					url : "http://107.20.159.169:8080/ecosystem-transport/transport/getNptgRegions",
					datatype : 'json',
					accepts : 'json',
					type : "GET",
					data : data,
					success : s,
					error : e
				});
			},
			ajaxPost : function(service, method, params, s, e) {
				var dt = {};
				dt['service'] = service;
				dt['method'] = method;
				dt['stuff'] = JSON.stringify(params);
				$.ajax({
					url : "proxy.php",
					datatype : 'json',
					accepts : 'json',
					type : "POST",
					data : dt,
					success : s,
					error : e
				});
			},

			register : function(email, nickname, password, success, error) {
				irp.getthere.funcs.ajaxPost(irp.getthere.servers.user,
						"create", {
							"email" : email,
							"nickname" : nickname,
							"password" : password
						}, success, error);
			},
			login : function(email, password, success, error) {
				irp.getthere.funcs.ajaxGet(irp.getthere.servers.user,
						"isValidLoginCredentials", {
							"email" : email,
							"password" : password
						}, success, error);
			},
			startJourneyNewPhone : function(authenticationToken, userUri,
					lineUri, direction, deviceType, deviceName, deviceOS,
					deviceOSVersion, uniqueId, success, error) {
				irp.getthere.funcs
						.ajaxPost(
								irp.getthere.servers.journey,
								"create",
								{
									"authenticationToken" : authenticationToken,
									"userUri" : userUri,
									"device" : {
										"type" : deviceType,
										"name" : deviceName,
										"operatingSystem" : deviceOS,
										"operatingSystemVersion" : deviceOSVersion,
										"uniqueId" : uniqueId
									},
									"type" : {
										'uri' : 'http://www.dotrural.ac.uk/irp/uploads/ontologies/user/BusJourney',
										'lineUri' : lineUri,
										'direction' : direction
									}
								}, success, error);
			},
			startJourneyExistingPhone : function(authenticationToken, userUri,
					lineUri, direction, deviceUri, success, error) {
				irp.getthere.funcs.ajaxPost(irp.getthere.servers.journey,
						"create", {
							"authenticationToken" : authenticationToken,
							"userUri" : userUri,
							"device" : {
								"uri" : deviceUri
							},
							"type" : {
								'uri' : irp.getthere.constants.BusJourney,
								'lineUri' : lineUri,
								'direction' : direction
							}
						}, success, error);

			},
			sendLocationUpdate : function(authenticationToken, userUri,
					sensorUri, sensingMethodUsedUri, sensingControllerUri,
					journeyUri, latitude, longitude, gpsTime, deviceTime,
					accuracy, heading, speed, success, error) {
				irp.getthere.funcs.ajaxPost(irp.getthere.servers.observation,
						"create", {
							'authenticationToken' : authenticationToken,
							'userUri' : userUri,
							'type' : 'LocationDeviceObservation',
							'sensor' : sensorUri,
							'sensingMethodUsed' : sensingMethodUsedUri,
							'sensingController' : sensingControllerUri,
							'featureOfInterest' : journeyUri,
							'values' : {
								'latitude' : latitude,
								'longitude' : longitude,
								'gpsTime' : gpsTime,
								'deviceTime' : deviceTime,
								'accuracy' : accuracy,
								'heading' : heading,
								'speed' : speed
							}
						}, success, error);
			},
			getBusStopsOnRoute : function(routeUri, direction, success, error) {
				irp.getthere.funcs.ajaxGet(irp.getthere.servers.timetable,
						"getBusStopsOnRoute", {
							'lineUri' : routeUri,
							'direction' : direction
						}, success, error);
			}
		},
		util : {
			// just for demo purposes, should use Appcelerator
			getDeviceDetails : function() {
				var details = {
					deviceType : 'iPhone', // should change
					deviceName : navigator.appName,
					deviceOS : irp.getthere.util.getOS(),
					deviceOSVersion : '1.0',
					// not ideal, but it'll do
					uniqueId : new Date().getTime()
				};
				return details;
			},
			findSensor : function(sensors, observedThing) {
				if (sensors instanceof Array) {
					$.each(sensors, function(key, value) {
						if (key.observes == observedThing) {
							return key;
						}
					});
				} else if (sensors.observes == observedThing) {
					return sensors;
				}
				return null;
			},
			getLocation : function(success, error) {
				var location = {};
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
							function(position) {
								location = {
									latitude : position.coords.latitude,
									longitude : position.coords.longitude,
									gpsTime : irp.getthere.util.getTime(),
									deviceTime : irp.getthere.util.getTime(),
									accuracy : position.coords.accuracy,
									heading : position.coords.heading,
									speed : position.coords.speed
								};
								success(location);
							}, function(error) {
								location = {
									latitude : "57.166315",
									longitude : "-2.098346",
									gpsTime : irp.getthere.util.getTime(),
									deviceTime : irp.getthere.util.getTime(),
									accuracy : "5",
									heading : "",
									speed : ""
								};
								error(location);
							}, {
								maximumAge : (60000 * 5),
								enableHighAccuracy : true
							});

				}
			},
			getTime : function() {
				return new Date().getTime();
				// var now = moment(new Date());
				// str = now.format('YYYY-MM-DD HH:mm:ss ZZ');
				// return str;
			},
			getOS : function() {
				var OSName = "Unknown OS";
				if (navigator.appVersion.indexOf("Win") != -1)
					OSName = "Windows";
				if (navigator.appVersion.indexOf("Mac") != -1)
					OSName = "MacOS";
				if (navigator.appVersion.indexOf("X11") != -1)
					OSName = "UNIX";
				if (navigator.appVersion.indexOf("Linux") != -1)
					OSName = "Linux";
				return OSName;
			}
		},
		ui : {
			addTimetableLocations : function(locations, layer) {
				layer.clearMarkers();
				if ("locations" in locations && locations.locations.length > 0) {
					$.each(locations.locations, function(key, value) {
						var size = new OpenLayers.Size(33, 44);
						var offset = new OpenLayers.Pixel(-(size.w / 2),
								-size.h);
						var icon = new OpenLayers.Icon("../img/busTT.gif",
								size, offset);
						mapping.addMarker(key, value.longitude, value.latitude,
								"hello " + value.timestamp, icon, layer);
					});
				} else {
					var size = new OpenLayers.Size(33, 44);
					var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
					var icon = new OpenLayers.Icon("../img/busTT.gif", size,
							offset);
					mapping.addMarker("", locations.longitude,
							locations.latitude, "hello " + locations.timestamp,
							icon, layer);

				}
			},
			addMarkers : function(locations, layer, imageUri) {
				layer.removeAllFeatures();
				var features = {
					"type" : "FeatureCollection",
					"features" : []
				};
				if ("locations" in locations && locations.locations.length > 0) {

					$.each(locations.locations, function(key, value) {
						var p = new OpenLayers.LonLat(value.latitude,
								value.longitude).transform(
								new OpenLayers.Projection("EPSG:4326"),
								new OpenLayers.Projection("EPSG:900913"));
						features.features.push({
							"type" : "Feature",
							"geometry" : {
								"type" : "Point",
								"coordinates" : [ p.lon, p.lat ]
							}
						});
					});
				} else {
					var p = new OpenLayers.LonLat(locations.latitude,
							locations.longitude).transform(
							new OpenLayers.Projection("EPSG:4326"),
							new OpenLayers.Projection("EPSG:900913"));
					features.features.push({
						"type" : "Feature",
						"geometry" : {
							"type" : "Point",
							"coordinates" : [ p.lon, p.lat ]
						}
					});
				}
				var reader = new OpenLayers.Format.GeoJSON();

				var f = reader.read(features);
				layer.addFeatures(f);
			},
			addBusStops : function(busStops, layer, imageUri) {
				layer.removeAllFeatures();
				var features = {
					"type" : "FeatureCollection",
					"features" : []
				};
				// if ("busStops" in busStops && busStops.busStops.length > 0) {

				$.each(busStops.busStops, function(key, value) {
					var p = new OpenLayers.LonLat(value.longitude,
							value.latitude).transform(
							new OpenLayers.Projection("EPSG:4326"),
							new OpenLayers.Projection("EPSG:900913"));
					features.features.push({
						"type" : "Feature",
						"geometry" : {
							"type" : "Point",
							"coordinates" : [ p.lon, p.lat ]
						},
						"properties" : {
							"foo" : "bar"
						}
					});
				});
				// } else {
				// var p = new OpenLayers.LonLat(locations.latitude,
				// locations.longitude).transform(
				// new OpenLayers.Projection("EPSG:4326"),
				// new OpenLayers.Projection("EPSG:900913"));
				// features.features.push({
				// "type" : "Feature",
				// "geometry" : {
				// "type" : "Point",
				// "coordinates" : [ p.lon, p.lat ]
				// }
				// });
				// }
				var reader = new OpenLayers.Format.GeoJSON();

				var f = reader.read(features);
				layer.addFeatures(f);
			}
		}
	}
};

mapping = {
	init : function(elementId) {
		var map = new OpenLayers.Map(elementId);
		var layer = new OpenLayers.Layer.OSM("Simple OSM Map");
		map.addLayer(layer);
		map.setCenter(new OpenLayers.LonLat(-2.101135, 57.15561).transform(
				new OpenLayers.Projection("EPSG:4326"),
				new OpenLayers.Projection("EPSG:900913")), 12);
		return map;
	},
	// addMarkerLayer : function(map, layerId) {
	// var layer = new OpenLayers.Layer.Markers(layerId);
	// map.addLayer(layer);
	// return layer;
	// },
	addMarkerLayer : function(map, layerId, iconUri) {
		var sprintersLayer = new OpenLayers.Layer.Vector(layerId, {
			styleMap : new OpenLayers.StyleMap({
				externalGraphic : iconUri,
				graphicOpacity : 1.0,
				graphicWidth : 33,
				graphicHeight : 44,
				graphicYOffset : -44
			}),
			eventListeners : {
				'featureselected' : function(evt) {
					var feature = evt.feature;
					var popup = new OpenLayers.Popup.FramedCloud("popup",
							OpenLayers.LonLat.fromString(feature.geometry
									.toShortString()), null,
							"<div style='background:white;font-size:.8em'>Journey: "
									+ feature.attributes.journey
									+ " Device Time "
									+ feature.attributes.deviceTime
									+ " Server Time "
									+ feature.attributes.serverTime + "</div>",
							null, true);
					feature.popup = popup;
					map.addPopup(popup);
				},
				'featureunselected' : function(evt) {
					var feature = evt.feature;
					map.removePopup(feature.popup);
					feature.popup.destroy();
					feature.popup = null;
				}
			}
		});
		var selector = new OpenLayers.Control.SelectFeature(sprintersLayer, {
			hover : true,
			autoActivate : true
		});

		map.addControl(selector);
		map.addLayer(sprintersLayer);

		// var sprinters = getFeatures();
		// sprintersLayer.addFeatures(sprinters);

		return sprintersLayer;
	},
	addMarker : function(id, longitude, latitude, content, icon, layer) {
		var position = new OpenLayers.LonLat(latitude, longitude).transform(
				new OpenLayers.Projection("EPSG:4326"),
				new OpenLayers.Projection("EPSG:900913"));
		layer.addMarker(new OpenLayers.Marker(position), icon);
	}
};

function getFeatures() {
	var p = new OpenLayers.LonLat(-2.102107971118373, 57.14558119491852)
			.transform(new OpenLayers.Projection("EPSG:4326"),
					new OpenLayers.Projection("EPSG:900913"));
	var features = {
		"type" : "FeatureCollection",
		"features" : [ {
			"type" : "Feature",
			"geometry" : {
				"type" : "Point",
				"coordinates" : [ 1332700, 7906300 ]
			},
			"properties" : {
				"Name" : "Igor Tihonov",
				"Country" : "Sweden",
				"City" : "Gothenburg"
			}
		}, {
			"type" : "Feature",
			"geometry" : {
				"type" : "Point",
				"coordinates" : [ p.lon, p.lat ]
			},
			"properties" : {
				"Name" : "Marc Jansen",
				"Country" : "Germany",
				"City" : "Bonn"
			}
		} ]
	};

	var reader = new OpenLayers.Format.GeoJSON();

	return reader.read(features);
}
