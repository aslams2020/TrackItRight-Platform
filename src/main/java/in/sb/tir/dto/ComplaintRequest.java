package in.sb.tir.dto;

public class ComplaintRequest {
    private String title;
    private String description;
    private Long departmentId;

    // getters & setters
    public String getTitle() { 
    	return title; 
    }
    public void setTitle(String title) {
    	this.title = title; 
    }

    public String getDescription() {
    	return description; 
    }
    public void setDescription(String description) {
    	this.description = description; 
    }

    public Long getDepartmentId() { 
    	return departmentId; 
    }
    public void setDepartmentId(Long departmentId) { 
    	this.departmentId = departmentId; 
    }
}
