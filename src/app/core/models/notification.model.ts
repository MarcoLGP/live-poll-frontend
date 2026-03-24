export interface NotificationDTO {
  id: number;
  receiverUserId: number;
  actorUserId: number;
  actorUsername: string;
  type: string;
  referenceId: number;
  referenceTitle: string;
  subReferenceTitle?: string;
  createdAt: string;
  read: boolean;
}

export interface Notification {
  id: number;
  type: string;
  read: boolean;
  createdAt: string;
  group: string;        
  avatarInitials: string;
  avatarColor: string;
  textKey: string;       
  textParams: Record<string, string>;
  pollTitle: string;
  referenceId: number; 
  optionTitle?: string;
  actorName: string;
  milestone?: string;
  progress?: number;
  progressMax?: number;
  unread: boolean;
  time: string;
}