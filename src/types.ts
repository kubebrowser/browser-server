type pageReloadAction = {
  kind: "page-reload";
};

type pageNavigateAction = {
  kind: "page-navigate";
  url: string;
};

type pageGoBackAction = {
  kind: "page-goback";
};

type pageGoForwardAction = {
  kind: "page-goforward";
};

type pageResetAction = {
  kind: "page-reset";
};

export type browserAction = {
  kind: "browserAction";
  action: pageNavigateAction;
};

export type userAction = {
  kind: "userAction";
  action:
    | pageReloadAction
    | pageNavigateAction
    | pageGoBackAction
    | pageGoForwardAction
    | pageResetAction;
};
