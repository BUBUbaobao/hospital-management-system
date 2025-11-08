package com.hospital.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateReviewRequest {

    @NotNull(message = "就诊记录ID不能为空")
    private Long visitId;

    private Long doctorId;

    private Long departmentId;

    @NotNull(message = "评分不能为空")
    @Min(value = 1, message = "评分最低为1分")
    @Max(value = 10, message = "评分最高为10分")
    private Integer score;

    private String comment;
}
