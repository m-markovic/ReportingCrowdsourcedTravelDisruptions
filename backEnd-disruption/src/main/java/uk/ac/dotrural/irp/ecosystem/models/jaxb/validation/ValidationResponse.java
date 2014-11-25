package uk.ac.dotrural.irp.ecosystem.models.jaxb.validation;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class ValidationResponse {
	
	String uri = "";
	//who created the report
	String count = "";
		
		public ValidationResponse () {}
		
		public ValidationResponse (String uri) {
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
		
		 @XmlElement(name="count")
		  public String getCount()
		  {
		    return count;
		  }
		
		 public void setCount (String count)
		  {
			 this.count = count;
		  }

}
