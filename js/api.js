
const API = "https://louisnguyen.azurewebsites.net";

const LOGIN = API + "/api/users/loginAdmin";
const GET_TOTAL = API + "/api/users/totalPostAndUser";
const GET_LIST_FREELANCER = API + "/api/users/listFreelancer";

const GET_ALL_POST = API + "/api/posts";
const GET_ALL_COMPANY = API + "/api/users/listCompany";

const GET_POST_REQUEST_BY_USERNAME = API + "/api/UsersHavingPosts/requestedPosts";
const GET_POST_ACCEPTED_BY_USERNAME = API + "/api/UsersHavingPosts/acceptedPosts";

const BLOCK_UNBLOCK = API + "/api/users/status";


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
const getFreelancer = (cb, cbPagination) => {
  axiosClient({
    method: "GET",
    url: GET_LIST_FREELANCER,
  }).then((result) => {
    localStorage.setItem("listFreelancer",JSON.stringify(result.data));
    console.log("freelancer",result.data);    
    cb(result.data);
    cbPagination(result.data);
    
  }).catch((error) => {
    console.log(error);
  })
};

//Hàm get all bài POST
const getAllPost = (cb) => {
  axiosClient({
    method: "GET",
    url: GET_ALL_POST
  }).then((result) => {
    localStorage.setItem("listPost",result.data);
    cb(result.data);
  }).catch((error) => console.log(error))
}

// Trả về danh sách các Company
const getAllCompany = (cb) => {
  axiosClient({
    method: "GET",
    url: GET_ALL_COMPANY
  }).then((result)=>{
    localStorage.setItem("listCompany",JSON.stringify(result.data));
    cb(result.data);

  }).catch((error) => console.log(error));
}


// Lấy các post đã request theo username
const getRequestPostByUsername = (username, cb) => {  
  axiosClient({
    method: "POST",
    url: GET_POST_REQUEST_BY_USERNAME,
    data:{
      "username" : username
    }
  }).then((result) => {
    if(result.status === 204){
      document.getElementById("btnRegisterPost").disabled = true;
    }else {
      console.log(result);
      document.getElementById("btnRegisterPost").disabled = false;
      cb(result.data);
    }  
  }).catch((error) => console.log(error));
};

// Lấy các post đã accepted theo username
const getAcceptedPostByUsername = (username, cb) => {
  axiosClient({
    method: "POST",
    url: GET_POST_ACCEPTED_BY_USERNAME,
    data:{
      "username" : username
    }
  }).then((result) => {
    if(result.status === 204){
      document.getElementById("btnAcceptedPost").disabled = true;
    }else{
      document.getElementById("btnAcceptedPost").disabled = false;
      cb(result.data);
    }
  })
}

// Block hay unblock username
const blockOrUnblock = (username, cb) => {
    axiosClient({
      method: "PUT",
      url: BLOCK_UNBLOCK,
      data: {
        "username" : username
      }
    }).then((result) => {
      getFreelancer(cb);
    }).catch((error) => console.log(error));
}

