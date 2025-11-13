import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LocalAISession, checkLocalAIModel } from './localAIProvider';
import type { LocalAIConfig } from './localAI';

// Mock fetch globally
global.fetch = vi.fn();

describe('Local AI Provider', () => {
    let mockConfig: LocalAIConfig;

    beforeEach(() => {
        mockConfig = {
            enabled: true,
            provider: 'ollama',
            endpoint: 'http://localhost:11434',
            model: 'llama3.2',
            contextSize: 4096,
            temperature: 0.7,
        };

        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('LocalAISession', () => {
        describe('startSession', () => {
            it('should start a session successfully', async () => {
                const mockFetch = vi.fn().mockResolvedValue({
                    ok: true,
                    json: async () => ({ models: [] }),
                });
                global.fetch = mockFetch;

                const session = new LocalAISession(mockConfig);
                await session.startSession({
                    sessionId: 'test-session',
                    initialContext: 'You are a helpful assistant',
                });

                expect(session.getStatus()).toBe('connected');
                expect(mockFetch).toHaveBeenCalledWith(
                    'http://localhost:11434/api/tags',
                    expect.any(Object)
                );
            });

            it('should throw error when Local AI is unavailable', async () => {
                const mockFetch = vi.fn().mockRejectedValue(new Error('Connection refused'));
                global.fetch = mockFetch;

                const session = new LocalAISession(mockConfig);
                await expect(
                    session.startSession({ sessionId: 'test-session' })
                ).rejects.toThrow('Local AI service is not available');

                expect(session.getStatus()).toBe('disconnected');
            });

            it('should initialize conversation history with context', async () => {
                const mockFetch = vi.fn().mockResolvedValue({
                    ok: true,
                    json: async () => ({ models: [] }),
                });
                global.fetch = mockFetch;

                const session = new LocalAISession(mockConfig);
                const initialContext = 'You are a code assistant';
                
                await session.startSession({
                    sessionId: 'test-session',
                    initialContext,
                });

                const history = session.getConversationHistory();
                expect(history).toHaveLength(1);
                expect(history[0]).toEqual({
                    role: 'system',
                    content: initialContext,
                });
            });
        });

        describe('endSession', () => {
            it('should clear session state', async () => {
                const mockFetch = vi.fn().mockResolvedValue({
                    ok: true,
                    json: async () => ({ models: [] }),
                });
                global.fetch = mockFetch;

                const session = new LocalAISession(mockConfig);
                await session.startSession({ sessionId: 'test-session' });

                await session.endSession();

                expect(session.getStatus()).toBe('disconnected');
                expect(session.getConversationHistory()).toHaveLength(0);
            });
        });

        describe('sendTextMessage', () => {
            it('should add message to conversation history', async () => {
                const mockFetch = vi.fn()
                    .mockResolvedValueOnce({
                        ok: true,
                        json: async () => ({ models: [] }),
                    })
                    .mockResolvedValueOnce({
                        ok: true,
                        json: async () => ({
                            message: { role: 'assistant', content: 'Response' },
                            done: true,
                        }),
                    });
                global.fetch = mockFetch;

                const session = new LocalAISession(mockConfig);
                await session.startSession({ sessionId: 'test-session' });

                session.sendTextMessage('Hello');

                // Wait for async processing
                await new Promise(resolve => setTimeout(resolve, 10));

                const history = session.getConversationHistory();
                expect(history.some(msg => msg.content === 'Hello')).toBe(true);
            });

            it('should not send message when disconnected', async () => {
                const session = new LocalAISession(mockConfig);
                
                // Don't start session
                session.sendTextMessage('Hello');

                expect(session.getConversationHistory()).toHaveLength(0);
            });
        });

        describe('sendContextualUpdate', () => {
            it('should add system message to history', async () => {
                const mockFetch = vi.fn().mockResolvedValue({
                    ok: true,
                    json: async () => ({ models: [] }),
                });
                global.fetch = mockFetch;

                const session = new LocalAISession(mockConfig);
                await session.startSession({ sessionId: 'test-session' });

                const update = 'User opened settings.ts';
                session.sendContextualUpdate(update);

                const history = session.getConversationHistory();
                expect(history.some(msg => 
                    msg.role === 'system' && msg.content === update
                )).toBe(true);
            });

            it('should not update context when disconnected', async () => {
                const session = new LocalAISession(mockConfig);
                
                // Don't start session
                session.sendContextualUpdate('Update');

                expect(session.getConversationHistory()).toHaveLength(0);
            });
        });

        describe('getStatus', () => {
            it('should return current status', () => {
                const session = new LocalAISession(mockConfig);
                expect(session.getStatus()).toBe('disconnected');
            });
        });

        describe('getConversationHistory', () => {
            it('should return copy of conversation history', async () => {
                const mockFetch = vi.fn().mockResolvedValue({
                    ok: true,
                    json: async () => ({ models: [] }),
                });
                global.fetch = mockFetch;

                const session = new LocalAISession(mockConfig);
                await session.startSession({
                    sessionId: 'test-session',
                    initialContext: 'Context',
                });

                const history1 = session.getConversationHistory();
                const history2 = session.getConversationHistory();

                expect(history1).not.toBe(history2); // Different instances
                expect(history1).toEqual(history2); // Same content
            });
        });
    });

    describe('checkLocalAIModel', () => {
        it('should return true when model is available', async () => {
            const mockFetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    models: [
                        { name: 'llama3.2' },
                        { name: 'codellama' },
                    ],
                }),
            });
            global.fetch = mockFetch;

            const available = await checkLocalAIModel(
                'http://localhost:11434',
                'llama3.2'
            );

            expect(available).toBe(true);
        });

        it('should return false when model is not available', async () => {
            const mockFetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    models: [{ name: 'codellama' }],
                }),
            });
            global.fetch = mockFetch;

            const available = await checkLocalAIModel(
                'http://localhost:11434',
                'llama3.2'
            );

            expect(available).toBe(false);
        });

        it('should return false on network error', async () => {
            const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
            global.fetch = mockFetch;

            const available = await checkLocalAIModel(
                'http://localhost:11434',
                'llama3.2'
            );

            expect(available).toBe(false);
        });

        it('should return false when API returns error', async () => {
            const mockFetch = vi.fn().mockResolvedValue({
                ok: false,
                statusText: 'Internal Server Error',
            });
            global.fetch = mockFetch;

            const available = await checkLocalAIModel(
                'http://localhost:11434',
                'llama3.2'
            );

            expect(available).toBe(false);
        });

        it('should handle empty model list', async () => {
            const mockFetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ models: [] }),
            });
            global.fetch = mockFetch;

            const available = await checkLocalAIModel(
                'http://localhost:11434',
                'llama3.2'
            );

            expect(available).toBe(false);
        });

        it('should handle malformed response', async () => {
            const mockFetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({}), // No models property
            });
            global.fetch = mockFetch;

            const available = await checkLocalAIModel(
                'http://localhost:11434',
                'llama3.2'
            );

            expect(available).toBe(false);
        });
    });
});
