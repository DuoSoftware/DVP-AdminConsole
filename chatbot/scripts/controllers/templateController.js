mainApp.controller('templateController', function ($scope, $q, $anchorScroll, chatbotService, templateService, $state) {
    $anchorScroll();

    console.log("Template controller is up!");

    $scope.navigateToUI = function (location) {
        $state.go(location)
    }

    $scope.newTemplateSchema = function () {
        return {
            name: "",
            decription: "",
            company: 0,
            tenant: 0,
            updated_at: Date.now(),
            updated_at: Date.now(),
            type: "",
            items: [],
            buttons: []
        }
    }

    $scope.templateList = [
        {
            name: "Bot One",
            decription: "This is the first bot template",
            type: "generic",
            updated_at: Date.now()
        },
        {
            name: "Bot Two",
            decription: "This is the second bot template",
            type: "list",
            updated_at: Date.now()
        }
    ];

    $scope.AddNewTemplate = function (tempDetails) {
        var template = $scope.newTemplateSchema();
        template.name = tempDetails.name;
        template.decription = tempDetails.decription;
        template.type = tempDetails.type;
        $scope.templateList.push(template);
        $scope.SaveTemplate(template);
    }

    $scope.SaveTemplate = function (template) {
        templateService.CreateTemplate(template).then(function (response) {
            console.log(response);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Template", 'success', "New template created successfully.");
            } else {
                $scope.showAlert("Template", 'error', "Failed to create new template.");
            }
        }, function (error) {
            $scope.showAlert("Template", 'error', "Failed to create new template.");
        });
    }

    $scope.GetAllTemplates = function () {
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