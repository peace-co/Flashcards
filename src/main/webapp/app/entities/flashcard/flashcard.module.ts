import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FlashcardDeleteDialogComponent } from './delete/flashcard-delete-dialog.component';
import { FlashcardDetailComponent } from './detail/flashcard-detail.component';
import { FlashcardSelectorComponent } from './flashcard-selector/flashcard-selector.component';
import { FlashcardComponent } from './list/flashcard.component';
import { FlashcardRoutingModule } from './route/flashcard-routing.module';
import { FlashcardUpdateComponent } from './update/flashcard-update.component';
import { FlashcardViewerComponent } from './viewer/flashcard-viewer.component';

@NgModule({
  imports: [SharedModule, FlashcardRoutingModule],
  declarations: [
    FlashcardViewerComponent,
    FlashcardSelectorComponent,
    FlashcardComponent,
    FlashcardDetailComponent,
    FlashcardUpdateComponent,
    FlashcardDeleteDialogComponent,
  ],
})
export class FlashcardModule {}
