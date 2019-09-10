import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FAQ } from 'app/core/constant';

import { IStore } from 'app/shared/interfaces/store.interface';
import * as UiActions from 'app/shared/states/ui/ui.actions';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  public faqs = [];
  private pageTitle = 'FAQs';

  constructor(private store$: Store<IStore>) {}

  ngOnInit() {
    this.initSubHeader();
    this.faqs = FAQ ? FAQ : [];
  }

  initSubHeader() {
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetShowNextButton(false));
    this.store$.dispatch(new UiActions.SetShowStepper(false));
    this.store$.dispatch(new UiActions.SetShowStepper(false));
  }
}
