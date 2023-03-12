import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFlashcard } from '../flashcard.model';

@Component({
  selector: 'jhi-flashcard-detail',
  templateUrl: './flashcard-detail.component.html',
})
export class FlashcardDetailComponent implements OnInit {
  flashcard: IFlashcard | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ flashcard }) => {
      this.flashcard = flashcard;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
