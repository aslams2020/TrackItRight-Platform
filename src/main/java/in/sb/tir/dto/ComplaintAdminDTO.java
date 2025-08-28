package in.sb.tir.dto;

import java.time.LocalDateTime;

import in.sb.tir.model.Complaint;
import in.sb.tir.model.User;

//in.sb.tir.dto.ComplaintAdminDTO.java
public class ComplaintAdminDTO {
 private Long id;
 private String title;
 private String description;
 private String status;
 private String remarks;
 private LocalDateTime createdAt;
 private LocalDateTime updatedAt;
 private String departmentName;
 private String authorityName;
 private CitizenSummary citizen;
 private MinimalUser authority;

 // getters/setters

 public MinimalUser getAuthority() {
	return authority;
}

public void setAuthority(MinimalUser authority) {
	this.authority = authority;
}

public Long getId() {
	return id;
}

public void setId(Long id) {
	this.id = id;
}

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

public String getStatus() {
	return status;
}

public void setStatus(String status) {
	this.status = status;
}

public String getRemarks() {
	return remarks;
}

public void setRemarks(String remarks) {
	this.remarks = remarks;
}

public LocalDateTime getCreatedAt() {
	return createdAt;
}

public void setCreatedAt(LocalDateTime createdAt) {
	this.createdAt = createdAt;
}

public LocalDateTime getUpdatedAt() {
	return updatedAt;
}

public void setUpdatedAt(LocalDateTime updatedAt) {
	this.updatedAt = updatedAt;
}

public String getDepartmentName() {
	return departmentName;
}

public void setDepartmentName(String departmentName) {
	this.departmentName = departmentName;
}

public String getAuthorityName() {
	return authorityName;
}

public void setAuthorityName(String authorityName) {
	this.authorityName = authorityName;
}

public CitizenSummary getCitizen() {
	return citizen;
}

public void setCitizen(CitizenSummary citizen) {
	this.citizen = citizen;
}

public static class CitizenSummary {
     private Long id;
     private String name;
     private String email;
     
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
     
    
 }
 
public static class MinimalUser {
    private Long id;
    private String name;
    private String email;
    // getters/setters
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	

}


public static ComplaintAdminDTO fromEntity(Complaint c) {
    ComplaintAdminDTO dto = new ComplaintAdminDTO();
    dto.setId(c.getId());
    dto.setTitle(c.getTitle());
    dto.setDescription(c.getDescription());
    dto.setStatus(c.getStatus().toString());
    dto.setRemarks(c.getRemarks());
    dto.setCreatedAt(c.getCreatedAt());
    dto.setUpdatedAt(c.getUpdatedAt());
    dto.setDepartmentName(c.getDepartment().getName());

    // Authority name 
    dto.setAuthorityName(c.getAuthority() != null ? c.getAuthority().getName() : null);

    // Citizen DTO mapping:
    CitizenSummary citizenDto = new CitizenSummary();
    citizenDto.setId(c.getCitizen().getId());
    citizenDto.setName(c.getCitizen().getName());
    citizenDto.setEmail(c.getCitizen().getEmail());
    dto.setCitizen(citizenDto);

    // Authority DTO mapping:
    if (c.getAuthority() != null) {
        MinimalUser authorityDto = new MinimalUser();
        authorityDto.setId(c.getAuthority().getId());
        authorityDto.setName(c.getAuthority().getName());
        authorityDto.setEmail(c.getAuthority().getEmail());
        dto.setAuthority(authorityDto);
    } else {
        dto.setAuthority(null);
    }

    return dto;
}
 

}
