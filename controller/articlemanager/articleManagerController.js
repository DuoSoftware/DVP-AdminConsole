mainApp.controller("articleManagerController", function ($scope, $filter, $stateParams,$anchorScroll, articleBackendService,ShareData) {



    $anchorScroll();

    $scope.articleList=[];
    $scope.articleTags=[];
    $scope.newArticle={};
    $scope.folderId="";
    $scope.newArticleView=false;

    var loadArticlesOfFolder = function () {

        articleBackendService.getArticlesOfFolders($stateParams.fId).then(function (resp) {
            $scope.articleList=resp.articles;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Articles")
        });
    }
    var loadArticleTags = function () {

        articleBackendService.getArticlesTags().then(function (resp) {
            $scope.articleTags=resp;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Articles")
        });
    }
    var loadAllArticles = function () {

        articleBackendService.getAllArticles().then(function (resp) {
            $scope.articleList=resp;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Articles")
        });
    }

    if($stateParams.editmode =="true")
    {
        $scope.newArticleView=$stateParams.editmode;
    }

    if($stateParams.fId)
    {
        $scope.folderId=$stateParams.fId;
        loadArticlesOfFolder();
    }
    else
    {
        loadAllArticles();
    }

    $scope.showAlert = function (title, type, content) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };


    loadArticleTags();

    $scope.toggleNewArticleView = function () {
        $scope.newArticleView = !$scope.newArticleView;
    };

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(tag) {
            return (tag.tag.toLowerCase().indexOf(lowercaseQuery) != -1);

        };
    }


    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.articleTags) {
                return $scope.articleTags;
            }
            else {
                return [];
            }

        }
        else {
            var results = query ? $scope.articleTags.filter(createFilterFor(query)) : [];
            return results;
        }

    };

    $scope.saveNewArticle = function () {


        $scope.newArticle.businessUnit=ShareData.BusinessUnit;
        $scope.newArticle.folder=$scope.folderId;

        articleBackendService.saveNewArticle($scope.newArticle,$scope.folderId).then(function (resp) {

            $scope.articleList.push(resp);
            $scope.newArticle={};
            $scope.toggleNewArticleView();

        },function (err) {
            $scope.showAlert("Error","error","Article Saving failed");
        })

    };


});


