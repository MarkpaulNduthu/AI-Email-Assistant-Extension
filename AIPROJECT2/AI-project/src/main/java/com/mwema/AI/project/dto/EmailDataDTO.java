package com.mwema.AI.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmailDataDTO {
    private String emailContent;
    private String tone;
}
