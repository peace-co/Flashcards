import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FlashcardDetailComponent } from '../detail/flashcard-detail.component';
import { FlashcardSelectorComponent } from '../flashcard-selector/flashcard-selector.component';
import { FlashcardComponent } from '../list/flashcard.component';
import { FlashcardUpdateComponent } from '../update/flashcard-update.component';
import { FlashcardViewerComponent } from '../viewer/flashcard-viewer.component';
import { FlashcardRoutingResolveService } from './flashcard-routing-resolve.service';

const flashcardRoute: Routes = [
  {
    path: 'viewer',
    component: FlashcardViewerComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'selector',
    component: FlashcardSelectorComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: '',
    component: FlashcardComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FlashcardDetailComponent,
    resolve: {
      flashcard: FlashcardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FlashcardUpdateComponent,
    resolve: {
      flashcard: FlashcardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FlashcardUpdateComponent,
    resolve: {
      flashcard: FlashcardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(flashcardRoute)],
  exports: [RouterModule],
})
export class FlashcardRoutingModule {}
