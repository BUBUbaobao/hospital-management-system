package com.hospital.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CompleteConsultationRequest {

    @NotBlank(message = "医生建议不能为空")
    private String advice;

    @NotNull(message = "药品服务项目列表不能为空")
    private List<ItemRequest> items;

    @Data
    public static class ItemRequest {
        @NotNull(message = "项目ID不能为空")
        private Long itemId;

        @NotNull(message = "数量不能为空")
        private Integer quantity;
    }
}
