angular
  .module('helpers', [])
  .service('helpersService', function($ionicPopup) {
    this.bills = JSON.parse('[{"items":[{"name":"Salami & Cheese","price":146,"contributers":"Vikranth","$$hashKey":"object:55","contributersArray":["Vikranth"],"perhead":"163.00"},{"item":{"name":"","price":"","contributers":""},"$$hashKey":"object:72","name":"Jumbo Burger","price":190,"contributers":"Rony","contributersArray":["Rony"],"perhead":"212.00"},{"item":{"name":"","price":"","contributers":""},"$$hashKey":"object:90","name":"Egg Biryani","price":160,"contributers":"Herik, Pramod","contributersArray":["Herik","Pramod"],"perhead":"89.50"},{"item":{"name":"","price":"","contributers":""},"$$hashKey":"object:112","name":"Beer","price":235,"contributers":"Rony, Vikranth","contributersArray":["Rony","Vikranth"],"perhead":"131.00"},{"item":{"name":"","price":"","contributers":""},"$$hashKey":"object:126"}],"total_tax_amount_label_show":0,"total_tax_percentage_label_show":1,"total_tax_amount":84.85,"total_tax_percentage":"11.61","sum_amount":816,"total_tax_percentage_label":"11.61","total_tax_amount_label":84.8691,"grand_total":815.85,"title":"Rendezous","total_amount":731,"usersContributions":[{"name":"Vikranth","amount":294,"items":"Salami & Cheese, Beer","$$hashKey":"object:147"},{"name":"Rony","amount":343,"items":"Jumbo Burger, Beer","$$hashKey":"object:146"},{"name":"Herik","amount":89.5,"items":"Egg Biryani","$$hashKey":"object:144"},{"name":"Pramod","amount":89.5,"items":"Egg Biryani","$$hashKey":"object:145"}],"date":1473675803828}]');

    // this.bills = [{
    //   "items": [{
    //     "name": "Egg Biryani",
    //     "price": 555,
    //     "$$hashKey": "object:42",
    //     "contributers": "Herik, Pramod",
    //     "contributersArray": [
    //       "Herik",
    //       "Pramod"
    //     ],
    //     "perhead": "308.00 (277.50 + 61.05)"
    //   }, {
    //     "name": "Veg Biryani",
    //     "price": 555,
    //     "$$hashKey": "object:43",
    //     "contributers": "Vivek, Pramod",
    //     "contributersArray": [
    //       "Vivek",
    //       "Pramod"
    //     ],
    //     "perhead": "308.00 (277.50 + 61.05)"
    //   }, {
    //     "name": "",
    //     "price": "",
    //     "contributers": "",
    //     "$$hashKey": "object:44"
    //   }],
    //   "total_tax_percentage_label_show": 0,
    //   "total_tax_amount_label_show": 0,
    //   "sum_amount": 1110,
    //   "date": Date.now(),
    //   "total_tax_percentage": 11,
    //   "total_tax_amount": 110,
    //   "title": "Paradise Biryani",
    //   "total_amount": 1000,
    //   "total_tax_percentage_label": "11.00",
    //   "total_tax_amount_label": 110,
    //   "grand_total": 1110,
    //
    //   "contributions": [{
    //     name: " Herik ",
    //     amount: (308 + 205.33)
    //   }, {
    //     name: " Vivek ",
    //     amount: 205.33
    //   }, {
    //     name: " Pramod ",
    //     amount: (205.33 + 308)
    //   }]
    // }];

    this.duplicateData = function(count) {
      var thisObj = this;
      for (i = 2; i < count + 2; i++) {
        pushKey = i;
        var obj = {
          ID: pushKey,
          title: 'Swathi Maharaja' + pushKey,
          total: 1800.00 + pushKey,
          date: new Date().toDateString(),
          items: [{
            name: 'Mini Meal',
            price: 150 + pushKey,
            tax: 19 + pushKey,
            taxPercentage: 2.5 + pushKey
          }]
        };
        thisObj.addBill(obj);
      }
    }

    this.addBill = function(billObj) {
      this.bills.push(billObj);
    }

    this.getBillList = function() {
      this.bills = this.fetchFromLocalStorage();
      console.log(this.bills);
      return this.bills;
    }

    this.getBillDetails = function(billID) {
      var found = false;
      angular.forEach(this.bills, function(val, key) {
        // console.log(val);
        if (val.ID == billID) {
          found = val;
        }
      });
      console.log(found);
      return found;
    }


    this.calculatePercentage = function(value, totalValue) {
      return parseFloat((value / totalValue) * 100).toFixed(2);
    }
    this.calculateAmountFromPercentage = function(percentageValue, totalValue) {
      return parseFloat((percentageValue * totalValue) / 100);
    }
    this.parseDecimal = function(number, decimals) {
      return parseFloat(number).toFixed(decimals);
    }

    this.saveBill = function(billObj) {
      if (!this.bills) {
        this.bills = [];
      }
      this.bills.push(billObj);
      // console.log(this.bills);
      this.storeToLocalStorage(this.bills);
    }

    this.storeToLocalStorage = function(bills) {
      try {
        localStorage.setItem("bills", JSON.stringify(bills));
      } catch (ex) {
        localStorage.setItem("bills", "");
      }
    }

    this.fetchFromLocalStorage = function() {
      try {
        return JSON.parse(localStorage.getItem("bills"));
      } catch (ex) {
        return ex;
      }
    }




    this.alert = function(_title, _message) {
      var alertPopup = $ionicPopup.alert({
        title: _title,
        template: _message
      });
      return alertPopup;
    }



  });
