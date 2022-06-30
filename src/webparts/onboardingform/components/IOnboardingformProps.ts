import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IOnboardingformProps {
  description: string;
  context: WebPartContext;
  webURL: string;
  ChoicesRoles: any;
  ChoicesReturnedtowork: any;
  ChoicesOfficelocation: any;
}
