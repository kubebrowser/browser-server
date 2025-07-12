type pageReloadAction = {
  kind: "page-reload";
};

type pageNavigationAction = {
  kind: "page-navigation";
  url: string;
};

type pageBackAction = {
  kind: "page-back";
};

type pageForwardAction = {
  kind: "page-forward";
};

export type browserAction = {
  kind: "browserAction";
  action: pageNavigationAction;
};

export type userAction = {
  kind: "userAction";
  action:
    | pageReloadAction
    | pageNavigationAction
    | pageBackAction
    | pageForwardAction;
};
