package uk.ac.dotrural.irp.ecosystem.queries.provenance;

import uk.ac.dotrural.irp.ecosystem.queries.disruption.QueryReader;



public class ProvenanceQueries {

	
	public static String getCausesOfDisruption() {
		// TODO Auto-generated method stub
		return String.format(
				QueryReader.getString("ProvenanceQueries.query.getCausedByLinks"));
	}
	
	
	
	public static String getCreateDisruptionProvenance(String valueUri,
			String user, String entityURI) {
				
				String updateQuery = String.format(
				QueryReader.getString("ProvenanceQueries.update.createDisruption"),valueUri,user, entityURI);
		return updateQuery;
	}
	
	
	
}
