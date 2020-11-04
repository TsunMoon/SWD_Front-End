
const API = "https://thanhdeptrai.azurewebsites.net";

const LOGIN = API + "/api/users/loginAdmin";
const GET_TOTAL = API + "/api/users/totalPostAndUser";
const GET_LIST_FREELANCER = API + "/api/users/listFreelancer";

const axiosClient = axios.create({
  baseURL: API,
});

// login
const loginApi = (username, password) => {
  console.log("Vo hàm");
  axiosClient({
    method: "POST",
    url: LOGIN,
    data: {
      username: username,
      password: password,
    },
  })
    .then((result) => {
      console.log("Login Success");
      console.log(result.data);     
      localStorage.setItem("objectAdmin", JSON.stringify(result.data));
      swal({
        title: "Login Success",
        text: "",
        icon: "success",
      });
      setTimeout(() => {
        window.location.href = "admin.html";
      }, 2000);
    })
    .catch((error) => {
      console.log("Login thất bại");
      console.log(error);
      swal({
        title: "Login Failed",
        text: "Username or password didn't incorrect",
        icon: "error",
      });
      document.getElementById("inpUsername").value = "";
      document.getElementById("inpPassword").value = "";
    });
};

// lấy total posts, company, freelancer
const getTotalDashBoard = (cb) => {
  axiosClient({
    method: "GET",
    url: GET_TOTAL,    
  }).then((result) => {    
    //lưu tổng số posts, company, freelancer
    localStorage.setItem("dashboard_total", JSON.stringify(result.data)); 
    cb(result.data)   
    // return result.data;
  }).catch((error) => console.log(error));


}


//Trả về danh sách các 
const getFreelancer = () => {
  axiosClient({
    method: "GET",
    url: GET_LIST_FREELANCER,
  }).then((result) => {
    localStorage.setItem("listFreelacer",JSON.stringify(result.data));
  }).catch((error) => {
    console.log(error);
  })
};