import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FlashcardFormService } from './flashcard-form.service';
import { FlashcardService } from '../service/flashcard.service';
import { IFlashcard } from '../flashcard.model';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

import { FlashcardUpdateComponent } from './flashcard-update.component';

describe('Flashcard Management Update Component', () => {
  let comp: FlashcardUpdateComponent;
  let fixture: ComponentFixture<FlashcardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let flashcardFormService: FlashcardFormService;
  let flashcardService: FlashcardService;
  let tagService: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FlashcardUpdateComponent],
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
      .overrideTemplate(FlashcardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FlashcardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    flashcardFormService = TestBed.inject(FlashcardFormService);
    flashcardService = TestBed.inject(FlashcardService);
    tagService = TestBed.inject(TagService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Tag query and add missing value', () => {
      const flashcard: IFlashcard = { id: 456 };
      const tags: ITag[] = [{ id: 67777 }];
      flashcard.tags = tags;

      const tagCollection: ITag[] = [{ id: 81244 }];
      jest.spyOn(tagService, 'query').mockReturnValue(of(new HttpResponse({ body: tagCollection })));
      const additionalTags = [...tags];
      const expectedCollection: ITag[] = [...additionalTags, ...tagCollection];
      jest.spyOn(tagService, 'addTagToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ flashcard });
      comp.ngOnInit();

      expect(tagService.query).toHaveBeenCalled();
      expect(tagService.addTagToCollectionIfMissing).toHaveBeenCalledWith(tagCollection, ...additionalTags.map(expect.objectContaining));
      expect(comp.tagsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const flashcard: IFlashcard = { id: 456 };
      const tag: ITag = { id: 29082 };
      flashcard.tags = [tag];

      activatedRoute.data = of({ flashcard });
      comp.ngOnInit();

      expect(comp.tagsSharedCollection).toContain(tag);
      expect(comp.flashcard).toEqual(flashcard);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFlashcard>>();
      const flashcard = { id: 123 };
      jest.spyOn(flashcardFormService, 'getFlashcard').mockReturnValue(flashcard);
      jest.spyOn(flashcardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ flashcard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: flashcard }));
      saveSubject.complete();

      // THEN
      expect(flashcardFormService.getFlashcard).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(flashcardService.update).toHaveBeenCalledWith(expect.objectContaining(flashcard));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFlashcard>>();
      const flashcard = { id: 123 };
      jest.spyOn(flashcardFormService, 'getFlashcard').mockReturnValue({ id: null });
      jest.spyOn(flashcardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ flashcard: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: flashcard }));
      saveSubject.complete();

      // THEN
      expect(flashcardFormService.getFlashcard).toHaveBeenCalled();
      expect(flashcardService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFlashcard>>();
      const flashcard = { id: 123 };
      jest.spyOn(flashcardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ flashcard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(flashcardService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTag', () => {
      it('Should forward to tagService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tagService, 'compareTag');
        comp.compareTag(entity, entity2);
        expect(tagService.compareTag).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
