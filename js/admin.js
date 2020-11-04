var listFreelancer = [];

// ===========  DASHBOARD ==============
const loadAdminProfile = () => {
  let objectAdmin = JSON.parse(localStorage.getItem("objectAdmin"));
  document.getElementById("admin_img").src = objectAdmin.avatar;
  document.getElementById("admin_name").innerHTML = objectAdmin.fullname;
};

//vẽ chart
const createChart = () => {
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
};

//load tổng số post, company và freelancer
const loadTotal = () => {
  let dashboard_total = JSON.parse(localStorage.getItem("dashboard_total"));

  document.getElementById("number_posts").innerHTML = dashboard_total.totalPost;
  document.getElementById("number_company").innerHTML =
    dashboard_total.totalCompany;
  document.getElementById("number_freelancer").innerHTML =
    dashboard_total.totalFreelancer;
};

//Khi click More info thì sẽ add thêm clas active vào các tab bên trái
const clickMoreInfo = () => {
  console.log("Vào more info");
  $("#v-pills-settings-tab").addClass("active");
  document
    .getElementById("v-pills-settings-tab")
    .setAttribute("aria-expanded", "true");
  document
    .getElementById("v-pills-home-tab")
    .setAttribute("aria-expanded", "flase");
  $("#v-pills-home-tab").removeClass("active");
};

// Hiển thị freelancer
const getFreelancerFromLocal = () => {
  let listFromLocal = JSON.parse(localStorage.getItem("listFreelacer"));

  if (!listFromLocal) return;

  listFreelancer = listFromLocal.map((item) => {
    let newFreelancer = new Freelancer(
      item.username,
      item.roleId,
      item.amount,
      item.fullname,
      item.rating,
      item.avatar,
      item.status
    );
    return newFreelancer;
  });

  renderFreelancer(listFreelancer);
};

//In list Freelancer
const renderFreelancer = (listObject) => {
  var tempStr = "";

  for (let i = 0; i < listObject.length; i++) {
    let currentFreelencer = listObject[i];

    tempStr += `<tr>
    <td class="table__img">
      <img
        src="${currentFreelencer.avatar}"
        alt=""
      />
    </td>
    <td>
        <span>${currentFreelencer.fullname} </span>
        <p style="font-weight: bold">${currentFreelencer.username} </p>
    </td>
    <td style="padding-top: 24px">${currentFreelencer.checkRating()}</td>
    <td style="padding-top: 24px">${currentFreelencer.amount}</td>
    ${
      currentFreelencer.checkStatus()
        ? `<td style="color: green; font-weight: bold">${currentFreelencer.status} <span style="margin-left: 12px" ><img style="width: 50px; height: 50px" src="./imageSrc/green_point.png"/></span></td>`
        : `<td style="color: red; font-weight: bold">${currentFreelencer.status} <span ><img style="width: 50px; height: 50px" src="./imageSrc/red_point.png"/></span></td>`
    }
    
    <td>
    <button  onclick="openDetail('${
      currentFreelencer.username
    }')" class="btn btn-info">
        <i class="fa fa-edit"></i>
      </button>
      ${
        currentFreelencer.checkStatus()
          ? `<button onClick="clickBan('${currentFreelencer.username}')" class="btn btn-danger" >
      <i class="fa fa-ban"></i>
    </button>`
          : `<button onClick="clickNotBan('${currentFreelencer.username}')" class="btn btn-success" >
    <i class="fa fa-check"></i>
  </button>`
      }
      
     
    </td>
  </tr>`;
  }

  document.getElementById("table__body").innerHTML = tempStr;
};

//khi click vào nút ban
const clickBan = (username) => { 
  $.confirm({
    title: 'Block người này!',
    content: 'Người này sẽ không đăng nhập được nữa',
    buttons: {
        confirm:{
          text: 'Confirm',
          btnClass: 'btn-red',
          action:() => {
            alert("Bay màu");
          }
        },
        cancel:{
          text: 'Cancel',
          btnClass: 'btn-blue',
          action:() => {
            alert("Hên quá cancel rồi");
          }
        },  
    }
});             
};

//khi click vào nút mở ban
const clickNotBan = (username) => {
  console.log("mở", username);
  $.confirm({
    title: 'Mở block người này!',
    content: 'Người này sẽ hoạt động bình thường được',
    buttons: {
        confirm:{
          text: 'Confirm',
          btnClass: 'btn-blue',
          action:() => {
            alert("Bay màu");
          }
        },
        cancel:{
          text: 'Cancel',
          btnClass: 'btn-red',
          action:() => {
            alert("Hên quá cancel rồi");
          }
        },  
    }
});   
}

//Hàm search theo username 
const searchFreelancer = () => {
  if(!listFreelancer) return;
  var listSearchFreelancer = [];
  let keyword = document.getElementById("inpSearchFreelancer").value.trim().toLowerCase();

  for(let i = 0; i < listFreelancer.length; i++){
    let currentFreelancer = listFreelancer[i];

    if(currentFreelancer.username.trim().indexOf(keyword) !== -1){
      listSearchFreelancer.push(currentFreelancer);
    }    
  }
  
  renderFreelancer(listSearchFreelancer);

}

const runApp = async () => {
 await loadAdminProfile();
 await createChart();
  getTotalDashBoard(function(data){
    console.log(data);
    loadTotal();
  });
  

  getFreelancer();
  getFreelancerFromLocal();
}

runApp();


//Nhấn chi tiết
const openDetail = (username) => {
  document.getElementById("btnOpenDetail").click();

  let newFreelancer = getUserbyUsername(username);

  if (newFreelancer !== -1) {
    console.log(newFreelancer);
    document.getElementById("detail__img_id").src = newFreelancer.avatar;
    document.getElementById("detail__fullname").innerHTML =
      newFreelancer.fullname;
     document.getElementById("detail__email").innerHTML = newFreelancer.username;
    document.getElementById(
      "detail__rating"
    ).innerHTML = newFreelancer.checkRating();
    document.getElementById(
      "detail__role"
    ).innerHTML = newFreelancer.checkRole();
    document.getElementById("detail__amount").innerHTML = newFreelancer.amount;
  }
};

// Lấy User by username
const getUserbyUsername = (username) => {
  for (let i = 0; i < listFreelancer.length; i++) {
    let currentUser = listFreelancer[i];
    if (username === currentUser.username) {
      return currentUser;
    }
  }
  return -1;
};


//Logout
const logout = () => {
  window.location.href = "index.html";
  localStorage.clear();
}