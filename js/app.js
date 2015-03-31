'use strict';

var app = angular.module('todoList', ['ngRoute', 'ngMaterial', 'LocalStorageModule']);

// Angular Routing = Navigation. Lädt beim Klick von Links die jeweilige Seite nach & fügt sie in den DOM ein
app.config(function($routeProvider, $mdThemingProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/lists_body.html',
      controller: 'TodoCtrl'
    })
    .when('/einstellungen', {
      templateUrl: '/partials/einstellungen_body.html'
    })
    .when('/impressum', {
      templateUrl: '/partials/impressum_body.html'
    })
    .otherwise({
      redirectTo: "/"
    });

  $mdThemingProvider.theme('default')
    .primaryPalette('teal')
    .accentPalette('orange');
});

// Ändert die CSS-Klasse der Navigation in der SideBar bei jedem $routeChangeSuccess
app.directive('activeMenu', ['$location', function($location) {
  return {
    restrict: 'A',
    replace: false,
    link: function(scope, elem) {
      scope.$on("$routeChangeSuccess", function() {
        var hrefs = ['/#' + $location.path(),
          '#' + $location.path(),
          $location.path()
        ];
        angular.forEach(elem.find('a'), function(a) {
          a = angular.element(a);
          if (-1 !== hrefs.indexOf(a.attr('href'))) {
            a.parent().addClass('active');
          } else {
            a.parent().removeClass('active');
          };
        });
      });
    }
  };
}]);

// Controller der App
app.controller('TodoCtrl', function($scope, $mdSidenav, $mdDialog, localStorageService) {

  // Initialisiert Default-Werte bei erstem Aufruf, wenn keine gespeicherten Daten gefunden
  $scope.init = function() {
    if (!localStorageService.get('todoList')) {
      $scope.lists = [{
        name: 'Projektarbeit SPA',
        todos: [{
          task: 'nach Weingarten fahren',
          done: true
        }, {
          task: 'Projektarbeit abgeben',
          done: false
        }]
      }, {
        name: 'Bachelorarbeit',
        todos: [{
            task: 'Thema suchen',
            done: true
          },{
          task: 'Anmelden',
          done: false
        }, {
          task: 'Schreiben',
          done: false
        }]
      }];
    } else {
      $scope.lists = localStorageService.get('todoList');
    }
    $scope.config = {
      user: 'Luke',
      showDone: true,
    }
  };

  $scope.newTodo = '';
  $scope.newList = '';

  // Blendet die SideBar ein & aus
  // https://material.angularjs.org/#/api/material.components.sidenav/directive/mdSidenav
  $scope.toggleLeftMenu = function() {
    $mdSidenav('left').toggle();
  };

  // Aufgabe in aktuell aktive Liste eintragen
  $scope.addTodo = function() {
    var newTodo = $scope.newTodo.trim();
    if (newTodo.length == 0) {
      return;
    }
    $scope.lists[$scope.selectedTab].todos.push({
      task: newTodo,
      done: false
    });
    $scope.newTodo = '';
  };

  // neue Liste erstellen
  $scope.addList = function() {
    var newList = $scope.newList.trim();
    if (newList.length == 0) {
      return;
    }
    $scope.lists.push({
      name: newList,
      todos: []
    });
    $scope.newList = '';
  };

  // Löscht Todo aus aktuell aktiver Liste
  $scope.deleteTodo = function(index) {
    $scope.lists[$scope.selectedTab].todos.splice(index, 1);
  };

  // Löscht aktuell aktive Liste nachdem Dialog bestätigt wird
  $scope.deleteList = function(ev) {
    var confirm = $mdDialog.confirm()
      .title('Liste löschen?')
      .content('Soll die Liste ' + $scope.lists[$scope.selectedTab].name + ' wirklich gelöscht werden?')
      .ariaLabel('Liste löschen?')
      .ok('Löschen')
      .cancel('Abbrechen')
      .targetEvent(ev);
    $mdDialog.show(confirm).then(function() {
      $scope.lists.splice($scope.selectedTab, 1);
    });
  };

  //Markiert alle Todos der aktuell aktiven Liste als erledigt
  $scope.markAll = function(status) {
    $scope.lists[$scope.selectedTab].todos.forEach(function(todo) {
      todo.done = status;
    });
  };

  // Wechselt zum nächsten Tab, TODO: MaxTabs überprüfen
  $scope.nextTab = function() {
    $scope.selectedTab = $scope.selectedTab + 1;
  };

  // Wechselt zum vorherigen Tab
  $scope.previousTab = function() {
    $scope.selectedTab = Math.max($scope.selectedTab - 1, 0);
  };

  // Überwacht Änderungen an todoList im DOM und speichert diese autom. in LocalStorage
  $scope.$watch('lists', function(newVal, oldVal) {
    if (newVal !== null && angular.isDefined(newVal) && newVal !== oldVal) {
      localStorageService.add('todoList', angular.toJson(newVal));
    }
  }, true);

});
