import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFlashcard } from '../flashcard.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../flashcard.test-samples';

import { FlashcardService } from './flashcard.service';

const requireRestSample: IFlashcard = {
  ...sampleWithRequiredData,
};

describe('Flashcard Service', () => {
  let service: FlashcardService;
  let httpMock: HttpTestingController;
  let expectedResult: IFlashcard | IFlashcard[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FlashcardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Flashcard', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const flashcard = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(flashcard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Flashcard', () => {
      const flashcard = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(flashcard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Flashcard', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Flashcard', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Flashcard', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFlashcardToCollectionIfMissing', () => {
      it('should add a Flashcard to an empty array', () => {
        const flashcard: IFlashcard = sampleWithRequiredData;
        expectedResult = service.addFlashcardToCollectionIfMissing([], flashcard);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(flashcard);
      });

      it('should not add a Flashcard to an array that contains it', () => {
        const flashcard: IFlashcard = sampleWithRequiredData;
        const flashcardCollection: IFlashcard[] = [
          {
            ...flashcard,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFlashcardToCollectionIfMissing(flashcardCollection, flashcard);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Flashcard to an array that doesn't contain it", () => {
        const flashcard: IFlashcard = sampleWithRequiredData;
        const flashcardCollection: IFlashcard[] = [sampleWithPartialData];
        expectedResult = service.addFlashcardToCollectionIfMissing(flashcardCollection, flashcard);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(flashcard);
      });

      it('should add only unique Flashcard to an array', () => {
        const flashcardArray: IFlashcard[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const flashcardCollection: IFlashcard[] = [sampleWithRequiredData];
        expectedResult = service.addFlashcardToCollectionIfMissing(flashcardCollection, ...flashcardArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const flashcard: IFlashcard = sampleWithRequiredData;
        const flashcard2: IFlashcard = sampleWithPartialData;
        expectedResult = service.addFlashcardToCollectionIfMissing([], flashcard, flashcard2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(flashcard);
        expect(expectedResult).toContain(flashcard2);
      });

      it('should accept null and undefined values', () => {
        const flashcard: IFlashcard = sampleWithRequiredData;
        expectedResult = service.addFlashcardToCollectionIfMissing([], null, flashcard, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(flashcard);
      });

      it('should return initial array if no Flashcard is added', () => {
        const flashcardCollection: IFlashcard[] = [sampleWithRequiredData];
        expectedResult = service.addFlashcardToCollectionIfMissing(flashcardCollection, undefined, null);
        expect(expectedResult).toEqual(flashcardCollection);
      });
    });

    describe('compareFlashcard', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFlashcard(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFlashcard(entity1, entity2);
        const compareResult2 = service.compareFlashcard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFlashcard(entity1, entity2);
        const compareResult2 = service.compareFlashcard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFlashcard(entity1, entity2);
        const compareResult2 = service.compareFlashcard(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
