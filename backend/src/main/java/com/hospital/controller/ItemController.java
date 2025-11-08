package com.hospital.controller;

import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.ItemResponse;
import com.hospital.enums.ItemType;
import com.hospital.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/items")
@Tag(name = "药品服务项目接口", description = "药品和服务项目查询接口")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Operation(summary = "查询药品服务项目", description = "查询所有启用的药品/服务项目，可按类型筛选")
    @GetMapping
    public ApiResponse<List<ItemResponse>> getItems(@RequestParam(required = false) ItemType type) {
        List<ItemResponse> items = itemService.getItems(type);
        return ApiResponse.success(items);
    }
}
