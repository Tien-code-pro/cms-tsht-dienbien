import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  matchRoutes,
} from "react-router-dom";
//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from "./AuthProtected";
import { useScrollLock } from "../Components/Hooks/UseScrollLock";
import { useProfile } from "../Components/Hooks/UserHooks";
import {
  getAPIListFunctionByUser,
  isUserAuthenticated,
} from "../helpers/fakebackend_helper";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_USER_PERMISSION } from "../store/auth/profile/actionTypes";
import AccountReader from "../pages/TSHT/Reader/AccountReader";
import AccountReaderDetail from "../pages/TSHT/Reader/AccountReaderDetail";
import CommentReader from "../pages/TSHT/Reader/CommentReader";
import MailReader from "../pages/TSHT/Reader/MailReader";
import InteractReader from "../pages/TSHT/Reader/InteractReader";

const Index = () => {
  const { lockScroll, unlockScroll } = useScrollLock();
  const { token } = useProfile();
  const [listRoleFunction, setListRoleFunction] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // const prevPage = useSelector((state) => state.PrevPage);
  // useEffect(() => {
  //   const matchedRouteItem = matchRoutes(authProtectedRoutes, location);
  //   console.log(
  //     5555555555,
  //     matchedRouteItem[0].route.name,
  //     prevPage.namePrevPage
  //   );
  //   if (
  //     matchedRouteItem[0].route.name &&
  //     matchedRouteItem[0].route.name !== prevPage.namePrevPage
  //   )
  //     dispatch(
  //       setStatePrevPage({
  //         name: "",
  //         data: null,
  //       })
  //     );
  // }, [location, navigate]);
  useEffect(() => {
    if (isUserAuthenticated()) {
      getAPIListFunctionByUser().then((res) => {
        if (res.data && res.data.list && res.status > 0) {
          var filterRoute = [];
          authProtectedRoutes.filter((e) => {
            var target = {};
            if (e.path === "*" || e.path === "/") {
              target = e;
              filterRoute.push(target);
            }
            res.data.list.filter((g) => {
              if (g.child_functions.length > 0) {
                g.child_functions.filter((f) => {
                  if (f.url === e.path) {
                    target = e;
                    filterRoute.push(target);
                  }
                });
              } else {
                if (g.url === e.path) {
                  target = e;
                  filterRoute.push(target);
                }
              }
            });
          });
          setListRoleFunction(filterRoute);
          dispatch({ type: UPDATE_USER_PERMISSION, payload: res.data.list });
        }
      });
    } else {
      var filterRoute = [];
      authProtectedRoutes.filter((e) => {
        var target = {};
        if (e.path === "*" || e.path === "/" || e.path === "/home") {
          target = e;
          filterRoute.push(target);
        }
      });
      setListRoleFunction(filterRoute);
    }
  }, [token]);

  useEffect(() => {
    unlockScroll();
  }, [navigate]);
  // useLayoutEffect(() => {
  //   if (
  //     !location.pathname.includes("/list-article") &&
  //     !location.pathname.includes("/update-article")
  //   ) {
  //     localStorage.removeItem("paginationFilter");
  //   }
  // }, [location]);
  return (
    <React.Fragment>
      <Routes>
        <Route>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
              exact={true}
            />
          ))}
        </Route>

        <Route>
          {listRoleFunction.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AuthProtected>
                  <VerticalLayout>{route.component}</VerticalLayout>
                </AuthProtected>
              }
              key={idx}
              exact={true}
            />
          ))}
          <Route
            path={"/reader/account"}
            element={
              <AuthProtected>
                <VerticalLayout>
                  <AccountReader />
                </VerticalLayout>
              </AuthProtected>
            }
            key={"account-reader"}
            exact={true}
          />
          <Route
            path={"/reader/account/:id"}
            element={
              <AuthProtected>
                <VerticalLayout>
                  <AccountReaderDetail />
                </VerticalLayout>
              </AuthProtected>
            }
            key={"account-reader"}
            exact={true}
          />
          <Route
            path={"/comment-reader-manage"}
            element={
              <AuthProtected>
                <VerticalLayout>
                  <CommentReader />
                </VerticalLayout>
              </AuthProtected>
            }
            key={"account-reader"}
            exact={true}
          />
          <Route
            path={"/mail-reader-manage"}
            element={
              <AuthProtected>
                <VerticalLayout>
                  <MailReader />
                </VerticalLayout>
              </AuthProtected>
            }
            key={"account-reader"}
            exact={true}
          />
          <Route
            path={"/interact-reader-manage"}
            element={
              <AuthProtected>
                <VerticalLayout>
                  <InteractReader />
                </VerticalLayout>
              </AuthProtected>
            }
            key={"account-reader"}
            exact={true}
          />
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
