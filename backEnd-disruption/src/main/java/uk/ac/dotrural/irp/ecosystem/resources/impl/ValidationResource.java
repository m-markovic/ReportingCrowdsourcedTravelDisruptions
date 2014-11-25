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
import uk.ac.dotrural.irp.ecosystem.models.jaxb.validation.ValidationMoreInfoResponse;
import uk.ac.dotrural.irp.ecosystem.models.jaxb.validation.ValidationReport;
import uk.ac.dotrural.irp.ecosystem.models.jaxb.validation.ValidationResponse;
import uk.ac.dotrural.irp.ecosystem.queries.disruption.IncidentQueries;
import uk.ac.dotrural.irp.ecosystem.queries.disruption.QueryReader;
import uk.ac.dotrural.irp.ecosystem.queries.validation.ValidationQueries;


@Path("/validation")
@Scope("request")
public class ValidationResource implements RESTFulSPARQL{
	
	@Context
	private UriInfo uriInfo;
	private SPARQLEndpoint validationEndpoint;
	
	public SPARQLEndpoint getValidationEndpoint() {
		return validationEndpoint;
	}

	public void setValidationEndpoint(SPARQLEndpoint validationEndpoint) {
		this.validationEndpoint = validationEndpoint;
	}

	public EndpointInfo info() {
		// TODO Auto-generated method stub
		return validationEndpoint.info();
	}

	public SystemMessage init(ServiceInitialiser si) {
		// TODO Auto-generated method stub
		return validationEndpoint.init(uriInfo, si);
	}

	public String query(Query query) {
		// TODO Auto-generated method stub
		return Util.resultsetToString(validationEndpoint.query(query));
	}

	public void update(Query query) {
		// TODO Auto-generated method stub
		validationEndpoint.update(query);
	}
	
	@POST 
    @Consumes(MediaType.APPLICATION_JSON) 
	@Produces({ MediaType.APPLICATION_JSON }) // if applicable
	@Path("createAnnotationCorrect")
	//@RequestMapping(method = RequestMethod.POST)
	public ValidationReport validation ( ValidationReport validation) {
		//Incident incidentDetails = new Incident ();
	//	incidentDetails.setDescription(description);
	//	incidentDetails.setType(type);
	//	incidentDetails.setLat(lat);
	//	incidentDetails.setLon(lon);
		
		// System.out.println (lon);
		
		if(validation == null)
		      throw new ExceptionReporter(new NullPointerException("No 'Values' given."));
		    
		
		    
		    String incidentUrl = "";
		    
		    incidentUrl =  UUID.randomUUID().toString();
		    
		    String query = ValidationQueries.getCreateAnnotationCorrect(
		    		
		    		incidentUrl,
		    		validation.getUser().trim(), 
		    		validation.getRelatedTo().trim(),
		    		validation.getDeviceLat().trim(),
		    		validation.getDeviceLon().trim(),
		    		validation.getGpsTime().trim(),
		    		validation.getDeviceTime().trim(),
		    		validation.getAccuracy().trim()
	);
		    System.out.println (validation.getDeviceLat().trim());
		    
		    Query sparqlQuery = new Query(query);
		  
		    System.out.println (query);
		      
		    validationEndpoint.update(sparqlQuery);

		    String provActivityURI =  UUID.randomUUID().toString();
		    
		    String CreateActivityProvenanceQuery = ValidationQueries.getCreateValidationReportActivity(
		    		provActivityURI,
		    		validation.getUser().trim()
		    		
		    		);
		   sparqlQuery = new Query(CreateActivityProvenanceQuery);
		  
		    System.out.println (query);
		      
		    validationEndpoint.update(sparqlQuery);

	     
		 
		    
		    String CreateEntityProvenanceQuery = ValidationQueries.getCreateValidationReportEntity(
		    		incidentUrl,
		    		provActivityURI
		    		
		    		);
		   sparqlQuery = new Query(CreateEntityProvenanceQuery);
		  
		    System.out.println (query);
		      
		    validationEndpoint.update(sparqlQuery);
		    
		    
		    String CreateUsedProvenanceQuery = ValidationQueries.getCreateValidationReportUsed(
		    		provActivityURI,
		    		validation.getRelatedTo().trim()
		    		
		    		);
		   sparqlQuery = new Query(CreateUsedProvenanceQuery);
		  
		    System.out.println (query);
		      
		    validationEndpoint.update(sparqlQuery);
		     
		      

return validation;
	}
	
	@POST 
    @Consumes(MediaType.APPLICATION_JSON) 
	@Produces({ MediaType.APPLICATION_JSON }) // if applicable
	@Path("createAnnotationIncorrect")
	//@RequestMapping(method = RequestMethod.POST)
	public ValidationReport incorrect ( ValidationReport incorrect) {
		//Incident incidentDetails = new Incident ();
	//	incidentDetails.setDescription(description);
	//	incidentDetails.setType(type);
	//	incidentDetails.setLat(lat);
	//	incidentDetails.setLon(lon);
		
		// System.out.println (lon);
		
		if(incorrect == null)
		      throw new ExceptionReporter(new NullPointerException("No 'Values' given."));
		    
		
		    
		    String incidentUrl = "";
		    
		    incidentUrl =  UUID.randomUUID().toString();
		    
		    String query = ValidationQueries.getCreateAnnotationIncorrect(incidentUrl,
		    		incorrect.getUser().trim(), 
		    		incorrect.getRelatedTo().trim(),
		    		
		    		incorrect.getDeviceLat().trim(),
		    		incorrect.getDeviceLon().trim(),
		    		incorrect.getGpsTime().trim(),
		    		incorrect.getDeviceTime().trim(),
		    		incorrect.getAccuracy().trim()
	);
		    System.out.println (query);
		    
		    Query sparqlQuery = new Query(query);
		  
		    System.out.println (query);
		      
		    validationEndpoint.update(sparqlQuery);

		     EventReport incident = new EventReport ();
		      incident.setUri(incidentUrl);
		      
		      
		      String provActivityURI =  UUID.randomUUID().toString();
			    
			    String CreateActivityProvenanceQuery = ValidationQueries.getCreateValidationReportActivity(
			    		provActivityURI,
			    		incorrect.getUser().trim()
			    		
			    		);
			   sparqlQuery = new Query(CreateActivityProvenanceQuery);
			  
			    System.out.println (query);
			      
			    validationEndpoint.update(sparqlQuery);

		     
			 
			    
			    String CreateEntityProvenanceQuery = ValidationQueries.getCreateValidationReportEntity(
			    		incidentUrl,
			    		provActivityURI
			    		
			    		);
			   sparqlQuery = new Query(CreateEntityProvenanceQuery);
			  
			    System.out.println (query);
			      
			    validationEndpoint.update(sparqlQuery);
			    
			    
			    String CreateUsedProvenanceQuery = ValidationQueries.getCreateValidationReportUsed(
			    		provActivityURI,
			    		incorrect.getRelatedTo().trim()
			    		
			    		);
			   sparqlQuery = new Query(CreateUsedProvenanceQuery);
			  
			    System.out.println (query);
			      
			    validationEndpoint.update(sparqlQuery);
		     
		      

return incorrect;
	}
	
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("getNumberCorrect")
	public ValidationResponse getAllIncidengetNumberCorrectt(@DefaultValue("") @QueryParam("uri") String reportUri	) { 
	String	uri = reportUri.trim(); 
		
		

		

		String query = ValidationQueries.getNumberCorrect(uri);
		Query sparqlQuery = new Query(query);
		ResultSet results = validationEndpoint.query(sparqlQuery);

		List<String> vars = results.getResultVars();
		
		ValidationResponse response  = new ValidationResponse();

		while (results.hasNext()) {
			
			QuerySolution solution = results.next(); // need to look at this
			response.setCount((Util.getNodeValue(solution.get(vars.get(0))).trim()));
			
		}

		return response;
	}
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("getNumberIncorrect")
	public ValidationResponse getNumberIncorrectt(@DefaultValue("") @QueryParam("uri") String reportUri	) { 
	String	uri = reportUri.trim(); 
		
		

		

		String query = ValidationQueries.getNumberInorrect(uri);
		Query sparqlQuery = new Query(query);
		ResultSet results = validationEndpoint.query(sparqlQuery);

		List<String> vars = results.getResultVars();
		
		ValidationResponse response  = new ValidationResponse();

		while (results.hasNext()) {
			
			QuerySolution solution = results.next(); // need to look at this
			response.setCount((Util.getNodeValue(solution.get(vars.get(0))).trim()));
			
		}

		return response;
	}
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("getLatLongOfReport")
	public ValidationReport getLatLongOfValidationReport(@DefaultValue("") @QueryParam("uri") String reportUri	) { 
	String	uri = reportUri.trim(); 
		
		String query = ValidationQueries.getLatLon(uri);
		Query sparqlQuery = new Query(query);
		ResultSet results = validationEndpoint.query(sparqlQuery);

		List<String> vars = results.getResultVars();
		
		ValidationReport response  = new ValidationReport();

		while (results.hasNext()) {
			
			QuerySolution solution = results.next(); // need to look at this
			response.setDeviceLat((Util.getNodeValue(solution.get(vars.get(0))).trim()));
			response.setDeviceLon((Util.getNodeValue(solution.get(vars.get(1))).trim()));
			
		}

		return response;
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("getCreatorOfReport")
	public ValidationReport getCreatorOfReport(@DefaultValue("") @QueryParam("uri") String reportUri	) { 
	String	uri = reportUri.trim(); 
		
		String query = ValidationQueries.getCreatorOfReport(uri);
		Query sparqlQuery = new Query(query);
		ResultSet results = validationEndpoint.query(sparqlQuery);

		List<String> vars = results.getResultVars();
		
		ValidationReport response  = new ValidationReport();

		while (results.hasNext()) {
			
			QuerySolution solution = results.next(); // need to look at this
			response.setUser((Util.getNodeValue(solution.get(vars.get(0))).trim()));
			
		}

		return response;
	}
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("getCorrectMoreInfo")
	public List <ValidationMoreInfoResponse> getCorrectMoreInfo(@DefaultValue("") @QueryParam("uri") String reportUri	) { 
	String	uri = reportUri.trim(); 
		
		String query = ValidationQueries.getCorrectMoreInfo(uri);
		Query sparqlQuery = new Query(query);
		ResultSet results = validationEndpoint.query(sparqlQuery);

		List<String> vars = results.getResultVars();
		
		List <ValidationMoreInfoResponse> responseList = new ArrayList <ValidationMoreInfoResponse> ();
		
		

		while (results.hasNext()) {
			ValidationMoreInfoResponse response  = new ValidationMoreInfoResponse();
			QuerySolution solution = results.next(); // need to look at this
			response.setUser((Util.getNodeValue(solution.get(vars.get(0))).trim()));
			response.setDeviceLat((Util.getNodeValue(solution.get(vars.get(1))).trim()));
			response.setDeviceLon((Util.getNodeValue(solution.get(vars.get(2))).trim()));
			response.setDeviceTime((Util.getNodeValue(solution.get(vars.get(3))).trim()));
			responseList.add(response);
		}

		return responseList;
	}
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("getIncorrectMoreInfo")
	public List <ValidationMoreInfoResponse> getIncorrectMoreInfo(@DefaultValue("") @QueryParam("uri") String reportUri	) { 
	String	uri = reportUri.trim(); 
		
		String query = ValidationQueries.getIncorrectMoreInfo(uri);
		Query sparqlQuery = new Query(query);
		ResultSet results = validationEndpoint.query(sparqlQuery);

		List<String> vars = results.getResultVars();
		
		List <ValidationMoreInfoResponse> responseList = new ArrayList <ValidationMoreInfoResponse> ();
		
		

		while (results.hasNext()) {
			ValidationMoreInfoResponse response  = new ValidationMoreInfoResponse();
			QuerySolution solution = results.next(); // need to look at this
			response.setUser((Util.getNodeValue(solution.get(vars.get(0))).trim()));
			response.setDeviceLat((Util.getNodeValue(solution.get(vars.get(1))).trim()));
			response.setDeviceLon((Util.getNodeValue(solution.get(vars.get(2))).trim()));
			response.setDeviceTime((Util.getNodeValue(solution.get(vars.get(3))).trim()));
			responseList.add(response);
		}

		return responseList;
	}
	
	
}
