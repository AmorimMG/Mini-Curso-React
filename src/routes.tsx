import React from 'react';

import { Route, BrowserRouter} from 'react-router-dom';

import Home from './Pages/Home'
import CreateLocation from './Pages/CreateLocation/Index';


const Routes = () => {
    return (
        <BrowserRouter> 
            <Route component={Home} path="/" exact />
            <Route component={CreateLocation} path="/Create-location" />
        </BrowserRouter>
    )
}

export default Routes;