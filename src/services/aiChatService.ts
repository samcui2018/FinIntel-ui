import { apiFetch } from "./apiClient";
//import { getCurrentBusiness } from "./businessStorage";
import { getCurrentBusiness} from "../utils/businessSession";
import type { AiChatRequest, AiChatResponse, ChatTurn } from "../types/aiChat";

export async function sendAiChatMessage(
  message: string,
  history: ChatTurn[]
): Promise<AiChatResponse> {
  const business = getCurrentBusiness();
  const businessId = business?.businessId;

  if (!businessId) {
    throw new Error("No business selected.");
  }

  const payload: AiChatRequest = {
    message,
    history,
  };

  const response = await apiFetch(`/businesses/${businessId}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to send AI chat message.");
  }

  return (await response.json()) as AiChatResponse;
}