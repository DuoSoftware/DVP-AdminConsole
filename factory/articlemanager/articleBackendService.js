mainApp.factory('articleBackendService', function ($http, authService,baseUrls)
{
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