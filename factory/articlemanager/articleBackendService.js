mainApp.factory('articleBackendService', function ($http, authService,baseUrls)
{
    var showAlert = function (title, type, content) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };
    return {

        getCategories: function () {

            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Categories"
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },

        saveNewArticleCategory: function (resource) {


            return $http({
                method: 'POST',
                url: baseUrls.articleServiceUrl + "Category",
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","New Article Category Adding Failed");
                    return [];
                }
            });
        },
        getFoldersOfCategory: function (catId) {

            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "FullCategory/"+catId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        getAllFolders: function () {

            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Folders"
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        saveNewArticleFolder: function (resource) {


            return $http({
                method: 'POST',
                url: baseUrls.articleServiceUrl + "Folder",
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","New Article Folder Adding Failed");
                    return [];
                }
            });
        },
        attachFolderToCategory: function (catId,fId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Category/"+catId+"/Folder/"+fId


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        getArticlesOfFolders: function (fId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "FullFolder/"+fId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        getAllArticles: function (fId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Articles"
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        getArticlesTags: function () {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Tags"
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        saveNewArticle: function (resource) {



            return $http({
                method: 'POST',
                url: baseUrls.articleServiceUrl + "Article",
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","New Article Adding Failed");
                    return [];
                }
            });
        },
        updateArticle: function (id,resource) {



            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+id,
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","New Article Adding Failed");
                    return [];
                }
            });
        },
        getFullArticle: function (aId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "FullArticle/"+aId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        getArticle: function (aId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "Article/"+aId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        attachTagToArticle: function (tag,aId) {



            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/Tag",
                data:{"tag":tag}


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        detachTagToArticle: function (tag,aId) {



            return $http({
                method: 'DELETE',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/Tag",
                data:{"tag":tag}


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        updateEnablityOfArticle: function (aId,state) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/Enable/"+state


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","Article State change failed");
                    return [];
                }
            });
        },
        getFullFolder: function (fId) {

            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "FullFolder/"+fId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        updateFolder: function (id,resource) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Folder/"+id,
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","New Folder Adding Failed");
                    return [];
                }
            });
        },
        attachUserGroupToArticle: function (gId,fId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Folder/"+fId+"/Group?allow_groups="+gId


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        detachUserGroupToArticle: function (gId,fId) {


            return $http({
                method: 'DELETE',
                url: baseUrls.articleServiceUrl + "Folder/"+fId+"/Group?allow_groups="+gId


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },

        getFullCategory: function (cId) {


            return $http({
                method: 'GET',
                url: baseUrls.articleServiceUrl + "FullCategory/"+cId
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        updateCategory: function (id,resource) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Category/"+id,
                data:resource

            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","Category updating Failed");
                    return [];
                }
            });
        },
        updateEnablityOfFolder: function (fId,state) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Folder/"+fId+"/Enable/"+state


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","Folder state Change failed");
                    return [];
                }
            });
        },
        updateEnablityOfCategory: function (cId,state) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Category/"+cId+"/Enable/"+state


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    showAlert("Error","error","Folder state Change failed");
                    return [];
                }
            });
        },
        attachBUToCategory: function (cId,bId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Category/"+cId+"/BU?allow_business_units="+bId


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        detachBUToCategory: function (cId,bId) {


            return $http({
                method: 'DELETE',
                url: baseUrls.articleServiceUrl + "Category/"+cId+"/BU?allow_business_units="+bId


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        attachSearchTagToArticle: function (tag,aId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/SearchTag",
                data:{"tags":tag}


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        detachSearchTagToArticle: function (tag,aId) {


            return $http({
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'DELETE',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/SearchTag",
                data:{"tags":tag}


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },
        attachSearchMetaToArticle: function (meta,aId) {


            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/SearchMeta",
                data:{"meta":meta}


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },






    }
});