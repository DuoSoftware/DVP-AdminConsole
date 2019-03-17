mainApp.controller("articleManagerController", function ($scope, $filter, $stateParams,$anchorScroll, articleBackendService,ShareData) {



    $anchorScroll();

    $scope.articleList=[];
    $scope.articleTags=[];
    $scope.newArticle={};
    $scope.folderId="";
    $scope.isEditable=false;
    $scope.newArticleView=false;
    $scope.newTags=[];
    $scope.isSaving=false;
    $scope.isUpdating=false;
    $scope.savebtn="Save";


    var loadArticlesOfFolder = function () {

        articleBackendService.getArticlesOfFolders($stateParams.fId).then(function (resp) {
            $scope.articleList=resp.articles;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Articles")
        });
    };
    var loadArticleTags = function () {

        articleBackendService.getArticlesTags().then(function (resp) {
            $scope.articleTags=resp;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Articles")
        });
    };
    var loadAllArticles = function () {

        articleBackendService.getAllArticles().then(function (resp) {
            $scope.articleList=resp;
        },function (error) {
            $scope.showAlert("Error","error","Error in Loading Articles")
        });
    };
    var loadFullArticle = function (aId) {
        articleBackendService.getFullArticle(aId).then(function (resp) {

            $scope.newArticleView=true;


            $scope.newArticle =resp[0];

            $scope.newTags = resp[0].tags;
            resp[0].tags.forEach(function (item) {
                $scope.newArticle.tags=[];
                $scope.newArticle.tags.push(item.tag) ;
            });


        });
    };


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
        $scope.newArticle={};
        $scope.newTags=[];
        $scope.newArticleView = !$scope.newArticleView;
        $scope.savebtn="Save";
        $scope.isUpdating=false;

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

    $scope.onChipAdd = function (chip) {

        if(!$scope.newArticle.tags)
        {
            $scope.newArticle.tags=[];
        }
        $scope.newArticle.tags.push(chip.tag);
        if($scope.isUpdating)
        {
            articleBackendService.attachTagToArticle(chip.tag,$scope.newArticle._id).then(function (resp) {

            });
        }


    };
    $scope.onChipDelete = function (chip) {


        if($scope.isUpdating)
        {
            articleBackendService.detachTagToArticle(chip.tag,$scope.newArticle._id).then(function (resp) {
                console.log(resp);
            });
        }


    };

    $scope.saveNewArticle = function () {

        if($scope.savebtn=="Save")
        {
            $scope.newArticle.businessUnit=ShareData.BusinessUnit;
            $scope.newArticle.folder=$scope.folderId;
            $scope.isSaving=true;
            articleBackendService.saveNewArticle($scope.newArticle,$scope.folderId).then(function (resp) {
                $scope.isSaving=false;

                $scope.articleList.unshift(resp);

                resp.tags.forEach(function (item) {

                    index = $scope.articleTags.findIndex(function (i) {
                        i._id===item._id;
                    });
                    if(index==-1)
                    {
                        $scope.articleTags.push(item);
                    }

                });



                $scope.newArticle={};
                $scope.newTags=[];
                $scope.toggleNewArticleView();

            },function (err) {
                $scope.showAlert("Error","error","Article Saving failed");
            })
        }
        else
        {
            $scope.isSaving=true;
            delete $scope.newArticle.tags;

            articleBackendService.updateArticle($scope.newArticle._id,$scope.newArticle).then(function (resp) {
                $scope.isSaving=false;

                $scope.articleList =  $scope.articleList.filter(function (item) {
                    return item._id!=resp._id;
                });
                $scope.articleList.unshift(resp);

                resp.tags.forEach(function (item) {

                    index = $scope.articleTags.findIndex(function (i) {
                        i._id===item._id;
                    });
                    if(index==-1)
                    {
                        $scope.articleTags.push(item);
                    }

                });



                $scope.newArticle={};
                $scope.newTags=[];
                $scope.toggleNewArticleView();

            },function (err) {
                $scope.showAlert("Error","error","Article Updating failed");
            })
        }



    };

    $scope.openForEditing = function (aId) {

        $anchorScroll();
        loadFullArticle(aId);
        $scope.savebtn="Update";
        $scope.isUpdating=true;


    }

    $scope.setEnable = function (aId,state) {
        articleBackendService.updateEnablityOfoArticle(aId,state).then(function (resp) {

            $scope.showAlert("Success","success","State changed of Article");
        });

    }




});


