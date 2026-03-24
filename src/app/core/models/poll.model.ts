export interface PollOption {
  id: number;
  text: string;
  votes: number;      
  percentage: number;  
  displayOrder: number;
}

export interface PollSearchResultDTO {
  id: number;
  title: string;
  category: string;
  active: boolean;
  totalVotes: number;
  authorName: string;
  authorGradient: string | null;
  authorAvatarUrl: string | null;
}

export interface Poll {
  id: number;
  title: string;
  category: string;
  authorId: number
  authorName: string;
  authorGradient: string | null;
  authorAvatarUrl: string | null;
  createdAt: string;
  active: boolean;
  totalVotes: number;
  myVotedOptionId: number | null;  
  options: PollOption[];
}

export interface PollCreateDTO {
  title: string;
  category: string;
  userId: number;
  userName: string;
  userGradient?: string;
  userAvatarUrl?: string;
  options: { text: string; displayOrder: number }[];
}

export interface PollOptionReadDTO {
  id: number;
  text: string;
  displayOrder: number;
  totalVotes: number;
  percentage: number;
}

export interface PollReadDTO {
  id: number;
  title: string;
  category: string;
  authorId: number;
  authorName: string;
  authorGradient: string | null;
  authorAvatarUrl: string | null;
  createdAt: string;
  active: boolean;
  totalVotes: number;
  myVotedOptionId: number | null;
  options: PollOptionReadDTO[];
}

export interface PollReadFeedOption {
  id: number;
  text: string;
  displayOrder: number;
  totalVotes: number;
  percentage: number;       
}

export interface PollReadFeedOptionVotes {
  id: number;
  userId: number;
  createdAt: string;
}

export interface PollReadFeed {
  id: number;
  title: string;
  category: string;
  authorName: string;
  authorGradient?: string;
  authorAvatarUrl?: string;
  createdAt: string;
  active: boolean;
  totalVotes: number;         
  myVotedOptionId: number | null;
  options: PollReadFeedOption[];
}

export interface PagedResult<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
  hasNext: boolean;
}

export interface FeedParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: 'recent' | 'top';
}