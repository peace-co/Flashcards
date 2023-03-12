import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FlashcardComponent } from '../list/flashcard.component';
import { FlashcardDetailComponent } from '../detail/flashcard-detail.component';
import { FlashcardUpdateComponent } from '../update/flashcard-update.component';
import { FlashcardRoutingResolveService } from './flashcard-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const flashcardRoute: Routes = [
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
