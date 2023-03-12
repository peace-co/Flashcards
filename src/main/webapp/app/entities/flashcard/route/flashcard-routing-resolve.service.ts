import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFlashcard } from '../flashcard.model';
import { FlashcardService } from '../service/flashcard.service';

@Injectable({ providedIn: 'root' })
export class FlashcardRoutingResolveService implements Resolve<IFlashcard | null> {
  constructor(protected service: FlashcardService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFlashcard | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((flashcard: HttpResponse<IFlashcard>) => {
          if (flashcard.body) {
            return of(flashcard.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
