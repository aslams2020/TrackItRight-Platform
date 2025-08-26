package in.sb.tir.dto;

import in.sb.tir.model.ComplaintStatus;

public class UpdateStatusRequest {
    private ComplaintStatus status;

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }
}
