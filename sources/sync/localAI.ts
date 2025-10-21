/**
 * Local AI Configuration and Integration
 * 
 * This module provides configuration and integration for Local AI models
 * including Ollama, LM Studio, and other local inference servers.
 */

export type LocalAIProvider = 'ollama' | 'lmstudio' | 'custom';

export interface LocalAIConfig {
    enabled: boolean;
    provider: LocalAIProvider;
    endpoint: string;
    model: string;
    contextSize?: number;
    temperature?: number;
    threads?: number;
    gpuEnabled?: boolean;
}

export interface LocalAIModel {
    name: string;
    size: number;
    quantization?: string;
    capabilities: string[];
}

export const DEFAULT_LOCAL_AI_CONFIG: LocalAIConfig = {
    enabled: false,
    provider: 'ollama',
    endpoint: 'http://localhost:11434',
    model: 'llama3.2',
    contextSize: 4096,
    temperature: 0.7,
    threads: 4,
    gpuEnabled: true,
};

export const SUPPORTED_MODELS: Record<string, LocalAIModel> = {
    'llama3.2': {
        name: 'Llama 3.2',
        size: 3.8 * 1024 ** 3, // 3.8 GB
        quantization: 'Q4_K_M',
        capabilities: ['code', 'chat', 'reasoning'],
    },
    'llama3.2:70b': {
        name: 'Llama 3.2 70B',
        size: 40 * 1024 ** 3, // 40 GB
        quantization: 'Q4_K_M',
        capabilities: ['code', 'chat', 'reasoning', 'advanced'],
    },
    'codellama': {
        name: 'Code Llama',
        size: 3.8 * 1024 ** 3, // 3.8 GB
        quantization: 'Q4_K_M',
        capabilities: ['code', 'completion', 'debugging'],
    },
    'mistral': {
        name: 'Mistral 7B',
        size: 4.1 * 1024 ** 3, // 4.1 GB
        quantization: 'Q4_K_M',
        capabilities: ['code', 'chat', 'reasoning'],
    },
    'phi3': {
        name: 'Phi-3',
        size: 2.3 * 1024 ** 3, // 2.3 GB
        quantization: 'Q4_K_M',
        capabilities: ['code', 'chat', 'fast'],
    },
};

/**
 * Check if Local AI is available at the configured endpoint
 */
export async function checkLocalAIAvailability(
    endpoint: string = DEFAULT_LOCAL_AI_CONFIG.endpoint
): Promise<boolean> {
    try {
        const response = await fetch(`${endpoint}/api/tags`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return response.ok;
    } catch (error) {
        console.warn('Local AI not available:', error);
        return false;
    }
}

/**
 * List available models on the Local AI server
 */
export async function listLocalAIModels(
    endpoint: string = DEFAULT_LOCAL_AI_CONFIG.endpoint
): Promise<string[]> {
    try {
        const response = await fetch(`${endpoint}/api/tags`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch models');
        }
        
        const data = await response.json();
        return data.models?.map((m: any) => m.name) || [];
    } catch (error) {
        console.error('Failed to list models:', error);
        return [];
    }
}

/**
 * Validate Local AI configuration
 */
export function validateLocalAIConfig(config: Partial<LocalAIConfig>): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    
    if (config.endpoint) {
        try {
            new URL(config.endpoint);
        } catch {
            errors.push('Invalid endpoint URL');
        }
    }
    
    if (config.contextSize && (config.contextSize < 512 || config.contextSize > 32768)) {
        errors.push('Context size must be between 512 and 32768');
    }
    
    if (config.temperature && (config.temperature < 0 || config.temperature > 2)) {
        errors.push('Temperature must be between 0 and 2');
    }
    
    if (config.threads !== undefined && config.threads < 1) {
        errors.push('Threads must be at least 1');
    }
    
    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Get recommended model based on device capabilities
 */
export function getRecommendedModel(
    availableMemory: number // in bytes
): string {
    // Recommend models based on available memory
    // Leave some headroom for the OS and other apps
    const safeMemory = availableMemory * 0.7;
    
    if (safeMemory >= 50 * 1024 ** 3) {
        return 'llama3.2:70b';
    } else if (safeMemory >= 8 * 1024 ** 3) {
        return 'llama3.2';
    } else if (safeMemory >= 4 * 1024 ** 3) {
        return 'mistral';
    } else {
        return 'phi3';
    }
}

/**
 * Format model size for display
 */
export function formatModelSize(bytes: number): string {
    if (bytes < 1024 ** 3) {
        return `${Math.round(bytes / (1024 ** 2))} MB`;
    }
    return `${(bytes / (1024 ** 3)).toFixed(1)} GB`;
}

/**
 * Check if a model is suitable for the device
 */
export function isModelSuitable(
    modelName: string,
    availableMemory: number
): boolean {
    const model = SUPPORTED_MODELS[modelName];
    if (!model) return false;
    
    // Model should use less than or equal to 70% of available memory
    return model.size <= availableMemory * 0.7;
}
