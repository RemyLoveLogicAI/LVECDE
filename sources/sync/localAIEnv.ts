/**
 * Local AI Environment Configuration
 * 
 * Environment variables for configuring Local AI features.
 * These can be set in .env files or passed directly to the app.
 */

export interface LocalAIEnv {
    // Core Local AI settings
    HAPPY_LOCAL_AI_ENABLED?: string;
    HAPPY_LOCAL_AI_PROVIDER?: 'ollama' | 'lmstudio' | 'custom';
    HAPPY_LOCAL_AI_ENDPOINT?: string;
    HAPPY_LOCAL_AI_MODEL?: string;

    // Performance settings
    HAPPY_LOCAL_AI_CONTEXT_SIZE?: string;
    HAPPY_LOCAL_AI_TEMPERATURE?: string;
    HAPPY_LOCAL_AI_THREADS?: string;
    HAPPY_LOCAL_AI_GPU?: string;

    // Multiple endpoints for different use cases
    HAPPY_LOCAL_AI_CODING_ENDPOINT?: string;
    HAPPY_LOCAL_AI_CODING_MODEL?: string;
    HAPPY_LOCAL_AI_DOCS_ENDPOINT?: string;
    HAPPY_LOCAL_AI_DOCS_MODEL?: string;

    // Voice processing
    HAPPY_VOICE_LOCAL?: string;
    HAPPY_VOICE_STT_ENDPOINT?: string;
    HAPPY_VOICE_TTS_ENDPOINT?: string;
}

/**
 * Parse and validate Local AI environment variables
 */
export function parseLocalAIEnv(): {
    enabled: boolean;
    provider: 'ollama' | 'lmstudio' | 'custom';
    endpoint: string;
    model: string;
    contextSize: number;
    temperature: number;
    threads: number;
    gpuEnabled: boolean;
    voiceLocal: boolean;
} {
    const env = process.env as LocalAIEnv;

    return {
        enabled: env.HAPPY_LOCAL_AI_ENABLED === 'true',
        provider: (env.HAPPY_LOCAL_AI_PROVIDER as any) || 'ollama',
        endpoint: env.HAPPY_LOCAL_AI_ENDPOINT || 'http://localhost:11434',
        model: env.HAPPY_LOCAL_AI_MODEL || 'llama3.2',
        contextSize: parseInt(env.HAPPY_LOCAL_AI_CONTEXT_SIZE || '4096', 10),
        temperature: parseFloat(env.HAPPY_LOCAL_AI_TEMPERATURE || '0.7'),
        threads: parseInt(env.HAPPY_LOCAL_AI_THREADS || '4', 10),
        gpuEnabled: env.HAPPY_LOCAL_AI_GPU !== 'false',
        voiceLocal: env.HAPPY_VOICE_LOCAL === 'true',
    };
}

/**
 * Get Local AI configuration from environment
 */
export function getLocalAIConfigFromEnv() {
    const config = parseLocalAIEnv();

    return {
        enabled: config.enabled,
        provider: config.provider,
        endpoint: config.endpoint,
        model: config.model,
        contextSize: config.contextSize,
        temperature: config.temperature,
        threads: config.threads,
        gpuEnabled: config.gpuEnabled,
    };
}

/**
 * Environment variable documentation
 */
export const LOCAL_AI_ENV_DOCS = {
    HAPPY_LOCAL_AI_ENABLED: {
        description: 'Enable Local AI integration',
        type: 'boolean',
        default: 'false',
        example: 'true',
    },
    HAPPY_LOCAL_AI_PROVIDER: {
        description: 'Local AI provider type',
        type: 'string',
        default: 'ollama',
        options: ['ollama', 'lmstudio', 'custom'],
        example: 'ollama',
    },
    HAPPY_LOCAL_AI_ENDPOINT: {
        description: 'Local AI server endpoint URL',
        type: 'string',
        default: 'http://localhost:11434',
        example: 'http://localhost:11434',
    },
    HAPPY_LOCAL_AI_MODEL: {
        description: 'Model name to use for inference',
        type: 'string',
        default: 'llama3.2',
        example: 'codellama',
    },
    HAPPY_LOCAL_AI_CONTEXT_SIZE: {
        description: 'Context window size in tokens',
        type: 'number',
        default: '4096',
        range: '512-32768',
        example: '8192',
    },
    HAPPY_LOCAL_AI_TEMPERATURE: {
        description: 'Model temperature for response randomness',
        type: 'number',
        default: '0.7',
        range: '0.0-2.0',
        example: '0.5',
    },
    HAPPY_LOCAL_AI_THREADS: {
        description: 'Number of CPU threads for inference',
        type: 'number',
        default: '4',
        range: '1-64',
        example: '8',
    },
    HAPPY_LOCAL_AI_GPU: {
        description: 'Enable GPU acceleration',
        type: 'boolean',
        default: 'true',
        example: 'false',
    },
    HAPPY_VOICE_LOCAL: {
        description: 'Use local voice processing instead of cloud',
        type: 'boolean',
        default: 'false',
        example: 'true',
    },
} as const;

/**
 * Generate .env template for Local AI configuration
 */
export function generateEnvTemplate(): string {
    const lines = [
        '# Local AI Configuration',
        '# Copy this section to your .env file and customize as needed',
        '',
    ];

    for (const [key, doc] of Object.entries(LOCAL_AI_ENV_DOCS)) {
        lines.push(`# ${doc.description}`);
        lines.push(`# Type: ${doc.type}${doc.range ? ` (${doc.range})` : ''}`);
        if (doc.options) {
            lines.push(`# Options: ${doc.options.join(', ')}`);
        }
        lines.push(`# Default: ${doc.default}`);
        lines.push(`${key}=${doc.example}`);
        lines.push('');
    }

    return lines.join('\n');
}
