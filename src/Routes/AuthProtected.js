import React, { useState, useEffect } from "react";
import {
  Navigate,
  Route,
  useNavigate,
  useRoutes,
  matchRoutes,
  useLocation,
} from "react-router-dom";
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { setStatePrevPage } from "../store/actions";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch, useSelector } from "react-redux";
import { useProfile } from "../Components/Hooks/UserHooks";
import { logoutUser } from "../store/actions";
const AuthProtected = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userProfile, loading, token } = useProfile();
  const prevPage = useSelector((state) => state.PrevPage);
  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    } else if (!userProfile && loading && !token) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  /*
    redirect is un-auth access protected routes via url
  */

  if (!userProfile && loading && !token) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  // const matchedRouteItem = matchRoutes(authProtectedRoutes, location);

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {" "}
            <Component {...props} />{" "}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
