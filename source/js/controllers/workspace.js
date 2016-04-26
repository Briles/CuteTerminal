module.exports = function ($scope) {
  'use strict';

  $scope.library = require('../../json/themelib.json');

  $scope.workspace = {
    themes: {},
  };

  // colorpicker
  $scope.colorpicker = {
    id: undefined,
    colorKey: undefined,
  };

  // Deletes all themes from the workspace
  $scope.clearWorkspace = function () {
    $scope.workspace.themes = {};
  };

  // Deletes a theme from the Workspace
  $scope.deleteTheme = function () {
    $scope.colorpicker.isActive = false;
    delete $scope.workspace.themes[this.id];
  };

  function uid() {
    var themes = $scope.workspace.themes;
    var id = Object.keys(themes).length + 1;
    if (themes[id]) {
      uid();
    }

    return id;
  }

  // Adds a theme to the workspace
  $scope.addTheme = function (name) {
    $scope.workspace.themes[uid()] = {
      name: '',
      palette: angular.copy($scope.library[(name || 'Monokai')]),
    };
  };

  $scope.hideColorpicker = function () {
    $scope.colorpicker.isActive = false;
  };

  $scope.showColorpicker = function () {
    $scope.colorpicker.color = this.color;
    $scope.colorpicker.colorKey = this.colorKey;
    $scope.colorpicker.id = this.id;
    $scope.colorpicker.isActive = true;
  };

  $scope.updatePaletteColor = function () {
    var color = tinycolor($scope.colorpicker.color);

    if (color.isValid()) {
      var id = $scope.colorpicker.id;
      var colorKey = $scope.colorpicker.colorKey;
      $scope.workspace.themes[id].palette[colorKey] = color.toHexString();
    }
  };

  $scope.activeColor = function () {
    var activeTheme = $scope.workspace.themes[$scope.colorpicker.id];
    if (activeTheme) {
      return activeTheme.palette[$scope.colorpicker.colorKey];
    }
  };
};
