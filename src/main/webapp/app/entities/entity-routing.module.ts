import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'flashcard',
        data: { pageTitle: 'flashcardsApp.flashcard.home.title' },
        loadChildren: () => import('./flashcard/flashcard.module').then(m => m.FlashcardModule),
      },
      {
        path: 'tag',
        data: { pageTitle: 'flashcardsApp.tag.home.title' },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
