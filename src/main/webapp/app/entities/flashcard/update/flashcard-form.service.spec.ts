import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../flashcard.test-samples';

import { FlashcardFormService } from './flashcard-form.service';

describe('Flashcard Form Service', () => {
  let service: FlashcardFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashcardFormService);
  });

  describe('Service methods', () => {
    describe('createFlashcardFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFlashcardFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            question: expect.any(Object),
            answer: expect.any(Object),
            hint: expect.any(Object),
            globalRating: expect.any(Object),
            tag: expect.any(Object),
          })
        );
      });

      it('passing IFlashcard should create a new form with FormGroup', () => {
        const formGroup = service.createFlashcardFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            question: expect.any(Object),
            answer: expect.any(Object),
            hint: expect.any(Object),
            globalRating: expect.any(Object),
            tag: expect.any(Object),
          })
        );
      });
    });

    describe('getFlashcard', () => {
      it('should return NewFlashcard for default Flashcard initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFlashcardFormGroup(sampleWithNewData);

        const flashcard = service.getFlashcard(formGroup) as any;

        expect(flashcard).toMatchObject(sampleWithNewData);
      });

      it('should return NewFlashcard for empty Flashcard initial value', () => {
        const formGroup = service.createFlashcardFormGroup();

        const flashcard = service.getFlashcard(formGroup) as any;

        expect(flashcard).toMatchObject({});
      });

      it('should return IFlashcard', () => {
        const formGroup = service.createFlashcardFormGroup(sampleWithRequiredData);

        const flashcard = service.getFlashcard(formGroup) as any;

        expect(flashcard).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFlashcard should not enable id FormControl', () => {
        const formGroup = service.createFlashcardFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFlashcard should disable id FormControl', () => {
        const formGroup = service.createFlashcardFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
