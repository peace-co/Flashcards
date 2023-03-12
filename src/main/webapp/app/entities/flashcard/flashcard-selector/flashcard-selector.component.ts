import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityArrayResponseType, TagService } from 'app/entities/tag/service/tag.service';
import { ITag } from 'app/entities/tag/tag.model';

import { IFlashcard } from '../flashcard.model';

@Component({
  selector: 'jhi-flashcard-selector',
  templateUrl: './flashcard-selector.component.html',
})
export class FlashcardSelectorComponent implements OnInit {
  flashcard: IFlashcard | null = null;
  tags: ITag[] | null = null;
  selectedTags: ITag[] | null = null;

  constructor(protected activatedRoute: ActivatedRoute, public router: Router, protected tagService: TagService) {}

  ngOnInit(): void {
    const queryObject = {
      page: 0,
      size: 0,
      sort: ['id,asc'],
    };
    this.tagService.query(queryObject).subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
    this.activatedRoute.data.subscribe(({ flashcard }) => {
      // this.flashcard = flashcard;
      // this.tags = flashcard.tags;
      // console.log('this.tags: ', this.tags);
    });
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    // this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    console.log('dataFromBody: ', dataFromBody);
    this.tags = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IFlashcard[] | null): IFlashcard[] {
    return data ?? [];
  }

  onStudy() {
    console.log('onStudy, selectedTags: ', this.selectedTags);
    this.handleNavigation();
    // const selects = document.querySelectorAll('select');
    // const optgroups = selects[0].querySelectorAll('optgroup');
    // console.log("onStudy, tags, flashcard, selects, optgroups: ", this.tags, this.flashcard, selects, optgroups);
  }

  protected handleNavigation(page = 10, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page: 0,
      size: 0,
      sort: ['id,asc'],
    };

    this.router.navigate(['./flashcard/viewer/study'], {
      // relativeTo: this.activatedRoute,
      // queryParams: queryParamsObj,
    });
  }

  // protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
  //   this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  // }

  previousState(): void {
    window.history.back();
  }
}
