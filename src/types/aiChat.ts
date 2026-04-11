export type ChatRole = "user" | "assistant";

export type ChatTurn = {
  role: ChatRole;
  content: string;
};

export type AiChatRequest = {
  message: string;
  history?: ChatTurn[];
};

export type AiChatResponse = {
  reply: string;
  suggestedFollowUps: string[];
};