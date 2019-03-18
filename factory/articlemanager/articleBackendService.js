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
            var authToken = authService.GetToken();
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
            var authToken = authService.GetToken();

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
            var authToken = authService.GetToken();
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
            var authToken = authService.GetToken();
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
            var authToken = authService.GetToken();

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
            var authToken = authService.GetToken();

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
            var authToken = authService.GetToken();
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
            var authToken = authService.GetToken();
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
            var authToken = authService.GetToken();
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
            var authToken = authService.GetToken();

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
            var authToken = authService.GetToken();

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
            var authToken = authService.GetToken();
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
        attachTagToArticle: function (tag,aId) {
            var authToken = authService.GetToken();

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
            var authToken = authService.GetToken();

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
        updateEnablityOfoArticle: function (aId,state) {
            var authToken = authService.GetToken();

            return $http({
                method: 'PUT',
                url: baseUrls.articleServiceUrl + "Article/"+aId+"/Enable/"+state


            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return [];
                }
            });
        },

        assignMasterApplication: function (masterId,childId) {
            var authToken = authService.GetToken();

            return $http({
                method: 'POST',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Application/"+childId+"/SetAsMasterApp/"+masterId

            }).then(function(response)
            {
                return response;
            });
        },

        updateApplication: function (resource) {
            var authToken = authService.GetToken();

            return $http({
                method: 'PUT',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Application/"+resource.id,
                data:resource

            }).then(function(response)
            {
                return response;
            });
        },

        deleteApplication: function (resource) {

            var authToken = authService.GetToken();
            return $http({
                method: 'DELETE',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Application/"+resource.id

            }).then(function(response)
            {
                return response;
            });
        },
        getUnassignedFiles: function () {

            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.fileServiceUrl+"Files?fileCategory=IVRCLIPS&fileFormat=audio/wav&assignedState=false"

            }).then(function(response)
            {
                return response;
            });
        },
        getFilesOfApplication: function (appID) {

            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.fileServiceUrl+"Files/Info/"+appID

            }).then(function(response)
            {
                return response;
            });
        },

        attachFilesWithApplication: function (appID,fileID) {

            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.fileServiceUrl+"File/"+fileID+"/AssignToApplication/"+appID

            }).then(function(response)
            {
                return response;
            });
        } ,
        detachFilesFromApplication: function (fileID) {

            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.fileServiceUrl+"File/"+fileID+"/DetachFromApplication"

            }).then(function(response)
            {
                return response;
            });
        },
        getDevelopers: function () {

            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Developers"

            }).then(function(response)
            {
                return response;
            });
        },
        ApplicationAssignToDeveloper: function (appId,devId) {

            var authToken = authService.GetToken();

            return $http({
                method: 'POST',
                url: baseUrls.appregistryServiceUrl + "APPRegistry/Application/"+appId+"/AssignToDeveloper/"+devId

            }).then(function(response)
            {
                return response;
            });
        }

    }
});