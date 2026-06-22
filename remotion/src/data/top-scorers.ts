export type Scorer = {
  rank: number;
  name: string;
  goals: number;
};

export const TOP_SCORERS: Scorer[] = [
  { rank: 1, name: "Cristiano Ronaldo", goals: 901 },
  { rank: 2, name: "Lionel Messi", goals: 838 },
  { rank: 3, name: "Pelé", goals: 767 },
  { rank: 4, name: "Romário", goals: 752 },
  { rank: 5, name: "Neymar", goals: 708 },
  { rank: 6, name: "Josef Bican", goals: 694 },
  { rank: 7, name: "Ferenc Puskás", goals: 624 },
  { rank: 8, name: "Kaíser", goals: 618 },
  { rank: 9, name: "Eusébio", goals: 601 },
  { rank: 10, name: "Robert Lewandowski", goals: 582 },
];

export const MAX_GOALS = TOP_SCORERS[0].goals;
