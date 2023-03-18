import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFlashcard } from '../flashcard.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, FlashcardService } from '../service/flashcard.service';
import { FlashcardDeleteDialogComponent } from '../delete/flashcard-delete-dialog.component';

@Component({
  selector: 'jhi-flashcard-viewer',
  templateUrl: './flashcard-viewer.component.html',
})
export class FlashcardViewerComponent implements OnInit {
  flashcards?: IFlashcard[];
  flashcard?: IFlashcard;
  flashcardIndex = 0;

  isLoading = false;
  showAnswer = false;
  showHint = false;
  timeLeft: number = 300;
  interval: any;
  correctNum = 0;
  incorrectNum = 0;
  marked = false;
  markedValue = '';

  predicate = 'id';
  ascending = true;
  study = false;

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;
  totalCardsPlayed = 1;

  constructor(
    protected flashcardService: FlashcardService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IFlashcard): number => this.flashcardService.getFlashcardIdentifier(item);

  ngOnInit(): void {
    const queryObject = {
      page: 0,
      size: 20,
      sort: ['id,asc'],
    };
    this.flashcardService.query(queryObject).subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });

    if (this.router.url === '/flashcard/viewer/study') {
      this.study = true;
    }
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 300;
      }
    }, 1000);
  }

  onShowNext() {
    if (this.flashcards) {
      if (this.flashcardIndex < this.flashcards.length - 1) {
        this.flashcardIndex += 1;
      }
      if (this.flashcardIndex + 2 > this.totalCardsPlayed) {
        this.totalCardsPlayed = this.flashcardIndex + 1;
      }
      this.flashcard = this.flashcards[this.flashcardIndex + 1];
      this.showAnswer = false;
      this.showHint = false;

      this.marked = false;
      this.markedValue = '';
    }
  }

  onShowPrevious() {
    if (this.flashcards) {
      if (this.flashcardIndex > 0) {
        this.flashcardIndex -= 1;
      }
      this.flashcard = this.flashcards[this.flashcardIndex];
      this.showAnswer = false;
      this.showHint = false;

      this.marked = false;
      this.markedValue = '';
    }
  }

  onShowAnswer() {
    this.showAnswer = true;
  }

  onShowHint() {
    this.showHint = true;
  }

  onMarkCorrect() {
    this.marked = true;
    this.markedValue = 'correct.';
    this.correctNum++;
    console.log('correctNum: ', this.correctNum);
  }

  onMarkIncorrect() {
    this.marked = true;
    this.markedValue = 'incorrect.';
    this.incorrectNum++;
    console.log('incorrectNum: ', this.incorrectNum);
  }

  delete(flashcard: IFlashcard): void {
    const modalRef = this.modalService.open(FlashcardDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.flashcard = flashcard;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    console.log('dataFromBody: ', dataFromBody);
    this.flashcards = dataFromBody;
    this.flashcard = this.flashcards[0];
    this.flashcardIndex = 0;
  }

  protected fillComponentAttributesFromResponseBody(data: IFlashcard[] | null): IFlashcard[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.flashcardService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
