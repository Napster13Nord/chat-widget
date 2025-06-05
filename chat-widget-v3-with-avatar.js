// Interactive Chat Widget for n8n
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

    // Apply widget styles with completely different design approach
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

        .chat-assist-widget .chat-window.left-side {
            left: 20px;
            display: none; /* Hide any left-side positioning */
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
            
            .chat-assist-widget .chat-window.right-side,
            .chat-assist-widget .chat-window.left-side {
                left: 16px;
                right: 16px;
            }
        }
        
        /* Extra small screens */
        @media (max-width: 360px) {
            .chat-assist-widget .chat-window {
                width: calc(100% - 24px);
                left: 12px;
                right: 12px;
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
            overflow: hidden; /* Prevent overflow */
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
            max-height: calc(100% - 70px); /* Ensure messages don't push out controls */
        }

        @media (max-width: 480px) {
            .chat-assist-widget .chat-messages {
                padding: 16px;
            }
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-thumb {
            background-color: rgba(16, 185, 129, 0.3);
            border-radius: var(--chat-radius-full);
        }

        .chat-assist-widget .chat-bubble {
            padding: 14px 18px;
            border-radius: var(--chat-radius-md);
            max-width: 85%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            white-space: pre-line; /* This preserves line breaks */
        }

        @media (max-width: 480px) {
            .chat-assist-widget .chat-bubble {
                padding: 12px 16px;
                font-size: 14px;
                max-width: 90%;
            }
        }

        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
        }

        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white;
            color: var(--chat-color-text);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid var(--chat-color-light);
        }

        /* Bot message container with avatar - ONLY NEW ADDITION */
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

        .chat-assist-widget .bot-message-container .chat-bubble.bot-bubble {
            margin: 0; /* Remove default margin since it's in container */
        }

        /* Typing animation */
        .chat-assist-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 14px 18px;
            background: white;
            border-radius: var(--chat-radius-md);
            border-bottom-left-radius: 4px;
            max-width: 80px;
            align-self: flex-start;
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
            min-height: 70px; /* Ensure controls have minimum height */
            flex-shrink: 0; /* Prevent controls from shrinking */
            position: relative; /* Ensure it stays at the bottom */
            z-index: 2; /* Layer above messages */
        }

        @media (max-width: 480px) {
            .chat-assist-widget .chat-controls {
                padding: 12px;
            }
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

        @media (max-width: 480px) {
            .chat-assist-widget .chat-textarea {
                padding: 12px 14px;
                font-size: 14px;
                min-height: 44px;
            }
        }

        .chat-assist-widget .chat-textarea:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .chat-assist-widget .chat-textarea::placeholder {
            color: var(--chat-color-text-light);
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

        .chat-assist-widget .chat-submit:hover {
            transform: scale(1.05);
            box-shadow: var(--chat-shadow-md);
        }

        .chat-assist-widget .chat-submit svg {
            width: 22px;
            height: 22px;
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
            right: 20px; /* Force right positioning */
            left: auto; /* Ensure no left positioning */
        }

        .chat-assist-widget .chat-launcher.right-side {
            right: 20px;
            left: auto;
        }

        .chat-assist-widget .chat-launcher.left-side {
            display: none !important; /* Completely hide any left-side launcher */
        }

        @media (max-width: 480px) {
            .chat-assist-widget .chat-launcher {
                bottom: 16px;
                width: 52px;
                height: 52px;
                right: 16px; /* Force right positioning on mobile */
                left: auto;
            }
            
            .chat-assist-widget .chat-launcher.right-side {
                right: 16px;
                left: auto;
            }
            
            .chat-assist-widget .chat-launcher.left-side {
                display: none !important;
            }
        }

        .chat-assist-widget .chat-launcher:hover {
            transform: scale(1.05);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .chat-launcher svg {
            width: 24px;
            height: 24px;
        }
        
        .chat-assist-widget .chat-launcher-text {
            font-weight: 600;
            font-size: 15px;
            white-space: nowrap;
        }

        .chat-assist-widget .chat-footer {
            padding: 10px;
            text-align: center;
            background: var(--chat-color-surface);
            border-top: 1px solid var(--chat-color-light);
            display: none;
        }

        .chat-assist-widget .chat-footer-link {
            color: var(--chat-color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: var(--chat-transition);
            font-family: inherit;
            display: none;
        }

        .chat-assist-widget .chat-footer-link:hover {
            opacity: 1;
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

        .chat-assist-widget .suggested-question-btn:hover {
            background: var(--chat-color-light);
            border-color: var(--chat-color-primary);
        }

        .chat-assist-widget .chat-link {
            color: var(--chat-color-primary);
            text-decoration: underline;
            word-break: break-all;
            transition: var(--chat-transition);
            font-weight: 600;
            background: rgba(117, 134, 210, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
            margin: 2px 0;
        }

        .chat-assist-widget .chat-link:hover {
            color: var(--chat-color-secondary);
            text-decoration: underline;
            background: rgba(117, 134, 210, 0.2);
            transform: translateY(-1px);
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
            letter-spacing: 0;
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

        @media (max-width: 480px) {
            .chat-assist-widget .form-input {
                padding: 10px 12px;
            }
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
            letter-spacing: inherit;
        }

        .chat-assist-widget .submit-registration:hover {
            transform: translateY(-2px);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .submit-registration:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        /* Tooltip styles */
        .chat-assist-widget .chat-launcher-tooltip {
            position: absolute;
            bottom: 70px;
            right: 0;
            background: var(--chat-color-text);
            color: white;
            padding: 8px 12px;
            border-radius: var(--chat-radius-md);
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: var(--chat-transition);
            box-shadow: var(--chat-shadow-md);
            z-index: 1001;
        }

        .chat-assist-widget .chat-launcher-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            right: 20px;
            border: 6px solid transparent;
            border-top-color: var(--chat-color-text);
        }

        .chat-assist-widget .chat-launcher:hover .chat-launcher-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        @media (max-width: 480px) {
            .chat-assist-widget .chat-launcher-tooltip {
                bottom: 65px;
                right: -10px;
                font-size: 13px;
                padding: 6px 10px;
            }
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

    // Session tracking
    let conversationId = '';
    let isWaitingForResponse = false;

    // Create widget DOM structure
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    
    // Apply custom colors
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-tertiary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    // Create chat panel
    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window right-side`;
    
    // Create welcome screen with header
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
                    <label class="form-label" for="chat-user-name">${t.nameLabel}</label>
                    <input type="text" id="chat-user-name" class="form-input" placeholder="${t.namePlaceholder}" required>
                    <div class="error-text" id="name-error"></div>
                </div>
                <div class="form-field">
                    <label class="form-label" for="chat-user-email">${t.emailLabel}</label>
                    <input type="email" id="chat-user-email" class="form-input" placeholder="${t.emailPlaceholder}" required>
                    <div class="error-text" id="email-error"></div>
                </div>
                <button type="submit" class="submit-registration">${t.continueButtonText}</button>
            </form>
        </div>
    `;

    // Create chat interface without duplicating the header
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
            <div class="chat-footer">
                <a class="chat-footer-link" href="${settings.branding.poweredBy?.link || '#'}" target="_blank">${settings.branding.poweredBy?.text || ''}</a>
            </div>
        </div>
    `;
    
    chatWindow.innerHTML = welcomeScreenHTML + chatInterfaceHTML;
    
    // Create toggle button - back to original
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher right-side`;
    launchButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <div class="chat-launcher-tooltip">${settings.language === 'pt' ? 'Fale connosco!' : 'Chat with us!'}</div>`;
    
    // Add elements to DOM
    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // Get DOM elements
    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');
    
    // Registration form elements
    const registrationForm = chatWindow.querySelector('.registration-form');
    const userRegistration = chatWindow.querySelector('.user-registration');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const nameInput = chatWindow.querySelector('#chat-user-name');
    const emailInput = chatWindow.querySelector('#chat-user-email');
    const nameError = chatWindow.querySelector('#name-error');
    const emailError = chatWindow.querySelector('#email-error');

    // Helper function to generate unique session ID
    function createSessionId() {
        return crypto.randomUUID();
    }

    // Create typing indicator element - back to original without avatar
    function createTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        return indicator;
    }

    // Create bot message with Anna's avatar - only change is here
    function createBotMessage(messageText) {
        const container = document.createElement('div');
        container.className = 'bot-message-container';
        
        const avatar = document.createElement('img');
        avatar.className = 'bot-avatar';
        avatar.src = ANNA_AVATAR_URL;
        avatar.alt = 'Anna';
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble bot-bubble';
        bubble.innerHTML = processMessageHTML(messageText);
        
        container.appendChild(avatar);
        container.appendChild(bubble);
        return container;
    }

    // Function to sanitize and process HTML from n8n
    function processMessageHTML(text) {
        // First, convert plain URLs to links (for backward compatibility)
        let processedText = linkifyText(text);
        
        // Then allow safe HTML tags from n8n
        // This is safe because we only allow specific tags
        const allowedTags = ['a', 'strong', 'b', 'em', 'i', 'br', 'p', 'span'];
        const tagPattern = new RegExp(`<(\/?)(?:${allowedTags.join('|')})(?:\\s[^>]*)?>`, 'gi');
        
        // Keep allowed tags, remove others
        processedText = processedText.replace(/<[^>]*>/g, function(tag) {
            if (tagPattern.test(tag)) {
                // For anchor tags, ensure they have proper attributes
                if (tag.toLowerCase().includes('<a ')) {
                    if (!tag.includes('target=')) {
                        tag = tag.replace('<a ', '<a target="_blank" rel="noopener noreferrer" ');
                    }
                    if (!tag.includes('class=')) {
                        tag = tag.replace('<a ', '<a class="chat-link" ');
                    } else if (!tag.includes('chat-link')) {
                        tag = tag.replace('class="', 'class="chat-link ');
                    }
                }
                return tag;
            }
            return ''; // Remove disallowed tags
        });
        
        return processedText;
    }

    // Function to convert URLs in text to clickable links (for backward compatibility)
    function linkifyText(text) {
        // Enhanced URL pattern that matches various URL formats
        const urlPattern = /(https?:\/\/[^\s<>"`{}\[\]\\^]+|www\.[^\s<>"`{}\[\]\\^]+\.[a-z]{2,}[^\s<>"`{}\[\]\\^]*)/gim;
        
        return text.replace(urlPattern, function(url) {
            // Skip if already inside HTML tags
            const beforeUrl = text.substring(0, text.indexOf(url));
            const afterUrl = text.substring(text.indexOf(url) + url.length);
            
            // Simple check to avoid double-processing URLs that are already in <a> tags
            if (beforeUrl.lastIndexOf('<a') > beforeUrl.lastIndexOf('</a>')) {
                return url; // URL is already inside an <a> tag
            }
            
            // Clean up URL (remove trailing punctuation that might not be part of URL)
            const cleanUrl = url.replace(/[.,;!?]+$/, '');
            
            // Add protocol if missing
            const href = cleanUrl.startsWith('http') ? cleanUrl : 'https://' + cleanUrl;
            
            // Create a shorter display text for long URLs
            let displayText = cleanUrl;
            if (cleanUrl.length > 50) {
                const domain = cleanUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
                displayText = domain + '/...';
            }
            
            return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="chat-link" title="${cleanUrl}">${displayText}</a>`;
        });
    }

    // Show registration form
    function showRegistrationForm() {
        chatWelcome.style.display = 'none';
        userRegistration.classList.add('active');
    }

    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Handle registration form submission
    async function handleRegistration(event) {
        event.preventDefault();
        
        // Reset error messages
        nameError.textContent = '';
        emailError.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        
        // Get values
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        // Validate
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
        
        // Initialize conversation with user data
        conversationId = createSessionId();
        
        // First, load the session
        const sessionData = [{
            action: "loadPreviousSession",
            sessionId: conversationId,
            route: settings.webhook.route,
            metadata: {
                userId: email,
                userName: name,
                language: settings.language
            }
        }];

        try {
            // Hide registration form, show chat interface
            userRegistration.classList.remove('active');
            chatBody.classList.add('active');
            
            // Show typing indicator
            const typingIndicator = createTypingIndicator();
            messagesContainer.appendChild(typingIndicator);
            
            // Load session
            const sessionResponse = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });
            
            const sessionResponseData = await sessionResponse.json();
            
            // Send user info as first message
            const userInfoMessage = `Name: ${name}\nEmail: ${email}`;
            
            const userInfoData = {
                action: "sendMessage",
                sessionId: conversationId,
                route: settings.webhook.route,
                chatInput: userInfoMessage,
                metadata: {
                    userId: email,
                    userName: name,
                    language: settings.language,
                    isUserInfo: true
                }
            };
            
            // Send user info
            const userInfoResponse = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfoData)
            });
            
            const userInfoResponseData = await userInfoResponse.json();
            
            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);
            
            // Display initial bot message with Anna's avatar
            const messageText = Array.isArray(userInfoResponseData) ? 
                userInfoResponseData[0].output : userInfoResponseData.output;
            const botMessage = createBotMessage(messageText);
            messagesContainer.appendChild(botMessage);
            
            // Add sample questions if configured
            if (settings.suggestedQuestions && Array.isArray(settings.suggestedQuestions) && settings.suggestedQuestions.length > 0) {
                const suggestedQuestionsContainer = document.createElement('div');
                suggestedQuestionsContainer.className = 'suggested-questions';
                
                settings.suggestedQuestions.forEach(question => {
                    const questionButton = document.createElement('button');
                    questionButton.className = 'suggested-question-btn';
                    questionButton.textContent = question;
                    questionButton.addEventListener('click', () => {
                        submitMessage(question);
                        // Remove the suggestions after clicking
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
            
            // Remove typing indicator if it exists
            const indicator = messagesContainer.querySelector('.typing-indicator');
            if (indicator) {
                messagesContainer.removeChild(indicator);
            }
            
            // Show error message with Anna's avatar
            const errorMessage = createBotMessage(t.connectionError);
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Send a message to the webhook
    async function submitMessage(messageText) {
        if (isWaitingForResponse) return;
        
        isWaitingForResponse = true;
        
        // Get user info if available
        const email = nameInput ? nameInput.value.trim() : "";
        const name = emailInput ? emailInput.value.trim() : "";
        
        const requestData = {
            action: "sendMessage",
            sessionId: conversationId,
            route: settings.webhook.route,
            chatInput: messageText,
            metadata: {
                userId: email,
                userName: name,
                language: settings.language
            }
        };

        // Display user message
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble user-bubble';
        userMessage.textContent = messageText;
        messagesContainer.appendChild(userMessage);
        
        // Show typing indicator
        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            const responseData = await response.json();
            
            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);
            
            // Display bot response with Anna's avatar
            const responseText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            const botMessage = createBotMessage(responseText);
            messagesContainer.appendChild(botMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Message submission error:', error);
            
            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);
            
            // Show error message with Anna's avatar
            const errorMessage = createBotMessage(t.sendError);
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } finally {
            isWaitingForResponse = false;
        }
    }

    // Auto-resize textarea as user types
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

    // Close button functionality
    const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
        });
    });
})(); 