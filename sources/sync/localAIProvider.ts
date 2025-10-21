/**
 * Local AI Realtime Provider
 * 
 * This module provides integration between Local AI models and the app's
 * realtime voice/chat system.
 */

import type { VoiceSession, VoiceSessionConfig, ConversationStatus } from '../realtime/types';
import type { LocalAIConfig } from './localAI';
import { checkLocalAIAvailability } from './localAI';

export interface LocalAIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface LocalAIGenerateRequest {
    model: string;
    messages: LocalAIMessage[];
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
}

export interface LocalAIGenerateResponse {
    message: {
        role: 'assistant';
        content: string;
    };
    done: boolean;
}

/**
 * Local AI Session implementation
 * Provides compatibility with the existing VoiceSession interface
 */
export class LocalAISession implements VoiceSession {
    private config: LocalAIConfig;
    private sessionId: string | null = null;
    private conversationHistory: LocalAIMessage[] = [];
    private status: ConversationStatus = 'disconnected';
    private abortController: AbortController | null = null;

    constructor(config: LocalAIConfig) {
        this.config = config;
    }

    async startSession(sessionConfig: VoiceSessionConfig): Promise<void> {
        this.sessionId = sessionConfig.sessionId;
        this.status = 'connecting';

        // Check if Local AI is available
        const isAvailable = await checkLocalAIAvailability(this.config.endpoint);
        if (!isAvailable) {
            this.status = 'disconnected';
            throw new Error('Local AI service is not available');
        }

        // Initialize conversation with context if provided
        if (sessionConfig.initialContext) {
            this.conversationHistory.push({
                role: 'system',
                content: sessionConfig.initialContext,
            });
        }

        this.status = 'connected';
        console.log('Local AI session started:', this.sessionId);
    }

    async endSession(): Promise<void> {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }

        this.sessionId = null;
        this.conversationHistory = [];
        this.status = 'disconnected';
        console.log('Local AI session ended');
    }

    sendTextMessage(message: string): void {
        if (this.status !== 'connected') {
            console.warn('Cannot send message: session not connected');
            return;
        }

        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: message,
        });

        // Generate response from Local AI
        this.generateResponse().catch((error) => {
            console.error('Failed to generate response:', error);
        });
    }

    sendContextualUpdate(update: string): void {
        if (this.status !== 'connected') {
            console.warn('Cannot send context update: session not connected');
            return;
        }

        // Add system message for contextual updates
        this.conversationHistory.push({
            role: 'system',
            content: update,
        });

        console.log('Context updated:', update);
    }

    getStatus(): ConversationStatus {
        return this.status;
    }

    getConversationHistory(): LocalAIMessage[] {
        return [...this.conversationHistory];
    }

    private async generateResponse(): Promise<void> {
        this.abortController = new AbortController();

        try {
            const requestBody: LocalAIGenerateRequest = {
                model: this.config.model,
                messages: this.conversationHistory,
                temperature: this.config.temperature,
                stream: false,
            };

            const response = await fetch(`${this.config.endpoint}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                signal: this.abortController.signal,
            });

            if (!response.ok) {
                throw new Error(`Local AI request failed: ${response.statusText}`);
            }

            const data: LocalAIGenerateResponse = await response.json();

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: data.message.content,
            });

            console.log('Response generated:', data.message.content);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Response generation aborted');
            } else {
                console.error('Failed to generate response:', error);
                throw error;
            }
        } finally {
            this.abortController = null;
        }
    }
}

/**
 * Stream response from Local AI
 * Used for real-time streaming responses
 */
export async function* streamLocalAIResponse(
    config: LocalAIConfig,
    messages: LocalAIMessage[]
): AsyncGenerator<string, void, unknown> {
    const requestBody: LocalAIGenerateRequest = {
        model: config.model,
        messages,
        temperature: config.temperature,
        stream: true,
    };

    const response = await fetch(`${config.endpoint}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error(`Local AI request failed: ${response.statusText}`);
    }

    if (!response.body) {
        throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    if (data.message?.content) {
                        yield data.message.content;
                    }
                } catch (parseError) {
                    console.warn('Failed to parse stream chunk:', parseError);
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}

/**
 * Check Local AI model availability
 */
export async function checkLocalAIModel(
    endpoint: string,
    model: string
): Promise<boolean> {
    try {
        const response = await fetch(`${endpoint}/api/tags`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        const models = data.models?.map((m: any) => m.name) || [];
        return models.includes(model);
    } catch (error) {
        console.error('Failed to check model availability:', error);
        return false;
    }
}
