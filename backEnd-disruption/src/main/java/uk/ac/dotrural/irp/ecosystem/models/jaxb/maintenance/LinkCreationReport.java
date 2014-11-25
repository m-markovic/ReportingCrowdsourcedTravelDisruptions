package uk.ac.dotrural.irp.ecosystem.models.jaxb.maintenance;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class LinkCreationReport {

	String uri = "";
	//who created the report
	String user = "";
	//report uri the validation report relates to
	String relatedTo = "";
	String link = "";
	private String deviceLat="";
	private String deviceLon="";
	private String gpsTime="";
	private String deviceTime="";
	private String accuracy="";
	private String item="";
		
		public LinkCreationReport () {}
		
		public LinkCreationReport (String uri) {
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
		 
		 @XmlElement(name="item")
		  public String getItem()
		  {
		    return item;
		  }
		
		 public void setItem (String item)
		  {
			 this.item = item;
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
		 
		 @XmlElement(name="link")
		  public String getLink()
		  {
		    return link;
		  }
		
		 public void setLink (String link)
		  {
			 this.link = link;
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
