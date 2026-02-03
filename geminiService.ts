
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { Message, MessageRole, TicketStatus, TicketPriority } from "../types";

const TICKET_FUNCTIONS: FunctionDeclaration[] = [
  {
    name: 'createTicket',
    description: 'Creates a new support ticket for the user.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        subject: {
          type: Type.STRING,
          description: 'A brief summary of the issue.'
        },
        priority: {
          type: Type.STRING,
          enum: ['Low', 'Medium', 'High', 'Urgent'],
          description: 'The urgency of the ticket.'
        },
        customerName: {
          type: Type.STRING,
          description: 'Name of the user requesting help.'
        }
      },
      required: ['subject', 'priority', 'customerName']
    }
  },
  {
    name: 'getTicketStatus',
    description: 'Retrieves the current status of a support ticket by ID.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        ticketId: {
          type: Type.STRING,
          description: 'The unique ID of the ticket.'
        }
      },
      required: ['ticketId']
    }
  }
];

const SYSTEM_INSTRUCTION = `
You are OmniSupport AI, a world-class conversational support agent for a SaaS platform called OmniCloud.
Your goals are:
1. Be helpful, professional, and concise.
2. If a user has a complex problem, offer to create a support ticket using the 'createTicket' tool.
3. If a user asks about an existing ticket, use 'getTicketStatus'.
4. If you don't know an answer, admit it and offer to escalate.
5. You can handle billing questions, technical troubleshooting, and feature requests.

Standard priorities:
- High/Urgent: Production outages, billing errors.
- Medium: Functional bugs, setup help.
- Low: Feature requests, cosmetic issues.
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateResponse(history: Message[], userInput: string, handlers: {
    onCreateTicket: (ticket: any) => string;
    onGetStatus: (id: string) => string;
  }) {
    const contents = history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    contents.push({
      role: MessageRole.USER,
      parts: [{ text: userInput }]
    });

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: TICKET_FUNCTIONS }]
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const toolResults = [];
      for (const fc of response.functionCalls) {
        if (fc.name === 'createTicket') {
          const result = handlers.onCreateTicket(fc.args);
          toolResults.push({
            functionResponses: {
              id: fc.id,
              name: fc.name,
              response: { result }
            }
          });
        } else if (fc.name === 'getTicketStatus') {
          const result = handlers.onGetStatus(fc.args.ticketId as string);
          toolResults.push({
            functionResponses: {
              id: fc.id,
              name: fc.name,
              response: { result }
            }
          });
        }
      }

      // After tool execution, get final conversational response
      const followUp = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...contents,
          { role: MessageRole.MODEL, parts: response.candidates[0].content.parts },
          ...toolResults.map(tr => ({
            role: MessageRole.MODEL,
            parts: [{ functionResponse: tr.functionResponses }]
          }))
        ],
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });

      return followUp.text || "Ticket processed. How else can I help?";
    }

    return response.text || "I'm sorry, I couldn't process that request.";
  }
}
