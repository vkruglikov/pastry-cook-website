import React from 'react';
import {Layout} from 'antd';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {Provider, useSelector} from 'react-redux';
import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from 'redux-thunk';
import {composeWithDevTools} from "redux-devtools-extension/developmentOnly";


import AuthorPage from './pages/AuthorPage';
import LoginPage from './pages/LoginPage';
import LessonPage from './pages/LessonPage';
import LessonCreatePage from './pages/LessonCreatePage';
import PublicCreatePage from './pages/PublicCreatePage';
import PublicPage from './pages/PublicPage';
import MainPage from './pages/MainPage';

import ScrollToTop from "./components/ScrollToTop";

import userReducer from "./redux/userReducer";
import lessonReducer from "./redux/lessonsReducer";
import authorsReducer from "./redux/authorsReducer";
import publicReducer from "./redux/publicReducer";

// TODO переделать на модули
import './App.css';
import {getUserData} from "./redux/selectors";

const store = createStore(combineReducers({
    user: userReducer,
    lessons: lessonReducer,
    authors: authorsReducer,
    public: publicReducer,
}), composeWithDevTools(
    applyMiddleware(thunk),
));

const Footer = () => {
    const login = useSelector(getUserData).login;
    const firstName = useSelector(getUserData).first_name;
    const lastName = useSelector(getUserData).last_name;

    return (
        <Layout.Footer style={{textAlign: 'center'}}>
            Уроки кондитерства ©2020
            {login && <div>Вы вошли как {firstName} {lastName} <a href={'/logout'}>Выйти</a></div>}
            <div>
                <a href={'/policy.html'}>Политика конфиденциальности</a>{' '}
            </div>
        </Layout.Footer>
    );
}

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <ScrollToTop/>

                    <Switch>
                        <Route exact path="/">
                            <MainPage/>
                        </Route>
                        <Route exact path="/public:publicId(\d+)">
                            <PublicPage/>
                        </Route>
                        <Route exact path="/public/create">
                            <PublicCreatePage/>
                        </Route>
                        <Route exact path="/lesson/add">
                            <LessonCreatePage/>
                        </Route>
                        <Route exact path="/lesson/:lessonId(\d+)(.*)">
                            <LessonPage/>
                        </Route>
                        <Route exact path="/login">
                            <LoginPage/>
                        </Route>
                        <Route exact path="/author/noisy_breeze">
                            <AuthorPage/>
                        </Route>
                    </Switch>
                    <Footer/>
            </Router>
        </Provider>
    )
};

export default App;