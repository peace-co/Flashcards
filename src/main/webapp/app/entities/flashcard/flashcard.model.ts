import { ITag } from 'app/entities/tag/tag.model';

export interface IFlashcard {
  id: number;
  question?: string | null;
  answer?: string | null;
  hint?: string | null;
  correct?: boolean | null;
  globalRating?: number | null;
  tag?: Pick<ITag, 'id'> | null;
}

export type NewFlashcard = Omit<IFlashcard, 'id'> & { id: null };
