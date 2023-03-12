import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FlashcardDetailComponent } from './flashcard-detail.component';

describe('Flashcard Management Detail Component', () => {
  let comp: FlashcardDetailComponent;
  let fixture: ComponentFixture<FlashcardDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlashcardDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ flashcard: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FlashcardDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FlashcardDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load flashcard on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.flashcard).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
