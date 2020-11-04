class Freelancer{
    constructor(username, roleId, amount, fullname, rating, avatar, status){
        this.username = username;        
        this.roleId = roleId;
         this.amount = amount;
         this.fullname = fullname;
         this.rating = rating;
         this.avatar = avatar;
         this.status = status   
    }

     checkRating = () => {
        switch(this.rating){
            case 1: 
                return ` <span class="fa fa-star checked"></span>
                <span class="fa fa-star "></span>
                <span class="fa fa-star "></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>`;
            break;
            case 2: 
                return ` <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star "></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>`;
            break;
            case 3: 
                return ` <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star  "></span>
                <span class="fa fa-star  "></span>`;
            break;
            case 4: 
                return ` <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star"></span>`;
            break;
            case 5: 
                return ` <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star "></span>`;
            break;
            default:
                return ` <span class="fa fa-star "></span>
                <span class="fa fa-star "></span>
                <span class="fa fa-star "></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>`;
                break;
        }
    };

    checkRole = () => {
        if(this.roleId === 1){
            return "Admin";
        }else if(this.roleId ===2){
            return "Freelancer";
        }else if(this.roleId === 3){
            return "Company";
        }
    }

    checkStatus = () => {
        if(this.status === "active"){
            return true;
        }else
        return false;
    }


}