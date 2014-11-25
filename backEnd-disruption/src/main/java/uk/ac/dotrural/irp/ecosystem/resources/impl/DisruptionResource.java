package uk.ac.dotrural.irp.ecosystem.resources.impl;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.EndpointInfo;
import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.Query;
import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.ServiceInitialiser;
import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.SystemMessage;
import uk.ac.dotrural.irp.ecosystem.core.resources.RESTFulSPARQL;
import uk.ac.dotrural.irp.ecosystem.core.resources.support.reporters.ExceptionReporter;
import uk.ac.dotrural.irp.ecosystem.core.services.SPARQLEndpoint;
import uk.ac.dotrural.irp.ecosystem.core.util.Util;


import uk.ac.dotrural.irp.ecosystem.models.jaxb.disruption.EventReport;
import uk.ac.dotrural.irp.ecosystem.queries.disruption.IncidentQueries;
import uk.ac.dotrural.irp.ecosystem.queries.disruption.QueryReader;

import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;


@Path("/disruption")
@Scope("request")
public class DisruptionResource  implements RESTFulSPARQL{

	
	@Context
	private UriInfo uriInfo;

	private SPARQLEndpoint disruptionEndpoint;

	public SPARQLEndpoint getDisruptionEndpoint() {
		return disruptionEndpoint;
	}

	public void setDisruptionEndpoint(SPARQLEndpoint pointsEndpoint) {
		this.disruptionEndpoint = pointsEndpoint;
	}

	public SystemMessage init(ServiceInitialiser si) {
		// TODO Auto-generated method stub
		return disruptionEndpoint.init(uriInfo, si);
	}

	public void update(Query query) {
		disruptionEndpoint.update(query);

	}

	public String query(Query query) {
		// TODO Auto-generated method stub
		return Util.resultsetToString(disruptionEndpoint.query(query));
	}

	public EndpointInfo info() {
		// TODO Auto-generated method stub
		return disruptionEndpoint.info();
	}
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("getAllIncidents")
	public List <EventReport> getAllIncident(	) { 
		
		

		

		String query = IncidentQueries.getAllIncidentQuery();
		Query sparqlQuery = new Query(query);
		
		try
		{
		ResultSet results = disruptionEndpoint.query(sparqlQuery);

		System.out.println ("results of the query"+ results);
		List<String> vars = results.getResultVars();
		
		List <EventReport> disruptionList = new ArrayList <EventReport> ();
		
		System.out.println ("Disruption List created");
		
		if (results != null) {
		
			System.out.println ("Processing result...");
			
		while (results.hasNext()) {
			
			QuerySolution solution = results.next(); // need to look at this
			EventReport incident = new EventReport();
			incident.setUri ((Util.getNodeValue(solution.get(vars.get(0))).trim()));
			incident.setDescription  ((Util.getNodeValue(solution.get(vars.get(1))).trim()));
			incident.setType  ((Util.getNodeValue(solution.get(vars.get(2))).trim()));
			incident.setEvent  ((Util.getNodeValue(solution.get(vars.get(3))).trim()));
			incident.setDeviceTime  ((Util.getNodeValue(solution.get(vars.get(4))).trim()));
			incident.setLon(Util.getNodeValue(solution.get(vars.get(5))).trim());
			incident.setLat(Util.getNodeValue(solution.get(vars.get(6))).trim());
			disruptionList.add(incident);
			
		}
		}
		
		System.out.println ("Disruption List "+ disruptionList);
		
		return disruptionList;
		}
		catch(Exception ex)
		{
			ex.printStackTrace();
		}
		return null;
	}
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("startTwitterService")
	public List <EventReport>  startTwitterServices(	) { 
		String query = IncidentQueries.getAllIncidentQuery();
		Query sparqlQuery = new Query(query);
		try
		{
			ResultSet results = disruptionEndpoint.query(sparqlQuery);
			List <EventReport> disruptionList = new ArrayList <EventReport> ();
	/*	
		
		
		
		
		
			System.out.println ("Authorising twitter account...");
			ConfigurationBuilder cb = new ConfigurationBuilder();
			cb.setDebugEnabled(true)
			  .setOAuthConsumerKey("wZQWjNjH4WLguRYrU9uiw")
			  .setOAuthConsumerSecret("2hjTgDfj5Gtudf6tdQVCQvUNhaUQXxisKnPfzel24")
			  .setOAuthAccessToken("901992445-ygqHZVgMd8WExPbTVv21vNxQzhzhdA2NWFb14dkL")
			  .setOAuthAccessTokenSecret("AT8mcHlxyUawbLDtUjmBqAQx15N9HdXEaueIx2RnUk");
			TwitterFactory tf = new TwitterFactory(cb.build());
			twitter4j.Twitter twitter = tf.getInstance();
			
			System.out.println ("Twitter account authorisation ok...");
			
			System.out.println ("Initialising twitter stream...");
			
			
			   
			
			
			
			
			TwitterStream twitterStream = new TwitterStreamFactory().getInstance();
	        
			ArrayList<String> track = new ArrayList<String>();
			track.add("#WCPDisruptionTest");
			

			String[] trackArray = track.toArray(new String[track.size()]);
			twitterStream.filter(new FilterQuery(0, null, trackArray));
			
			StatusListener listener = new StatusListener() {
	            
	        	public void onStatus(Status status) {
	                System.out.println("@" + status.getUser().getScreenName() + " - " + status.getText());
	            }

				public void onException(Exception arg0) {
					// TODO Auto-generated method stub
					
				}

				public void onDeletionNotice(StatusDeletionNotice arg0) {
					// TODO Auto-generated method stub
					
				}

				public void onScrubGeo(long arg0, long arg1) {
					// TODO Auto-generated method stub
					
				}

				public void onStallWarning(StallWarning arg0) {
					// TODO Auto-generated method stub
					
				}

				public void onTrackLimitationNotice(int arg0) {
					// TODO Auto-generated method stub
					
				}

	            
					
				};
	        
			twitterStream.addListener(listener);
			System.out.println ("Initialising twitter stream ok...");
	       // twitterStream.sample();
		
			
	
		
		*/
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date();
		
		System.out.println ("Twitter Service has started at: "+ date);
		
		return disruptionList;
	}
	catch(Exception ex)
	{
		ex.printStackTrace();
	}
	return null;
		
		
}
	
	@POST 
    @Consumes(MediaType.APPLICATION_JSON) 
	@Produces({ MediaType.APPLICATION_JSON }) // if applicable
	@Path("create")
	//@RequestMapping(method = RequestMethod.POST)
	public EventReport create ( EventReport incidentDetails) {
		//Incident incidentDetails = new Incident ();
	//	incidentDetails.setDescription(description);
	//	incidentDetails.setType(type);
	//	incidentDetails.setLat(lat);
	//	incidentDetails.setLon(lon);
		
		// System.out.println (lon);
		 System.out.println ("hello");
		 
		System.out.println ("incident details  "+ incidentDetails.getOsm_ID().trim());
		 
		if(incidentDetails == null)
		      throw new ExceptionReporter(new NullPointerException("No 'Values' given."));
		    
		
		    
		    String incidentUrl = "";
		    
		    incidentUrl =  UUID.randomUUID().toString();
		    
		    String query = IncidentQueries.getCreateIncidentUpdate(incidentUrl,
		    		incidentDetails.getLat().trim(), 
		    		incidentDetails.getLon().trim(),
		    		incidentDetails.getDescription().trim(),
		    		incidentDetails.getEvent().trim(),
		    		incidentDetails.getType().trim(),
		    		incidentDetails.getDisruptionType().trim(),
		    		incidentDetails.getDeviceLat().trim(),
		    		incidentDetails.getDeviceLon().trim(),
		    		incidentDetails.getGpsTime().trim(),
		    		incidentDetails.getDeviceTime().trim(),
		    		incidentDetails.getAccuracy().trim(),
		    		incidentDetails.getPlace().trim(),
		    		incidentDetails.getOsm_ID().trim(),
		    		incidentDetails.getUser().trim()
		    		);
		    Query sparqlQuery = new Query(query);
		  
		    System.out.println (query);
		      
		    System.out.println ("Sending Query to the endpoint");
		    disruptionEndpoint.update(sparqlQuery);

		    System.out.println ("Query sent");
		    
		    
		    System.out.println ("Creating provenance Query");
		     EventReport incident = new EventReport ();
		     incident.setUri(incidentUrl);
		     
		   
		     //generate some provenance
		     
		     String provActivityURI =  UUID.randomUUID().toString();
			    
			    String CreateActivityProvenanceQuery = IncidentQueries.getCreateDisruptionReportActivity(
			    		provActivityURI,
			    		incidentDetails.getUser().trim()
			    		
			    		);
			    
			    System.out.println ("Generating provenance Query");
			   sparqlQuery = new Query(CreateActivityProvenanceQuery);
			  
			    System.out.println (query);
			    System.out.println ("Sending provenance Query");
			    disruptionEndpoint.update(sparqlQuery);
			    System.out.println ("provenance sent");

		     
			 
			    System.out.println ("Generating provenance Query");
			    String CreateEntityProvenanceQuery = IncidentQueries.getCreateDisruptionReportEntity(
			    		incident.getUri(),
			    		provActivityURI
			    		
			    		);
			   sparqlQuery = new Query(CreateEntityProvenanceQuery);
			  
			    System.out.println (query);
			    System.out.println ("Sending provenance Query");
			    disruptionEndpoint.update(sparqlQuery);
			    System.out.println ("provenance sent");


		      

return incident;
	}

	
	
	
}
