mainApp.controller('templateController', function ($scope, $q, $anchorScroll, chatbotService, templateService, $state, $stateParams) {
    $anchorScroll();

    console.log("Template controller is up!");

    $scope.getTemplateTypes = function (type) {
        var returnArray = [];
        switch (type) {
            case "card": {
                returnArray = [
                    { "Key": "Generic", "Value": "generic" },
                    { "Key": "List", "Value": "list" }
                ]; break;
            }
            case "attachment": {
                returnArray = [
                    { "Key": "Image", "Value": "image" },
                    { "Key": "Audio", "Value": "audio" },
                    { "Key": "Video", "Value": "video" },
                    { "Key": "File", "Value": "file" }
                ]; break;
            }
        }
        return returnArray;
    }

    $scope.TemplateTypes = [];
    if ($stateParams.templateType == "cards") {
        $scope.TemplateCategory = "Card";
    } else if ($stateParams.templateType == "attachments") {
        $scope.TemplateCategory = "Attachment";
    }
    $scope.TemplateTypes = $scope.getTemplateTypes($scope.TemplateCategory.toLowerCase());

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
        template.type = tempDetails.type.Value;
        //$scope.templateList.push(template);
        $scope.SaveTemplate(template, $scope.TemplateCategory);
    }

    $scope.SaveTemplate = function (template, category) {
        templateService.CreateTemplate(template, category).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Template", 'success', "New template created successfully.");
                $scope.GetAllTemplates($scope.TemplateCategory);
            } else {
                $scope.showAlert("Template", 'error', "Failed to create new template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to create new template.");
        });
    }

    $scope.updateTemplate = function (template, category) {
        debugger
        templateService.UpdateTemplate(template, category).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Template", 'success', "Template updated successfully.");
                $scope.GetAllTemplates($scope.TemplateCategory);
            } else {
                $scope.showAlert("Template", 'error', "Failed to update template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to update template.");
        });
    };

    $scope.deleteTemplate = function (template, category) {
        templateService.DeleteTemplate(template, category).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Template", 'success', "Template deleted successfully.");
                $scope.GetAllTemplates($scope.TemplateCategory);
            } else {
                $scope.showAlert("Template", 'error', "Failed to delete template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to delete template.");
        });
    };

    $scope.GetAllTemplates = function (category) {
        $scope.templateList = [];
        templateService.GetAllTemplates(category).then(function (response) {
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
    $scope.GetAllTemplates($scope.TemplateCategory);
});