import globalState from "@floorplan/system/globalState";
import Event from "@floorplan/system/event";
import Navigation from "@floorplan/system/navigation";
import routes from "@floorplan/routes";
const Todos = {
  isLogged: () => {
    if (localStorage.getItem("accessToken")) {
      return true;
    }
    return false;
  },
  // as
  getBearerToken: () => {
    return localStorage.getItem("accessToken");
  },
  login: (data) => {
    console.log("aaa");
    return new Promise((resolve) => {
      axios
        .post("/api/customer/login", {
          email: data.email,
          password: data.password,
        })
        .then((response) => {
          // console.log('aaa')
          if (
            ((response.data && response.data.errors == null) ||
              Object.keys(response.data.errors).length == 0) &&
            response.data.access_token
          ) {
            localStorage.setItem("accessToken", response.data.access_token);
          }
          resolve(response);
        })
        .catch((error) => {
          console.log(error, "23232");
          resolve({});
        });
    });
  },
  logout: (data) => {
    // return new Promise((resolve) => {
    //   axios.defaults.headers.common = {'Authorization': `Bearer ${Todos.getBearerToken()}`}
    //   axios.post('/api/customer/logout').then(response => {
    //     resolve({})
    //   }).catch(function (error) {
    //     resolve({})
    //   });
    //   localStorage.removeItem('accessToken');
    // })
    localStorage.removeItem("accessToken");
  },
  syncAuthInfo: () => {
    return new Promise((resolve) => {
      let url = "/api/customer/info";
      axios.defaults.headers.common = {
        Authorization: `Bearer ${Todos.getBearerToken()}`,
      };
      axios
        .get(url)
        .then((response) => {
          resolve(response);
        })
        .catch(function (error) {
          resolve({});
        });
    });
  },
};
export default Todos;
