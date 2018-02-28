mainApp.controller('templateController', function ($scope, $q, $anchorScroll, chatbotService, templateService, $state, $stateParams) {
    $anchorScroll();

    console.log("Template controller is up!");

    $scope.getTemplateTypes = function (type) {
        var returnTypes = [];
        var returnContentTypes = [];
        switch (type) {
            case "card": {
                returnTypes = [
                    { "Key": "Select Type", "Value": "select" },
                    { "Key": "Generic", "Value": "generic" },
                    { "Key": "List", "Value": "list" }
                ];
                returnContentTypes = [
                    { "Key": "Select Content Type", "Value": "select" },
                    { "Key": "Dynamic", "Value": "dynamic" },
                    { "Key": "Static", "Value": "static" }
                ]
                break;
            }
            case "attachment": {
                returnTypes = [
                    { "Key": "Select Attachment Type", "Value": "select" },
                    { "Key": "Image", "Value": "image" },
                    { "Key": "Audio", "Value": "audio" },
                    { "Key": "Video", "Value": "video" },
                    { "Key": "File", "Value": "file" }
                ]; break;
            }
        }
        return { types: returnTypes, contentTypes: returnContentTypes };
    }

    $scope.navigateToUI = function (location) {
        $state.go(location)
    }

    $scope.newTemplateSchema = function () {
        var obj = $scope.getTemplateTypes($scope.TemplateCategory.toLowerCase());
        switch ($scope.TemplateCategory.toLowerCase()) {
            case "card": {
                return {
                    name: "",
                    description: "",
                    company: 0,
                    tenant: 0,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                    type: "select",
                    contentType: "select",
                    items: [],
                    buttons: []
                }
            }
            case "attachment": {
                return {
                    name: "",
                    description: "",
                    company: 0,
                    tenant: 0,
                    created_at: Date.now(),
                    updated_at: Date.now(),
                    type: "select",
                    title: "",
                    payload: {
                        url: ""
                    }
                }
            }
        }
    }

    $scope.AddNewTemplate = function (tempDetails) {
        $scope.SaveTemplate(tempDetails, $scope.TemplateCategory);
        $scope.newTemplate = $scope.newTemplateSchema();
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

    $scope.runDefaultFunctions = function () {
        $scope.TemplateTypes = [];
        $scope.TemplateContentTypes = [];
        if ($stateParams.templateType == "cards") {
            $scope.TemplateCategory = "Card";
        } else if ($stateParams.templateType == "attachments") {
            $scope.TemplateCategory = "Attachment";
        }
        var obj = $scope.getTemplateTypes($scope.TemplateCategory.toLowerCase());
        $scope.TemplateTypes = obj.types;
        $scope.TemplateContentTypes = obj.contentTypes;
        $scope.newTemplate = $scope.newTemplateSchema();
        $scope.GetAllTemplates($scope.TemplateCategory);
    }
    $scope.runDefaultFunctions();
});