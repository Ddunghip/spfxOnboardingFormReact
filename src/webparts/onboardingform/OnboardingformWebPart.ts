import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'OnboardingformWebPartStrings';
import Onboardingform from './components/Onboardingform';
import { IOnboardingformProps } from './components/IOnboardingformProps';
import ObdForm from './components/ObdForm';
import Routes from './components/Routesss';
// import { sp } from '@pnp/sp/presets/all';



export interface IOnboardingformWebPartProps {
  description: string;
}

export default class OnboardingformWebPart extends BaseClientSideWebPart<IOnboardingformWebPartProps> {

  // private _links: Array<any>;

  // protected async onInit(): Promise<void> {
  //   sp.setup({ spfxContext: this.context });
  //   this._links = await this._getPersonalLinks(false);
  //   return super.onInit();
  // }

  public async render(): Promise<void> {
    const element: React.ReactElement<IOnboardingformProps> = React.createElement(
      Routes,
      {

        description: this.properties.description,
        webURL: this.context.pageContext.web.absoluteUrl,
        context: this.context,
        spconect: this.context,

        ChoicesRoles: await getChoiceFields(this.context.pageContext.web.absoluteUrl, 'Roles'),
        ChoicesReturnedtowork: await getChoiceFields(this.context.pageContext.web.absoluteUrl, 'Is_x0020_Returned_x0020_to_x0020'),
        ChoicesOfficelocation: await getChoiceFields(this.context.pageContext.web.absoluteUrl, 'Office_x0020_Location'),


      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };

  }
  // private _getPersonalLinks = (filterByEmail: boolean): Promise<Array<any>> => {

  //   // This legacyPageContext is not recommended to be used.
  //   console.log(this.context.pageContext.legacyPageContext.userId);

  //   if (filterByEmail) {
  //     // Filter by EMail
  //     return sp.web.lists.getByTitle('Employee onboarding').items
  //       .filter(`Author/EMail eq '${encodeURIComponent(this.context.pageContext.user.email)}'`)
  //       .select('Title')
  //       .get();
  //   }
  //   else {
  //     //Filter by LoginName (i:0#.f|membership|r@tenant-name.onmicrosoft.com)
  //     let userToken = `i:0#.f|membership|${this.context.pageContext.user.loginName}`;
  //     return sp.web.lists.getByTitle('Employee onboarding').items
  //       .filter(`Author/Name eq '${encodeURIComponent(userToken)}'`)
  //       .select('Title')
  //       .get();
  //   }

  //   sp.web.currentUser.get().then(user => {
  //     // Query for the list items using user.Id
  //     // sp.web.lists.......
  //   });
  // }

}
export const getChoiceFields = async (webURL, field) => {
  let resultarr = [];
  await fetch(`${webURL}/_api/web/lists/GetByTitle('Employee onboarding')/fields?$filter=EntityPropertyName eq '${field}'`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      'pragma': 'no-cache',
    }),
  }).then(async (response) => await response.json())
    .then(async (data) => {
      for (var i = 0; i < data.value[0].Choices.length; i++) {
        console.log(data.value);

        await resultarr.push({
          key: data.value[0].Choices[i],
          text: data.value[0].Choices[i]

        });

      }
    });
  return await resultarr;
};
