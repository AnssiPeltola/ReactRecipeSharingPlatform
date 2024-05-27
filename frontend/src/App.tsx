import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as ROUTES from '../src/Constants/routes';
import TestComponent from './Components/TestComponent/dbtest';
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import Navbar from './Components/Navbar/Navbar';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import RegisterDetails from './Pages/Register/RegisterDetails/RegisterDetails';
import IngredientSearch from './Components/IngredientSearch/IngredientSearch';
import CreateRecipe from './Pages/RecipeCreate/RecipeCreate';

function App() {
    return (
      <Router>
        <div id='root'>
          <Navbar />
          <main>
            <Routes>
              <Route path={ROUTES.LANDING} element={<TestComponent />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route path={ROUTES.REGISTER_DETAILS} element={<RegisterDetails />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.INGREDIENT_SEARCH} element={<IngredientSearch />} />
              <Route path={ROUTES.CREATERECIPE + '/*'} element={<CreateRecipe />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
};

export default App;