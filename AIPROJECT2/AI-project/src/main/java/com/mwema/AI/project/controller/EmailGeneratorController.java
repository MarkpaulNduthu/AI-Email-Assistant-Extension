package com.mwema.AI.project.controller;

import com.mwema.AI.project.dto.EmailDataDTO;
import com.mwema.AI.project.service.EmailGeneratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ollama-model")
@CrossOrigin(origins = "*")
public class EmailGeneratorController {
    private final EmailGeneratorService emailGeneratorService;

    public EmailGeneratorController(EmailGeneratorService emailGeneratorService) {
        this.emailGeneratorService = emailGeneratorService;
    }

    @RequestMapping(method = RequestMethod.POST, path = "/generate-email")
    public ResponseEntity<String> generateEmail(@RequestBody EmailDataDTO emailData) {
        System.out.println("I am here\n"+emailData+"\n");
        return ResponseEntity.ok(emailGeneratorService.generateEmail(emailData));
    }
}
