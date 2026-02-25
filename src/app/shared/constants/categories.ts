export interface Category {
  key: string;         
  emoji: string;
  name: string;         
  bg: string;          
  c: string;            
}

export const CATEGORIES: Category[] = [
  {
    key: 'CATEGORIES.TECH',
    emoji: '💻',
    name: 'Tecnologia',
    bg: 'rgba(91,141,247,.12)',
    c: '#5B8DF7',
  },
  {
    key: 'CATEGORIES.GAMES',
    emoji: '🎮',
    name: 'Games',
    bg: 'rgba(155,121,245,.12)',
    c: '#9B79F5',
  },
  {
    key: 'CATEGORIES.MUSIC',
    emoji: '🎵',
    name: 'Música',
    bg: 'rgba(240,98,146,.12)',
    c: '#F06292',
  },
  {
    key: 'CATEGORIES.SPORTS',
    emoji: '🏀',
    name: 'Esportes',
    bg: 'rgba(82,217,160,.12)',
    c: '#52D9A0',
  },
  {
    key: 'CATEGORIES.FOOD',
    emoji: '🍕',
    name: 'Comida',
    bg: 'rgba(245,179,66,.12)',
    c: '#F5B342',
  },
  {
    key: 'CATEGORIES.GENERAL',
    emoji: '💬',
    name: 'Geral',
    bg: 'rgba(255,255,255,.06)',
    c: '#8892B0',
  },
];

export const categoryMap = new Map<string, Category>(
  CATEGORIES.map(cat => [cat.key, cat])
);