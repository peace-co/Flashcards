import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FlashcardFormService, FlashcardFormGroup } from './flashcard-form.service';
import { IFlashcard } from '../flashcard.model';
import { FlashcardService } from '../service/flashcard.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

@Component({
  selector: 'jhi-flashcard-update',
  templateUrl: './flashcard-update.component.html',
})
export class FlashcardUpdateComponent implements OnInit {
  isSaving = false;
  flashcard: IFlashcard | null = null;

  tagsSharedCollection: ITag[] = [];

  editForm: FlashcardFormGroup = this.flashcardFormService.createFlashcardFormGroup();

  constructor(
    protected flashcardService: FlashcardService,
    protected flashcardFormService: FlashcardFormService,
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTag = (o1: ITag | null, o2: ITag | null): boolean => this.tagService.compareTag(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ flashcard }) => {
      this.flashcard = flashcard;
      if (flashcard) {
        this.updateForm(flashcard);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const flashcard = this.flashcardFormService.getFlashcard(this.editForm);
    if (flashcard.id !== null) {
      this.subscribeToSaveResponse(this.flashcardService.update(flashcard));
    } else {
      this.subscribeToSaveResponse(this.flashcardService.create(flashcard));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFlashcard>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(flashcard: IFlashcard): void {
    this.flashcard = flashcard;
    this.flashcardFormService.resetForm(this.editForm, flashcard);

    this.tagsSharedCollection = this.tagService.addTagToCollectionIfMissing<ITag>(this.tagsSharedCollection, flashcard.tag);
  }

  protected loadRelationshipsOptions(): void {
    this.tagService
      .query()
      .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
      .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing<ITag>(tags, this.flashcard?.tag)))
      .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));
  }
}
