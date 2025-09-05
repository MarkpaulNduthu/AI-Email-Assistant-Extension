package com.mwema.AI.project.service;

import com.mwema.AI.project.dto.EmailDataDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.template.st.StTemplateRenderer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.function.Consumer;

@Service
public class EmailGeneratorService {
    private ChatClient chatClient;

    public EmailGeneratorService(@Qualifier("ollamaChatClient") ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String generateEmail(EmailDataDTO emailData) {
        PromptTemplate promptTemplate = PromptTemplate.builder()
                .renderer(StTemplateRenderer.builder().startDelimiterToken('{').endDelimiterToken('}').build())
                .template(
                        """
                Generate a professional Email response to the following Email. Please Do not generate a subject line.
                ----------------------
                Tone:
                {tone}
                ----------------------
                original Email:
                {original_email}
                ----------------------
                """
                ).build();
        var prompt = promptTemplate.render(Map.of("tone", emailData.getTone(),
                "original_email", emailData.getEmailContent()));
        var message = chatClient.prompt(prompt)
                .call()
                .content();
        System.out.println(message);
        return message;
    }
}
