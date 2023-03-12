import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFlashcard } from '../flashcard.model';
import { FlashcardService } from '../service/flashcard.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './flashcard-delete-dialog.component.html',
})
export class FlashcardDeleteDialogComponent {
  flashcard?: IFlashcard;

  constructor(protected flashcardService: FlashcardService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.flashcardService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
