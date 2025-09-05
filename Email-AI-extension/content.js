console.log("Email Writer Extension- Content Script loaded")


function createAIButton() {
    const button = document.createElement('div');
    button.innerHTML = 'AI Reply';
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    console.log("Button Created!")
    return button;
}

function getEmailContent() {

    const selectors = [
        '.h7',
        '.a3s.aiL',
        '[role="presentation"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            console.log("Gmail Content Found");
            return content.innerText.trim();
        }
    }
    return '';
}
function findToolBar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gmail_quote'
    ];
    for (const selector of selectors) {
        const toolBar = document.querySelector(selector);
        if (toolBar) {
            console.log("ToolBar Found: ",selector);
            return toolBar;
        } 
    }
    return null;
}

function injectButton() {
    const existingButton = document.querySelector('.email-ai-btn')
    if (existingButton) {
        existingButton.remove();
    }
    const toolBar = findToolBar();
    if (!toolBar) {
        console.log("toolbar not found!");
        return;
    }
    console.log("Toolbar Found");
    const emailAIButton = createAIButton();
    emailAIButton.classList.add('email-ai-btn');
    emailAIButton.addEventListener('click', async () => {
        try {
            emailAIButton.innerHTML = "Generating...";
            emailAIButton.disabled = true;
            const emailContent = getEmailContent();
            const response = await fetch("http://localhost:8080/api/v1/ollama-model/generate-email", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: 'Professional'
                })
            });
            if (!response.ok) {
                throw new Error("API request failed!");
            }
            const aiReply = await response.text();
            const composeBox = document.querySelector('[g_editable="true"][role="textbox"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, aiReply);
            } else {
                console.error("ComposeBox not Found!")
            }
        } catch (error) {
            alert('Failed to generate Reply!');
            console.error(error);
        } finally {
            emailAIButton.innerHTML = 'AI Reply';
            emailAIButton.disabled = false;
        }
    });
    // toolBar.parentNode.appendChild(emailAIButton);

    toolBar.insertBefore(emailAIButton, toolBar.firstChild);
}


const observer = new MutationObserver((mutationRecordList) => {
    console.log("Mutation observer 1")
    for (const mutationRecord of mutationRecordList) {
        const addedNodes = Array.from(mutationRecord.addedNodes)
        const hasComposeElements = addedNodes.some(node => {
            console.log("Mutation observer 2")
            return node.nodeType === Node.ELEMENT_NODE && (
                node.matches('.aDh, .btC, [role="dialog"]') ||
                node.querySelector('.aDh, .btC, [role="dialog"]')
            );
        });
        if (hasComposeElements) {
            console.log("Compose Window Detected")
            setTimeout(injectButton, 500)
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
})