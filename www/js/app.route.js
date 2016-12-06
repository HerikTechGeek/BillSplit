angular
  .module('starter')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.createBill', {
        url: '/billCreate',
        views: {
          'menuContent': {
            templateUrl: 'templates/createNewBill.html',
            controller: 'billCreateController'
          }
        }
      })

    .state('app.single', {
      url: '/billDetails/:billID',
      views: {
        'menuContent': {
          templateUrl: 'templates/billDetails.template.html',
          controller: 'billDetailController'
        }
      }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/billCreate');
  });
