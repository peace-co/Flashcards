import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(protected activatedRoute: ActivatedRoute, protected tagService: TagService) {}

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

  // protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
  //   this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  // }

  previousState(): void {
    window.history.back();
  }
}
