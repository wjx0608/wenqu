package com.wenqu.knowpost.api.dto;

import jakarta.validation.constraints.NotNull;

public record KnowPostTopPatchRequest(
        @NotNull Boolean isTop
) {}