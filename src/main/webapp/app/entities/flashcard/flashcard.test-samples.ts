import { IFlashcard, NewFlashcard } from './flashcard.model';

export const sampleWithRequiredData: IFlashcard = {
  id: 8830,
  question: 'Chief redundant',
  answer: 'help-desk',
};

export const sampleWithPartialData: IFlashcard = {
  id: 40110,
  question: 'IB Investment',
  answer: 'Phased',
  hint: 'Unbranded Marketing Vermont',
};

export const sampleWithFullData: IFlashcard = {
  id: 3372,
  question: 'transmitting SDD Pizza',
  answer: 'SAS deliver hybrid',
  hint: 'Digitized Madagascar virtual',
  globalRating: 66506,
};

export const sampleWithNewData: NewFlashcard = {
  question: 'Marketing',
  answer: 'calculating',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
