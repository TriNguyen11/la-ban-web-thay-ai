import { Navigate,useLocation } from "react-router-dom"
import {routes, APIs} from '@floorplan/App'

function CheckPrivateRoute({ children }) {
  const location = useLocation();
  let route
  Object.keys(routes).forEach((key, i) => {
    if (routes[key].path == location.pathname) {
      route = routes[key]
    }
  });
  // console.log(location.pathname)
  // console.log(auth,route.auth,route.path == location.pathname);
  // if (route != null && (route.auth == null || route.auth == true)) {
  //   return APIs.isLogged() ? children : <Navigate to={routes.login.path} />;
  // }
  // console.log(children)
  return children
}

export default CheckPrivateRoute
