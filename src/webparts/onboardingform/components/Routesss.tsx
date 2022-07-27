import * as React from 'react';
import {
    BrowserRouter as Router,
    HashRouter, Route, Switch
} from "react-router-dom";
import ObdForm from './ObdForm';
import ObdDetails from './ObdDetails';
import { IOnboardingformProps } from './IOnboardingformProps';
import PageNotFound from './PageNotFound';
import history from './history';


export default class Routes extends React.Component<IOnboardingformProps> {

    public render() {
        console.log(this.props);

        return (

            <HashRouter history={history}>
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
                            userID={this.props.userID}

                        />
                    </Route>
                    <Route path='/' >
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
        );
    }
}
