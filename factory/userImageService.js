/** * Created by Damith on 12/6/2016. */mainApp.factory('userImageList', function ($http, baseUrls,notifiSenderService,$q) {    var userListSerivce = {        users: []    };    userListSerivce.users.getImage = function () {        return userListSerivce.users;    };    userListSerivce.getAvatarByUserName = function (userName, callback) {        for (var i = 0; i < userListSerivce.users.length; i++) {            if (userListSerivce.users[i].username == userName) {                callback(userListSerivce.users[i].avatar);            }        }        //return    };    userListSerivce.addInToUserList = function (res) {        serListSerivce.users = [];        userListSerivce.users = res.data.Result;    };    userListSerivce.getAllUsers = function (callback) {        userListSerivce.users = [];        notifiSenderService.getUserCount().then(function (row_count) {            var pagesize = 20;            var pagecount = Math.ceil(row_count / pagesize);            var method_list = [];            for (var i = 1; i <= pagecount; i++) {                method_list.push(notifiSenderService.LoadUsersByPage(pagesize, i));            }            $q.all(method_list).then(function (resolveData) {                if (resolveData) {                    resolveData.map(function (data) {                        data.map(function (item) {                            item.status = 'offline';                            item.callstatus = 'offline';                            item.callstatusstyle = 'call-status-offline';                            userListSerivce.users.push(item);                        });                    });                }                callback(true);            }).catch(function (err) {                console.error(err);                callback(true);            });        }, function (err) {            console.log(err);            callback(true);        });        /*var url = baseUrls.UserServiceBaseUrl + "Users";        $http.get(url).then(function (res) {            if (res.data && res.data.Result) {                userListSerivce.users = res.data.Result;                callback(true);            }        }, function (err) {            callback(true);            console.log(err);        });*/    };    return userListSerivce;});