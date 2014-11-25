package uk.ac.dotrural.irp.ecosystem.models.jaxb.validation;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ValidationMoreInfoResponse {

	
	String uri = "";
	
	String user = "";
	String deviceLat = "";
	String deviceLon = "";
	String deviceTime = "";
	
	public ValidationMoreInfoResponse () {}
	
	public ValidationMoreInfoResponse (String uri) {
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
}
