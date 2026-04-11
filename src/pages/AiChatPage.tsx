import { useMemo, useState } from "react";
import { sendAiChatMessage } from "../services/aiChatService";
import type { ChatTurn } from "../types/aiChat";
import { getCurrentBusiness} from "../utils/businessSession";
//import { getCurrentBusiness } from "../services/businessStorage";


export default function AiChatPage() {
  const currentBusiness = getCurrentBusiness();

  const initialMessages = useMemo<ChatTurn[]>(
    () => [
      {
        role: "assistant",
        content: currentBusiness?.businessName
          ? `Hi, I'm FinIntel AI. Ask me about ${currentBusiness.businessName}'s spending trends, risks, merchants, or recent insights.`
          : "Hi, I'm FinIntel AI. Ask me about spending trends, risks, merchants, or recent insights.",
      },
    ],
    [currentBusiness?.businessName]
  );

  const [messages, setMessages] = useState<ChatTurn[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const trimmed = input.trim();

    if (!trimmed || loading) {
      return;
    }

    const nextMessages: ChatTurn[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const result = await sendAiChatMessage(trimmed, nextMessages);

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: result.reply || "I couldn't generate a response.",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function applySuggestedPrompt(prompt: string) {
    setInput(prompt);
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>FinIntel AI Chat</h1>
        <div style={{ color: "#666", marginTop: 6 }}>
          {currentBusiness?.businessName
            ? `Business: ${currentBusiness.businessName}`
            : "No business selected"}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          background: "#fff",
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  message.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "12px 14px",
                  borderRadius: 14,
                  background:
                    message.role === "user" ? "#dbeafe" : "#f3f4f6",
                  color: "#111827",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ color: "#6b7280", fontStyle: "italic" }}>
              FinIntel AI is thinking...
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: 8,
                color: "#b91c1c",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 10,
                padding: 10,
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", padding: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask FinIntel about this business..."
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              style={{
                flex: 1,
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #d1d5db",
                outline: "none",
              }}
            />

            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                background: "#111827",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Try asking:</div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                "Summarize this business's financial health.",
                "What are my biggest spending risks?",
                "Which merchants look unusual?",
                "What changed in my latest upload?"
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => applySuggestedPrompt(prompt)}
                  style={{
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    borderRadius: 999,
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function AiChatPage() {
//   const currentBusiness = getCurrentBusiness();

//   const initialMessage = useMemo<ChatTurn[]>(
//     () => [
//       {
//         role: "assistant",
//         content: currentBusiness?.businessName
//           ? `Hi, I'm FinIntel AI. Ask me about ${currentBusiness.businessName}'s spending trends, risks, merchants, or recent insights.`
//           : "Hi, I'm FinIntel AI. Ask me about spending trends, risks, merchants, or recent insights.",
//       },
//     ],
//     [currentBusiness?.businessName]
//   );

//   const [messages, setMessages] = useState<ChatTurn[]>(initialMessage);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSend() {
//     const trimmed = input.trim();

//     if (!trimmed || loading) {
//       return;
//     }

//     const nextMessages: ChatTurn[] = [
//       ...messages,
//       { role: "user", content: trimmed },
//     ];

//     setMessages(nextMessages);
//     setInput("");
//     setError(null);
//     setLoading(true);

//     try {
//       const response = await sendAiChatMessage(trimmed, nextMessages);

//       setMessages([
//         ...nextMessages,
//         {
//           role: "assistant",
//           content: response.reply,
//         },
//       ]);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
//       <div style={{ marginBottom: 16 }}>
//         <h1 style={{ margin: 0 }}>AI Chat</h1>
//         <div style={{ color: "#666", marginTop: 6 }}>
//           {currentBusiness?.businessName
//             ? `Business: ${currentBusiness.businessName}`
//             : "No business selected"}
//         </div>
//       </div>

//       <div
//         style={{
//           border: "1px solid #e5e7eb",
//           borderRadius: 16,
//           background: "#ffffff",
//           minHeight: 480,
//           padding: 16,
//           boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <div style={{ flex: 1, overflowY: "auto", paddingBottom: 12 }}>
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               style={{
//                 display: "flex",
//                 justifyContent:
//                   message.role === "user" ? "flex-end" : "flex-start",
//                 marginBottom: 12,
//               }}
//             >
//               <div
//                 style={{
//                   maxWidth: "75%",
//                   padding: "12px 14px",
//                   borderRadius: 14,
//                   background:
//                     message.role === "user" ? "#dbeafe" : "#f3f4f6",
//                   color: "#111827",
//                   whiteSpace: "pre-wrap",
//                   lineHeight: 1.5,
//                 }}
//               >
//                 {message.content}
//               </div>
//             </div>
//           ))}

//           {loading && (
//             <div style={{ color: "#6b7280", fontStyle: "italic" }}>
//               FinIntel AI is thinking...
//             </div>
//           )}

//           {error && (
//             <div
//               style={{
//                 marginTop: 8,
//                 color: "#b91c1c",
//                 background: "#fef2f2",
//                 border: "1px solid #fecaca",
//                 borderRadius: 10,
//                 padding: 10,
//               }}
//             >
//               {error}
//             </div>
//           )}
//         </div>

//         <div
//           style={{
//             borderTop: "1px solid #e5e7eb",
//             paddingTop: 12,
//             display: "flex",
//             gap: 8,
//           }}
//         >
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask FinIntel about this business..."
//             disabled={loading}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handleSend();
//               }
//             }}
//             style={{
//               flex: 1,
//               padding: "12px 14px",
//               borderRadius: 12,
//               border: "1px solid #d1d5db",
//               outline: "none",
//             }}
//           />

//           <button
//             onClick={handleSend}
//             disabled={loading || !input.trim()}
//             style={{
//               padding: "12px 18px",
//               borderRadius: 12,
//               border: "none",
//               background: "#111827",
//               color: "#ffffff",
//               cursor: loading ? "not-allowed" : "pointer",
//               opacity: loading || !input.trim() ? 0.6 : 1,
//             }}
//           >
//             Send
//           </button>
//         </div>
//       </div>

//       <div style={{ marginTop: 16 }}>
//         <div style={{ fontWeight: 600, marginBottom: 8 }}>Try asking:</div>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//           {[
//             "Summarize this business’s financial health.",
//             "What are the top spending risks?",
//             "Which merchants look unusual?",
//             "What changed in the latest upload?",
//           ].map((prompt) => (
//             <button
//               key={prompt}
//               type="button"
//               onClick={() => setInput(prompt)}
//               style={{
//                 border: "1px solid #d1d5db",
//                 background: "#fff",
//                 borderRadius: 999,
//                 padding: "8px 12px",
//                 cursor: "pointer",
//               }}
//             >
//               {prompt}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }