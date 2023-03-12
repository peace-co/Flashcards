import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITag } from 'app/entities/tag/tag.model';

import { IFlashcard } from '../flashcard.model';

@Component({
  selector: 'jhi-flashcard-detail',
  templateUrl: './flashcard-detail.component.html',
})
export class FlashcardDetailComponent implements OnInit {
  flashcard: IFlashcard | null = null;
  tags: ITag[] | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ flashcard }) => {
      this.flashcard = flashcard;
      this.tags = flashcard.tags;
      console.log('this.tags: ', this.tags);
    });
  }

  previousState(): void {
    window.history.back();
  }
}
