import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Chatbot.css';

const API_URL = 'http://localhost:8080/chatbot';

const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Xin chào! 👋 Tôi là trợ lý AI của garage. Tôi có thể giúp gì cho bạn?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Send message
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputMessage;
        setInputMessage('');
        setIsLoading(true);

        try {
            // Call API
            const response = await axios.post(`${API_URL}/chat`, {
                message: currentInput,
                conversationId: conversationId
            });

            // Add bot response
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: response.data.response,
                timestamp: new Date(response.data.timestamp),
                sources: response.data.sources,
                metadata: response.data.metadata
            };

            setMessages(prev => [...prev, botMessage]);

            // Save conversation ID
            if (!conversationId) {
                setConversationId(response.data.conversationId);
            }

        } catch (error) {
            console.error('Error sending message:', error);

            // Add error message
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                timestamp: new Date(),
                isError: true
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear chat
    const clearChat = () => {
        setMessages([{
            id: 1,
            type: 'bot',
            text: 'Xin chào! 👋 Tôi là trợ lý AI của garage. Tôi có thể giúp gì cho bạn?',
            timestamp: new Date()
        }]);
        setConversationId(null);
    };

    // Quick suggestions
    const quickSuggestions = [
        'Các dịch vụ của garage',
        'Tư vấn sửa chữa xe',
        'Quy trình đặt lịch hẹn',
        'Địa chỉ và thời gian làm việc của garage'
    ];

    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
    };

    // Custom markdown components
    const markdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className="inline-code" {...props}>
                    {children}
                </code>
            );
        },
        p: ({ children }) => <p className="markdown-paragraph">{children}</p>,
        ul: ({ children }) => <ul className="markdown-list">{children}</ul>,
        ol: ({ children }) => <ol className="markdown-ordered-list">{children}</ol>,
        li: ({ children }) => <li className="markdown-list-item">{children}</li>,
        h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
        h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
        h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
        strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
        em: ({ children }) => <em className="markdown-em">{children}</em>,
        blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
        a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="markdown-link">
                {children}
            </a>
        ),
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>🤖 Trợ lý AI Garage</h3>
                <div className="header-actions">
                    <button onClick={clearChat} className="clear-btn" title="Xóa lịch sử">
                        🗑️
                    </button>
                    {onClose && (
                        <button onClick={onClose} className="close-btn" title="Đóng">
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="chatbot-messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.type} ${message.isError ? 'error' : ''}`}
                    >
                        <div className="message-content">
                            {/* Render markdown cho bot messages */}
                            {message.type === 'bot' ? (
                                <ReactMarkdown components={markdownComponents}>
                                    {message.text}
                                </ReactMarkdown>
                            ) : (
                                <p>{message.text}</p>
                            )}

                            {/* Show sources if available */}
                            {message.sources && message.sources.length > 0 && (
                                <div className="message-sources">
                                    <p className="sources-title">📚 Nguồn tham khảo:</p>
                                    {message.sources.map((source, idx) => (
                                        <div key={idx} className="source-item">
                                            <strong>{source.title}</strong>
                                            {source.category && (
                                                <span className="source-category"> ({source.category})</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Show metadata */}
                            {message.metadata && (
                                <div className="message-metadata">
                                    ⏱️ {message.metadata.processingTimeMs}ms •
                                    📄 {message.metadata.documentCount} tài liệu
                                </div>
                            )}
                        </div>

                        <span className="message-time">
                            {message.timestamp.toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                ))}

                {isLoading && (
                    <div className="message bot loading">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length === 1 && (
                <div className="quick-suggestions">
                    <p>💡 Gợi ý câu hỏi:</p>
                    {quickSuggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="suggestion-btn"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            <form onSubmit={sendMessage} className="chatbot-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    disabled={isLoading}
                    autoFocus
                />
                <button type="submit" disabled={isLoading || !inputMessage.trim()}>
                    {isLoading ? '⏳' : '📤'}
                </button>
            </form>
        </div>
    );
};

export default Chatbot;