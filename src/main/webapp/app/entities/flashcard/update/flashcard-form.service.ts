import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFlashcard, NewFlashcard } from '../flashcard.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFlashcard for edit and NewFlashcardFormGroupInput for create.
 */
type FlashcardFormGroupInput = IFlashcard | PartialWithRequiredKeyOf<NewFlashcard>;

type FlashcardFormDefaults = Pick<NewFlashcard, 'id'>;

type FlashcardFormGroupContent = {
  id: FormControl<IFlashcard['id'] | NewFlashcard['id']>;
  question: FormControl<IFlashcard['question']>;
  answer: FormControl<IFlashcard['answer']>;
  hint: FormControl<IFlashcard['hint']>;
  globalRating: FormControl<IFlashcard['globalRating']>;
  tag: FormControl<IFlashcard['tag']>;
};

export type FlashcardFormGroup = FormGroup<FlashcardFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FlashcardFormService {
  createFlashcardFormGroup(flashcard: FlashcardFormGroupInput = { id: null }): FlashcardFormGroup {
    const flashcardRawValue = {
      ...this.getFormDefaults(),
      ...flashcard,
    };
    return new FormGroup<FlashcardFormGroupContent>({
      id: new FormControl(
        { value: flashcardRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      question: new FormControl(flashcardRawValue.question, {
        validators: [Validators.required],
      }),
      answer: new FormControl(flashcardRawValue.answer, {
        validators: [Validators.required],
      }),
      hint: new FormControl(flashcardRawValue.hint),
      globalRating: new FormControl(flashcardRawValue.globalRating),
      tag: new FormControl(flashcardRawValue.tag),
    });
  }

  getFlashcard(form: FlashcardFormGroup): IFlashcard | NewFlashcard {
    return form.getRawValue() as IFlashcard | NewFlashcard;
  }

  resetForm(form: FlashcardFormGroup, flashcard: FlashcardFormGroupInput): void {
    const flashcardRawValue = { ...this.getFormDefaults(), ...flashcard };
    form.reset(
      {
        ...flashcardRawValue,
        id: { value: flashcardRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FlashcardFormDefaults {
    return {
      id: null,
    };
  }
}
