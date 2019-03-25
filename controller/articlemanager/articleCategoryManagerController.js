mainApp.controller("articleCategoryManagerController", function ($scope, $filter, $stateParams,$anchorScroll,$state, articleBackendService,ShareData) {



    $anchorScroll();

    $scope.categoryList=[];
    $scope.newCat={};
    $scope.savebtn="Save";

    $scope.isSaving=false;
    $scope.isUpdating=false;

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
        $scope.savebtn="Save";
        $scope.isUpdating=false;
        $scope.newCat={}
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

        $scope.isSaving=true;
        if($scope.savebtn=="Save")
        {
            $scope.newCat.businessUnit=ShareData.BusinessUnit;
            articleBackendService.saveNewArticleCategory($scope.newCat).then(function (resp) {
                $scope.isSaving=false;
                $scope.showAlert("Success","success","Category Saved Successfully");
                $scope.categoryList.unshift(resp);
                $scope.newCat={};
                $scope.toggleNewCategoryView();
            },function (err) {
                $scope.showAlert("Error","error","Category Saving failed");
            })
        }
        else
        {
            articleBackendService.updateCategory($scope.newCat._id,$scope.newCat).then(function (resp) {
                $scope.isSaving=false;
                $scope.isUpdating=false;

                $scope.categoryList =  $scope.categoryList.filter(function (item) {
                    return item._id!=resp._id;
                });
                $scope.categoryList.unshift(resp);

                $scope.newCat={};
                $scope.toggleNewCategoryView();
                $scope.showAlert("Success","success","Category Saving Succeeded");
            },function (err) {
                $scope.showAlert("Error","error","Category Updating failed");
            })
        }


    };

    $scope.goToFolders = function (item,title) {
        $state.go('console.articlefolders', {catId:item,editmode:true,catName:title});
    };


    var loadFullCategory = function (cId) {
        articleBackendService.getFullCategory(cId).then(function (resp) {

            $scope.newCategoryView=true;
            $scope.newCat =resp;



        });
    };
    $scope.openForEditing = function (cId) {

        $anchorScroll();
        loadFullCategory(cId);
        $scope.savebtn="Update";
        $scope.isUpdating=true;


    };

    $scope.onChipAdd = function (chip) {

        if($scope.isUpdating)
        {
            articleBackendService.attachBUToCategory($scope.newCat._id,chip._id).then(function (resp) {

            });
        }


    };
    $scope.onChipDelete = function (chip) {


        if($scope.isUpdating)
        {
            articleBackendService.detachBUToCategory($scope.newCat._id,chip._id).then(function (resp) {

            });
        }


    };


        $scope.setEnable = function (cId,state) {
            articleBackendService.updateEnablityOfCategory(cId,state).then(function (resp) {

                $scope.showAlert("Success","success","State changed of Category");
            });

        }

    $scope.toolTipGenerator = function (state) {

        if(state)
        {
            return "UnPublish";
        }
        else
        {
            return "Publish";
        }
    }


});


