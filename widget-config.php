<?php
function enqueue_chat_widget_script() {
    // Detecta o idioma atual
    $current_lang = apply_filters('wpml_current_language', null);
    
    // Fallback se WPML não estiver disponível
    if (!$current_lang) {
        $current_lang = get_locale();
    }
    
    $lang = (strpos($current_lang, 'pt') === 0) ? 'pt' : 'en';
    
    // Configuração completa do widget
    $widget_config = [
        'webhook' => [
            'url' => 'https://webhook.wpexperts.pt/webhook/f406671e-c954-4691-b39a-66c90aa2f103/chat',
            'route' => 'general'
        ],
        'branding' => [
            'logo' => 'https://thriveflows.com/wp-content/uploads/2025/04/ThriveFlows-FavIcon.webp',
            'name' => 'ThriveFlows',
            'welcomeText' => ($lang === 'pt') ? 'Olá 👋, como podemos ajudar?' : 'Hi 👋, how can we help?',
            'responseTimeText' => ($lang === 'pt') ? 'Normalmente respondemos na hora' : 'We typically respond right away'
        ],
        'style' => [
            'primaryColor' => '#7586D2',
            'secondaryColor' => '#5f6fb6',
            'position' => 'right',
            'backgroundColor' => '#ffffff',
            'fontColor' => '#1f2937'
        ],
        'language' => $lang
    ];
    
    // Carrega o script via jsDelivr CDN (versão limpa sem erros de sintaxe)
    wp_enqueue_script(
        'chat-widget-script', 
        'https://cdn.jsdelivr.net/gh/Napster13Nord/chat-widget@main/chat-widget-v2.js', 
        [], 
        '20250105-v2', // Versão atualizada
        true
    );
    
    // Passa a configuração para o JavaScript
    wp_localize_script('chat-widget-script', 'ChatWidgetConfig', $widget_config);
    
    // Passa também o idioma separadamente (para compatibilidade e detecção)
    wp_localize_script('chat-widget-script', 'ChatWidgetLang', [
        'lang' => $current_lang
    ]);
}
add_action('wp_enqueue_scripts', 'enqueue_chat_widget_script');

// Para debugging - remover em produção
function debug_chat_widget_lang() {
    if (current_user_can('administrator')) {
        $current_lang = apply_filters('wpml_current_language', null);
        if (!$current_lang) {
            $current_lang = get_locale();
        }
        echo "<!-- Debug: Current language detected: " . $current_lang . " -->";
    }
}
add_action('wp_head', 'debug_chat_widget_lang');
?> 