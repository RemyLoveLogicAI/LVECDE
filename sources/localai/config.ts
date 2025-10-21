/**
 * Local AI Configuration Types
 * 
 * This module defines the configuration structure for Local AI integration.
 * It supports multiple AI providers through a unified configuration interface.
 */

export type AIProviderType = 'ollama' | 'lmstudio' | 'localai' | 'openai' | 'custom';

/**
 * Configuration for Ollama provider
 */
export interface OllamaConfig {
    /** Base URL of the Ollama server (e.g., http://localhost:11434) */
    url: string;
    /** Model to use (e.g., codellama:13b, deepseek-coder:6.7b) */
    model: string;
    /** Additional Ollama-specific options */
    options?: {
        temperature?: number;
        top_p?: number;
        top_k?: number;
        repeat_penalty?: number;
        num_predict?: number;
    };
}

/**
 * Configuration for LM Studio provider
 */
export interface LMStudioConfig {
    /** Base URL of the LM Studio server (e.g., http://localhost:1234/v1) */
    url: string;
    /** Model identifier */
    model: string;
    /** Optional API key */
    apiKey?: string;
}

/**
 * Configuration for LocalAI provider
 */
export interface LocalAIProviderConfig {
    /** Base URL of the LocalAI server (e.g., http://localhost:8080/v1) */
    url: string;
    /** Model name configured in LocalAI */
    model: string;
    /** Optional API key */
    apiKey?: string;
}

/**
 * Configuration for OpenAI-compatible providers
 */
export interface OpenAIConfig {
    /** Base URL of the API endpoint */
    baseUrl: string;
    /** API key for authentication */
    apiKey?: string;
    /** Model identifier */
    model: string;
    /** Organization ID (optional) */
    organization?: string;
}

/**
 * Configuration for custom providers
 */
export interface CustomConfig {
    /** Custom server URL */
    url: string;
    /** Model identifier */
    model: string;
    /** Optional API key */
    apiKey?: string;
    /** Custom headers to include in requests */
    headers?: Record<string, string>;
}

/**
 * Main configuration for Local AI integration
 */
export interface LocalAIConfig {
    /** Type of AI provider to use */
    provider: AIProviderType;
    
    /** Provider-specific configurations */
    ollama?: OllamaConfig;
    lmstudio?: LMStudioConfig;
    localai?: LocalAIProviderConfig;
    openai?: OpenAIConfig;
    custom?: CustomConfig;
    
    /** General settings */
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
    /** Maximum number of retry attempts (default: 3) */
    maxRetries?: number;
    
    /** Model settings */
    /** Default model if not specified in provider config */
    defaultModel?: string;
    /** Temperature for generation (0.0-1.0, default: 0.7) */
    temperature?: number;
    /** Maximum tokens to generate (default: 2048) */
    maxTokens?: number;
    /** Context window size in tokens (default: 4096) */
    contextSize?: number;
    
    /** Debug options */
    /** Enable debug logging */
    debug?: boolean;
}

/**
 * Status of a provider
 */
export interface ProviderStatus {
    /** Whether the provider is available */
    available: boolean;
    /** Whether the provider is currently connected */
    connected: boolean;
    /** Last successful connection timestamp */
    lastConnected?: Date;
    /** Last error message if any */
    lastError?: string;
    /** Current model being used */
    currentModel?: string;
}

/**
 * Health check result
 */
export interface HealthStatus {
    /** Overall health status */
    healthy: boolean;
    /** Provider status */
    provider: ProviderStatus;
    /** Response time in milliseconds */
    responseTime: number;
}

/**
 * Information about an available model
 */
export interface ModelInfo {
    /** Model identifier */
    id: string;
    /** Human-readable model name */
    name: string;
    /** Model size in bytes */
    size?: number;
    /** Model family (e.g., llama, codellama, mistral) */
    family?: string;
}

/**
 * Default configuration for Local AI
 */
export const DEFAULT_LOCAL_AI_CONFIG: Partial<LocalAIConfig> = {
    provider: 'ollama',
    timeout: 30000,
    maxRetries: 3,
    temperature: 0.7,
    maxTokens: 2048,
    contextSize: 4096,
    debug: false,
};

/**
 * Load Local AI configuration from environment variables
 */
export function loadLocalAIConfigFromEnv(): Partial<LocalAIConfig> {
    const provider = (process.env.EXPO_PUBLIC_LOCAL_AI_TYPE || 'ollama') as AIProviderType;
    const url = process.env.EXPO_PUBLIC_LOCAL_AI_URL || 'http://localhost:11434';
    const model = process.env.EXPO_PUBLIC_LOCAL_AI_MODEL || 'codellama:13b';
    const apiKey = process.env.EXPO_PUBLIC_LOCAL_AI_API_KEY;
    
    const config: Partial<LocalAIConfig> = {
        provider,
        timeout: process.env.EXPO_PUBLIC_LOCAL_AI_TIMEOUT 
            ? parseInt(process.env.EXPO_PUBLIC_LOCAL_AI_TIMEOUT) 
            : DEFAULT_LOCAL_AI_CONFIG.timeout,
        temperature: process.env.EXPO_PUBLIC_LOCAL_AI_TEMPERATURE
            ? parseFloat(process.env.EXPO_PUBLIC_LOCAL_AI_TEMPERATURE)
            : DEFAULT_LOCAL_AI_CONFIG.temperature,
        maxTokens: process.env.EXPO_PUBLIC_LOCAL_AI_MAX_TOKENS
            ? parseInt(process.env.EXPO_PUBLIC_LOCAL_AI_MAX_TOKENS)
            : DEFAULT_LOCAL_AI_CONFIG.maxTokens,
        contextSize: process.env.EXPO_PUBLIC_LOCAL_AI_CONTEXT_SIZE
            ? parseInt(process.env.EXPO_PUBLIC_LOCAL_AI_CONTEXT_SIZE)
            : DEFAULT_LOCAL_AI_CONFIG.contextSize,
        debug: process.env.EXPO_PUBLIC_LOCAL_AI_DEBUG === '1',
    };
    
    // Provider-specific configuration
    switch (provider) {
        case 'ollama':
            config.ollama = { url, model };
            break;
        case 'lmstudio':
            config.lmstudio = { url, model, apiKey };
            break;
        case 'localai':
            config.localai = { url, model, apiKey };
            break;
        case 'openai':
            config.openai = { baseUrl: url, model, apiKey };
            break;
        case 'custom':
            config.custom = { url, model, apiKey };
            break;
    }
    
    return config;
}

/**
 * Validate a Local AI configuration
 */
export function validateLocalAIConfig(config: LocalAIConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config.provider) {
        errors.push('Provider type is required');
    }
    
    // Validate provider-specific config
    switch (config.provider) {
        case 'ollama':
            if (!config.ollama?.url) errors.push('Ollama URL is required');
            if (!config.ollama?.model) errors.push('Ollama model is required');
            break;
        case 'lmstudio':
            if (!config.lmstudio?.url) errors.push('LM Studio URL is required');
            if (!config.lmstudio?.model) errors.push('LM Studio model is required');
            break;
        case 'localai':
            if (!config.localai?.url) errors.push('LocalAI URL is required');
            if (!config.localai?.model) errors.push('LocalAI model is required');
            break;
        case 'openai':
            if (!config.openai?.baseUrl) errors.push('OpenAI base URL is required');
            if (!config.openai?.model) errors.push('OpenAI model is required');
            break;
        case 'custom':
            if (!config.custom?.url) errors.push('Custom URL is required');
            if (!config.custom?.model) errors.push('Custom model is required');
            break;
    }
    
    // Validate numeric values
    if (config.timeout !== undefined && (config.timeout < 1000 || config.timeout > 600000)) {
        errors.push('Timeout must be between 1000ms and 600000ms');
    }
    
    if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 1)) {
        errors.push('Temperature must be between 0.0 and 1.0');
    }
    
    if (config.maxTokens !== undefined && (config.maxTokens < 1 || config.maxTokens > 100000)) {
        errors.push('Max tokens must be between 1 and 100000');
    }
    
    return {
        valid: errors.length === 0,
        errors,
    };
}
