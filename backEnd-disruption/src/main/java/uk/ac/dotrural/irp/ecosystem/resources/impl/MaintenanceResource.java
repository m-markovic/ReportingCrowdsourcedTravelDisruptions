package uk.ac.dotrural.irp.ecosystem.resources.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.springframework.context.annotation.Scope;

import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;

import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.EndpointInfo;
import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.Query;
import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.ServiceInitialiser;
import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.SystemMessage;
import uk.ac.dotrural.irp.ecosystem.core.resources.RESTFulSPARQL;
import uk.ac.dotrural.irp.ecosystem.core.resources.support.reporters.ExceptionReporter;
import uk.ac.dotrural.irp.ecosystem.core.services.SPARQLEndpoint;
import uk.ac.dotrural.irp.ecosystem.core.util.Util;
import uk.ac.dotrural.irp.ecosystem.models.jaxb.disruption.EventReport;
import uk.ac.dotrural.irp.ecosystem.models.jaxb.maintenance.LinkCreationReport;
import uk.ac.dotrural.irp.ecosystem.models.jaxb.maintenance.ResponseCausedByLinks;
import uk.ac.dotrural.irp.ecosystem.models.jaxb.validation.ValidationMoreInfoResponse;
import uk.ac.dotrural.irp.ecosystem.models.jaxb.validation.ValidationReport;
import uk.ac.dotrural.irp.ecosystem.queries.maintenance.MaintenanceQueries;
import uk.ac.dotrural.irp.ecosystem.queries.validation.ValidationQueries;


@Path("/maintenance")
@Scope("request")
public class MaintenanceResource implements RESTFulSPARQL{
	
	@Context
	private UriInfo uriInfo;
	private SPARQLEndpoint maintenanceEndpoint;
	
	public SPARQLEndpoint getMaintenanceEndpoint() {
		return maintenanceEndpoint;
	}

	public void setMaintenanceEndpoint(SPARQLEndpoint maintenanceEndpoint) {
		this.maintenanceEndpoint = maintenanceEndpoint;
	}

	public EndpointInfo info() {
		// TODO Auto-generated method stub
		return maintenanceEndpoint.info();
	}

	public SystemMessage init(ServiceInitialiser si) {
		// TODO Auto-generated method stub
		return maintenanceEndpoint.init(uriInfo, si);
	}

	public String query(Query query) {
		// TODO Auto-generated method stub
		return Util.resultsetToString(maintenanceEndpoint.query(query));
	}

	public void update(Query query) {
		// TODO Auto-generated method stub
		maintenanceEndpoint.update(query);
	}
	
	@POST 
    @Consumes(MediaType.APPLICATION_JSON) 
	@Produces({ MediaType.APPLICATION_JSON }) // if applicable
	@Path("createLink")
	//@RequestMapping(method = RequestMethod.POST)
	public LinkCreationReport linkCreationReport ( LinkCreationReport linkCreationReport) {
		//Incident incidentDetails = new Incident ();
	//	incidentDetails.setDescription(description);
	//	incidentDetails.setType(type);
	//	incidentDetails.setLat(lat);
	//	incidentDetails.setLon(lon);
		
		// System.out.println (lon);
		
		if(linkCreationReport == null)
		      throw new ExceptionReporter(new NullPointerException("No 'Values' given."));
		    
		
		    
		    String incidentUrl = "";
		    
		    incidentUrl =  UUID.randomUUID().toString();
		    
		    String query = MaintenanceQueries.getCreateLink(incidentUrl,
		    		linkCreationReport.getUser().trim(), 
		    		linkCreationReport.getItem().trim(),
		    		linkCreationReport.getLink().trim(),
		    		linkCreationReport.getRelatedTo().trim(),
		    		linkCreationReport.getDeviceLat().trim(),
		    		linkCreationReport.getDeviceLon().trim(),
		    		linkCreationReport.getGpsTime().trim(),
		    		linkCreationReport.getDeviceTime().trim(),
		    		linkCreationReport.getAccuracy().trim()
		    		);
		    
		    System.out.println (query);
		    
		    Query sparqlQuery = new Query(query);
		  
		    System.out.println (query);
		      
		    maintenanceEndpoint.update(sparqlQuery);

		    
		    String provActivityURI =  UUID.randomUUID().toString();
		    
		    String CreateActivityProvenanceQuery = MaintenanceQueries.getCreateLinkReportActivity(
		    		provActivityURI,
		    		linkCreationReport.getUser().trim()
		    		
		    		);
		   sparqlQuery = new Query(CreateActivityProvenanceQuery);
		  
		    System.out.println (query);
		      
		    maintenanceEndpoint.update(sparqlQuery);

	     
		 
		    
		    String CreateEntityProvenanceQuery = MaintenanceQueries.getCreateLinkReportEntity(
		    		incidentUrl,
		    		provActivityURI
		    		
		    		);
		   sparqlQuery = new Query(CreateEntityProvenanceQuery);
		  
		    System.out.println (query);
		      
		    maintenanceEndpoint.update(sparqlQuery);
		    
		    
		    String CreateUsedProvenanceQuery = MaintenanceQueries.getCreateLinkReportUsed(
		    		provActivityURI,
		    		linkCreationReport.getRelatedTo().trim(),
		    		linkCreationReport.getItem().trim()
		    		
		    		);
		   sparqlQuery = new Query(CreateUsedProvenanceQuery);
		  
		    System.out.println (query);
		      
		    maintenanceEndpoint.update(sparqlQuery);
		     
		      

return linkCreationReport;
	}
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("getCausedByLinks")
	public List <ResponseCausedByLinks> getIncorrectMoreInfo(@DefaultValue("") @QueryParam("uri") String reportUri	) { 
	String	uri = reportUri.trim(); 
		
		String query = MaintenanceQueries.getCausedByLinks(uri);
		Query sparqlQuery = new Query(query);
		ResultSet results = maintenanceEndpoint.query(sparqlQuery);

		List<String> vars = results.getResultVars();
		
		List <ResponseCausedByLinks> responseList = new ArrayList <ResponseCausedByLinks> ();
		
		

		while (results.hasNext()) {
			ResponseCausedByLinks response  = new ResponseCausedByLinks();
			QuerySolution solution = results.next(); // need to look at this
			response.setCausedBy((Util.getNodeValue(solution.get(vars.get(0))).trim()));
			response.setDisruptionType((Util.getNodeValue(solution.get(vars.get(2))).trim())+"->"+(Util.getNodeValue(solution.get(vars.get(1))).trim()));
			response.setLon((Util.getNodeValue(solution.get(vars.get(3))).trim()));
			response.setLat((Util.getNodeValue(solution.get(vars.get(4))).trim()));
			
			
			
			//build a query to retrieve how many times this kind of link was created
			String query2 = MaintenanceQueries.getCausedByLinksCount(uri,response.getCausedBy());
			Query sparqlQuery2 = new Query(query2);
			ResultSet results2 = maintenanceEndpoint.query(sparqlQuery2);
			QuerySolution solution2 = results2.next();
			List<String> vars2 = results2.getResultVars();
			response.setPeopleCount((Util.getNodeValue(solution2.get(vars2.get(0))).trim()));
			
			
			responseList.add(response);
		}

		return responseList;
	}
	

}
