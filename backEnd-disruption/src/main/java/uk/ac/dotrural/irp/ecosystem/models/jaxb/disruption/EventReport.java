package uk.ac.dotrural.irp.ecosystem.models.jaxb.disruption;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class EventReport {
	
	private String uri="";
	private String description="";
	private String type="";
	private String event ="";
	private String disruptionType ="";
	private String lat;
	private String lon;
	private String deviceLat="";
	private String deviceLon="";
	private String gpsTime="";
	private String deviceTime="";
	private String accuracy="";
	private String osm_id = "";
	private String place="";
	private String user = "";

	
	public EventReport() {}
	
	public EventReport(String uri)
	  {
	    this.uri = uri;
	  }
	
	@XmlElement(name="uri")
	  public String getUri()
	  {
	    return uri;
	  }
	
	public void setUri(String uri)
	  {
	    this.uri = uri;
	  }
	
	@XmlElement(name="description")
	  public String getDescription()
	  {
	    return description;
	  }
	
	public void setDescription(String description )
	  {
	    this.description = description;
	  }
	
	@XmlElement(name="disruptionType")
	  public String getDisruptionType()
	  {
	    return disruptionType;
	  }
	
	public void setDisruptionType(String disruptionType)
	  {
	    this.disruptionType = disruptionType;
	  }
	
	@XmlElement(name="event")
	  public String getEvent()
	  {
	    return event;
	  }
	
	public void setEvent(String event)
	  {
	    this.event = event;
	  }
	
	@XmlElement(name="type")
	  public String getType()
	  {
	    return type;
	  }
	
	public void setType(String type)
	  {
	    this.type = type;
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
	
	@XmlElement(name="lat")
	  public String getLat()
	  {
	    return lat;
	  }
	
	public void setLat(String lat)
	  {
	    this.lat = lat;
	  }
	
	@XmlElement(name="lon")
	  public String getLon()
	  {
	    return lon;
	  }
	
	public void setLon(String lon)
	  {
	    this.lon = lon;
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
	
	public void setAccuracy(String accuracy)
	  {
	    this.accuracy = accuracy;
	  }
	@XmlElement(name="place")
	  public String getPlace()
	  {
	    return place;
	  }
	
	public void setPlace(String place)
	  {
	    this.place = place;
	  }
	@XmlElement(name="osm_id")
	  public String getOsm_ID()
	  {
	    return osm_id;
	  }
	
	public void setOsm_ID(String osm_id)
	  {
	    this.osm_id = osm_id;
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
}
