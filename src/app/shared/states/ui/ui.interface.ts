export interface INavigator {
  readonly type: string;
  readonly click: boolean;
}

export interface IUi {
  readonly language: string;
  readonly subHeaderTitle: string;
  readonly showPrevButton: boolean;
  readonly showNextButton: boolean;
  readonly showStepper: boolean;
  readonly showCancelSearch: boolean;
  readonly showSearchBox: boolean;
  readonly currentPage: string;
  readonly navigateButtonClick: INavigator;
  readonly lastStep: string;
  readonly nextButtonLabel: string;
  readonly searchString: string;
}
