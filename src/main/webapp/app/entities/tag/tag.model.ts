import { IFlashcard } from 'app/entities/flashcard/flashcard.model';

export interface ITag {
  id: number;
  name?: string | null;
  flashcards?: Pick<IFlashcard, 'id'>[] | null;
}

export type NewTag = Omit<ITag, 'id'> & { id: null };
