import React from 'react';
import {Layout} from 'antd';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {Provider} from 'react-redux';
import {combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";


import LessonsListPage from './pages/LessonsList';
import LessonPage from './pages/Lesson';
import ScrollToTop from "./components/ScrollToTop";

import {ROOT_REDUCER} from "react-soul-player/dist/redux/constants";
import playerReducer from "react-soul-player/dist/redux/reducer";

import './App.css';

const store = createStore(combineReducers({
    [ROOT_REDUCER]: playerReducer
}), composeWithDevTools());

const App = () => {
    return (
        <Provider store={store}>
            <Layout className="layout">
                <Router>
                    <ScrollToTop/>
                    <Switch>
                        <Route path="/lesson/test">
                            <LessonPage/>
                        </Route>
                        <Route path="/">
                            <LessonsListPage/>
                        </Route>
                    </Switch>
                    <Layout.Footer style={{textAlign: 'center'}}>Уроки кондитерства ©2020</Layout.Footer>
                </Router>
            </Layout>
        </Provider>
    )
};

export default App;