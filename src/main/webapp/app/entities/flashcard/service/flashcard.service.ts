import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFlashcard, NewFlashcard } from '../flashcard.model';

export type PartialUpdateFlashcard = Partial<IFlashcard> & Pick<IFlashcard, 'id'>;

export type EntityResponseType = HttpResponse<IFlashcard>;
export type EntityArrayResponseType = HttpResponse<IFlashcard[]>;

@Injectable({ providedIn: 'root' })
export class FlashcardService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/flashcards');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(flashcard: NewFlashcard): Observable<EntityResponseType> {
    return this.http.post<IFlashcard>(this.resourceUrl, flashcard, { observe: 'response' });
  }

  update(flashcard: IFlashcard): Observable<EntityResponseType> {
    return this.http.put<IFlashcard>(`${this.resourceUrl}/${this.getFlashcardIdentifier(flashcard)}`, flashcard, { observe: 'response' });
  }

  partialUpdate(flashcard: PartialUpdateFlashcard): Observable<EntityResponseType> {
    return this.http.patch<IFlashcard>(`${this.resourceUrl}/${this.getFlashcardIdentifier(flashcard)}`, flashcard, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFlashcard>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFlashcard[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFlashcardIdentifier(flashcard: Pick<IFlashcard, 'id'>): number {
    return flashcard.id;
  }

  compareFlashcard(o1: Pick<IFlashcard, 'id'> | null, o2: Pick<IFlashcard, 'id'> | null): boolean {
    return o1 && o2 ? this.getFlashcardIdentifier(o1) === this.getFlashcardIdentifier(o2) : o1 === o2;
  }

  addFlashcardToCollectionIfMissing<Type extends Pick<IFlashcard, 'id'>>(
    flashcardCollection: Type[],
    ...flashcardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const flashcards: Type[] = flashcardsToCheck.filter(isPresent);
    if (flashcards.length > 0) {
      const flashcardCollectionIdentifiers = flashcardCollection.map(flashcardItem => this.getFlashcardIdentifier(flashcardItem)!);
      const flashcardsToAdd = flashcards.filter(flashcardItem => {
        const flashcardIdentifier = this.getFlashcardIdentifier(flashcardItem);
        if (flashcardCollectionIdentifiers.includes(flashcardIdentifier)) {
          return false;
        }
        flashcardCollectionIdentifiers.push(flashcardIdentifier);
        return true;
      });
      return [...flashcardsToAdd, ...flashcardCollection];
    }
    return flashcardCollection;
  }
}
