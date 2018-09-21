import React, {Component} from 'react';
import {Scene, Stack, Router} from 'react-native-router-flux';
import ShowPage from './components/showPage';



export default class AppRouter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="showPage" component={ShowPage} hideNavBar initial/>
                </Scene>
            </Router>

        );
    }
}

