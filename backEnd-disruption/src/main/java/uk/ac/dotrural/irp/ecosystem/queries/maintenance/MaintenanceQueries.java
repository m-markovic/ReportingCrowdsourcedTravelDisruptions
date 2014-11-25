package uk.ac.dotrural.irp.ecosystem.queries.maintenance;

import uk.ac.dotrural.irp.ecosystem.queries.maintenance.QueryReader;

public class MaintenanceQueries {

	
	public static String getCreateLink(String valueUri,
			String user,String item,  String link,String relatedTo, String deviceLat,String deviceLon,String gpsTime,String deviceTime,String accuracy) {
				
				String updateQuery = String.format(
				QueryReader.getString("MaintenanceQueries.update.createLink"),valueUri,user,item,link, relatedTo, deviceLat,deviceLon,gpsTime,deviceTime,accuracy);
		return updateQuery;
	}
	
	public static String getCreateLinkReportActivity(String valueUri,
			String user) {
				
				String updateQuery = String.format(
				QueryReader.getString("MaintenanceQueries.update.createReportActivity"),valueUri,user);
		return updateQuery;
	}
	
	public static String getCreateLinkReportEntity(String entityURI,String activityUri
			) {
				
				String updateQuery = String.format(
				QueryReader.getString("MaintenanceQueries.update.createReportEntity"),entityURI,activityUri);
		return updateQuery;
	}
	
	public static String getCreateLinkReportUsed(String activityUri,String entityURI,String entityURI2
	) {
		
		String updateQuery = String.format(
		QueryReader.getString("MaintenanceQueries.update.createReportUsed"),activityUri,entityURI,entityURI2);
		return updateQuery;
		}

	public static String getCausedByLinks(String uri) {
		String getQuery = String.format(
				QueryReader.getString("MaintenanceQueries.query.getCausedByLinks"),uri,uri);
				return getQuery;
	}

	public static String getCausedByLinksCount(String uri, String uri2) {
		String getQuery = String.format(
				QueryReader.getString("MaintenanceQueries.query.getCausedByLinksCount"),uri,uri,uri2);
				return getQuery;
	}
	
	
	
	
	
	
	
}
