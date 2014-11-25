package uk.ac.dotrural.irp.ecosystem.models.jaxb.maintenance;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class ResponseCausedByLinks {
	
	private String uri="";	
	private String disruptionType ="";
	private String peopleCount ="";
	private String lat;
	private String lon;
	private String causedBy;

	
public ResponseCausedByLinks() {}
	
	public ResponseCausedByLinks(String uri)
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
	
	@XmlElement(name="causedBy")
	  public String getCausedBy()
	  {
	    return causedBy;
	  }
	
	public void setCausedBy(String causedBy)
	  {
	    this.causedBy = causedBy;
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
	
	@XmlElement(name="peopleCount")
	  public String getPeopleCount()
	  {
	    return peopleCount;
	  }
	
	public void setPeopleCount(String peopleCount)
	  {
	    this.peopleCount = peopleCount;
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
	
	
}
