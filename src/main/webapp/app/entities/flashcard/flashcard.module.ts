import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FlashcardComponent } from './list/flashcard.component';
import { FlashcardDetailComponent } from './detail/flashcard-detail.component';
import { FlashcardUpdateComponent } from './update/flashcard-update.component';
import { FlashcardDeleteDialogComponent } from './delete/flashcard-delete-dialog.component';
import { FlashcardRoutingModule } from './route/flashcard-routing.module';

@NgModule({
  imports: [SharedModule, FlashcardRoutingModule],
  declarations: [FlashcardComponent, FlashcardDetailComponent, FlashcardUpdateComponent, FlashcardDeleteDialogComponent],
})
export class FlashcardModule {}
