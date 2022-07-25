import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IOnboardingformProps {
  description: string;
  context: WebPartContext;
  spconect: any;

  webURL: string;
  ChoicesRoles: any;
  ChoicesReturnedtowork: any;
  ChoicesOfficelocation: any;

  userID: any;

  // Eitems: Array<any>;

}
