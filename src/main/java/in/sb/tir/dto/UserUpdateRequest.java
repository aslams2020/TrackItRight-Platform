package in.sb.tir.dto;

public class UserUpdateRequest {
	
	private String role;        // "USER", "AUTHORITY", "ADMIN"
	
    private Long departmentId;  
    
    // getters/setters
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public Long getDepartmentId() {
		return departmentId;
	}
	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}
    
}
