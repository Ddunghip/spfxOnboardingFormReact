import * as React from 'react';
import {
    BrowserRouter as Router,
    HashRouter, Route, Switch
} from "react-router-dom";
import ObdForm from './ObdForm';
import ObdDetails from './ObdDetails';
import { IOnboardingformProps } from './IOnboardingformProps';
import PageNotFound from './PageNotFound';


export default class Routes extends React.Component<IOnboardingformProps> {

    render() {
        console.log(this.props);

        return (

            <HashRouter>
                <Switch>
                    <Route path='/id=:id' exact>
                        <ObdForm
                            {...this.props}
                            context={this.props.context}
                            spconect={this.props.spconect}
                            webURL={this.props.webURL}
                            ChoicesRoles={this.props.ChoicesRoles}
                            ChoicesReturnedtowork={this.props.ChoicesReturnedtowork}
                            ChoicesOfficelocation={this.props.ChoicesOfficelocation}
                        />
                    </Route>
                    <Route path='/' exact>
                        <ObdForm
                            {...this.props}
                            context={this.props.context}
                            spconect={this.props.spconect}
                            webURL={this.props.webURL}
                            ChoicesRoles={this.props.ChoicesRoles}
                            ChoicesReturnedtowork={this.props.ChoicesReturnedtowork}
                            ChoicesOfficelocation={this.props.ChoicesOfficelocation}
                        />
                    </Route>
                    <Route path='/detail' component={ObdDetails} />
                    {/* <Route component={PageNotFound} /> */}
                </Switch>
            </HashRouter>
        )
    };
}
