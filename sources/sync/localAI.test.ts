import { describe, it, expect, beforeEach } from 'vitest';
import {
    validateLocalAIConfig,
    getRecommendedModel,
    formatModelSize,
    isModelSuitable,
    DEFAULT_LOCAL_AI_CONFIG,
    SUPPORTED_MODELS,
    type LocalAIConfig,
} from './localAI';

describe('Local AI Configuration', () => {
    describe('validateLocalAIConfig', () => {
        it('should validate a valid configuration', () => {
            const config: Partial<LocalAIConfig> = {
                endpoint: 'http://localhost:11434',
                contextSize: 4096,
                temperature: 0.7,
                threads: 4,
            };
            
            const result = validateLocalAIConfig(config);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        
        it('should reject invalid endpoint URLs', () => {
            const config: Partial<LocalAIConfig> = {
                endpoint: 'not-a-valid-url',
            };
            
            const result = validateLocalAIConfig(config);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Invalid endpoint URL');
        });
        
        it('should reject context size below minimum', () => {
            const config: Partial<LocalAIConfig> = {
                contextSize: 256,
            };
            
            const result = validateLocalAIConfig(config);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Context size must be between 512 and 32768');
        });
        
        it('should reject context size above maximum', () => {
            const config: Partial<LocalAIConfig> = {
                contextSize: 65536,
            };
            
            const result = validateLocalAIConfig(config);
            expect(result.valid).toBe(false);
        });
        
        it('should reject temperature below 0', () => {
            const config: Partial<LocalAIConfig> = {
                temperature: -0.5,
            };
            
            const result = validateLocalAIConfig(config);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Temperature must be between 0 and 2');
        });
        
        it('should reject temperature above 2', () => {
            const config: Partial<LocalAIConfig> = {
                temperature: 2.5,
            };
            
            const result = validateLocalAIConfig(config);
            expect(result.valid).toBe(false);
        });
        
        it('should reject invalid thread count', () => {
            const config: Partial<LocalAIConfig> = {
                threads: 0,
            };
            
            const result = validateLocalAIConfig(config);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Threads must be at least 1');
        });
        
        it('should accept edge case valid values', () => {
            const config: Partial<LocalAIConfig> = {
                contextSize: 512, // minimum
                temperature: 0, // minimum
                threads: 1, // minimum
            };
            
            const result = validateLocalAIConfig(config);
            expect(result.valid).toBe(true);
        });
        
        it('should accept maximum valid values', () => {
            const config: Partial<LocalAIConfig> = {
                contextSize: 32768, // maximum
                temperature: 2, // maximum
            };
            
            const result = validateLocalAIConfig(config);
            expect(result.valid).toBe(true);
        });
    });
    
    describe('getRecommendedModel', () => {
        it('should recommend phi3 for low memory devices', () => {
            const memory = 3 * 1024 ** 3; // 3 GB
            const model = getRecommendedModel(memory);
            expect(model).toBe('phi3');
        });
        
        it('should recommend mistral for medium memory devices', () => {
            const memory = 6 * 1024 ** 3; // 6 GB
            const model = getRecommendedModel(memory);
            expect(model).toBe('mistral');
        });
        
        it('should recommend llama3.2 for high memory devices', () => {
            const memory = 12 * 1024 ** 3; // 12 GB
            const model = getRecommendedModel(memory);
            expect(model).toBe('llama3.2');
        });
        
        it('should recommend llama3.2:70b for very high memory devices', () => {
            const memory = 80 * 1024 ** 3; // 80 GB
            const model = getRecommendedModel(memory);
            expect(model).toBe('llama3.2:70b');
        });
        
        it('should handle edge case of exactly threshold memory', () => {
            const memory = 50 * 1024 ** 3 / 0.7; // Exactly at threshold
            const model = getRecommendedModel(memory);
            expect(model).toBe('llama3.2:70b');
        });
    });
    
    describe('formatModelSize', () => {
        it('should format bytes to MB when less than 1 GB', () => {
            const size = 512 * 1024 ** 2; // 512 MB
            expect(formatModelSize(size)).toBe('512 MB');
        });
        
        it('should format bytes to GB when 1 GB or more', () => {
            const size = 3.8 * 1024 ** 3; // 3.8 GB
            expect(formatModelSize(size)).toBe('3.8 GB');
        });
        
        it('should round MB values', () => {
            const size = 512.7 * 1024 ** 2; // 512.7 MB
            expect(formatModelSize(size)).toBe('513 MB');
        });
        
        it('should handle zero bytes', () => {
            expect(formatModelSize(0)).toBe('0 MB');
        });
        
        it('should handle very large sizes', () => {
            const size = 100 * 1024 ** 3; // 100 GB
            expect(formatModelSize(size)).toBe('100.0 GB');
        });
    });
    
    describe('isModelSuitable', () => {
        it('should return true when model fits in available memory', () => {
            const availableMemory = 16 * 1024 ** 3; // 16 GB
            const suitable = isModelSuitable('llama3.2', availableMemory);
            expect(suitable).toBe(true);
        });
        
        it('should return false when model is too large', () => {
            const availableMemory = 4 * 1024 ** 3; // 4 GB
            const suitable = isModelSuitable('llama3.2:70b', availableMemory);
            expect(suitable).toBe(false);
        });
        
        it('should return false for unknown models', () => {
            const availableMemory = 16 * 1024 ** 3; // 16 GB
            const suitable = isModelSuitable('unknown-model', availableMemory);
            expect(suitable).toBe(false);
        });
        
        it('should respect 70% memory threshold', () => {
            const modelSize = SUPPORTED_MODELS['phi3'].size;
            const exactMemory = modelSize / 0.7; // Exactly at threshold
            
            const suitable = isModelSuitable('phi3', exactMemory);
            expect(suitable).toBe(true);
        });
        
        it('should handle edge case just below threshold', () => {
            const modelSize = SUPPORTED_MODELS['phi3'].size;
            const slightlyLess = (modelSize / 0.7) - 1; // Just below threshold
            
            const suitable = isModelSuitable('phi3', slightlyLess);
            expect(suitable).toBe(false);
        });
    });
    
    describe('DEFAULT_LOCAL_AI_CONFIG', () => {
        it('should have sensible defaults', () => {
            expect(DEFAULT_LOCAL_AI_CONFIG.enabled).toBe(false);
            expect(DEFAULT_LOCAL_AI_CONFIG.provider).toBe('ollama');
            expect(DEFAULT_LOCAL_AI_CONFIG.endpoint).toBe('http://localhost:11434');
            expect(DEFAULT_LOCAL_AI_CONFIG.model).toBe('llama3.2');
        });
        
        it('should pass validation', () => {
            const result = validateLocalAIConfig(DEFAULT_LOCAL_AI_CONFIG);
            expect(result.valid).toBe(true);
        });
    });
    
    describe('SUPPORTED_MODELS', () => {
        it('should have valid model definitions', () => {
            Object.entries(SUPPORTED_MODELS).forEach(([key, model]) => {
                expect(model.name).toBeTruthy();
                expect(model.size).toBeGreaterThan(0);
                expect(model.capabilities).toBeInstanceOf(Array);
                expect(model.capabilities.length).toBeGreaterThan(0);
            });
        });
        
        it('should include common models', () => {
            expect(SUPPORTED_MODELS['llama3.2']).toBeDefined();
            expect(SUPPORTED_MODELS['codellama']).toBeDefined();
            expect(SUPPORTED_MODELS['mistral']).toBeDefined();
            expect(SUPPORTED_MODELS['phi3']).toBeDefined();
        });
    });
});
