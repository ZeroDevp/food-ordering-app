import React, { Fragment, useCallback, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./router";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./service/UserService";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./redux/userSlide";
import Loading from "./components/LoadingComponent/Loading";
function App() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)

  const handleGetDetailsUser = useCallback(async (id, token) => {
    try {
      //27/11
      // let storageRefreshToken = localStorage.getItem('refresh_token')
      // const refreshToken = JSON.parse(storageRefreshToken)
      //27/11
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (e) {
      console.log("Error getting details", e)
    }


  },
    [dispatch] // Nếu có thêm các dependency cần thiết, hãy thêm vào đây
  );


  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    } else {
      console.log("user not found");
    }
  }, [handleGetDetailsUser]);

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      // Do something before request is sent
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      //27/11
      // let storageRefreshToken = localStorage.getItem('refresh_token')
      // const refreshToken = JSON.parse(storageRefreshToken)
      // const decodedRefreshToken = jwtDecode(refreshToken)
      //27/11
      if (decoded?.exp < currentTime.getTime() / 1000) {
        // if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
        // } else {
        //   dispatch(resetUser())
        // }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const isCheckAuth = !route.isPrivate || user.isAdmin
              const Layout = route.isShowheader ? DefaultComponent : Fragment
              return (
                <Route key={route.path}
                  path={isCheckAuth ? route.path : ""} element={
                    <Layout>
                      <Page />
                    </Layout>
                  } />
              )
            })}
          </Routes>
        </Router>
      </Suspense>
    </div>
  )
}

export default App;


