import { Injectable, signal } from '@angular/core';

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: number;
  author: string;
  initials: string;
  color: string;
  question: string;
  category: string;         
  options: PollOption[];
  live: boolean;
  createdAt: string;      
  mine: boolean;
  voted: number | null;
}

@Injectable({ providedIn: 'root' })
export class PollService {
  private pollsSignal = signal<Poll[]>(MOCK_POLLS);
  readonly polls = this.pollsSignal.asReadonly();

  addPoll(poll: Poll) {
    this.pollsSignal.update(p => [poll, ...p]);
  }

  vote(pollId: number, optionIndex: number) {
    this.pollsSignal.update(polls =>
      polls.map(p => {
        if (p.id === pollId && p.voted === null) {
          const newOptions = [...p.options];
          newOptions[optionIndex] = {
            ...newOptions[optionIndex],
            votes: newOptions[optionIndex].votes + 1
          };
          return { ...p, options: newOptions, voted: optionIndex };
        }
        return p;
      })
    );
  }
}

const COLORS = [
  'linear-gradient(135deg,#5B8DF7,#9B79F5)',
  'linear-gradient(135deg,#F06292,#FF8A65)',
  'linear-gradient(135deg,#52D9A0,#5B8DF7)',
  'linear-gradient(135deg,#F5B342,#F06292)',
  'linear-gradient(135deg,#9B79F5,#52D9A0)',
  'linear-gradient(135deg,#5B8DF7,#52D9A0)',
];

// Função auxiliar para gerar timestamps relativos realistas
const minutesAgo = (minutes: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
};

const hoursAgo = (hours: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

const MOCK_POLLS: Poll[] = [
  {
    id: 1,
    author: 'Ana Lima',
    initials: 'AL',
    color: COLORS[1],
    question: 'Qual framework frontend você usa no dia a dia?',
    category: 'CATEGORIES.TECH',
    options: [
      { text: 'React', votes: 48 },
      { text: 'Vue.js', votes: 22 },
      { text: 'Angular', votes: 14 },
      { text: 'Svelte', votes: 9 },
    ],
    live: true,
    createdAt: minutesAgo(3),
    mine: false,
    voted: 0,
  },
  {
    id: 2,
    author: 'Carlos M.',
    initials: 'CM',
    color: COLORS[2],
    question: 'Melhor jogo lançado em 2024?',
    category: 'CATEGORIES.GAMES',
    options: [
      { text: 'Elden Ring DLC', votes: 35 },
      { text: 'Metaphor: ReFantazio', votes: 41 },
      { text: 'Black Myth: Wukong', votes: 28 },
    ],
    live: true,
    createdAt: minutesAgo(12),
    mine: true,
    voted: 1,
  },
  {
    id: 3,
    author: 'Beatriz S.',
    initials: 'BS',
    color: COLORS[3],
    question: 'Café ou energético para trabalhar à noite?',
    category: 'CATEGORIES.FOOD',
    options: [
      { text: '☕ Café sempre', votes: 72 },
      { text: '⚡ Red Bull na veia', votes: 31 },
      { text: 'Água mineral', votes: 8 },
    ],
    live: true,
    createdAt: minutesAgo(28),
    mine: false,
    voted: 2,
  },
  {
    id: 4,
    author: 'Rafael O.',
    initials: 'RO',
    color: COLORS[4],
    question: 'Linux, macOS ou Windows para desenvolvimento?',
    category: 'CATEGORIES.TECH',
    options: [
      { text: 'Linux 🐧', votes: 55 },
      { text: 'macOS 🍎', votes: 60 },
      { text: 'Windows 🪟', votes: 18 },
    ],
    live: false,
    createdAt: hoursAgo(2),
    mine: false,
    voted: 2,
  },
];