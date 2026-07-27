export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
}

export interface BNSCategory {
  id: string;
  title: string;
  hindiTitle: string;
  iconName: string;
  summary: string;
  topics: {
    title: string;
    details: string;
    punishmentOrAction?: string;
  }[];
}

export interface EmergencyNumber {
  name: string;
  number: string;
  desc: string;
  icon: string;
}
