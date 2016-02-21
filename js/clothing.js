(function() {
    var app = angular.module('storeItems', []);
    
    app.controller('storeController', function(){
        this.items = storeItems;
    });
    
    app.controller('itemController', function(){
        this.itemSelected = 0;
        
        this.selectItem = function(setItem) {
            this.itemSelected = setItem;
        };
    });
    
    app.controller('detailController', function(){
        this.info = 1;
        
        this.selectInfo = function(setInfo) {
            this.info = setInfo;
        };
        
        this.isSelected = function(getInfo) {
            return this.info === getInfo;
        };
    });
    
    app.controller('reviewFormController', function() {
        this.open = 0;
        this.review = {};
        this.toggleForm = function(formToggle) {
            this.open = formToggle;
        };
        
        this.stateCheck = function(checkAgainst) {
            return this.open === checkAgainst;
        };
        
        this.addReview = function(product) {
            storeItems[product].reviews.push(this.review);
            this.review = {};
        };
    });
    
    // This function will list all of the products
    var storeItems [{
        "id":,
        "name":,
        "price":,
        "stock":20,
        "weight": 2.4
        "image": "",
        "description":"" 
    }];
 })();