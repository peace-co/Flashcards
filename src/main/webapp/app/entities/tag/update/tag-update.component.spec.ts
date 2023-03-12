import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TagFormService } from './tag-form.service';
import { TagService } from '../service/tag.service';
import { ITag } from '../tag.model';
import { IFlashcard } from 'app/entities/flashcard/flashcard.model';
import { FlashcardService } from 'app/entities/flashcard/service/flashcard.service';

import { TagUpdateComponent } from './tag-update.component';

describe('Tag Management Update Component', () => {
  let comp: TagUpdateComponent;
  let fixture: ComponentFixture<TagUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tagFormService: TagFormService;
  let tagService: TagService;
  let flashcardService: FlashcardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TagUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TagUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TagUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tagFormService = TestBed.inject(TagFormService);
    tagService = TestBed.inject(TagService);
    flashcardService = TestBed.inject(FlashcardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Flashcard query and add missing value', () => {
      const tag: ITag = { id: 456 };
      const flashcards: IFlashcard[] = [{ id: 97299 }];
      tag.flashcards = flashcards;

      const flashcardCollection: IFlashcard[] = [{ id: 90197 }];
      jest.spyOn(flashcardService, 'query').mockReturnValue(of(new HttpResponse({ body: flashcardCollection })));
      const additionalFlashcards = [...flashcards];
      const expectedCollection: IFlashcard[] = [...additionalFlashcards, ...flashcardCollection];
      jest.spyOn(flashcardService, 'addFlashcardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      expect(flashcardService.query).toHaveBeenCalled();
      expect(flashcardService.addFlashcardToCollectionIfMissing).toHaveBeenCalledWith(
        flashcardCollection,
        ...additionalFlashcards.map(expect.objectContaining)
      );
      expect(comp.flashcardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tag: ITag = { id: 456 };
      const flashcard: IFlashcard = { id: 93000 };
      tag.flashcards = [flashcard];

      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      expect(comp.flashcardsSharedCollection).toContain(flashcard);
      expect(comp.tag).toEqual(tag);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITag>>();
      const tag = { id: 123 };
      jest.spyOn(tagFormService, 'getTag').mockReturnValue(tag);
      jest.spyOn(tagService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tag }));
      saveSubject.complete();

      // THEN
      expect(tagFormService.getTag).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tagService.update).toHaveBeenCalledWith(expect.objectContaining(tag));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITag>>();
      const tag = { id: 123 };
      jest.spyOn(tagFormService, 'getTag').mockReturnValue({ id: null });
      jest.spyOn(tagService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tag: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tag }));
      saveSubject.complete();

      // THEN
      expect(tagFormService.getTag).toHaveBeenCalled();
      expect(tagService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITag>>();
      const tag = { id: 123 };
      jest.spyOn(tagService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tagService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareFlashcard', () => {
      it('Should forward to flashcardService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(flashcardService, 'compareFlashcard');
        comp.compareFlashcard(entity, entity2);
        expect(flashcardService.compareFlashcard).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
