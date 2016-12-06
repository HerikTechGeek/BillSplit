var myApp = angular.module('starter.controllers', [
  'ionic-material',
  'ionMdInput',

  'helpers'
])

myApp.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'helpersService', function($scope, $ionicModal, $timeout, helpersService) {
  // Form data for the login modal
  // $scope.txtSearch = "";
  // $scope.loginData = {};
  $scope.bill = {};
  // console.log("$scope.bills", $scope.bills);
  $scope.bills = helpersService.getBillList();
  console.log("BILLS LIST", $scope.bills);

  $scope.joinNames = function(contributersArray) {
    var finalString = "";
    angular.forEach(contributersArray, function(val, key) {
      finalString += val.name.trim();
      if (key < contributersArray.length - 1) {
        finalString = finalString + ", ";
      }
    });
    return finalString;
  }
}])

.controller('billDetailController', ['$scope', '$stateParams', 'helpersService', function($scope, $stateParams, helpersService) {
  $scope.billID = $stateParams.billID;
  $scope.bill = helpersService.getBillDetails($scope.billID);
}])

.controller('billCreateController', ['$scope', '$rootScope', '$stateParams', '$ionicModal', 'helpersService', function($scope, $rootScope, $stateParams, $ionicModal, helpersService) {

  // $scope.initForm = function() {
  // console.log("initForm CALLED");
  if(!$stateParams.billID) {
    $scope.bill.items = [];
    $scope.bill.total_tax_amount_label_show = 0;
    $scope.bill.total_tax_percentage_label_show = 0;
    $scope.bill.total_tax_amount = 0;
    $scope.bill.total_tax_percentage = 0;
    $scope.bill.items.count = 0;
    $scope.bill.sum_amount = 0;
  }
  else {
    $scope.bill = null;
  }
  // $scope.bill.title = "Paradise";
  // $scope.bill.total_amount = 1000;
  // $scope.bill.total_tax_amount = 110;
  // $scope.bill.total_tax_percentage = 11;
  //
  // itemObj1 = {
  //   name: 'Egg Biryani',
  //   price: 500
  // }
  // itemObj2 = {
  //   name: 'Veg Biryani',
  //   price: 500
  // }
  //
  // $scope.bill.items.push(itemObj1);
  // $scope.bill.items.push(itemObj2);

  // }
  // $scope.initForm();
  $scope.viewTitle = "Create New";
  // $scope.bill.title = "Rendezvous";
  // $scope.bill.total_amount = 2000;


  $scope.addBillNode = function(index) {
    console.log(index, $scope.bill.items.length - 1);
    if (index !== undefined) {
      if (index == $scope.bill.items.length - 1) {
        $scope.bill.items.push({
          item: {
            name: '',
            price: '',
            contributers: ''
          }
        });
      }
    } else {
      $scope.bill.items.push({
        name: '',
        price: '',
        contributers: ''
      });
    }
  }

  $scope.addBillNode();

  $scope.saveBill = function() {
    helpersService.saveBill($scope.bill);
    helpersService.alert("Success", "Bill is saved for future reference!");
    $rootScope.$broadcast("bill:saved");
    // helpersService.storeToLocalStorage($scope.bills);
  }

  $scope.$watchCollection("bill", function() {
    var billAmount = $scope.bill.total_amount;
    var taxAmount = $scope.bill.total_tax_amount;
    var taxPercent = $scope.bill.total_tax_percentage;

    // Set Defaults
    // if(!$scope.bill.total_tax_amount)  $scope.bill.total_tax_amount = 0;

    // console.log($scope.bill.total_tax_amount_label_show, $scope.bill.total_tax_percentage_label_show);
    // console.log("billAmount", billAmount, "taxAmount", taxAmount, "taxPercent", taxPercent)

    $scope.bill.total_tax_percentage_label = helpersService.calculatePercentage(taxAmount, billAmount);
    $scope.bill.total_tax_amount_label = helpersService.calculateAmountFromPercentage(taxPercent, billAmount);

    if ($scope.bill.total_tax_amount_label_show) {
      taxAmount = $scope.bill.total_tax_amount_label;
    }

    // if($scope.bill.total_tax_percentage_label_show) {
    //   taxAmount = $scope.bill.total_tax_amount_label_show;
    // }

    $scope.bill.grand_total = parseFloat(taxAmount) + parseFloat(billAmount);
    document.title = $scope.bill.grand_total;

    // console.log("FIRE onContributersUpdate");
    angular.forEach($scope.bill.items, function(val, key) {
      // console.log(key);
      $scope.onContributersUpdate(key);
    })
  }, true);

  $scope.onContributersUpdate = function(index) {
    var item = $scope.bill.items[index];
    if (item.contributers) {
      var singleCount = 0;
      var contributers = item.contributers.split(",").map(function(stringElement) {
        return String.prototype.trim.apply(stringElement);
      });
      var totalHeads = contributers.length + singleCount;
      var perHeadText = "";
      $scope.bill.items.count = 0;
      item.contributersArray = contributers;

      if (item.contributers.length > 0 && item.contributers.indexOf(",") == -1) {
        singleCount = 1;
      }

      if ($scope.bill.total_tax_percentage > 0) {
        // item.perhead = (item.price + (item.price / $scope.bill.total_tax_amount)) / totalHeads;
        // console.log($scope.bill.total_tax_percentage, item.price);
        item.perhead = helpersService.parseDecimal(item.price + helpersService.calculateAmountFromPercentage($scope.bill.total_tax_percentage, item.price));
        perHeadText = helpersService.parseDecimal((item.price) / totalHeads, 2) + " + " + helpersService.parseDecimal(helpersService.calculateAmountFromPercentage($scope.bill.total_tax_percentage, item.price), 2);
      } else {
        item.perhead = item.price;
        perHeadText = helpersService.parseDecimal(item.price / totalHeads, 2) + " + " + 0;
      }
      item.perhead = helpersService.parseDecimal((item.perhead / totalHeads), 2) // + " (" + perHeadText + ")";
        // console.log(item.contributers, contributers, item.perhead);

      // if (item.perhead) {
      //   $scope.bill.items.length
      // }
    }
  }
  $scope.onItemPriceUpdate = function() {
    var totalAmount = 0;
    angular.forEach($scope.bill.items, function(val, key) {
      // console.log(key, val.price);
      if (val.perhead) {
        totalAmount += parseFloat(parseFloat(val.perhead) * val.contributersArray.length);
      }
    });
    // console.log(totalAmount);
    $scope.bill.sum_amount = totalAmount;
  }

  $scope.generateContributions = function() {
    $scope.onItemPriceUpdate();
    angular.forEach($scope.bill.items, function(val, key) {
      $scope.onContributersUpdate(key);
    });

    if ($scope.bill.sum_amount >= $scope.bill.grand_total) {
      var uniqueUsers = [];
      var contributers = [];
      var tmpItems = [];
      var usersContributions = [];

      angular.forEach($scope.bill.items, function(val, key) {
        if (val.price != "") {
          var itemName = val.name;
          var perhead = parseFloat(val.perhead);
          angular.forEach(val.contributersArray, function(_contributer, contributerKey) {
            if (uniqueUsers.indexOf(_contributer) == -1) {
              uniqueUsers.push(_contributer);
              usersContributions.push({
                name: _contributer,
                amount: perhead,
                items: itemName
              });
            } else {
              angular.forEach(usersContributions, function(contributorObj, contributorKey) {
                if (contributorObj.name == _contributer) {
                  contributorObj.amount += perhead;
                  contributorObj.items += ", " + itemName;
                }
              });
            }
          });
          tmpItems.push(val);
        }
      });
      $scope.bill.items = tmpItems;

      $scope.bill.usersContributions = (usersContributions);

      $scope.bill.date = Date.now();
      // $scope.saveBill();
      $scope.openModal();
      // console.log(JSON.stringify($scope.bill, null, "\t"));
    }
    else {
      helpersService.alert("Oops!", "Items total is: <b>" + $scope.bill.sum_amount + "</b><br/>and grand total of amount which you entered is <b>" + $scope.bill.grand_total + "</b><br/><br/>It should be equal to generate contributions");
    }
  }


  $ionicModal.fromTemplateUrl('templates/common/_contributions.modal.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.modal = popover;
  });


  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

}])

.directive('itemsList', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/common/items-list.template.html'
  }
})
