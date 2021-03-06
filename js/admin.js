var listFreelancer = [];

var itemEachPage = 0;
var totalPage = 0;

// ===========  DASHBOARD ==============
const loadAdminProfile = () => {
  let objectAdmin = JSON.parse(localStorage.getItem("objectAdmin"));
  document.getElementById("admin_img").src = objectAdmin.avatar;
  document.getElementById("admin_name").innerHTML = objectAdmin.fullname;
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
const getFreelancerFromLocal = (strListLocal) => {
  let listFromLocal = JSON.parse(localStorage.getItem(strListLocal));
 
};

//In list Freelancer
const renderFreelancer = (listObject, strTableId, nameTab) => {
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
    <button  onclick="openDetail('${currentFreelencer.username}','${nameTab}')" class="btn btn-info">
        <i class="fa fa-edit"></i>
      </button>
      ${
        currentFreelencer.checkStatus()
          ? `<button onClick="clickBan('${currentFreelencer.username}')" class="btn btn-danger" >
      <i class="fa fa-ban"></i>
    </button>`
          : `<button onClick="clickBan('${currentFreelencer.username}')" class="btn btn-success" >
    <i class="fa fa-check"></i>
  </button>`
      }
      
     
    </td>
  </tr>`;
  }

  document.getElementById(strTableId).innerHTML = tempStr;
};




//khi click vào nút ban
const clickBan = (username) => { 
  
  $.confirm({
    title: 'Xác nhận thao tác này',
    content: 'Block or unblock',
    buttons: {
        confirm:{
          text: 'Confirm',
          btnClass: 'btn-red',
          action:() => {
            blockOrUnblock(username, () => {
              getFreelancer((data) => {
                if (!data) return;
            
                listFreelancer = data.map((item) => {
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
              
                renderFreelancer(listFreelancer,"table__body","freelancer");
            
              },(data)=> {

                itemEachPage =  document.getElementById("mySelect").value;
                //render ra các nút      
                totalPage = returnPage(data.length,itemEachPage);
                document.getElementById("total-item").innerHTML = listFreelancer.length;
                document.getElementById("total-page").innerHTML = totalPage;
                renderListPage(totalPage);
                clickToRender(1);
              });
            })
          }
        },
        cancel:{
          text: 'Cancel',
          btnClass: 'btn-blue',
          action:() => {
           
          }
        },  
    }
});             
};



//Hàm search theo username 
const searchFreelancer = () => {
  if(!listFreelancer) return;
  var listSearchFreelancer = [];
  let keyword = document.getElementById("inpSearchFreelancer").value.trim().toLowerCase();

  for(let i = 0; i < listFreelancer.length; i++){
    let currentFreelancer = listFreelancer[i];

    if(currentFreelancer.username.toLowerCase().trim().indexOf(keyword) !== -1){
      listSearchFreelancer.push(currentFreelancer);
    }    
  }
console.log(listSearchFreelancer);
  if(listSearchFreelancer.length === listFreelancer.length){
    console.log("Yui");
    totalPage = returnPage(listFreelancer.length,itemEachPage);
  document.getElementById("total-page").innerHTML = totalPage;
  renderListPage(totalPage);
  clickToRender(1);
  }
  else{
    renderFreelancer(listSearchFreelancer,"table__body","freelancer");
  }
  

}

const runApp = async () => {
 await loadAdminProfile();
  getTotalDashBoard(function(data){
    console.log(data);
    loadTotal();
  });
  

  getFreelancer((data) => {
    if (!data) return;

    listFreelancer = data.map((item) => {
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
  
    // renderFreelancer(listFreelancer,"table__body","freelancer");

  }, 
  (data) => {
      //Viết hàm phân trang vào đây

    itemEachPage =  document.getElementById("mySelect").value;
     //render ra các nút      
     totalPage = returnPage(data.length,itemEachPage);
     document.getElementById("total-item").innerHTML = listFreelancer.length;
     document.getElementById("total-page").innerHTML = totalPage;
     renderListPage(totalPage);
     clickToRender(1);
  });
  getFreelancerFromLocal('listFreelancer');
}

runApp();


//Nhấn chi tiết
const openDetail = (username, nametab) => {
  

  let newFreelancer;
  if(nametab === "freelancer"){
     newFreelancer = getUserbyUsername(username, listFreelancer);
     document.getElementById("btnOpenDetail").click();
  }else{
    
    
    document.getElementById("btnOpenDetailCompany").click();
    let listCompany = JSON.parse(localStorage.getItem("listCompany")).map((item) => {
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

    newFreelancer = getUserbyUsername(username, listCompany);
  }

 

  if (newFreelancer !== -1) {

    if(nametab === "freelancer"){
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
      document.getElementById("btnRegisterPost").onclick = detailRequestPost(newFreelancer.username);
      document.getElementById("btnAcceptedPost").onclick = detailAcceptedPost(newFreelancer.username);
    }else{
      document.getElementById("detail__img_id_company").src = newFreelancer.avatar;
      document.getElementById("detail__fullname_company").innerHTML =
        newFreelancer.fullname;
       document.getElementById("detail__email_company").innerHTML = newFreelancer.username;
      document.getElementById(
        "detail__rating_company"
      ).innerHTML = newFreelancer.checkRating();
      document.getElementById(
        "detail__role_company"
      ).innerHTML = newFreelancer.checkRole();
      document.getElementById("detail__amount_company").innerHTML = newFreelancer.amount;  
    }
    
    
   

  }
};

// Lấy User by username
const getUserbyUsername = (username, listToSort) => {
  for (let i = 0; i < listToSort.length; i++) {
    let currentUser = listToSort[i];
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



// HÀM POST

const loadPost = () => {
  getAllPost(function(data){


    renderPostWriter(filterPostType(data,"Writer"),1, "#writterModal");
    renderPostWriter(filterPostType(data,"Design"),2,"#designModal");
    renderPostWriter(filterPostType(data,"Translate"),3,"#translateModal");

    
  });
};

loadPost();

//Hiển thị Writer
const renderPostWriter = (listPost, indexType, idModal) => {

  var strTemp = "";

  for(var current of listPost){
    strTemp += `
    <div style="margin-top: 20px;" class="card ">
    <div class="card-header bg-dark text-white ">   
      <div class="row">
        <div style="color: yellow;" class="col-9">
          <span>#Keyword</span>
          <span>#Keyword</span>
          <span>#Keyword</span>
        </div>
        <div style="color: tomato; font-size: 20px;" class="col-3">Amount: <span>${current.amount}</span></div>
      </div>                
      
    </div>
    <div class="card-body bg-secondary text-center">
      <h5 class="card-title">${current.title}</h5>
      <p class="card-text">${current.description 
        ? 
        ( current.description.length > 60  ? current.description.replace(current.description.slice(60,current.description.length),"...")  : current.description )
        : 
        "Không có mô tả" }</p>
      <button onclick="showInDetailDescription('${current.description}',${indexType})" id="btnOpenModal" class="btn btn-success" data-toggle="modal" data-target=${idModal}>Detail Description</button>
      
    </div>
    <div style="color: white;" class="card-footer bg-info text-center ">
     ${current.createdDate.slice(11,13)+":"+current.createdDate.slice(14,16) +"  "+current.createdDate.slice(8,10) +"/"+current.createdDate.slice(5,7) +"/"+current.createdDate.slice(0,4)}     
    </div>
  </div>
    `
  }
  if(indexType === 1){
    document.getElementById("show_list_writer").innerHTML = strTemp;
   // document.getElementById("btnOpenModal").setAttribute("data-target","#writterModal")
  }else if(indexType === 2){
    document.getElementById("show_list_design").innerHTML = strTemp;
  //  document.getElementById("btnOpenModal").setAttribute("data-target","#designModal")
  }else if(indexType === 3){
    document.getElementById("show_list_translate").innerHTML = strTemp;
  //  document.getElementById("btnOpenModal").setAttribute("data-target","#translateModal")
  }
}




// Lọc ra các bài Post có postType là
const filterPostType = (listPost, postType) => {
  var listAfterFilter = [];
    for(var currentPost of listPost){
      if(currentPost.postType === postType){
        listAfterFilter.push(currentPost);
      }
    }
    localStorage.setItem(postType,JSON.stringify(listAfterFilter));
    return listAfterFilter;
}

//Hiện thị description trong tab DetailDescription
const showInDetailDescription = (desc, indexType) => {  
  if(desc !== "null"){
    
    if(indexType === 1){
      document.getElementById("modal_detail_writer").innerHTML = desc;
    }else if(indexType === 2){
      document.getElementById("modal_detail_design").innerHTML = desc;
    }else if(indexType === 3){
      document.getElementById("modal_detail_translate").innerHTML = desc;
    }

  }else{    
    if(indexType === 1){
      document.getElementById("modal_detail_writer").innerHTML = "Không có mô tả";
    }else if(indexType === 2){     
      document.getElementById("modal_detail_design").innerHTML = "Không có mô tả";
    }else if(indexType === 3){
      document.getElementById("modal_detail_translate").innerHTML = "Không có mô tả";
    }
  }
    
}


getAllCompany((data) => {
  var listCompany = data.map((item) => {
    let newFreelancer = new Freelancer(
      item.username,
      item.roleId,
      item.amount,
      item.fullname,
      item.rating,
      item.avatar,
      item.status
    )

    return newFreelancer
  });

document.getElementById("inpSearchCompany").oninput = () => searchByKeyword(listCompany,"inpSearchCompany","table__body_company","company");
// searchByKeyword(listCompany,"inpSearchCompany","table__body_company")
  renderFreelancer(listCompany, "table__body_company","company");
});


// Search 
const searchByKeyword = (listSearch, inpId, tableBodyId, nameTab) => {  
  if(!listSearch) return;
  var listSearchResponse = [];
  let keyword = document.getElementById(inpId).value.trim().toLowerCase();

  for(let i = 0; i < listSearch.length; i++){
    let current = listSearch[i];

    if(current.fullname.trim().toLowerCase().indexOf(keyword) !== -1){
      listSearchResponse.push(current);
    }    
  }
  
  renderFreelancer(listSearchResponse,tableBodyId,nameTab);

}


// Xem số các bài post đã reuqest theo username
const detailRequestPost = (username) => {  
  getRequestPostByUsername(username, (data) => {

    if(!data)  return;

    strTemp = "";
    for(let current of data){
      strTemp += `
      <div style="margin-top: 20px;" class="card ">
      <div class="card-header bg-dark text-white ">   
        <div class="row">
          <div style="color: yellow;" class="col-9">
            <span>#Keyword</span>
            <span>#Keyword</span>
            <span>#Keyword</span>
          </div>
          <div style="color: tomato; font-size: 20px;" class="col-3">Amount: <span>${current.amount}</span></div>
        </div>                
        
      </div>
      <div class="card-body bg-secondary text-center">
        <h5 class="card-title">${current.title}</h5>
        <p class="card-text">${current.description 
          ? 
          ( current.description.length > 60  ? current.description.replace(current.description.slice(60,current.description.length),"...")  : current.description )
          : 
          "Không có mô tả" }</p>
        
      </div>
      <div style="color: white;" class="card-footer bg-info text-center ">
       ${current.createdDate.slice(11,13)+":"+current.createdDate.slice(14,16) +"  "+current.createdDate.slice(8,10) +"/"+current.createdDate.slice(5,7) +"/"+current.createdDate.slice(0,4)}     
      </div>
    </div>
      `
    }


      document.getElementById("modal_request_post").innerHTML = strTemp;
  });
} 

//Xem các bài post đã accepted theo username
const detailAcceptedPost = (username) => {

  console.log(username);
  getAcceptedPostByUsername(username, (data) => {

    if(!data) return;
    strTemp = "";
    for(let current of data){
      strTemp += `
      <div style="margin-top: 20px;" class="card ">
      <div class="card-header bg-dark text-white ">   
        <div class="row">
          <div style="color: yellow;" class="col-9">
            <span>#Keyword</span>
            <span>#Keyword</span>
            <span>#Keyword</span>
          </div>
          <div style="color: tomato; font-size: 20px;" class="col-3">Amount: <span>${current.amount}</span></div>
        </div>                
        
      </div>
      <div class="card-body bg-secondary text-center">
        <h5 class="card-title">${current.title}</h5>
        <p class="card-text">${current.description 
          ? 
          ( current.description.length > 60  ? current.description.replace(current.description.slice(60,current.description.length),"...")  : current.description )
          : 
          "Không có mô tả" }</p>
        
      </div>
      <div style="color: white;" class="card-footer bg-info text-center ">
       ${current.createdDate.slice(11,13)+":"+current.createdDate.slice(14,16) +"  "+current.createdDate.slice(8,10) +"/"+current.createdDate.slice(5,7) +"/"+current.createdDate.slice(0,4)}     
      </div>
    </div>
      `
    }

    document.getElementById("modal_accepted_post").innerHTML = strTemp;

  });

}

//search post writer theo title
const searchWriter = () => {
  let keyword = document.getElementById("inpSearchPostWriter").value.trim().toLowerCase();  

  let listAfterSearch = [];

  let listSearch = JSON.parse(localStorage.getItem("Writer"));
  for(currentPost of listSearch){
    if(currentPost.title.trim().toLowerCase().indexOf(keyword) !== -1){
      listAfterSearch.push(currentPost);
    }
  }

  renderPostWriter(listAfterSearch,1, "#writterModal");

}

//search post design theo title
const searchDesign = () => {
  let keyword = document.getElementById("inpSearchPostDesign").value.trim().toLowerCase();  

  let listAfterSearch = [];

  let listSearch = JSON.parse(localStorage.getItem("Design"));
  for(currentPost of listSearch){
    console.log(currentPost.title.trim().toLowerCase());
    if(currentPost.title.trim().toLowerCase().indexOf(keyword) !== -1){
      listAfterSearch.push(currentPost);
    }
  }

  renderPostWriter(listAfterSearch,2, "#designModal");

}

//search post translate theo title
const searchTranslate = () => {
  let keyword = document.getElementById("inpSearchPostTranslate").value.trim().toLowerCase();  

  let listAfterSearch = [];

  let listSearch = JSON.parse(localStorage.getItem("Translate"));
  for(currentPost of listSearch){
    console.log(currentPost.title.trim().toLowerCase());
    if(currentPost.title.trim().toLowerCase().indexOf(keyword) !== -1){
      listAfterSearch.push(currentPost);
    }
  }

  renderPostWriter(listAfterSearch,3, "#translateModal");

}


var start = 0 ;
var end = 0;



// Thuật toán trả về số trang
const returnPage = (listLength, itemEachPage) => {

  if(listLength % itemEachPage === 0 ){
    return listLength / itemEachPage;
}

for(let i = 0 ; i < itemEachPage ; i++){
    if((listLength - i) % itemEachPage === 0){
        return ((listLength - i) / itemEachPage) + 1;
    }
}
return -1;
}

//Thuật toán tính thứ tự để render ra
const renderPageByClick = (currentPage, iteamEachPage) => {
  if(currentPage > 0){
    start = (currentPage - 1) * iteamEachPage;

    if((currentPage * iteamEachPage) > listFreelancer.length){
      end = listFreelancer.length;
    }else{
      end = currentPage * iteamEachPage;
    }

    
  }
}

//Phân trang

//Click để chuyển trang
const clickToRender = (numberPage) => {

  itemEachPage =  document.getElementById("mySelect").value;

  document.getElementById("dynamic_li_"+numberPage).classList.add("active");
  for(let i = 1 ; i <= totalPage; i++){
    if(i !== numberPage){
      document.getElementById("dynamic_li_"+i).classList.remove("active");
    }
  }

  console.log("numberPage", numberPage);
  renderPageByClick(numberPage, itemEachPage);
  console.log("start",start);
  console.log("end", end);

  let listFreeAfterPaging = [];
  for( let i = start ; i < end ; i++){
    listFreeAfterPaging.push(listFreelancer[i]);
  }  
  if(listFreeAfterPaging){
    renderFreelancer(listFreeAfterPaging,"table__body","freelancer");
  }

}

//render ra các nút để click
function renderListPage(totalPages) {
  let html = '';
  html += `<li id="dynamic_li_1" onclick="clickToRender(1)" class="current-page active"><a>${1}</a></li>`;
  for (let i = 2; i <= totalPages; i++) {
      html += `<li id="dynamic_li_${i}" onclick="clickToRender(${i})"><a>${i} </a></li>`;
  }
  if (totalPages === 0) {
      html = ''
  }
  document.getElementById('number-page').innerHTML = html;
}

//Khi select option thay đổi
const changeSelected = (value) => {
  itemEachPage = value;
  totalPage = returnPage(listFreelancer.length,itemEachPage);
  document.getElementById("total-page").innerHTML = totalPage;
  renderListPage(totalPage);
  clickToRender(1);
}





