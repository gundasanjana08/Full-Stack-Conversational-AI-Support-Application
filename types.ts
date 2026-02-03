
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

export enum TicketStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export interface Ticket {
  id: string;
  subject: string;
  customerName: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: number;
  lastUpdate: number;
}

export interface AppState {
  messages: Message[];
  tickets: Ticket[];
  isThinking: boolean;
  activeView: 'chat' | 'dashboard';
}
