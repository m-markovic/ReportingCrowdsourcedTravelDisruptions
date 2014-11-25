package uk.ac.dotrural.irp.ecosystem.models.jaxb.provenance;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ProvenanceModel {

	private String uri="";
	private String agent="";
	private String wasAssociatedWith="";
	private String used="";
	private String entity="";
	private String activity="";
	private String wasGeneratedBy="";
	
	
	
	
public ProvenanceModel() {}
	
	public ProvenanceModel(String uri)
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
	
	@XmlElement(name="agent")
	  public String getAgent()
	  {
	    return agent;
	  }
	
	public void setAgent(String agent)
	  {
	    this.agent = agent;
	  }
	
	@XmlElement(name="entity")
	  public String getEntity()
	  {
	    return entity;
	  }
	
	public void setEntity(String entity)
	  {
	    this.entity = entity;
	  }
	
	@XmlElement(name="activity")
	  public String getActivity()
	  {
	    return activity;
	  }
	
	public void setActivity(String activity)
	  {
	    this.activity = activity;
	  }
	
	@XmlElement(name="wasGeneratedBy")
	  public String getWasGeneratedBy()
	  {
	    return wasGeneratedBy;
	  }
	
	public void setWasGeneratedBy(String wasGeneratedBy)
	  {
	    this.wasGeneratedBy = wasGeneratedBy;
	  }
	
	@XmlElement(name="used")
	  public String getUsed()
	  {
	    return used;
	  }
	
	public void setUsed(String used)
	  {
	    this.used = used;
	  }
	
	@XmlElement(name="wasAssociatedWith")
	  public String wasAssociatedWith()
	  {
	    return wasAssociatedWith;
	  }
	
	public void setWasAssociatedWith(String wasAssociatedWith)
	  {
	    this.used = wasAssociatedWith;
	  }

}
