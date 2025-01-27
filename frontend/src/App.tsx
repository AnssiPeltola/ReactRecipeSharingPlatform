import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as ROUTES from "../src/Constants/routes";
import Frontpage from "./Pages/Frontpage/frontpage";
import Register from "./Pages/Register/Register/Register";
import Login from "./Pages/Login/Login";
import Navbar from "./Components/Navbar/Navbar";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import RegisterDetails from "./Pages/Register/RegisterDetails/RegisterDetails";
import RegisterProfilePicture from "./Pages/Register/RegisterProfilePicture/RegisterProfilePicture";
import CreateRecipeWrapper from "./Components/CreateRecipeWrapper/CreateRecipeWrapper";
import EditRecipeWrapper from "./Components/EditRecipeWrapper/EditRecipeWrapper";
import SearchResultsPage from "./Pages/RecipeSearchResults/RecipeSearchResults";
import RecipeDetails from "./Pages/RecipeDetails/RecipeDetails";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import RegisterRoute from "./Pages/Register/RegisterRoute/RegisterRoute";
import RecipeSwiper from "./Pages/RecipeSwiper/RecipeSwiper";

function App() {
  return (
    <Router>
      <div id="root">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path={ROUTES.LANDING} element={<Frontpage />} />
            <Route path={ROUTES.REGISTER + "/*"} element={<RegisterRoute />} />
            <Route
              path={ROUTES.REGISTER_DETAILS}
              element={<RegisterDetails />}
            />
            <Route
              path={ROUTES.REGISTER_PICTURE}
              element={<RegisterProfilePicture />}
            />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route
              path={ROUTES.CREATERECIPE + "/*"}
              element={<CreateRecipeWrapper />}
            />
            <Route
              path={ROUTES.EDIT_RECIPE + "/*"}
              element={<EditRecipeWrapper />}
            />
            <Route
              path={ROUTES.SEARCH_RESULTS}
              element={<SearchResultsPage />}
            />
            <Route path={ROUTES.RECIPE_DETAILS} element={<RecipeDetails />} />
            <Route path={ROUTES.PROFILE + "/*"} element={<ProfilePage />} />
            <Route path={ROUTES.RECIPE_SWIPER} element={<RecipeSwiper />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
