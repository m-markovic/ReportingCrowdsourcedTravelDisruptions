package uk.ac.dotrural.irp.ecosystem.queries.disruption;



public class IncidentQueries {

	
	public static String getAllIncidentQuery() {
		// TODO Auto-generated method stub
		return String.format(
				QueryReader.getString("IncidentQueries.query.getAllIncidents"));
	}
	
	
	public static String getCreateIncidentUpdate(String valueUri,
			String latitude, String longitude, String description,String event,
			String type,String disruptionType,String deviceLat,String deviceLon,String gpsTime,String deviceTime,String accuracy,String place, String osm_id,String user) {
				
				String updateQuery = String.format(
				QueryReader.getString("IncidentQueries.update.create"),valueUri,latitude, longitude, description,event, type,disruptionType,deviceLat,deviceLon,gpsTime,deviceTime,accuracy,place,osm_id,user);
		return updateQuery;
	}
	
	
	public static String getCreateDisruptionReportActivity(String valueUri,
			String user) {
				
				String updateQuery = String.format(
				QueryReader.getString("IncidentQueries.update.createReportActivity"),valueUri,user);
		return updateQuery;
	}
	
	public static String getCreateDisruptionReportEntity(String entityURI,String activityUri
			) {
				
				String updateQuery = String.format(
				QueryReader.getString("IncidentQueries.update.createReportEntity"),entityURI,activityUri);
		return updateQuery;
	}
	
	
}
