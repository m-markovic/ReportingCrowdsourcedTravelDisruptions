package uk.ac.dotrural.irp.ecosystem.models.jaxb.validation;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ValidationReport {
	
String uri = "";
//who created the report
String user = "";
//report uri the validation report relates to
String relatedTo = "";
String value = "";
private String deviceLat="";
private String deviceLon="";
private String gpsTime="";
private String deviceTime="";
private String accuracy="";
	
	public ValidationReport () {}
	
	public ValidationReport (String uri) {
		this.uri = uri;
		
	}
	
	@XmlElement(name="uri")
	  public String getURI()
	  {
	    return uri;
	  }
	
	 public void setURI (String uri)
	  {
		 this.uri = uri;
	  }
	
	 @XmlElement(name="user")
	  public String getUser()
	  {
	    return user;
	  }
	
	 public void setUser (String user)
	  {
		 this.user = user;
	  }
	 
	 @XmlElement(name="relatedTo")
	  public String getRelatedTo()
	  {
	    return relatedTo;
	  }
	
	 public void setRelatedTo (String relatedTo)
	  {
		 this.relatedTo = relatedTo;
	  }
	 
	 @XmlElement(name="value")
	  public String getValue()
	  {
	    return value;
	  }
	
	 public void setValue (String value)
	  {
		 this.value = value;
	  }
	 
		@XmlElement(name="deviceLat")
		  public String getDeviceLat()
		  {
		    return deviceLat;
		  }
		
		public void setDeviceLat(String deviceLat)
		  {
		    this.deviceLat = deviceLat;
		  }
		
		@XmlElement(name="deviceLon")
		  public String getDeviceLon()
		  {
		    return deviceLon;
		  }
		
		public void setDeviceLon(String deviceLon)
		  {
		    this.deviceLon = deviceLon;
		  }
		
		@XmlElement(name="deviceTime")
		  public String getDeviceTime()
		  {
		    return deviceTime;
		  }
		
		public void setDeviceTime(String deviceTime)
		  {
		    this.deviceTime = deviceTime;
		  }
		
		@XmlElement(name="gpsTime")
		  public String getGpsTime()
		  {
		    return gpsTime;
		  }
		
		public void setGpsTime(String gpsTime)
		  {
		    this.gpsTime = gpsTime;
		  }
		@XmlElement(name="accuracy")
		  public String getAccuracy()
		  {
		    return accuracy;
		  }

}
