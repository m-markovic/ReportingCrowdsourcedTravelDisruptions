package uk.ac.dotrural.irp.ecosystem.queries.validation;

import uk.ac.dotrural.irp.ecosystem.queries.validation.QueryReader;

public class ValidationQueries {

	
	public static String getCreateAnnotationCorrect(String valueUri,
			String user, String relatedTo ,String deviceLat,String deviceLon,String gpsTime,String deviceTime,String accuracy) {
				
				String updateQuery = String.format(
				QueryReader.getString("ValidationQueries.update.createAnnotationCorrect"),valueUri,user, relatedTo,deviceLat,deviceLon,gpsTime,deviceTime,accuracy);
		return updateQuery;
	}
	
	public static String getCreateAnnotationIncorrect(String valueUri,
			String user, String relatedTo, String deviceLat,String deviceLon,String gpsTime,String deviceTime,String accuracy) {
				
				String updateQuery = String.format(
				QueryReader.getString("ValidationQueries.update.createAnnotationIncorrect"),valueUri,user, relatedTo, deviceLat,deviceLon,gpsTime,deviceTime,accuracy);
		return updateQuery;
	}
	
	
	public static String getCreateValidationReportActivity(String valueUri,
			String user) {
				
				String updateQuery = String.format(
				QueryReader.getString("ValidationQueries.update.createReportActivity"),valueUri,user);
		return updateQuery;
	}
	
	public static String getCreateValidationReportEntity(String entityURI,String activityUri
			) {
				
				String updateQuery = String.format(
				QueryReader.getString("ValidationQueries.update.createReportEntity"),entityURI,activityUri);
		return updateQuery;
	}
	
	public static String getCreateValidationReportUsed(String activityUri,String entityURI
	) {
		
		String updateQuery = String.format(
		QueryReader.getString("ValidationQueries.update.createReportUsed"),activityUri,entityURI);
		return updateQuery;
		}
	
	public static String getNumberCorrect(String valueUri) {
				
				String updateQuery = String.format(
				QueryReader.getString("ValidationQueries.query.getNumberCorrect"),valueUri);
		return updateQuery;
	}
	
	public static String getNumberInorrect(String valueUri) {
		
		String updateQuery = String.format(
		QueryReader.getString("ValidationQueries.query.getNumberIncorrect"),valueUri);
		return updateQuery;
	}
	
	public static String getLatLon(String valueUri) {
		
		String updateQuery = String.format(
		QueryReader.getString("ValidationQueries.query.getLatLon"),valueUri);
		return updateQuery;
	}
	
	public static String getCreatorOfReport(String valueUri) {
		
		String updateQuery = String.format(
		QueryReader.getString("ValidationQueries.query.getCreatorOfReport"),valueUri);
		return updateQuery;
	}
	
public static String getCorrectMoreInfo(String valueUri) {
		
		String updateQuery = String.format(
		QueryReader.getString("ValidationQueries.query.getCorrectMoreInfo"),valueUri);
		return updateQuery;
	}

public static String getIncorrectMoreInfo(String valueUri) {
	
	String updateQuery = String.format(
	QueryReader.getString("ValidationQueries.query.getIncorrectMoreInfo"),valueUri);
	return updateQuery;
}
	
	
}
