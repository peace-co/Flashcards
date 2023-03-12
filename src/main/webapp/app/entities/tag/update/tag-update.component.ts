import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TagFormService, TagFormGroup } from './tag-form.service';
import { ITag } from '../tag.model';
import { TagService } from '../service/tag.service';
import { IFlashcard } from 'app/entities/flashcard/flashcard.model';
import { FlashcardService } from 'app/entities/flashcard/service/flashcard.service';

@Component({
  selector: 'jhi-tag-update',
  templateUrl: './tag-update.component.html',
})
export class TagUpdateComponent implements OnInit {
  isSaving = false;
  tag: ITag | null = null;

  flashcardsSharedCollection: IFlashcard[] = [];

  editForm: TagFormGroup = this.tagFormService.createTagFormGroup();

  constructor(
    protected tagService: TagService,
    protected tagFormService: TagFormService,
    protected flashcardService: FlashcardService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareFlashcard = (o1: IFlashcard | null, o2: IFlashcard | null): boolean => this.flashcardService.compareFlashcard(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tag }) => {
      this.tag = tag;
      if (tag) {
        this.updateForm(tag);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tag = this.tagFormService.getTag(this.editForm);
    if (tag.id !== null) {
      this.subscribeToSaveResponse(this.tagService.update(tag));
    } else {
      this.subscribeToSaveResponse(this.tagService.create(tag));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITag>>): void {
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

  protected updateForm(tag: ITag): void {
    this.tag = tag;
    this.tagFormService.resetForm(this.editForm, tag);

    this.flashcardsSharedCollection = this.flashcardService.addFlashcardToCollectionIfMissing<IFlashcard>(
      this.flashcardsSharedCollection,
      ...(tag.flashcards ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.flashcardService
      .query()
      .pipe(map((res: HttpResponse<IFlashcard[]>) => res.body ?? []))
      .pipe(
        map((flashcards: IFlashcard[]) =>
          this.flashcardService.addFlashcardToCollectionIfMissing<IFlashcard>(flashcards, ...(this.tag?.flashcards ?? []))
        )
      )
      .subscribe((flashcards: IFlashcard[]) => (this.flashcardsSharedCollection = flashcards));
  }
}
