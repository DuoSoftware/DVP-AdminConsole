mainApp.controller("resourceController", function ($scope, $compile, $uibModal, $filter, $location, $log, resourceService) {


    $scope.tasksList = [];
    $scope.GetTasks = function () {
        resourceService.GetTasks().then(function (response) {
            $scope.tasksList = response
        }, function (error) {
            console.info("GetTasks err" + error);
        });
    };
    $scope.GetTasks();

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.resource = {};
    $scope.resources = [];
    $scope.GetResources = function (rowCount, pageNo) {
        resourceService.GetResources(rowCount, pageNo).then(function (response) {
            $scope.resources = response;
        }, function (error) {
            $log.debug("GetResources err");
            $scope.showAlert("Error", "Error", "ok", "There is an error ");
        });

    };
    $scope.GetResources(50, 1);

    $scope.addNew = false;
    $scope.addResource = function () {
        $scope.addNew = !$scope.addNew;
    };

    $scope.saveResource = function (resource) {
        resourceService.SaveResource(resource).then(function (response) {
            $scope.addNew = !response.IsSuccess;
            if (response.IsSuccess) {
                $scope.resources.splice(0, 0, response.Result);
            }

        }, function (error) {
            $log.debug("GetResources err");
            $scope.showAlert("Error", "Error", "ok", "There is an error ");
        });

    };

    $scope.GetResourcesCount = function () {

    };

    $scope.removeDeleted = function (item) {

        $scope.safeApply(function () {
            var index = $scope.resources.indexOf(item);
            if (index != -1) {
                $scope.resources.splice(index, 1);
            }
        });
        $scope.GetResourcesCount();

    };

    $scope.showAlert = function (tittle, label, button, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: 'notice',
            styling: 'bootstrap3'
        });
    };

    $scope.reloadPage = function () {
        $scope.GetResources(50, 1);
        console.info("reloadPage..........");
    };

    $scope.attributesList = {};
    $scope.LoadAttribute = function (item) {
        resourceService.GetAttributes().then(function (response) {
            $scope.attributesList = response;
        }, function (error) {
            console.info("GetAttributes err" + error);
        });
    };
    $scope.LoadAttribute();

});

mainApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, selectedTask) {

    $scope.selectedTask = selectedTask;

    $scope.ok = function () {
        $uibModalInstance.close($scope.selectedTask);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

mainApp.controller('addSkillModalInstanceCtrl', function ($scope, $uibModalInstance, selectedTask) {

    $scope.selectedAttribute = [];

    $scope.selectedTask = selectedTask;

    $scope.ok = function () {
        $scope.selectedTask.selectedAttribute = $scope.selectedAttribute;
        $uibModalInstance.close($scope.selectedTask);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

mainApp.controller('assignAttributeToTask', function ($scope) {

    $scope.selectedAttribute = [];

    $scope.selectedTask = selectedTask;

    $scope.ok = function () {
        $scope.selectedTask.selectedAttribute = $scope.selectedAttribute;
        $uibModalInstance.close($scope.selectedTask);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});