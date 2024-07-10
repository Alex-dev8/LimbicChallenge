export interface Choice {
  text: string;
  value: number;
}

export interface Question {
  id: number;
  text: string;
  type:
    | 'userInput-text'
    | 'userInput-numbers'
    | 'date'
    | 'multi'
    | 'multi-emergency'
    | 'multi-end'
    | 'contact'
    | 'fork'
    | 'skip'
    | 'end';
  choices: Choice[] | [];
  next: any;
}

export interface Message {
  id: string;
  text: string;
  user: string | null;
  value: string | number | null;
}

export interface GlobalState {
  user: string | null;
  currentQuestion: Question | null;
  messages: Message[];
  answersGiven: number[];
  pushNotifications: boolean;
  loading: boolean;
}
