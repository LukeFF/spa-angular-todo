'use strict';

var app = angular.module('todoList', ['ngRoute', 'ngMaterial', 'LocalStorageModule']);

app.config(function($routeProvider, $mdThemingProvider) {
  $routeProvider.
    when('/', {templateUrl:'/partials/lists_body.html'}).
    when('/einstellungen', {templateUrl:'/partials/einstellungen_body.html'}).
    when('/impressum', {templateUrl:'/partials/impressum_body.html'});

  $mdThemingProvider.theme('default')
    .primaryPalette('teal')
    .accentPalette('orange');
});

app.controller('TodoCtrl', function($scope, $mdSidenav, $mdDialog, localStorageService) {

  $scope.init = function() {
    if (!localStorageService.get('todoList')) {
      $scope.lists = [{
        name: 'Projektarbeit SPA',
        todos: [{
          task: 'Create an Angular-js TodoList',
          done: false
        }, {
          task: 'Understanding Angular-js Directives',
          done: true
        }]
      }, {
        name: 'Bachelorarbeit',
        todos: [{
          task: 'Build an open-source website builder',
          done: false
        }, {
          task: 'BUild an Email Builder',
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
    $scope.show = 'All';
  };

    $scope.toggleLeftMenu = function() {
        $mdSidenav('left').toggle();
    };

  $scope.newTodo = '';
  $scope.newList = '';

  $scope.addTodo = function() {
    var newTodo = $scope.newTodo.trim();
    if (newTodo.length === 0) {
      return;
    }
    $scope.lists[$scope.selectedTab].todos.push({
      task: newTodo,
      done: false
    });
    /*Reset the Field*/
    $scope.newTodo = '';
  };

  $scope.addList = function() {
    var newList = $scope.newList.trim();
    if (newList.length === 0) {
      return;
    }
    $scope.lists.push({
      name: newList,
      todos: []
    });
    /*Reset the Field*/
    $scope.newList = '';
  };

  $scope.deleteTodo = function(index) {
    $scope.lists[$scope.selectedTab].todos.splice(index, 1);
  };

  $scope.deleteList = function(ev) {
    var confirm = $mdDialog.confirm()
      .title('Liste löschen?')
      .content('Soll die Liste '+$scope.lists[$scope.selectedTab].name +' wirklich gelöscht werden?')
      .ariaLabel('Liste löschen?')
      .ok('Löschen')
      .cancel('Abbrechen')
      .targetEvent(ev);
    $mdDialog.show(confirm).then(function() {
			$scope.lists.splice($scope.selectedTab, 1);
    });
  };

  $scope.markAll = function(status) {
    $scope.lists[$scope.selectedTab].todos.forEach(function(todo) {
      todo.done = status;
    });
  };

  $scope.$watch('model', function(newVal, oldVal) {
    if (newVal !== null && angular.isDefined(newVal) && newVal !== oldVal) {
      localStorageService.add('todoList', angular.toJson(newVal));
    }
  }, true);

});
