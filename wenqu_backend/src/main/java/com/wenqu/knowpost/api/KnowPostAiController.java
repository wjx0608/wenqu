package com.wenqu.knowpost.api;

import com.wenqu.knowpost.api.dto.DescriptionSuggestRequest;
import com.wenqu.knowpost.api.dto.DescriptionSuggestResponse;
import com.wenqu.llm.service.KnowPostDescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1/knowposts", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class KnowPostAiController {

    private final KnowPostDescriptionService descriptionService;

    /**
     * 生成不超过 50 字的知文描述。
     * 需要鉴权（默认策略），防止匿名滥用。
     */
    @PostMapping(path = "/description/suggest", consumes = MediaType.APPLICATION_JSON_VALUE)
    public DescriptionSuggestResponse suggest(@Valid @RequestBody DescriptionSuggestRequest req) {
        String desc = descriptionService.generateDescription(req.content());
        return new DescriptionSuggestResponse(desc);
    }
}