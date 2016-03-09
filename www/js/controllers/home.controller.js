/*global angular*/
(function withAngular(angular) {
  'use strict';

  var HomeController = function HomeController($rootScope, $scope) {

    var that = this
      , choosedPackage
      , choosedPackageDir
      , updatePackage = function updatePackage() {

        $rootScope.$emit('user:update-package');
      }
      , selectGlobal = function selectGlobalDir() {

          $rootScope.globally = true;
          that.selectedProject = undefined;
          that.showMenuButtons = undefined;
          $rootScope.$emit('user:selected-global');
        }
      , selectProject = function selectProject(project, event) {
        if (event) {
          event.preventDefault();
        }

        $rootScope.globally = undefined;
        that.selectedProject = project;
        $rootScope.$emit('user:selected-project', project);
        that.showMenuButtons = undefined;
        if (event) {
          event.stopPropagation();
        }
      }
      , deleteProject = function deleteProject(project, event) {

        if (event) {
          event.preventDefault();
        }

        var index = $rootScope.projectsList.indexOf(project);
        $rootScope.projectsList.splice(index, 1);
        $rootScope.$emit('user:deleted-project', project);
        that.showMenuButtons = undefined;
        if (event) {
          event.stopPropagation();
        }
      }
      , unregisterOnSelectedPackage = $rootScope.$on('user:selected-package', function onSelectedPackage() {
        that.showMenuButtons = true;
      })
      , unregisterOnNewProject = $rootScope.$on('user:added-new-project', function onNewProject(eventInfo, data) {

        that.showMenuButtons = undefined;

        $scope.$evalAsync(function evalAsync() {

          $rootScope.projectsList.unshift(data);
          selectProject(data);
        });
      });

      $scope.$on('$destroy', function scopeDestroy() {

        unregisterOnNewProject();
        unregisterOnSelectedPackage();
      });

      that.selectGlobal = selectGlobal;
      that.selectProject = selectProject;
      that.deleteProject = deleteProject;
      that.updatePackage = updatePackage;
  }
  , inputFile = function inputFile($window, $rootScope) {
    return {
      'restrict': 'A',
      'scope': {
        'inputfile': '='
      },
      'link': function linkingFunction(scope, element) {

        element.bind('change', function onInputfileChange(changeEvent) {
          var selectedDir = changeEvent.target;

          if (selectedDir && selectedDir.files[0]) {

            $rootScope.$emit('user:added-new-project', {
              'name': selectedDir.files[0].name,
              'path': selectedDir.files[0].path
            });
          }
        });
      }
    };
  };

  angular.module('electron.home.controllers', [])
    .controller('HomeController', ['$rootScope', '$scope', HomeController])
    .directive('inputFile', ['$window', '$rootScope', inputFile]);
}(angular));
