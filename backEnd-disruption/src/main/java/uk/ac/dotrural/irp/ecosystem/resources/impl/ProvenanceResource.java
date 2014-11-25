package uk.ac.dotrural.irp.ecosystem.resources.impl;

import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;

import org.springframework.context.annotation.Scope;

import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.EndpointInfo;
import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.Query;
import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.ServiceInitialiser;
import uk.ac.dotrural.irp.ecosystem.core.models.jaxb.system.SystemMessage;
import uk.ac.dotrural.irp.ecosystem.core.resources.RESTFulSPARQL;
import uk.ac.dotrural.irp.ecosystem.core.services.SPARQLEndpoint;
import uk.ac.dotrural.irp.ecosystem.core.util.Util;


@Path("/disruption")
@Scope("request")
public class ProvenanceResource implements RESTFulSPARQL{

	@Context
	private UriInfo uriInfo;

	private SPARQLEndpoint provenanceEndpoint;

	public SPARQLEndpoint getProvenanceEndpoint() {
		return provenanceEndpoint;
	}

	public void setProvenanceEndpoint(SPARQLEndpoint provenanceEndpoint) {
		this.provenanceEndpoint = provenanceEndpoint;
	}

	public SystemMessage init(ServiceInitialiser si) {
		// TODO Auto-generated method stub
		return provenanceEndpoint.init(uriInfo, si);
	}

	public void update(Query query) {
		provenanceEndpoint.update(query);

	}

	public String query(Query query) {
		// TODO Auto-generated method stub
		return Util.resultsetToString(provenanceEndpoint.query(query));
	}

	public EndpointInfo info() {
		// TODO Auto-generated method stub
		return provenanceEndpoint.info();
	}
	
	
	
	
}
