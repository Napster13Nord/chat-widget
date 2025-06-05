// Interactive Chat Widget for n8n - Version 3 with Anna Avatar
(function() {
    // Initialize widget only once
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Anna's avatar URL
    const ANNA_AVATAR_URL = 'https://thriveflows.com/wp-content/uploads/2025/06/Anna-Avatar.jpg';

    // Load font resource - using Poppins for a fresh look
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    // Apply widget styles with Anna avatar support
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #7586D2);
            --chat-color-secondary: var(--chat-widget-secondary, #6476C2);
            --chat-color-tertiary: var(--chat-widget-tertiary, #5366B2);
            --chat-color-light: var(--chat-widget-light, #E6E9F7);
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #1f2937);
            --chat-color-text-light: var(--chat-widget-text-light, #6b7280);
            --chat-color-border: var(--chat-widget-border, #e5e7eb);
            --chat-shadow-sm: 0 1px 3px rgba(117, 134, 210, 0.1);
            --chat-shadow-md: 0 4px 6px rgba(117, 134, 210, 0.15);
            --chat-shadow-lg: 0 10px 15px rgba(117, 134, 210, 0.2);
            --chat-radius-sm: 8px;
            --chat-radius-md: 12px;
            --chat-radius-lg: 20px;
            --chat-radius-full: 9999px;
            --chat-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Poppins', sans-serif;
            letter-spacing: 0.3px;
        }

        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            z-index: 1000;
            width: 380px;
            height: 520px;
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            border: 1px solid var(--chat-color-light);
            overflow: hidden;
            display: none;
            flex-direction: column;
            transition: var(--chat-transition);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }

        .chat-assist-widget .chat-window.right-side {
            right: 20px;
        }

        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* Responsive styles for mobile devices */
        @media (max-width: 480px) {
            .chat-assist-widget .chat-window {
                width: calc(100% - 32px);
                height: calc(100% - 120px);
                bottom: 80px;
                left: 16px;
                right: 16px;
                max-height: 580px;
            }
        }

        .chat-assist-widget .chat-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            position: relative;
        }

        .chat-assist-widget .chat-header-logo {
            width: 32px;
            height: 32px;
            border-radius: var(--chat-radius-sm);
            object-fit: contain;
            background: white;
            padding: 4px;
        }

        .chat-assist-widget .chat-header-title {
            font-size: 16px;
            font-weight: 600;
            color: white;
        }

        .chat-assist-widget .chat-close-btn {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--chat-transition);
            font-size: 18px;
            border-radius: var(--chat-radius-full);
            width: 28px;
            height: 28px;
        }

        .chat-assist-widget .chat-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-50%) scale(1.1);
        }

        .chat-assist-widget .chat-welcome {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 24px;
            text-align: center;
            width: 100%;
            max-width: 320px;
        }

        .chat-assist-widget .chat-welcome-title {
            font-size: 22px;
            font-weight: 700;
            color: var(--chat-color-text);
            margin-bottom: 24px;
            line-height: 1.3;
            letter-spacing: 0;
        }

        .chat-assist-widget .chat-start-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 14px 20px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-size: 15px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            margin-bottom: 16px;
            box-shadow: var(--chat-shadow-md);
            letter-spacing: inherit;
        }

        .chat-assist-widget .chat-start-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .chat-response-time {
            font-size: 14px;
            color: var(--chat-color-text-light);
            margin: 0;
        }

        .chat-assist-widget .chat-body {
            display: none;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }

        .chat-assist-widget .chat-body.active {
            display: flex;
        }

        .chat-assist-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: calc(100% - 70px);
        }

        /* Bot message container with avatar */
        .chat-assist-widget .bot-message-container {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            align-self: flex-start;
            max-width: 85%;
        }

        .chat-assist-widget .bot-avatar {
            width: 36px;
            height: 36px;
            border-radius: var(--chat-radius-full);
            object-fit: cover;
            flex-shrink: 0;
            border: 2px solid var(--chat-color-light);
            box-shadow: var(--chat-shadow-sm);
        }

        @media (max-width: 480px) {
            .chat-assist-widget .bot-avatar {
                width: 32px;
                height: 32px;
            }
            .chat-assist-widget .bot-message-container {
                max-width: 90%;
            }
        }

        .chat-assist-widget .chat-bubble {
            padding: 14px 18px;
            border-radius: var(--chat-radius-md);
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            white-space: pre-line;
        }

        @media (max-width: 480px) {
            .chat-assist-widget .chat-bubble {
                padding: 12px 16px;
                font-size: 14px;
            }
        }

        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
            max-width: 85%;
        }

        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white;
            color: var(--chat-color-text);
            border-bottom-left-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid var(--chat-color-light);
            margin: 0; /* Remove default margin since it's in container */
        }

        /* Typing animation with avatar */
        .chat-assist-widget .typing-container {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            align-self: flex-start;
        }

        .chat-assist-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 14px 18px;
            background: white;
            border-radius: var(--chat-radius-md);
            border-bottom-left-radius: 4px;
            max-width: 80px;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid var(--chat-color-light);
        }

        .chat-assist-widget .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--chat-color-primary);
            border-radius: var(--chat-radius-full);
            opacity: 0.7;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }

        .chat-assist-widget .typing-dot:nth-child(1) {
            animation-delay: 0s;
        }

        .chat-assist-widget .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .chat-assist-widget .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typingAnimation {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-4px);
            }
        }

        .chat-assist-widget .chat-controls {
            padding: 16px;
            background: var(--chat-color-surface);
            border-top: 1px solid var(--chat-color-light);
            display: flex;
            gap: 10px;
            min-height: 70px;
            flex-shrink: 0;
            position: relative;
            z-index: 2;
        }

        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 14px 16px;
            border: 1px solid var(--chat-color-light);
            border-radius: var(--chat-radius-md);
            background: var(--chat-color-surface);
            color: var(--chat-color-text);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            max-height: 120px;
            min-height: 48px;
            transition: var(--chat-transition);
        }

        .chat-assist-widget .chat-textarea:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .chat-assist-widget .chat-submit {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            width: 48px;
            height: 48px;
            cursor: pointer;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: var(--chat-shadow-sm);
        }

        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            width: 56px;
            height: 56px;
            border-radius: var(--chat-radius-full);
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: var(--chat-shadow-md);
            z-index: 999;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            right: 20px;
        }

        .chat-assist-widget .user-registration {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 24px;
            text-align: center;
            width: 100%;
            max-width: 320px;
            display: none;
        }

        .chat-assist-widget .user-registration.active {
            display: block;
        }

        .chat-assist-widget .registration-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--chat-color-text);
            margin-bottom: 16px;
            line-height: 1.3;
        }

        .chat-assist-widget .registration-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
        }

        .chat-assist-widget .form-field {
            display: flex;
            flex-direction: column;
            gap: 4px;
            text-align: left;
        }

        .chat-assist-widget .form-label {
            font-size: 14px;
            font-weight: 500;
            color: var(--chat-color-text);
        }

        .chat-assist-widget .form-input {
            padding: 12px 14px;
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            font-family: inherit;
            font-size: 14px;
            transition: var(--chat-transition);
        }

        .chat-assist-widget .form-input:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .chat-assist-widget .form-input.error {
            border-color: #ef4444;
        }

        .chat-assist-widget .error-text {
            font-size: 12px;
            color: #ef4444;
            margin-top: 2px;
        }

        .chat-assist-widget .submit-registration {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 14px 20px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-size: 15px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            box-shadow: var(--chat-shadow-md);
        }

        .chat-assist-widget .suggested-questions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin: 12px 0;
            align-self: flex-start;
            max-width: 85%;
        }

        .chat-assist-widget .suggested-question-btn {
            background: #f3f4f6;
            border: 1px solid var(--chat-color-light);
            border-radius: var(--chat-radius-md);
            padding: 10px 14px;
            text-align: left;
            font-size: 13px;
            color: var(--chat-color-text);
            cursor: pointer;
            transition: var(--chat-transition);
            font-family: inherit;
            line-height: 1.4;
        }

        .chat-assist-widget .chat-link {
            color: var(--chat-color-primary);
            text-decoration: underline;
            word-break: break-all;
            transition: var(--chat-transition);
        }
    `;
    document.head.appendChild(widgetStyles);

    // Default translations
    const defaultTranslations = {
        en: {
            welcomeText: 'Hi 👋, how can we help?',
            responseTimeText: 'We typically respond right away',
            startChatText: 'Start chatting',
            registrationTitle: 'Please enter your details to start chatting',
            nameLabel: 'Name',
            namePlaceholder: 'Your name',
            emailLabel: 'Email',
            emailPlaceholder: 'Your email address',
            continueButtonText: 'Continue To Chat',
            messagePlaceholder: 'Type your message here...',
            nameRequired: 'Please enter your name',
            emailRequired: 'Please enter your email',
            emailInvalid: 'Please enter a valid email address',
            connectionError: "Sorry, I couldn't connect to the server. Please try again later.",
            sendError: "Sorry, I couldn't send your message. Please try again."
        },
        pt: {
            welcomeText: 'Olá 👋, como podemos ajudar?',
            responseTimeText: 'Normalmente respondemos na hora',
            startChatText: 'Iniciar Conversa',
            registrationTitle: 'Por favor insira os seus dados para começar a conversar',
            nameLabel: 'Nome',
            namePlaceholder: 'O seu nome',
            emailLabel: 'Email',
            emailPlaceholder: 'O seu endereço de email',
            continueButtonText: 'Continuar Para o Chat',
            messagePlaceholder: 'Digite a sua mensagem aqui...',
            nameRequired: 'Por favor insira o seu nome',
            emailRequired: 'Por favor insira o seu email',
            emailInvalid: 'Por favor insira um endereço de email válido',
            connectionError: "Desculpe, não consegui conectar ao servidor. Tente novamente mais tarde.",
            sendError: "Desculpe, não consegui enviar a sua mensagem. Tente novamente."
        }
    };

    // Default configuration
    const defaultSettings = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: { text: 'Powered by n8n', link: 'https://n8n.partnerlinks.io/fabimarkl' }
        },
        style: {
            primaryColor: '#7586D2',
            secondaryColor: '#6476C2',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1f2937'
        },
        suggestedQuestions: [],
        language: 'en',
        translations: defaultTranslations
    };

    // Detect language
    function detectLanguage() {
        if (window.ChatWidgetLang && window.ChatWidgetLang.lang) {
            return window.ChatWidgetLang.lang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
        }
        if (document.documentElement.lang) {
            return document.documentElement.lang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
        }
        const url = window.location.href;
        if (url.includes('/pt/') || url.includes('/pt-pt/') || url.includes('lang=pt')) {
            return 'pt';
        }
        return 'en';
    }

    const currentLanguage = detectLanguage();
    const settings = window.ChatWidgetConfig ? 
        {
            ...defaultSettings,
            ...window.ChatWidgetConfig,
            language: currentLanguage,
            translations: { ...defaultTranslations, ...window.ChatWidgetConfig.translations }
        } : { ...defaultSettings, language: currentLanguage };

    const t = settings.translations[settings.language] || settings.translations.en;

    let conversationId = '';
    let isWaitingForResponse = false;

    // Create widget DOM structure
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    
    // Apply custom colors
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);

    // Create chat panel
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window right-side';
    
    const welcomeScreenHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}">
            <span class="chat-header-title">${settings.branding.name}</span>
            <button class="chat-close-btn">×</button>
        </div>
        <div class="chat-welcome">
            <h2 class="chat-welcome-title">${settings.branding.welcomeText || t.welcomeText}</h2>
            <button class="chat-start-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                ${t.startChatText}
            </button>
            <p class="chat-response-time">${settings.branding.responseTimeText || t.responseTimeText}</p>
        </div>
        <div class="user-registration">
            <h2 class="registration-title">${t.registrationTitle}</h2>
            <form class="registration-form">
                <div class="form-field">
                    <label class="form-label">${t.nameLabel}</label>
                    <input type="text" id="chat-user-name" class="form-input" placeholder="${t.namePlaceholder}" required>
                    <div class="error-text" id="name-error"></div>
                </div>
                <div class="form-field">
                    <label class="form-label">${t.emailLabel}</label>
                    <input type="email" id="chat-user-email" class="form-input" placeholder="${t.emailPlaceholder}" required>
                    <div class="error-text" id="email-error"></div>
                </div>
                <button type="submit" class="submit-registration">${t.continueButtonText}</button>
            </form>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="${t.messagePlaceholder}" rows="1"></textarea>
                <button class="chat-submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2L11 13"></path>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    chatWindow.innerHTML = welcomeScreenHTML + chatInterfaceHTML;
    
    const launchButton = document.createElement('button');
    launchButton.className = 'chat-launcher right-side';
    launchButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
        </svg>`;
    
    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // Get DOM elements
    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');
    const registrationForm = chatWindow.querySelector('.registration-form');
    const userRegistration = chatWindow.querySelector('.user-registration');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const nameInput = chatWindow.querySelector('#chat-user-name');
    const emailInput = chatWindow.querySelector('#chat-user-email');
    const nameError = chatWindow.querySelector('#name-error');
    const emailError = chatWindow.querySelector('#email-error');

    function createSessionId() {
        return crypto.randomUUID();
    }

    // Create typing indicator with Anna's avatar
    function createTypingIndicator() {
        const container = document.createElement('div');
        container.className = 'typing-container';
        
        const avatar = document.createElement('img');
        avatar.className = 'bot-avatar';
        avatar.src = ANNA_AVATAR_URL;
        avatar.alt = 'Anna';
        
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        container.appendChild(avatar);
        container.appendChild(indicator);
        return container;
    }

    // Create bot message with Anna's avatar
    function createBotMessage(messageText) {
        const container = document.createElement('div');
        container.className = 'bot-message-container';
        
        const avatar = document.createElement('img');
        avatar.className = 'bot-avatar';
        avatar.src = ANNA_AVATAR_URL;
        avatar.alt = 'Anna';
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble bot-bubble';
        bubble.innerHTML = linkifyText(messageText);
        
        container.appendChild(avatar);
        container.appendChild(bubble);
        return container;
    }

    function linkifyText(text) {
        const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        return text.replace(urlPattern, function(url) {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`;
        });
    }

    function showRegistrationForm() {
        chatWelcome.style.display = 'none';
        userRegistration.classList.add('active');
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function handleRegistration(event) {
        event.preventDefault();
        
        nameError.textContent = '';
        emailError.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        let isValid = true;
        
        if (!name) {
            nameError.textContent = t.nameRequired;
            nameInput.classList.add('error');
            isValid = false;
        }
        
        if (!email) {
            emailError.textContent = t.emailRequired;
            emailInput.classList.add('error');
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = t.emailInvalid;
            emailInput.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        conversationId = createSessionId();
        
        const sessionData = [{
            action: "loadPreviousSession",
            sessionId: conversationId,
            route: settings.webhook.route,
            metadata: { userId: email, userName: name, language: settings.language }
        }];

        try {
            userRegistration.classList.remove('active');
            chatBody.classList.add('active');
            
            const typingIndicator = createTypingIndicator();
            messagesContainer.appendChild(typingIndicator);
            
            const sessionResponse = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData)
            });
            
            const userInfoData = {
                action: "sendMessage",
                sessionId: conversationId,
                route: settings.webhook.route,
                chatInput: `Name: ${name}\nEmail: ${email}`,
                metadata: { userId: email, userName: name, language: settings.language, isUserInfo: true }
            };
            
            const userInfoResponse = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userInfoData)
            });
            
            const userInfoResponseData = await userInfoResponse.json();
            messagesContainer.removeChild(typingIndicator);
            
            const messageText = Array.isArray(userInfoResponseData) ? 
                userInfoResponseData[0].output : userInfoResponseData.output;
            const botMessage = createBotMessage(messageText);
            messagesContainer.appendChild(botMessage);
            
            if (settings.suggestedQuestions && Array.isArray(settings.suggestedQuestions) && settings.suggestedQuestions.length > 0) {
                const suggestedQuestionsContainer = document.createElement('div');
                suggestedQuestionsContainer.className = 'suggested-questions';
                
                settings.suggestedQuestions.forEach(question => {
                    const questionButton = document.createElement('button');
                    questionButton.className = 'suggested-question-btn';
                    questionButton.textContent = question;
                    questionButton.addEventListener('click', () => {
                        submitMessage(question);
                        if (suggestedQuestionsContainer.parentNode) {
                            suggestedQuestionsContainer.parentNode.removeChild(suggestedQuestionsContainer);
                        }
                    });
                    suggestedQuestionsContainer.appendChild(questionButton);
                });
                
                messagesContainer.appendChild(suggestedQuestionsContainer);
            }
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Registration error:', error);
            const indicator = messagesContainer.querySelector('.typing-container');
            if (indicator) messagesContainer.removeChild(indicator);
            
            const errorMessage = createBotMessage(t.connectionError);
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async function submitMessage(messageText) {
        if (isWaitingForResponse) return;
        isWaitingForResponse = true;
        
        const email = nameInput ? nameInput.value.trim() : "";
        const name = emailInput ? emailInput.value.trim() : "";
        
        const requestData = {
            action: "sendMessage",
            sessionId: conversationId,
            route: settings.webhook.route,
            chatInput: messageText,
            metadata: { userId: email, userName: name, language: settings.language }
        };

        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble user-bubble';
        userMessage.textContent = messageText;
        messagesContainer.appendChild(userMessage);
        
        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            
            const responseData = await response.json();
            messagesContainer.removeChild(typingIndicator);
            
            const responseText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            const botMessage = createBotMessage(responseText);
            messagesContainer.appendChild(botMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Message submission error:', error);
            messagesContainer.removeChild(typingIndicator);
            
            const errorMessage = createBotMessage(t.sendError);
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } finally {
            isWaitingForResponse = false;
        }
    }

    function autoResizeTextarea() {
        messageTextarea.style.height = 'auto';
        messageTextarea.style.height = (messageTextarea.scrollHeight > 120 ? 120 : messageTextarea.scrollHeight) + 'px';
    }

    // Event listeners
    startChatButton.addEventListener('click', showRegistrationForm);
    registrationForm.addEventListener('submit', handleRegistration);
    
    sendButton.addEventListener('click', () => {
        const messageText = messageTextarea.value.trim();
        if (messageText && !isWaitingForResponse) {
            submitMessage(messageText);
            messageTextarea.value = '';
            messageTextarea.style.height = 'auto';
        }
    });
    
    messageTextarea.addEventListener('input', autoResizeTextarea);
    messageTextarea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const messageText = messageTextarea.value.trim();
            if (messageText && !isWaitingForResponse) {
                submitMessage(messageText);
                messageTextarea.value = '';
                messageTextarea.style.height = 'auto';
            }
        }
    });
    
    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
    });

    const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
        });
    });
})(); 