

window.location.replace(window.location.href.split("#")[0] + "#mappage");
 

    var popup = null;
    var popupControl=null;
    var selectedFeature = null;
    var features = new OpenLayers.Layer.Vector("Disruptions", {});
    var vector = new OpenLayers.Layer.Vector("Points", {});
    var control = new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Point);
    var ttMarkerLayer = new OpenLayers.Layer.Vector("Buses", {});
    var rtMarkerLayer = new OpenLayers.Layer.Vector("RealTimeBuses", {});
    var busStopMarkerLayer = new OpenLayers.Layer.Vector("BusStops", {});
    var dirLayer;
    var routes = [];
    var selection = {};
    var disruptionCreated = false;
    var loggedIn = false;
    var routeSelected = false;
    var onTheBus = false;
    var selectedRoute;
    var firstForMaintenanceSelected= false;
    var firstFeature;
    var place;
    var osm_id;
    var user="";
     




 /*var select = vector.events.on({
                'featureselected': function(feature) {
                    $('counter').innerHTML = this.selectedFeatures.length;
                },
                'featureunselected': function(feature) {
                    $('counter').innerHTML = this.selectedFeatures.length;
                }
            });*/


     // assing features vector layer to the map and populate with fetures that were obtained via service call from the ecosystem
    function getDisruptions () {
         $.getJSON("http://localhost:8080/ecosytem-disruption/disruption/getAllIncidents",
                function(data){
                                console.log(data);
                                if (data!=null){
                                    addMarkers(data, features, "./img/warning.gif");
                                }
                }
                );

                $.mobile.changePage("#mappage", "pop");
    }

function getRealTimeBuses () {
        irp.getthere.funcs.getRealtimeBusLocations(selectedRoute.lineUri, selectedRoute.direction, 
                function(data){
                    if (data!=null){
                        irp.getthere.ui.addRealtimeMarkers(data, rtMarkerLayer, "./img/busRT.gif");
                    }
                }, function (jqXHR, textStatus, errorThrown){
                });
    }

   function  addMarkers(locations, layer, imageUri) {
                layer.removeAllFeatures();
                var features = {"type":"FeatureCollection", "features":[]};
                 console.log(locations);

                 if ("eventReport" in locations && locations.eventReport.length > 0) {
                    console.log ("hello");
               $.each(locations.eventReport, function(key, value) {
                    var p = new OpenLayers.LonLat(value.lon,value.lat).transform(
                            new OpenLayers.Projection("EPSG:4326"),
                            new OpenLayers.Projection("EPSG:900913"));
                    features.features.push(
                    {"type":"Feature", 
                        "geometry":{"type":"Point", "coordinates":[p.lon,p.lat]},
                         "properties": {"DeviceTime": value.deviceTime,"Event":value.event,"Type": value.type, "Description":value.description, "Uri":value.uri}
                    } 
                        
                    );
                })
                   
                }
                else {
                    console.log (locations.eventReport.lon);
                    var p = new OpenLayers.LonLat(locations.eventReport.lon,locations.eventReport.lat).transform(
                            new OpenLayers.Projection("EPSG:4326"),
                            new OpenLayers.Projection("EPSG:900913"));
                    features.features.push(
                    {"type":"Feature", 
                        "geometry":{"type":"Point", "coordinates":[p.lon,p.lat]},
                         "properties": {"DeviceTime": locations.eventReport.deviceTime,"Event":locations.eventReport.event,"Type": locations.eventReport.type, "Description":locations.eventReport.description, "Uri":locations.eventReport.uri}
                    }
                     
                        
                    );


                }


            
                var reader = new OpenLayers.Format.GeoJSON();
                var f = reader.read(features);
                layer.addFeatures(f);

               // console.log (layer.features);
            }




$(document).ready(function() {

    // fix height of content
    function fixContentHeight() {
        var footer = $("div[data-role='footer']:visible"),
            content = $("div[data-role='content']:visible:visible"),
            viewHeight = $(window).height(),
            contentHeight = viewHeight - footer.outerHeight();

        if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
            contentHeight -= (content.outerHeight() - content.height() + 1);
            content.height(contentHeight);
        }

        if (window.map && window.map instanceof OpenLayers.Map) {
            map.updateSize();
        } else {
            // initialize map
            init();

            OpenLayers.Renderer.symbol.arrow = [0,2, 1,0, 2,2, 1,0, 0,2];

            var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults(
          {graphicName:"arrow",rotation : "${angle}", strokeWidth: 2, strokeColor: "black"},
                    
          OpenLayers.Feature.Vector.style["default"]));

            dirLayer = new OpenLayers.Layer.Vector("direction", {styleMap: styleMap});
            map.addLayer(dirLayer);
            initLayerList();
           
            map.addLayer (vector);
            $('#navigation2').hide();
            $('#navigation3').hide();
            $('#navigation4').hide();
              $('#offBusButton').hide();
             addMarkerLayer (map, "Reports" , "./img/warning.gif"); 
              
          getDisruptions ();
           

     

            ttMarkerLayer = mapping.addMarkerLayer(map, "timetableBusLocations", "./img/busTT.gif");
            rtMarkerLayer = mapping.addMarkerLayer(map, "realtimeBusLocations",  "./img/busRT.gif");
	          busStopMarkerLayer = mapping.addMarkerLayer(map, "busStops", "./img/stopFlag.gif");
            selectControl = new OpenLayers.Control.SelectFeature(
                [features, ttMarkerLayer,rtMarkerLayer],
                {
                    clickout: true, toggle: false,
                    multiple: false, hover: false,
                    toggleKey: "ctrlKey", // ctrl key removes from selection
                    multipleKey: "shiftKey" // shift key adds to selection
                }
            );

           
           
           // map.addControl( new OpenLayers.Control.LayerSwitcher());

            map.addControl(selectControl);
            selectControl.activate();  

            features.events.on({
                "featureselected": function(e) {
                  //  showStatus("selected feature "+e.feature.id+" on Vector Layer 1");
                selectedFeature = e.feature;
                  
                    if (firstForMaintenanceSelected) {
                      
                      //console.log(firstFeature);

                      //console.log( selectedFeature);

                      map.layers[2].removeAllFeatures();
                      var points=[];
                      

                      
                          
                          var line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([firstFeature.geometry, selectedFeature.geometry]));
                           

                          var linePoints = createDirection(line.geometry,"middle",false) ;
                          
                          for (var j=0;j<linePoints.length ;j++ ) {
                                linePoints[j].attributes.lineFid = selectedFeature.fid;
                          }
                          points =points.concat(linePoints);


                      
                    //console.log(points);

                     map.layers[2].addFeatures(line);

                    map.layers[2].addFeatures(points);

                    $('#navigation4').show();
                    
    
    
}
                     
                    
                  
                    else {
                    $.mobile.changePage("#popup", "pop");
                  }
                 
                },
                "featureunselected": function(e) {
                   // showStatus("unselected feature "+e.feature.id+" on Vector Layer 1");
                }
            });

            
           
            ttMarkerLayer.events.on({
                "featureselected": function(e) {
                    //showStatus("selected feature "+e.feature.id+" on Vector Layer 2");
                   
                    // selectedFeature = e.feature;
                  //  $.mobile.changePage("#aboutBus", "pop");
                },
                "featureunselected": function(e) {
                   // showStatus("unselected feature "+e.feature.id+" on Vector Layer 2");
                }
            });

             rtMarkerLayer.events.on({
                "featureselected": function(e) {
                   selectedFeature = e.feature;
                    $.mobile.changePage("#aboutBus", "pop");
                },
                "featureunselected": function(e) {
                   // showStatus("unselected feature "+e.feature.id+" on Vector Layer 2");
                }
            });


        }
    }

    $(window).bind("orientationchange resize pageshow", fixContentHeight);
    document.body.onload = fixContentHeight;


   $('#mappage').live ('pageshow',function(event, ui){ 
            // make sure feature doesnt stay selected when popup closed
            selectControl.unselectAll();
        });


    // Validation incorrect more info popup

    $('#validationInorrectMoreInfo').live('pageshow',function(event, ui){
    

    irp.getthere.funcs.getIncorrectMoreInfo (selectedFeature.attributes.Uri,function(data){
    console.log(data);

    $("ul#incorrect-validation-reports-details-list").empty();
    
     if ("validationMoreInfoResponse" in data && data.validationMoreInfoResponse.length > 0) {
                    console.log ("hello");
               $.each(data.validationMoreInfoResponse, function(key, value) {
                    
                     // console.log(value)  

                      var creatorOfValidationReport ="unknown";
        
                        if (value.user != "") {
                        creatorOfValidationReport = value.user; 
                      } 
      
        var user = "<li style='padding:5px 10px;'><div >Created by : " + creatorOfValidationReport +"</li>" ;        

        var d = new Date ();
        d.setTime(value.deviceTime);
        var dateString = d.getUTCFullYear() +"/"+ (d.getUTCMonth()+1) +"/"+ d.getUTCDate() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();

        console.log(d);

        $("ul#incorrect-validation-reports-details-list").append ("<li style='padding:5px 10px;'><div><img src='img/clock.png' height=6%/> " + dateString +"</div></li>");
        $("ul#incorrect-validation-reports-details-list").append (user);
        $("ul#incorrect-validation-reports-details-list").append ("<li style='padding:5px 10px;'>Creator's proximity to the event: </li>");
         $("ul#incorrect-validation-reports-details-list").trigger('create') ;
         


        var point1 = new OpenLayers.Geometry.Point(value.deviceLat,value.deviceLon);
          var point2 = new OpenLayers.Geometry.Point(selectedFeature.geometry.x,selectedFeature.geometry.y).transform(map.getProjectionObject(),
                   new OpenLayers.Projection("EPSG:4326") )
          var line = new OpenLayers.Geometry.LineString([point1, point2]);
          //distance in meters
          var dist = line.getGeodesicLength(new OpenLayers.Projection("EPSG:4326"));
          console.log(point1);
          console.log(point2);
          console.log(dist);

          //console.log(point1.distanceTo(point2));     

          reliablility = 80/dist;

          if (reliablility>1) {
                                reliablility=1;
          }

        //Add graph holder
        $("<div></div>", {id: "1reliabiltyGraph"+key ,style: "margin-left:20px;margin-bottom:5px"}).appendTo("ul#incorrect-validation-reports-details-list");
                      $("#1reliabiltyGraph"+key).css("border", "1px solid #000");
                      $("#1reliabiltyGraph"+key).css("width", "85%");
                      $("#1reliabiltyGraph"+key).css("height", "15px;");
  
                      //Add graph bar
                      $("<div></div>", {id: "1reliabilityGraphBar"+key }).appendTo("#1reliabiltyGraph"+key);
                      if(reliablility < 0.02 )
                        $("#1reliabilityGraphBar"+key).css("width", "1%");
                      else
                        $("#1reliabilityGraphBar"+key).css("width", (reliablility * 100) + "%");
                      $("#1reliabilityGraphBar"+key).css("height", "15px");
  
                      //Color the graph
                                        if (reliablility >0.75) {
                                          $("#1reliabilityGraphBar"+key).css('backgroundColor','#49E20E');
                                      }
                                      else if (reliablility >0.25) {
                                          $("#1reliabilityGraphBar"+key).css('backgroundColor','orange');
                                      }
                                      else {
                                          $("#1reliabilityGraphBar"+key).css('backgroundColor','#FF2400');
                                      }

                      
                    
                })
                   
                }
                else {
                    var creatorOfValidationReport ="unknown";
        
       
                        if (data.validationMoreInfoResponse.user != "") {
                      
                        creatorOfValidationReport = data.validationMoreInfoResponse.user;
                        }  
      
        var user = "<li style='padding:5px 10px;'><div >Created by : " + creatorOfValidationReport +"</li>" ;        

        var d = new Date ();
        d.setTime(data.validationMoreInfoResponse.deviceTime);
         var dateString = d.getUTCFullYear() +"/"+ (d.getUTCMonth()+1) +"/"+ d.getUTCDate() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();

        console.log(d);

        $("ul#incorrect-validation-reports-details-list").empty().append ("<li style='padding:5px 10px;'><div><img src='img/clock.png' height=6%/> " + dateString +"</div></li>");
        $("ul#incorrect-validation-reports-details-list").append (user);
        $("ul#incorrect-validation-reports-details-list").append ("<li style='padding:5px 10px;'>Creator's proximity to the event: </li>");
         $("ul#incorrect-validation-reports-details-list").trigger('create') ;
         


        var point1 = new OpenLayers.Geometry.Point(data.validationMoreInfoResponse.deviceLat,data.validationMoreInfoResponse.deviceLon);
          var point2 = new OpenLayers.Geometry.Point(selectedFeature.geometry.x,selectedFeature.geometry.y).transform(map.getProjectionObject(),
                   new OpenLayers.Projection("EPSG:4326") )
          var line = new OpenLayers.Geometry.LineString([point1, point2]);
          //distance in meters
          var dist = line.getGeodesicLength(new OpenLayers.Projection("EPSG:4326"));
          console.log(point1);
          console.log(point2);
          console.log(dist);

          //console.log(point1.distanceTo(point2));     

          reliablility = 80/dist;

          if (reliablility>1) {
                                reliablility=1;
          }

        //Add graph holder
        $("<div></div>", {id: "1reliabiltyGraphOne" ,style: "margin-left:20px;margin-bottom:5px"}).appendTo("ul#incorrect-validation-reports-details-list");
                      $("#1reliabiltyGraphOne").css("border", "1px solid #000");
                      $("#1reliabiltyGraphOne").css("width", "85%");
                      $("#1reliabiltyGraphOne").css("height", "15px;");
  
                      //Add graph bar
                      $("<div></div>", {id: "1reliabilityGraphBarOne"}).appendTo("#1reliabiltyGraphOne");
                      if(reliablility < 0.02 )
                        $("#1reliabilityGraphBarOne").css("width", "1%");
                      else
                        $("#1reliabilityGraphBarOne").css("width", (reliablility * 100) + "%");
                      $("#1reliabilityGraphBarOne").css("height", "15px");
  
                      //Color the graph
                                        if (reliablility >0.75) {
                                          $("#1reliabilityGraphBarOne").css('backgroundColor','#49E20E');
                                      }
                                      else if (reliablility >0.25) {
                                          $("#1reliabilityGraphBarOne").css('backgroundColor','orange');
                                      }
                                      else {
                                          $("#1reliabilityGraphBarOne").css('backgroundColor','#FF2400');
                                      }

                }


    });

      });



    // Validation correct more info popup 

    $('#validationCorrectMoreInfo').live('pageshow',function(event, ui){
    irp.getthere.funcs.getCorrectMoreInfo (selectedFeature.attributes.Uri,function(data){
    console.log(data);

    $("ul#correct-validation-reports-details-list").empty();
    
     if ("validationMoreInfoResponse" in data && data.validationMoreInfoResponse.length > 0) {
                   
               $.each(data.validationMoreInfoResponse, function(key, value) {
                    
                     // console.log(value)  

                      var creatorOfValidationReport ="unknown";
        
                        if (value.user !="") {
                        creatorOfValidationReport = value.user;
                        } 
      
        var user = "<li style='padding:5px 10px;'><div >Created by : " + creatorOfValidationReport +"</b></li>" ;        

        var d = new Date ();
        d.setTime(value.deviceTime);
          var dateString = d.getUTCFullYear() +"/"+ (d.getUTCMonth()+1) +"/"+ d.getUTCDate() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();

        console.log(d);

        $("ul#correct-validation-reports-details-list").append ("<li style='padding:5px 10px;'><div><img src='img/clock.png' height=6%/> " + dateString +"</div></li>");
        $("ul#correct-validation-reports-details-list").append (user);
        $("ul#correct-validation-reports-details-list").append ("<li style='padding:5px 10px;'>Creator's proximity to the event: </li>");
        $("ul#correct-validation-reports-details-list").trigger('create') ;
         


        var point1 = new OpenLayers.Geometry.Point(value.deviceLat,value.deviceLon);
          var point2 = new OpenLayers.Geometry.Point(selectedFeature.geometry.x,selectedFeature.geometry.y).transform(map.getProjectionObject(),
                   new OpenLayers.Projection("EPSG:4326") )
          var line = new OpenLayers.Geometry.LineString([point1, point2]);
          //distance in meters
          var dist = line.getGeodesicLength(new OpenLayers.Projection("EPSG:4326"));
          console.log(point1);
          console.log(point2);
          console.log(dist);

          //console.log(point1.distanceTo(point2));     

          reliablility = 80/dist;

          if (reliablility>1) {
                                reliablility=1;
          }

        //Add graph holder
        $("<div></div>", {id: "reliabiltyGraph"+key ,style: "margin-left:20px;margin-bottom:5px" }).appendTo("ul#correct-validation-reports-details-list");
                      $("#reliabiltyGraph"+key).css("border", "1px solid #000");
                      $("#reliabiltyGraph"+key).css("width", "85%");
                      $("#reliabiltyGraph"+key).css("height", "15px;");
  
                      //Add graph bar
                      $("<div></div>", {id: "reliabilityGraphBar"+key }).appendTo("#reliabiltyGraph"+key);
                      if(reliablility < 0.02 )
                        $("#reliabilityGraphBar"+key).css("width", "1%");
                      else
                        $("#reliabilityGraphBar"+key).css("width", (reliablility * 100) + "%");
                      $("#reliabilityGraphBar"+key).css("height", "15px");
  
                      //Color the graph
                                        if (reliablility >0.75) {
                                          $("#reliabilityGraphBar"+key).css('backgroundColor','#49E20E');
                                      }
                                      else if (reliablility >0.25) {
                                          $("#reliabilityGraphBar"+key).css('backgroundColor','orange');
                                      }
                                      else {
                                          $("#reliabilityGraphBar"+key).css('backgroundColor','#FF2400');
                                      }

                      
                    
                })
                   
                }
                else {
                    var creatorOfValidationReport ="unknown";
        
                        if (data.validationMoreInfoResponse.user != "") {
                        creatorOfValidationReport = data.validationMoreInfoResponse.user; 
                      }
      
        var user = "<li style='padding:5px 10px;'><div >Created by : " + creatorOfValidationReport +"</li>" ;        

        var d = new Date ();
        d.setTime(data.validationMoreInfoResponse.deviceTime);
          var dateString = d.getUTCFullYear() +"/"+ (d.getUTCMonth()+1) +"/"+ d.getUTCDate() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();

        console.log(d);

        $("ul#correct-validation-reports-details-list").empty().append ("<li style='padding:5px 10px;'><div><img src='img/clock.png' height=6%/> " + dateString +"</div></li>");
        $("ul#correct-validation-reports-details-list").append (user);
        $("ul#correct-validation-reports-details-list").append ("<li style='padding:5px 10px;'>Creator's proximity to the event: </li>");
         $("ul#correct-validation-reports-details-list").trigger('create') ;
         


        var point1 = new OpenLayers.Geometry.Point(data.validationMoreInfoResponse.deviceLat,data.validationMoreInfoResponse.deviceLon);
          var point2 = new OpenLayers.Geometry.Point(selectedFeature.geometry.x,selectedFeature.geometry.y).transform(map.getProjectionObject(),
                   new OpenLayers.Projection("EPSG:4326") )
          var line = new OpenLayers.Geometry.LineString([point1, point2]);
          //distance in meters
          var dist = line.getGeodesicLength(new OpenLayers.Projection("EPSG:4326"));
          console.log(point1);
          console.log(point2);
          console.log(dist);

          //console.log(point1.distanceTo(point2));     

          reliablility = 80/dist;

          if (reliablility>1) {
                                reliablility=1;
          }

        //Add graph holder
        $("<div></div>", {id: "reliabiltyGraphOne" ,style: "margin-left:20px;margin-bottom:5px"}).appendTo("ul#correct-validation-reports-details-list");
                      $("#reliabiltyGraphOne").css("border", "1px solid #000");
                      $("#reliabiltyGraphOne").css("width", "85%");
                      $("#reliabiltyGraphOne").css("height", "15px;");
  
                      //Add graph bar
                      $("<div></div>", {id: "reliabilityGraphBarOne"}).appendTo("#reliabiltyGraphOne");
                      if(reliablility < 0.02 )
                        $("#reliabilityGraphBarOne").css("width", "1%");
                      else
                        $("#reliabilityGraphBarOne").css("width", (reliablility * 100) + "%");
                      $("#reliabilityGraphBarOne").css("height", "15px");
  
                      //Color the graph
                                        if (reliablility >0.75) {
                                          $("#reliabilityGraphBarOne").css('backgroundColor','#49E20E');
                                      }
                                      else if (reliablility >0.25) {
                                          $("#reliabilityGraphBarOne").css('backgroundColor','orange');
                                      }
                                      else {
                                          $("#reliabilityGraphBarOne").css('backgroundColor','#FF2400');
                                      }

                }


    });

      });


  

    $('#popup').live('pageshow',function(event, ui){
        

        console.log("selected Feature");
        console.log(selectedFeature);

        var numberPeopleCorrect = 0;
        irp.getthere.funcs.getCorrectValidationReportsCount (selectedFeature.attributes.Uri,function(data){
        numberPeopleCorrect =data.count;

        console.log (data);

      //  for(var attr in selectedFeature.attributes){
      //   if (attr != 'Uri')
      //      li += "<li style='padding:5px 10px;'><div >" + attr + ": " + selectedFeature.attributes[attr] +  "</div></li>"
      //  }
        
        var type = "<li style='padding:5px 10px;'><b>Type: </b> " + selectedFeature.attributes.Event +" -> " +selectedFeature.attributes.Type + "</li>";
        



        var d = new Date ();
        d.setTime(selectedFeature.attributes.DeviceTime);
          var dateString = d.getUTCFullYear() +"/"+ (d.getUTCMonth()+1) +"/"+ d.getUTCDate() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();

        var time = "<li style='padding:5px 10px;'><img src='img/clock.png' height=6%/> " + dateString +"</li>";

        var description = "<li style='padding:5px 10px;'><b>Description: </b> " + selectedFeature.attributes.Description +"</li>";
       /* $("ul#details-list").empty().append(time);
        $("ul#details-list").append(type);
        $("ul#details-list").append(description);
        $("ul#details-list").append("<hr>");*/



        var numberPeopleIncorrect = 0;

         irp.getthere.funcs.getIncorrectValidationReportsCount (selectedFeature.attributes.Uri,function(data2){
        numberPeopleIncorrect =data2.count;



        var validation = "<li></li><div style='margin:5px' align='center' ><a href='#' id='validateReport'><img src='img/thumbsup.png' height=7%  /> </a> "+numberPeopleCorrect+"   <a href=#validationCorrectMoreInfo>  info</a>  &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;       <a href='#' id='againstReport'><img src='img/thumbsdown.png' height=7%  /></a>"+numberPeopleIncorrect+"    <a href=#validationInorrectMoreInfo>  info</a></div>";

        //$("ul#details-list").append (validation);

        var reliablility = 0;
       

        
              
        
        irp.getthere.funcs.getLatLonOfTheReport (selectedFeature.attributes.Uri,function(data3){

          var Geographic  = new OpenLayers.Projection("EPSG:4326"); 
          var point1 = new OpenLayers.Geometry.Point(data3.deviceLon,data3.deviceLat);
          var point2 = new OpenLayers.Geometry.Point(selectedFeature.geometry.x,selectedFeature.geometry.y).transform(map.getProjectionObject(),
                   new OpenLayers.Projection("EPSG:4326") )
          var line = new OpenLayers.Geometry.LineString([point1, point2]);
          //distance in meters
          var dist = line.getGeodesicLength(Geographic);

          console.log(dist);

          //console.log(point1.distanceTo(point2));     

          reliablility = 80/dist;

          if (reliablility>1) {
                                reliablility=1;
          }

      
       
        console.log(selectedFeature.attributes.Uri);


        var creatorOfTheDisruptionReport ="unknown";
        
        irp.getthere.funcs.getCreatorOfTheReport (selectedFeature.attributes.Uri,function(data4){

        if (data4.user!="") {
        creatorOfTheDisruptionReport = data4.user; 
      }

        //building Details form
        $("ul#details-list").empty().append(time);
        $("ul#details-list").append(type);
        $("ul#details-list").append("<li style='padding:5px 10px;'><b>Description: </b> " + selectedFeature.attributes.Description +"</li>");
        $("ul#details-list").append("<li style='padding:5px 10px;'><div ><b> Creator of the report: </b>" + creatorOfTheDisruptionReport );
        $("ul#details-list").append("<hr>");
        $("ul#details-list").append ("<li style='padding:5px 10px;'><div ><b>Reliability of the report</b></div></li>");
        
         $("ul#details-list").append ("<li style='padding:5px 10px;'><div >Creator's proximity to the event:</div></li>");
         //Add graph holder
        $("<div></div>", {id: "reliabiltyGraph" ,style: "margin-left:20px"}).appendTo("ul#details-list");
                      $("#reliabiltyGraph").css("border", "1px solid #000");
                      $("#reliabiltyGraph").css("width", "85%");
                      $("#reliabiltyGraph").css("height", "15px;");
  
                      //Add graph bar
                      $("<div></div>", {id: "reliabilityGraphBar" }).appendTo("#reliabiltyGraph");
                      if(reliablility < 0.02 )
                        $("#reliabilityGraphBar").css("width", "1%");
                      else
                        $("#reliabilityGraphBar").css("width", (reliablility * 100) + "%");
                      $("#reliabilityGraphBar").css("height", "15px");
  
                      //Color the graph
                                        if (reliablility >0.75) {
                                          $("#reliabilityGraphBar").css('backgroundColor','#49E20E');
                                      }
                                      else if (reliablility >0.25) {
                                          $("#reliabilityGraphBar").css('backgroundColor','orange');
                                      }
                                      else {
                                          $("#reliabilityGraphBar").css('backgroundColor','#FF2400');
                                      }

        $("ul#details-list").append ("<li style='padding:5px 10px;'><div >Creator's reputation:</div></li><div align='center'> <img src='img/starsDefault.png' height=12%/></div>");
        $("ul#details-list").append ("<li style='padding:5px 10px;'><div > What other people think: ");
        $("ul#details-list").append (validation);
        
         irp.getthere.funcs.getCausedByLinks (selectedFeature.attributes.Uri,function(data5){

        $("ul#details-list").append("<hr>");
        var linkReports = "<li style='padding:5px 10px;'><div ><b>Caused by:</b></div></li>";
        $("ul#details-list").append (linkReports);
       

          console.log(data5);

          if (data5 != null) {
          if ("responseCausedByLinks" in data5 && data5.responseCausedByLinks.length > 0) {
                 var count= 0;  
           //      var string = " <li style='padding:5px 10px;'>";
               $.each(data5.responseCausedByLinks, function(key, value) {
                    
                        if (value.disruptionType !="") {
                       $("ul#details-list").append (" <li style='padding:5px 10px;' align='center'><a href='#' id= 'link"+count+"'>"+value.disruptionType+ "</a> ("+value.peopleCount+") </li>");
                       //   string += "<a href='#' id= 'link"+count+"'>"+value.disruptionType+ "</a> ("+value.peopleCount+"); ";
                         $("#link"+count).click(function(){
                      console.log ("clicked");  
                      
                      var lon = value.lon;
                      var lat = value.lat
                      var point1 = new OpenLayers.Geometry.Point(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject() );
                      var point2 = new OpenLayers.Geometry.Point(selectedFeature.geometry.x,selectedFeature.geometry.y);

                      map.layers[2].removeAllFeatures();
                      var points=[];
                        
                          var line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([ point2,point1]));                       
                          var linePoints = createDirection(line.geometry,"middle",false) ;
                          
                          for (var j=0;j<linePoints.length ;j++ ) {
                                linePoints[j].attributes.lineFid = selectedFeature.fid;
                          }
                          points =points.concat(linePoints);

                      map.layers[2].addFeatures(line);
                      map.layers[2].addFeatures(points);
                      $.mobile.changePage("#mappage", "pop");


                    }
                      );

                      count++;

                        }
                });
//string += "</li>";
//$("ul#details-list").append (string);

          } 
          

          else {
            if (data5.responseCausedByLinks.disruptionType !="") {
                        $("ul#details-list").append (" <li style='padding:5px 10px;' align='center'><a href='#' id= 'link' >"+data5.responseCausedByLinks.disruptionType+ "</a> ("+data5.responseCausedByLinks.peopleCount+"); </li>");

                        $("#link").click(function(){
                      console.log ("clicked");  
                      
                      var lon = data5.responseCausedByLinks.lon;
                      var lat = data5.responseCausedByLinks.lat
                      var point1 = new OpenLayers.Geometry.Point(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject() );
                      var point2 = new OpenLayers.Geometry.Point(selectedFeature.geometry.x,selectedFeature.geometry.y);

                      map.layers[2].removeAllFeatures();
                      var points=[];
                        
                          var line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([ point2,point1]));                       
                          var linePoints = createDirection(line.geometry,"middle",false) ;
                          
                          for (var j=0;j<linePoints.length ;j++ ) {
                                linePoints[j].attributes.lineFid = selectedFeature.fid;
                          }
                          points =points.concat(linePoints);

                      map.layers[2].addFeatures(line);
                      map.layers[2].addFeatures(points);
                      $.mobile.changePage("#mappage", "pop");


                    }
                      );
                        

                      }
            
          }

        }

        else {  
           $("ul#details-list").append ("<li style='padding:5px 10px;' align='center'>no links to other events;</li>");
        }
         
               

       // $("ul#details-list").append("<form id= 'validateReport'  action='javascript:;'><button id='validatebutton' type='submmit' data-theme='b' data-icon='arrow-d'>This is correct</button></form><form id= 'againstReport' action='javascript:;'' ><button  type='submmit' data-icon='delete'>This is incorrect</button></form><a href='#'  id='maintain'   data-role='button'  >Link to another report</a>").listview("refresh");
        
       $("ul#details-list").append(" <a href='#'  id='maintain'   data-role='button'  >Link to another report</a>");

        $("ul#details-list").trigger('create') ;   


        

$("#validateReport").click(function () {
  
          irp.getthere.util.getLocation(function(location){
                $("#locationUpdateDetails").html("Location: " + JSON.stringify(location));
                 //   locationInfo = JSON.stringify(location);   
                    
                    console.log(location);
          
          var deviceLat = location.latitude;
          var deviceLon = location.longitude;
          var deviceGpsTime = location.gpsTime;
          var deviceTime = location.deviceTime;
          var deviceAccuracy = location.accuracy;
          var relatedTo = selectedFeature.attributes.Uri;

          console.log (deviceLat);
          irp.getthere.funcs.createAnnotationCorrect( user,relatedTo,deviceLat,deviceLon,deviceGpsTime,deviceTime,deviceAccuracy,place,osm_id); 
           $.mobile.changePage("#mappage", "pop");
      });
    });
    
    $("#againstReport").click(function(){

      irp.getthere.util.getLocation(function(location){
                $("#locationUpdateDetails").html("Location: " + JSON.stringify(location));
                 //   locationInfo = JSON.stringify(location);   
                    
                    console.log(location);
          
          var deviceLat = location.latitude;
          var deviceLon = location.longitude;
          var deviceGpsTime = location.gpsTime;
          var deviceTime = location.deviceTime;
          var deviceAccuracy = location.accuracy;
          var relatedTo = selectedFeature.attributes.Uri;

          

          irp.getthere.funcs.createAnnotationIncorrect( user,relatedTo,deviceLat,deviceLon,deviceGpsTime,deviceTime,deviceAccuracy,place,osm_id); 
           $.mobile.changePage("#mappage", "pop");
      });
           
      });  

     
     
      $("#maintain").click(function(){
        
        
       $.mobile.changePage("#maintenance", "pop");

    });

// end of get causedBY links associated with the report 
});    
// end of get creator of report of the report
});
// end of get lat long of the report
});
// end of get number of incorrect function
});
// end of get number of correct function
 });   


});

    function addMarkerLayer (map, layerId, iconUri){
       features = new OpenLayers.Layer.Vector(layerId, {
            styleMap: new OpenLayers.StyleMap({
                externalGraphic: iconUri,
                graphicOpacity: 1.0,
                graphicWidth: 28,
                graphicHeight: 28,
                graphicYOffset: -24
            })
        });
        map.addLayer(features);
        
        return features;
    }  
    

// triggered when button report is pressed. It changes the button report to button next and sets controls to the map for drawing of the point 
function selectFunction(){
  // var footerRef = document.getElementById("navigation3");
   //var  str = ' <a href="#createReport"  data-icon="forward" data-iconpos="top" data-role="button" >Next</a> ';

    //footerRef.innerHTML = str;
    //$('#navigation3').trigger('create')

    // change controls so we can draw points 
    //var control = new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Point);
 $('#navigation3').hide();
 alert("Select the location of the event by clicking on the map and then click next");
  $('#navigation2').show();
    map.addControl(control);
    control.activate();

    //register listener for removing old features in the layer
    vector.events.register("featureadded", vector, function(evt){
        //only one circle at a time
      if(vector.features.length > 1){
        vector.destroyFeatures(vector.features.shift());
        };
        });  
}

 $("#cancelSelect").click(function(){
    vector.removeAllFeatures();
        vector.removeAllFeatures();
        control.deactivate();
        $('#navigation2').hide();
        });




$('#maintenance').live('pageshow',function(event, ui){

$('#maintainSelectDiv').html ("");

var str2 = '<form id= "maintenanceForm" action="javascript:;"><label for="selectEvent" class="select">Type of Event</label>';
            str2 += '<select name="linkSelection" id="selectLink">';
            str2 += '<option value="standard">Select type of relationship</option>';
         //   str2 += '<option value="SOCIAL">Social Event</option>';
       //     str2 += '<option value="NATURAL">Natural Event</option>';
            str2 += '<option value="owl:sameAs">Same as</option>';
             str2 += '<option value="http://www.dotrural.ac.uk/irp/ontologies/disruptions#causedBy">Caused by</option>';


            str2 += '</select>';
            str2 += '<input type="submit" value="Submit" ></form>';
  

$('#maintainSelectDiv').append (str2);
$('#maintainSelectDiv').trigger('create');
   
   
$('#maintenanceForm').submit( function (){


// code for crating link goes here
firstForMaintenanceSelected = true;
firstFeature = selectedFeature;

$.mobile.changePage("#mappage", "pop");
alert ("Now select the second feature to which the relationship applies");

});   
   
   
    });


$('#submitMaintenance').click( function (){
  firstForMaintenanceSelected = false;

 irp.getthere.util.getLocation(function(location){
                $("#locationUpdateDetails").html("Location: " + JSON.stringify(location));
                 //   locationInfo = JSON.stringify(location);   
                    
                    console.log(location);
          
          var deviceLat = location.latitude;
          var deviceLon = location.longitude;
          var deviceGpsTime = location.gpsTime;
          var deviceTime = location.deviceTime;
          var deviceAccuracy = location.accuracy;
          var item = firstFeature.attributes.Uri;
          var relatedTo = selectedFeature.attributes.Uri;
          var link = $('#selectLink').val();

          //console.log (relatedTo);
          $("#navigation4").hide();
          map.layers[2].removeAllFeatures();
          
          irp.getthere.funcs.createLink( user,item, link, relatedTo,deviceLat,deviceLon,deviceGpsTime,deviceTime,deviceAccuracy,place,osm_id);     
      });

alert ("You have successfully created a link");
   });


$('#aboutBus').live ('pageshow',function(event, ui){

         $("#quality").html("");

        $.getJSON("http://107.20.159.169:8080/ecosystem-quality/quality/assess?uri="+selectedFeature.attributes.uri+"&endpoint=http://localhost:8093/journeys&rule="+disruptionCreated,
                function(data){
                                if (data!=null){
                                    //console.log (data)/;
                                    
									$("#quality").append("<h1>Quality Results</h1>");
									$.each(data, function(i, val)
									{
										$.each(val, function(i, item)
										{
											console.log(item);
											$("#quality").append("<h2>" + item.name + "</h2>");

											//$("<p></p>").html("<small>" + item.description + "</small>").appendTo("#quality");
	
											//Add graph holder
											$("<div></div>", {id: item.name + "Graph" }).appendTo("#quality");
											$("#" + item.name + "Graph").css("border", "1px solid #000");
											$("#" + item.name + "Graph").css("width", "99%");
											$("#" + item.name + "Graph").css("height", "15px;");
	
											//Add graph bar
											$("<div></div>", {
												id: item.name + "GraphBar" }).appendTo("#" + item.name + "Graph");
											if(item.plainScore == 0 )
												$("#" + item.name + "GraphBar").css("width", "1%");
											else
												$("#" + item.name + "GraphBar").css("width", (item.plainScore * 100) + "%");
											$("#" + item.name + "GraphBar").css("height", "15px");
	
											//Color the graph
		                                    if (item.plainScore >0.75) {
		                                    	$("#" + item.name + "GraphBar").css('backgroundColor','#49E20E');
			                                }
			                                else if (item.plainScore >0.25) {
			                                    $("#" + item.name + "GraphBar").css('backgroundColor','orange');
			                                }
			                                else {
			                                    $("#" + item.name + "GraphBar").css('backgroundColor','#FF2400');
			                                }
									});

								});
}
          }/* should add error handing function here*/);
       });    



    $('#busRoutes').live ('pageshow',function(event, ui){

      
      //Regions hardcoded for demo
      
      /*  irp.getthere.funcs.getNptgRegions(function(data){

          console.log("hello"+data);
            $.each(data.regions, function(key, value){
                $('#regionSelect').append($('<option></option>')
                        .attr("value",value.uri)
                        .text(value.prefLabel));
        }); 
    
      });*/
      
 /*     <http://transport.data.gov.uk/id/region/EA>	"East Anglia"@en	"EA"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/EM>	"East Midlands"@en	"EM"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/GB>	"Great Britain"@en	"GB"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/L>	"London"@en	"L"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/NE>	"North East"@en	"NE"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/NW>	"North West"@en	"NW"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/S>	"Scotland"@en	"S"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/SE>	"South East"@en	"SE"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/SW>	"South West"@en	"SW"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/W>	"Wales"@en	"W"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/WM>	"West Midlands"@en	"WM"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
<http://transport.data.gov.uk/id/region/Y>	"Yorkshire"@en	"Y"^^<http://transport.data.gov.uk/def/naptan/RegionCode>
 */
/*$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/EA>")
                        .text("East Anglia"));
$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/EM>")
                        .text("East Midlands"));
$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/L>")
                        .text("London"));
$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/NE>")
                        .text("North East"));
$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/NW>")
                        .text("North West"));*/
$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/S>")
                        .text("Scotland"));
/*$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/SE>")
                        .text("South East"));
$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/SW>")
                        .text("South West"));
$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/W>")
                        .text("Wales"));
$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/WM>")
                        .text("West Midlands"));
$('#regionSelect').append($('<option></option>')
                        .attr("value","<http://transport.data.gov.uk/id/region/Y>")
                        .text("Yorkshire"));*/



      
      $("#regionSelect").change(function(){
          // remove any existin areas from the areaSelect
          $('#areaSelect').find('option').remove();
          $('#areaSelect').append($('<option>Select area</option>'));

          // get the selected region uri
         var selectedUri = $("#regionSelect option:selected").val();
         // get the admin areas
     
     /* hard coded for demo
     
         irp.getthere.funcs.getNptgAdminAreas(selectedUri, function(data){
             $.each(data.adminAreas, function(key, value){
                $('#areaSelect').append($('<option></option>')
                            .attr("value",value.uri)
                            .text(value.prefLabel));
             });
          });*/
      $('#areaSelect').append($('<option></option>')
                            .attr("value","http://transport.data.gov.uk/id/administrative-area/111")
                            .text("Aberdeen"));
     
     
       });    

  
  
 /* $adminArea	$atcoAreaCode	$adminAreaCode	$prefLabel
<http://transport.data.gov.uk/id/administrative-area/111>	"639"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"111"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Aberdeen"@en
<http://transport.data.gov.uk/id/administrative-area/112>	"630"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"112"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Aberdeenshire"@en
<http://transport.data.gov.uk/id/administrative-area/113>	"649"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"113"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Angus"@en
<http://transport.data.gov.uk/id/administrative-area/114>	"607"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"114"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Argyll & Bute"@en
<http://transport.data.gov.uk/id/administrative-area/116>	"668"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"116"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Clackmannanshire"@en
<http://transport.data.gov.uk/id/administrative-area/118>	"680"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"118"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Dumfries & Galloway"@en
<http://transport.data.gov.uk/id/administrative-area/119>	"640"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"119"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Dundee"@en
<http://transport.data.gov.uk/id/administrative-area/120>	"618"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"120"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"East Ayrshire"@en
<http://transport.data.gov.uk/id/administrative-area/121>	"611"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"121"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"East Dunbartonshire"@en
<http://transport.data.gov.uk/id/administrative-area/122>	"627"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"122"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"East Lothian"@en
<http://transport.data.gov.uk/id/administrative-area/123>	"612"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"123"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"East Renfrewshire"@en
<http://transport.data.gov.uk/id/administrative-area/124>	"620"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"124"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Edinburgh"@en
<http://transport.data.gov.uk/id/administrative-area/125>	"669"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"125"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Falkirk"@en
<http://transport.data.gov.uk/id/administrative-area/126>	"650"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"126"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Fife"@en
<http://transport.data.gov.uk/id/administrative-area/127>	"609"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"127"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Glasgow"@en
<http://transport.data.gov.uk/id/administrative-area/128>	"670"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"128"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Highland"@en
<http://transport.data.gov.uk/id/administrative-area/129>	"613"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"129"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Inverclyde"@en
<http://transport.data.gov.uk/id/administrative-area/130>	"628"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"130"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Midlothian"@en
<http://transport.data.gov.uk/id/administrative-area/131>	"638"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"131"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Moray"@en
<http://transport.data.gov.uk/id/administrative-area/132>	"617"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"132"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"North Ayrshire"@en
<http://transport.data.gov.uk/id/administrative-area/133>	"616"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"133"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"North Lanarkshire"@en
<http://transport.data.gov.uk/id/administrative-area/134>	"602"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"134"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Orkney Islands"@en
<http://transport.data.gov.uk/id/administrative-area/135>	"648"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"135"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Perth & Kinross"@en
<http://transport.data.gov.uk/id/administrative-area/136>	"614"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"136"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Renfrewshire"@en
<http://transport.data.gov.uk/id/administrative-area/115>	"690"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"115"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Scottish Borders"@en
<http://transport.data.gov.uk/id/administrative-area/137>	"603"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"137"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Shetland Islands"@en
<http://transport.data.gov.uk/id/administrative-area/138>	"619"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"138"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"South Ayrshire"@en
<http://transport.data.gov.uk/id/administrative-area/139>	"615"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"139"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"South Lanarkshire"@en
<http://transport.data.gov.uk/id/administrative-area/140>	"660"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"140"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Stirling"@en
<http://transport.data.gov.uk/id/administrative-area/117>	"608"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"117"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"West Dunbartonshire"@en
<http://transport.data.gov.uk/id/administrative-area/141>	"629"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"141"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"West Lothian"@en
<http://transport.data.gov.uk/id/administrative-area/142>	"601"^^<http://transport.data.gov.uk/def/naptan/AtcoAreaCode>	"142"^^<http://transport.data.gov.uk/def/naptan/AdministrativeAreaCode>	"Western Isles"@en
 */
 

 
    $("#areaSelect").change(function(){
           
            // remove any existing routes
             $('#routeSelect').find('option').remove();
             routes = [];
      $('#routeSelect').append($('<option>Select route</option>'));
            // get the selected area
            var selectedUri = $("#areaSelect option:selected").val();
            // get the routes in that area
           // $('#routeSelect').append($('<option>Select route</option>'));
            irp.getthere.funcs.getRoutesInArea(selectedUri, 
                    function(data){
                     
                $.each(data.lines, function(key, value){
                    var index = 0;
                    console.log (value);
                    if (key == "directions") {
                    $.each(value.directions, function(dirKey, dirVal){
                        routes[routes.length] = {lineUri:data.lines.uri, direction:dirVal.direction};
//change the hardcoded 17!!! - hardcoded because json object no longer contains this value in value.label
                        $('#routeSelect').append($('<option></option>')
                            .attr("value",index++)
                            .text("17" + " - " + dirVal.directionDescription));
                    });

                  }
                });
            } /* should add error handing function here*/);

        });


  


$("#routeSelect").change(function(){
       selectedRoute =  routes[$("#routeSelect option:selected").val()];
       console.log (selectedRoute);
        selection.route = {}
        ttMarkerLayer.removeAllFeatures();
        rtMarkerLayer.removeAllFeatures();
        selection.route.uri = selectedRoute.lineUri;
        selection.route.direction = selectedRoute.direction;
        irp.getthere.funcs.getTimetableBusLocations(selectedRoute.lineUri, selectedRoute.direction, 
            function(data){
            if (data != null)
                irp.getthere.ui.addMarkers(data, ttMarkerLayer, "./img/busTT.gif");
            }, function (jqXHR, textStatus, errorThrown){
            }); 
        irp.getthere.funcs.getRealtimeBusLocations(selectedRoute.lineUri, selectedRoute.direction, 
                function(data){
                    if (data!=null){
                        irp.getthere.ui.addRealtimeMarkers(data, rtMarkerLayer, "./img/busRT.gif");
                    }
                }, function (jqXHR, textStatus, errorThrown){
                });
           irp.getthere.funcs.getBusStopsOnRoute(selectedRoute.lineUri, selectedRoute.direction,
				function(data){
					if (data!=null){
						irp.getthere.ui.addBusStops(data, busStopMarkerLayer, "./img/stopFlag.gif");
					}			
				}, function (jqXHR, textStatus, errorThrown){
				});	     
      });

}); 


// TO BE CHANGED hard coded to center map on aberdeen if when route above selected 
    $("#viewBuses").click(function(){
        var lonlat = new OpenLayers.LonLat(-2.11,57.1526);
        map.setCenter(lonlat.transform(gg, sm), 11); 
        $('#navigation3').hide();
        });





$('#createReport').live ('pageshow',function(event, ui){
        
        $('#navigation2').hide();
        var myPoint = new OpenLayers.Geometry.Point(vector.features[0].geometry.x,
                              vector.features[0].geometry.y );
        var myLatLonPoint = myPoint.transform( map.getProjectionObject(),
                   new OpenLayers.Projection("EPSG:4326"));

        

        console.log(myLatLonPoint.y);
        console.log(myLatLonPoint.x);
        $('#firstBlock').html('<img src="./img/loading.gif" alt="Loading..."/>');
        $('#secondBlock').html('');
        $('#thirdBlock').html('');
         $('#fourthBlock').html('');
       

 $.getJSON("http://nominatim.openstreetmap.org/reverse?format=json&lat="+myLatLonPoint.y+"&lon="+myLatLonPoint.x+"&zoom=1&addressdetails=1",
                function(data){
                             console.log( data)
                                place= data.address.road;
                                if (place==null) {
                                  place = data.display_name;
                                }
                                osm_id = data.osm_id;
                              //  console.log(road);
                             
        //var str = '<label for="road">Road:</label>';
          var  str = '<input type="hidden" name="road" id="road" value="';
            str += place;
            str += '" />';
           // str += '<label for="lon">Long,Lat of the report:</label>';
            str += '<input type="hidden" name="lon" id="lon" value="';
            str += myLatLonPoint.x;
            str += '" />';
            str += '<input type="hidden" name="lat" id="lat" value="';
            str += myLatLonPoint.y;
            str += '" />';    
 
 

            $('#firstBlock').html(str);
 place="test";
 osm_id = "334";

     // construct select menus from ontology

            var str2;

            var events = []; 
            $.getJSON("http://107.20.159.169:8080/ecosytem-disruption/ontologyQuery/getEventClasses",
                function(data){
                                if (data!=null){
                                    console.log (data);
                                    str2 = '<label for="selectEvent" class="select">Type of Event</label>';
                                    str2 += '<select name="type" id="selectEvent">';
                                    str2 += '<option value="standard">Select type of event</option>';
                                    var count =0;  
                                    
                                    $.each(data.ontologyClass, function() {  

                                      console.log (data.ontologyClass[count].label);
                                      events.push (data.ontologyClass[count].label);
                                      str2 += '<option value="'+data.ontologyClass[count].label+'">'+data.ontologyClass[count].label+'</option>';
                                      count++;
                                      });
                                    str2 += '</select>';

                                    $('#firstBlock').append(str2);
                                    $('#firstBlock').trigger('create')

      
        $("#selectEvent").bind( "change", function(event, ui) {
          $('#thirdBlock').html("");
          $('#fourthBlock').html("");

           var string = $("#selectEvent").val().replace (" ", "");
        
                
                $.getJSON("http://107.20.159.169:8080/ecosytem-disruption/ontologyQuery/getEventClassSubclasses?eventClass="+string+"",
                function(data){
                 
                  console.log (data);
                
            if (data!=null){
                 
                     str2 = '<label for="eventClassSubClass">Type of '+$("#selectEvent").val()+'</label>';
                     str2 += '<select name="eventClassSubClass" id="typeEvent">';
                     str2 += '<option value="standard">Select type of '+$("#selectEvent").val()+'</option>';

                    var count =0;  
                                    
                                    $.each(data.ontologyClass, function() {  

                                      //console.log (data.ontologyClass[count].label);
                                      //events.push (data.ontologyClass[count].label);
                                      str2 += '<option value="'+data.ontologyClass[count].label+'">'+data.ontologyClass[count].label+'</option>';
                                      count++;
                                      });

                       str2 += '</select>';
                       $('#secondBlock').html(str2);
                       $('#secondBlock').trigger('create')

                        

                      
                  $("#typeEvent").bind( "change", function(event, ui) {
                         // console.log ('jhe');
                        $('#thirdBlock').html("");
                        $('#fourthBlock').html("");

                        if ($("#selectEvent").val()==("Social Event")||$("#selectEvent").val()==("Natural Event")) { 
                            detailAndSubmit ();
                        }

                        else {
                          
                          var string = $("#typeEvent").val().replace (" ", "");
        
                
                          $.getJSON("http://107.20.159.169:8080/ecosytem-disruption/ontologyQuery/getDisruptionClassSubclasses?eventClass="+string+"",
                                  function(data){
                 
                               
                
                                      if (data!=null){
                 
                                          str2 = '<label for="DisruptionEventSubClass">Type of '+$("#typeEvent").val()+'</label>';
                                          str2 += '<select name="DisruptionEventSubClass" id="typeDisruption">';
                                          str2 += '<option value="standard">Select type of '+$("#typeEvent").val()+'</option>';

                                         var count =0;  
                                    
                                          $.each(data.ontologyClass, function() {  

                                      
                                              str2 += '<option value="'+data.ontologyClass[count].label+'">'+data.ontologyClass[count].label+'</option>';
                                              count++;
                                          });

                                          str2 += '</select>'; 
                                          $('#thirdBlock').append(str2);
                                          $('#thirdBlock').trigger('create')

                                          $("#typeDisruption").bind( "change", function(event, ui) {

                                           detailAndSubmit ();

                                         
                                          });  


                                        }

                                        else {
                                          
                                          detailAndSubmit ();
                                        }

                                    });  
                          
                          }

                    });

    
               
            }
          });

 
                                });


 
  }    
       
});      

    });

 });
  

//-----------


    function detailAndSubmit () {

        $('#fourthBlock').html('<div data-role="fieldcontain"><label for="textarea">Other Details:</label><textarea cols="40" rows="8" name="description" id="otherDetails"></textarea></div>');
                    $('#fourthBlock').trigger('create')
                    $('#fourthBlock').append('<button type="submit" data-theme="b" name="submit" value="submit-value">Submit</button>')
                    $('#fourthBlock').trigger('create')
        
    }
  




      $('#select').click(selectFunction);


       $("#createReportForm").submit(function(){
          var lat = $("#lat").val();
          var lon = $("#lon").val();
          var seletEvent = $("#selectEvent").val();
          var typeEvent = $("#typeEvent").val();
          var typeDisruption = $("typeDisruption").val();
          var otherDetails = $("#otherDetails").val();
         
          var locationInfo ;

          irp.getthere.util.getLocation(function(location){
                $("#locationUpdateDetails").html("Location: " + JSON.stringify(location));
                 //   locationInfo = JSON.stringify(location);   
                    
                    console.log(location);
          
          var deviceLat = location.latitude;
          var deviceLon = location.longitude;
          var deviceGpsTime = location.gpsTime;
          var deviceTime = location.deviceTime;
          var deviceAccuracy = location.accuracy;

          console.log(place);
console.log(lat,lon,seletEvent, typeEvent,typeDisruption, otherDetails,deviceLat,deviceLon,deviceGpsTime,deviceTime,deviceAccuracy,place,osm_id,user);
           irp.getthere.funcs.createDisruption(lat,lon,seletEvent, typeEvent,typeDisruption, otherDetails,deviceLat,deviceLon,deviceGpsTime,deviceTime,deviceAccuracy,place,osm_id,user); 


            disruptionCreated = true;

            control.deactivate();
            map.removeControl(control);
          //  vector.destroyFeatures();
            features.removeAllFeatures();
            vector.destroyFeatures();

            var t=setTimeout("getDisruptions();",2000);
                     
                }, function(error){
                    alert("Error Location: " + JSON.stringify(location));
                });      

    });

  
  function getDisruptionsRefresh () {
    
    $.getJSON("http://localhost:8080/ecosytem-disruption/disruption/getAllIncidents",
                function(data){
                    console.log(data);
                                if (data!=null){
                                    addMarkers(data, features, "./img/warning.gif");
                                }
                }
                );

                $.mobile.changePage("#mappage", "pop"); 
}





       // register
      $("#registerForm").submit(function(){
          var username = $("#regUsername").val();
          var nick = $("#regNickname").val();
          var password = $("#regPassword").val();
          irp.getthere.funcs.register(username, nick, password, function(data){
              if (data.created == "true"){
                //  alert("User uri: " + data.userUri);
                alert("You are now registered user");
              } else {
                  alert("User not created because " + data.reason);
              }
          },  function (jqXHR, textStatus, errorThrown){
              alert("error registering new user " + errorThrown);
            });
      });


      $('#loginButton').click (function(){
        if (loggedIn) {
        window.location.href=window.location.href;
      }
      });

      var userDetails;

      $("#loginForm").submit(function(){
          var username = $("#loginUsername").val();
          var password = $("#loginPassword").val();
          irp.getthere.funcs.login(username, password, function(data){
              if ("false"==data.exists){
                 alert ("incorrect username/password combination");
              } else {
                  userDetails = {url:data.userUri, authToken:data.authenticationToken};
               //  alert ("User uri:"+userDetails.url + " <br/>Auth token: " + userDetails.authToken);
               alert ("You are logged in");
               user = username;
               loggedIn = true;

              // $('#loginButton').siblings('.ui-btn-inner ui-btn-corner-all').children('.ui-btn-text').text("Log Out");
               $('#loginButton').children('.ui-btn-inner').children('.ui-btn-text').text("Log Out");
//console.log ($('#loginButton').siblings('#loginButton').children('.ui-btn-inner').children('.ui-btn-text').text("Log Out"));
                  $.mobile.changePage("#mappage", "pop");
              }
        },function(jqXHR, textStatus, errorThrown){
              alert("error logging in " + errorThrown);
          });
      });

     
      $('#onBus').click(function () {
          $('#navigation3').hide();

          if (onTheBus) {

            // code to handle off the bus action goes here
          $(this).siblings('.ui-btn-inner').children('.ui-btn-text').text("On Bus");
           // $('#onBus').prop('value', 'On Bus');
           //$('#onBus').trigger('create');
            onTheBus = false;
          }

       else 
        if (loggedIn && routeSelected)   {
        // $('#offBusButton').show();
       //   $('#onBusButton').hide();
       // $('#onBus').prop('value', 'Off Bus');
        //$('#onBus').trigger('create');
        $(this).siblings('.ui-btn-inner').children('.ui-btn-text').text("Off Bus");
        //alert ("Journey has started")

            if ("device" in userDetails && userDetails.device != null && userDetails.device != undefined){
            irp.getthere.funcs.startJourneyExistingPhone(userDetails.authToken, userDetails.url, selection.route.uri, selection.route.direction, userDetails.device.uri,
            function(data){
                userDetails.journeyUri = data.uri;  
                $("#journeyDetails").html("Started journey " + userDetails.journeyUri);
                sendUpdate();
            });
        }else{
            var deviceDetails = irp.getthere.util.getDeviceDetails();
            console.log(deviceDetails);

            irp.getthere.funcs.startJourneyNewPhone(
                    userDetails.authToken, userDetails.url, selection.route.uri, 
                    selection.route.direction,deviceDetails.deviceType, deviceDetails.deviceName, deviceDetails.deviceOS, deviceDetails.deviceOSVersion, deviceDetails.uniqueId,
            function(data){
            console.log("here");
            console.log(data);

                $("#journeyDetails").html(JSON.stringify(data));
                userDetails.device = data.device;
                userDetails.journeyUri = data.uri;
                sendUpdate();
            }, 
            function(jqXHR, textStatus, errorThrown){
                  alert("error starting journey " + errorThrown);
             });

             // test this if it is really refreshing the layer... 
             onTheBus = true;

             // need to wait 
           //var t=setTimeout("getRealTimeBuses();",2000); 

        }
      }
      else if (!loggedIn) { 
        alert ("You need to log in");
      }

      else {
         alert ("You need to select route first");
      }
      }) ;

     /*  function sendUpdate(){
          irp.getthere.util.getTime();
          console.log("attempting to send location");
            var sensor = irp.getthere.util.findSensor(userDetails.device.sensors.sensors, irp.getthere.constants.Location);
            if (sensor == null){
                alert("unable to find sensor");
            }
            irp.getthere.util.getLocation(function(location){
                $("#locationUpdateDetails").html("Location: " + JSON.stringify(location));
                    irp.getthere.funcs.sendLocationUpdate(
                    userDetails.authToken, userDetails.url, 
                    // sensor.sensingMethod would change for android, as it would be an array
                    sensor.uri, sensor.sensingMethod, userDetails.url,
                        userDetails.journeyUri, location.latitude, location.longitude, location.gpsTime, location.deviceTime, location.accuracy, location.heading, location.speed,
                        function(data){
                          // alert("Update sent: " + JSON.stringify(data));
                        }, function(jqXHR, textStatus, errorThrown){
                              alert("error sending location update " + errorThrown);
                        });                
                }, function(error){
                    alert("Error Location: " + JSON.stringify(location));
                });
      }*/


    function sendUpdate(){
          //irp.getthere.util.getTime();
          //console.log("attempting to send location");
            //var sensor = irp.getthere.util.findSensor(userDetails.device.sensors.sensors, irp.getthere.constants.Location);
            //if (sensor == null){
              //  alert("unable to find sensor");
            //}
            irp.getthere.util.getLocation(function(location){
                $("#locationUpdateDetails").html("Location: " + JSON.stringify(location));
                    irp.getthere.funcs.sendLocationUpdate(
                    userDetails.authToken, userDetails.url, 
                    // sensor.sensingMethod would change for android, as it would be an array
                    "http://milan.test.sensor.org", "test.method", userDetails.url,
                        userDetails.journeyUri, location.latitude, location.longitude, location.gpsTime, location.deviceTime, location.accuracy, location.heading, location.speed,
                        function(data){
                          // alert("Update sent: " + JSON.stringify(data));
                        }, function(jqXHR, textStatus, errorThrown){
                              alert("error sending location update " + errorThrown);
                        });                
                }, function(error){
                    alert("Error Location: " + JSON.stringify(location));
                });
      }


    $("#plus").click(function(){
        alert('hf')
        map.zoomIn();
    });
    $("#minus").click(function(){
        map.zoomOut();
    });

    
    // needs to be changed
    $("#viewBuses").click(function(){
      routeSelected = true; 
  
    });
   
    $("#control").click(function(){
      if ($('#navigation3').is(":visible")) {
          $('#navigation3').hide();
    }
      else {
       
      $('#navigation3').show();  
  }
    });

    $("#locate").click(function(){
        
        var control = map.getControlsBy("id", "locate-control")[0];
        if (control.active) {
            control.getCurrentLocation();
        } else {
            control.activate();
        }
    });
    
    
 
    $("#refresh").click(function(){
        if (selectedRoute!=null) {
        irp.getthere.funcs.getTimetableBusLocations(selectedRoute.lineUri, selectedRoute.direction, 
            function(data){
            if (data != null)
                irp.getthere.ui.addMarkers(data, ttMarkerLayer, "./img/busTT.gif");
            }, function (jqXHR, textStatus, errorThrown){
            }); 
        irp.getthere.funcs.getRealtimeBusLocations(selectedRoute.lineUri, selectedRoute.direction, 
                function(data){
                    if (data!=null){
                        irp.getthere.ui.addRealtimeMarkers(data, rtMarkerLayer, "./img/busRT.gif");
                    }
                }, function (jqXHR, textStatus, errorThrown){
                });
        
        }
    });
    
    
    
    

    $('#searchpage').live('pageshow',function(event, ui){
      
        $('#query').bind('change', function(e){
            $('#search_results').empty();
            if ($('#query')[0].value === '') {
                return;
            }
            $.mobile.showPageLoadingMsg();

            // Prevent form send
            e.preventDefault();

            var searchUrl = 'http://ws.geonames.org/searchJSON?featureClass=P&maxRows=10';
            searchUrl += '&name_startsWith=' + $('#query')[0].value;
            $.getJSON(searchUrl, function(data) {
                $.each(data.geonames, function() {
                    var place = this;
                    $('<li>')
                        .hide()
                        .append($('<h2 />', {
                            text: place.name
                        }))
                        .append($('<p />', {
                            html: '<b>' + place.countryName + '</b> ' + place.fcodeName
                        }))
                        .appendTo('#search_results')
                        .click(function() {
                            $.mobile.changePage('#mappage');
                            var lonlat = new OpenLayers.LonLat(place.lng, place.lat);
                            map.setCenter(lonlat.transform(gg, sm), 10);
                        })
                        .show();
                });
                $('#search_results').listview('refresh');
                $.mobile.hidePageLoadingMsg();
            });
        });
        // only listen to the first event triggered
        $('#searchpage').die('pageshow', arguments.callee);
    });

});

function initLayerList() {
    $('#layerspage').page();
    $('<li>', {
            "data-role": "list-divider",
            text: "Base Layers"
        })
        .appendTo('#layerslist');
    var baseLayers = map.getLayersBy("isBaseLayer", true);
    $.each(baseLayers, function() {
        addLayerToList(this);
    });

    $('<li>', {
            "data-role": "list-divider",
            text: "Overlay Layers"
        })
        .appendTo('#layerslist');
    var overlayLayers = map.getLayersBy("isBaseLayer", false);
    $.each(overlayLayers, function() {
        addLayerToList(this);
    });
    $('#layerslist').listview('refresh');
    
    map.events.register("addlayer", this, function(e) {
        addLayerToList(e.layer);
    });
}

function addLayerToList(layer) {
    var item = $('<li>', {
            "data-icon": "check",
            "class": layer.visibility ? "checked" : ""
        })
        .append($('<a />', {
            text: layer.name
        })
            .click(function() {
                $.mobile.changePage('#mappage');
                if (layer.isBaseLayer) {
                    layer.map.setBaseLayer(layer);
                } else {
                    layer.setVisibility(!layer.getVisibility());
                }
            })
        )
        .appendTo('#layerslist');
    layer.events.on({
        'visibilitychanged': function() {
            $(item).toggleClass('checked');
        }
    });
}




