import { IFlashcard, NewFlashcard } from './flashcard.model';

export const sampleWithRequiredData: IFlashcard = {
  id: 8830,
  question: 'Chief redundant',
  answer: 'help-desk',
};

export const sampleWithPartialData: IFlashcard = {
  id: 35596,
  question: 'compressing channels Phased',
  answer: 'Unbranded Marketing Vermont',
  hint: 'program',
};

export const sampleWithFullData: IFlashcard = {
  id: 95695,
  question: 'Fantastic JBOD SAS',
  answer: 'Northern Berkshire',
  hint: 'pink',
  correct: true,
  globalRating: 25627,
};

export const sampleWithNewData: NewFlashcard = {
  question: 'holistic Tasty',
  answer: 'Streamlined Maryland Lodge',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
