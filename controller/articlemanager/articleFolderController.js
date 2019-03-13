mainApp.controller("articleFolderController", function ($scope, $filter, $stateParams,$anchorScroll, articleBackendService,ShareData) {



    $anchorScroll();

    $scope.folderList=[];
    $scope.newFolder={};
    $scope.userGroups=ShareData.UserGroups;

    if($stateParams.editmode)
    {
        $scope.newFolderView=$stateParams.editmode;
    }

    $scope.showAlert = function (title, type, content) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    var loadFolderListOfCategory = function () {

        articleBackendService.getFoldersOfCategory($stateParams.catId).then(function (resp) {
            $scope.folderList=resp.folders;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Article Categories")
        });
    }

    loadFolderListOfCategory();

    $scope.toggleNewFolderView = function () {
        $scope.newFolderView = !$scope.newFolderView;
    };




    $scope.AvailableBUnits = ShareData.BusinessUnits;

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(bu) {
            return (bu.unitName.toLowerCase().indexOf(lowercaseQuery) != -1);

        };
    }


    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.userGroups) {
                return $scope.userGroups;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.userGroups.filter(createFilterFor(query)) : [];
            return results;
        }

    };

    $scope.saveNewFolder = function () {

        $scope.newFolder.businessUnit=ShareData.BusinessUnit;

        articleBackendService.saveNewArticleFolder($scope.newFolder).then(function (resp) {

            $scope.folderList.push(resp);
            $scope.newFolder={};
            $scope.toggleNewFolderView();
            if($stateParams.catId)
            {
                articleBackendService.attachFolderToCategory($stateParams.catId,resp._id).then(function (resAttach) {
                    $scope.showAlert("Success","success","Folder Saved  Successfully");
                },function (errAttach) {
                    $scope.showAlert("Error","error","Folder Attaching to Category failed");
                })
            }
            else
            {
                $scope.showAlert("Success","success","Folder Saved  Successfully");
            }

        },function (err) {
            $scope.showAlert("Error","error","Folder Saving failed");
        })

    };

    $scope.goToFolders = function (item) {
        $state.go('console.articlefolders', {catId:item});
    };

});


