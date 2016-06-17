mainApp.controller("appAccessManageController", function ($scope, $filter,$stateParams, appAccessManageService) {

    $scope.active = true;
    /*Load Application list*/
    $scope.showAlert = function (tittle, label, button, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'notice',
            styling: 'bootstrap3'
        });
    };

    $scope.consoleAppList = [];
    $scope.loadUserData = function () {
        var str = '{"_id":"575a60bbbb7565600a9e8bfb","consoleName":"ADMIN","created_at":"2016-06-10T06:39:55.693Z","updated_at":"2016-06-11T14:18:12.179Z","__v":0,"consoleNavigation":[{"_id":"575c1da37f1f1d7c171b2736","updated_at":"2016-06-11T14:18:11.503Z","created_at":"2016-06-11T14:18:11.503Z","navigationStatus":true,"navigationName":"ARDS_CONFIGURATION","scopes":[{"scopeName":"requestmeta","feature":"ards configuration access","_id":"575c1da37f1f1d7c171b2738","actions":["read","write","delete"]}]}],"consoleUserRoles":["admin","supervisor"]}';
        $scope.consoleAppList = JSON.parse(str);
    };
    $scope.loadUserData();

    $scope.userList = [];
    $scope.GetUserList = function () {

        appAccessManageService.GetUserList().then(function (response) {
            $scope.userList = response;
        }, function (error) {
            $scope.showAlert("Error", "Error", "ok", "There is an error ");
        });

    };
   // $scope.GetUserList();



    $scope.AddClientNavigationToUser = function () {

        var data = {
            "menuItem": navigationData.menuItem,
            "menuAction": {
                "Navigatione": navigationData.Navigatione,
                "read": true,
                "write": true,
                "delete": true,
            }
        };

        appAccessManageService.AddSelectedNavigationToUser().then(function (response) {


        }, function (error) {
            $scope.showAlert("Error", "Error", "ok", "There is an error ");
        });

    };

    $scope.DeleteSelectedNavigationFrmUser = function () {

        appAccessManageService.DeleteSelectedNavigationFrmUser().then(function (response) {

        }, function (error) {
            $scope.showAlert("Error", "Error", "ok", "There is an error ");
        });

    };

    $scope.assignableNavigations = [];
    $scope.GetAssignableNavigations = function (username,role) {
        appAccessManageService.GetAssignableNavigations(role).then(function (response) {
            $scope.assignableNavigations = response;
            $scope.GetNavigationAssignToUser(username);
        }, function (error) {
            $scope.showAlert("Error", "Error", "ok", "There is an error ");
        });

    };


    $scope.assignedNavigations = [];
    $scope.GetNavigationAssignToUser = function (userName) {
        appAccessManageService.GetNavigationAssignToUser(userName).then(function (response) {
            if (response.IsSuccess) {

                angular.forEach(response.Result.client_scopes, function (item) {
                    var items = $filter('filter')($scope.assignableNavigations, {consoleName: item.consoleName})
                    if (items) {
                        var index = $scope.assignableNavigations.indexOf(items[0]);
                        if (index > -1) {
                            var temptask = $scope.assignableNavigations[index];
                            temptask.consoleNavigation.saveItem = {};
                            temptask.consoleNavigation.saveItem = item.menus;
                            $scope.assignedNavigations.push(temptask);
                            $scope.assignableNavigations.splice(index, 1);
                        }
                    }
                });
                $scope.active = true;
            }

        }, function (error) {
            $scope.showAlert("Error", "Error", "ok", "There is an error ");
        });
    };

    $scope.assignNavigation = function () {
        appAccessManageService.AddConsoleToUser($scope.selectedUser, $scope.DragObject.consoleName).then(function (response) {
            if (!response) {
                var index = $scope.assignedNavigations.indexOf($scope.DragObject);
                if (index != -1) {
                    $scope.assignedNavigations.splice(index, 1);
                    $scope.assignableNavigations.push($scope.DragObject);
                }
            }
        }, function (error) {
            $scope.showAlert("Error", "Error", "ok", "There is an error ");
        });
    };

    $scope.removeNavigation = function () {
        appAccessManageService.DeleteConsoleFrmUser($scope.selectedUser, $scope.DragObject.consoleName).then(function (response) {
            if (!response) {
                var index = $scope.assignableNavigations.indexOf($scope.DragObject);
                if (index != -1) {
                    $scope.assignableNavigations.splice(index, 1);
                    $scope.assignedNavigations.push($scope.DragObject);
                }

            }
        }, function (error) {
            $scope.showAlert("Error", "Error", "ok", "There is an error ");
        });
    };

    $scope.DragObject = {};
    $scope.setCurrentDrag = function (item) {
        $scope.DragObject = item;
        $scope.showEditWindow = false;
    };

    $scope.showEditWindow = false;
    $scope.selectedConsole = {};
    $scope.showEditView = function (item) {
        $scope.selectedConsole = item;
        $scope.showEditWindow = true;
    };

    $scope.selectedUser = {};
    $scope.selectUser = function (user,role) {
        $scope.active = false;
        $scope.assignedNavigations = [];
        $scope.selectedUser = user;
        $scope.showEditWindow = false;
        $scope.GetAssignableNavigations(user,role);

    };
    $scope.selectUser($stateParams.username,$stateParams.role);
});

