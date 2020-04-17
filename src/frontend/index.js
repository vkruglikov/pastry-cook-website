import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import App from './App';

setTimeout(() => {
    ReactGA.initialize('UA-111205473-3', {
        debug: process.env.NODE_ENV === 'development',
        titleCase: false,
    });
}, 0);

ReactDOM.render(<App/>,
    document.getElementById('root')
);