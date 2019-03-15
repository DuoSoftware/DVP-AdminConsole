mainApp.controller("articleCategoryManagerController", function ($scope, $filter, $stateParams,$anchorScroll,$state, articleBackendService,ShareData) {



    $anchorScroll();

    $scope.categoryList=[];
    $scope.newCat={};

    $scope.showAlert = function (title, type, content) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    var loadCategoryList = function () {

        articleBackendService.getCategories().then(function (resp) {
            $scope.categoryList=resp;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Article Categories")
        });
    }

    loadCategoryList();

    $scope.toggleNewCategoryView = function () {
        $scope.newCategoryView = !$scope.newCategoryView;
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
            if ($scope.AvailableBUnits) {
                return $scope.AvailableBUnits;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.AvailableBUnits.filter(createFilterFor(query)) : [];
            return results;
        }

    };

    $scope.saveNewCategory = function () {

        $scope.newCat.businessUnit=ShareData.BusinessUnit;
        articleBackendService.saveNewArticleCategory($scope.newCat).then(function (resp) {
            $scope.showAlert("Success","success","Category Saved Successfully");
            $scope.categoryList.push(resp);
            $scope.newCat={};
            $scope.toggleNewCategoryView();
        },function (err) {
            $scope.showAlert("Error","error","Category Saving failed");
        })

    };

    $scope.goToFolders = function (item) {
        $state.go('console.articlefolders', {catId:item,editmode:true});
    };

});


