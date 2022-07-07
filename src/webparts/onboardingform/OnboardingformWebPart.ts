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

export interface IOnboardingformWebPartProps {
  description: string;
}

export default class OnboardingformWebPart extends BaseClientSideWebPart<IOnboardingformWebPartProps> {

  public async render(): Promise<void> {
    const element: React.ReactElement<IOnboardingformProps> = React.createElement(
      ObdForm,
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
