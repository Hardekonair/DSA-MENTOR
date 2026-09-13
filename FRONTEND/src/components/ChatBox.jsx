import React, { useEffect, useRef, useState } from "react";
import { sendQuestion } from "../middleware/chatMiddleware";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question.trim();
    
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: userQuestion,
    };
    
    const conversationHistory = [...messages, userMessage];
    setMessages(conversationHistory);
    setQuestion("");
    setLoading(true);

    try {
      const answer = await sendQuestion(userQuestion, conversationHistory);

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (text) => {
    setQuestion(text);
    textareaRef.current?.focus();
  };

  const handleNewChat = () => {
    setMessages([]);
    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="h-screen w-full bg-[#121826] text-[#e2e8f0]">

      {/* ================= HEADER ================= */}

      <header className="fixed left-0 right-0 top-0 z-50 flex h-18 items-center justify-between border-b border-[#2d3749] bg-[#1e293b] px-5 sm:px-7">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#7e6fff] to-[#00d4ff] text-lg shadow-lg">
            🤖
          </div>

          <div>
            <h1 className="text-base font-semibold sm:text-lg">
              Code Mentor AI
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Online
            </div>
          </div>

        </div>

        {messages.length > 0 && (
          <button
            onClick={handleNewChat}
            className="rounded-lg border border-[#3a465b] px-3 py-2 text-xs font-medium text-[#94a3b8] transition hover:border-[#7e6fff] hover:text-white"
          >
            + New Chat
          </button>
        )}

      </header>

      {/* ================= SCROLLABLE CONTENT ================= */}

      <main className="chat-scrollbar h-full overflow-y-auto px-4 pb-32.5 pt-22 sm:px-6">

        <div className="mx-auto w-full max-w-4xl">

          {/* ================= WELCOME SECTION ================= */}

          <section className="pb-5">

            {/* Welcome Heading */}

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#7e6fff] to-[#00d4ff] text-xl shadow-lg">
                🤖
              </div>

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Ask a Coding Question
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#94a3b8] sm:text-sm">
                  Your AI-powered Data Structures & Algorithms instructor.
                  Ask questions, solve problems, and understand concepts.
                </p>
              </div>

            </div>

            {/* How To Use */}

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#2d3749] border-l-4 border-l-[#7e6fff] bg-[#1e293b] px-4 py-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7e6fff] text-sm font-bold text-[#121826]">
                i
              </div>

              <div>
                <p className="text-sm font-semibold">
                  How to use
                </p>

                <p className="text-xs leading-5 text-[#94a3b8]">
                  Ask about arrays, linked lists, trees, graphs, dynamic
                  programming, sorting, searching, recursion, complexity, and
                  more.
                </p>
              </div>

            </div>

            {/* Suggestions */}

            <div className="mt-3 grid grid-cols-2 gap-2">

              {[
                "Explain binary search",
                "What is dynamic programming?",
                "Explain Dijkstra's algorithm",
                "Solve Two Sum in C++",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => handleSuggestion(item)}
                  className="group flex items-center gap-2 rounded-lg border border-[#2d3749] bg-[#1e293b] px-3 py-2 text-left text-xs transition hover:border-[#7e6fff] hover:bg-[#7e6fff]/10"
                >
                  <span className="text-[#7e6fff] transition-transform group-hover:translate-x-1">
                    →
                  </span>

                  <span>{item}</span>
                </button>
              ))}

            </div>

          </section>

          {/* ================= DIVIDER ================= */}

          {messages.length > 0 && (
            <div className="mb-5 border-t border-[#2d3749]" />
          )}

          {/* ================= CHAT MESSAGES ================= */}

          <section className="flex flex-col gap-5">

            {messages.map((message) => (

              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >

                <div
                  className={`max-w-[85%] px-4 py-3 sm:max-w-[75%] ${message.role === "user"
                    ? "rounded-2xl rounded-br-md bg-linear-to-br from-[#7e6fff] to-[#6a5af9] text-white"
                    : "rounded-2xl rounded-bl-md border border-[#2d3749] bg-[#1e293b] text-[#e2e8f0]"
                    }`}
                >

                  {/* Sender */}

                  <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium opacity-70">

                    {message.role === "user" ? (
                      "You"
                    ) : (
                      <>
                        <span>🤖</span>
                        Code Mentor AI
                      </>
                    )}

                  </div>

                  {/* Message */}

                  <div className="text-sm leading-6">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ children, className, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");

                          return match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              className="my-4 rounded-xl text-sm"
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="rounded bg-[#0b1120] px-1.5 py-0.5 font-mono text-[#00d4ff]" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>

                </div>

              </div>

            ))}

            {/* Loading */}

            {loading && (
              <div className="flex justify-start">

                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#2d3749] bg-[#1e293b] px-5 py-4">

                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#7e6fff]"></span>

                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#7e6fff] [animation-delay:150ms]"></span>

                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#7e6fff] [animation-delay:300ms]"></span>

                  <span className="ml-2 text-xs text-[#94a3b8]">
                    Thinking...
                  </span>

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </section>

        </div>

      </main>

      {/* ================= FIXED INPUT ================= */}

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2d3749] bg-[#1e293b] px-4 py-3 sm:px-6">

        <div className="mx-auto flex max-w-4xl items-end gap-2.5">

          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask your DSA question..."
            className="chat-input-scrollbar max-h-32 min-h-12 flex-1 resize-none overflow-y-auto rounded-xl border border-[#3a465b] bg-[#121826] px-4 py-3 text-sm text-[#e2e8f0] outline-none placeholder:text-[#64748b] focus:border-[#7e6fff] focus:ring-1 focus:ring-[#7e6fff]/30"
          />

          <button
            onClick={handleSubmit}
            disabled={!question.trim() || loading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7e6fff] to-[#6a5af9] text-lg text-white shadow-[0_4px_15px_rgba(126,111,255,0.3)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ➤
          </button>

        </div>

        <p className="mt-1 text-center text-[10px] text-[#64748b]">
          Enter to send • Shift + Enter for new line
        </p>

      </footer>

      {/* ================= CUSTOM SCROLLBAR ================= */}

      <style>{`
        .chat-scrollbar::-webkit-scrollbar {
          width: 7px;
        }

        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }

        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7e6fff;
        }

        .chat-input-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .chat-input-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-input-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>

    </div>
  );
};

export default ChatBox;