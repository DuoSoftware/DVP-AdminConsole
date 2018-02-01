mainApp.controller('templateController', function ($scope, $q, $anchorScroll, chatbotService, templateService, $state) {
    $anchorScroll();

    console.log("Template controller is up!");

    $scope.navigateToUI = function (location) {
        $state.go(location)
    }

    $scope.newTemplateSchema = function () {
        return {
            name: "",
            description: "",
            company: 0,
            tenant: 0,
            updated_at: Date.now(),
            updated_at: Date.now(),
            type: "",
            items: [],
            buttons: []
        }
    }

    $scope.AddNewTemplate = function (tempDetails) {
        var template = $scope.newTemplateSchema();
        template.name = tempDetails.name;
        template.description = tempDetails.description;
        template.type = tempDetails.type;
        //$scope.templateList.push(template);
        $scope.SaveTemplate(template);
    }

    $scope.SaveTemplate = function (template) {
        templateService.CreateTemplate(template).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Template", 'success', "New template created successfully.");
                $scope.GetAllTemplates();
            } else {
                $scope.showAlert("Template", 'error', "Failed to create new template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to create new template.");
        });
    }

    $scope.updateTemplate = function (template) {
        templateService.UpdateTemplate(template).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Template", 'success', "Template updated successfully.");
                $scope.GetAllTemplates();
            } else {
                $scope.showAlert("Template", 'error', "Failed to update template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to update template.");
        });
    };

    $scope.deleteTemplate = function (template) {
        debugger
        templateService.DeleteTemplate(template).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Template", 'success', "Template deleted successfully.");
                $scope.GetAllTemplates();
            } else {
                $scope.showAlert("Template", 'error', "Failed to delete template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to delete template.");
        });
    };

    $scope.GetAllTemplates = function () {
        $scope.templateList = [];
        templateService.GetAllTemplates().then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                angular.forEach(response.data.Result, function (item) {
                    $scope.templateList.push(item);
                });
            } else {
                $scope.showAlert("Template", 'error', "Failed to create new template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to create new template.");
        });
    }
    $scope.GetAllTemplates();
});