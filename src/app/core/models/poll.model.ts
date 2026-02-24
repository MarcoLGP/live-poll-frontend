export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: number;
  question: string;
  category: 'tech' | 'life' | 'general';
  options: PollOption[];
  voted: boolean;
  votedIndex: number | null;
  createdAt: number;
  isNew?: boolean;
}