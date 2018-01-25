mainApp.controller('chatbotController', function ($scope, $q, $anchorScroll, $http, baseUrls) {
    $anchorScroll();

    console.log("Chatbot controller is up!");

    $scope.CreateNewBot = function (newBot) {

        var bot = {
            "name": newBot.AppName,
            "company": 103,
            "tenant": 1,
            "screen_name": newBot.AppName,
            "status": true,
            "channel_facebook": {
                "company": 103,
                "tenant": 1,
                "page_id": "smoothdevbot",
                "app_id": "123456",
                "app_secret": "123456",
                "page_token": "EAARlNKkVmH0BACKZB87xROqPwlNDyaxX105VLwYMc7Gkcs8J8OXuO4yAnYWNwvR8mDpHa9o9G12h4LJSRqNWMuP6YGwuRwq5FSsuS7FlbIIVyHBZCgLrfZCBE1vrW78U3H91AZCZC4wZC0hN99MZAsNyY65vhLFlqEumElm3zPlkAZDZD",
                "verification_token": "123456"
            },
            "channel_slack": {
                "company": 103,
                "tenant": 1,
                "client_id": "295373426962.295411085860",
                "client_secret": "43e7c6b0eaeddb4e68f01b8e355d9fc2",
                "verification_token": "V4RziySqYN8QvGQuWHDjYcxD",
                "api_token": "xoxp-295373426962-296433140231-294719310272-7423be5fc086dd04f990bdccd43a6ada",
                "bot_token": "xoxb-295303466291-3v495qCgo2KpVJRthuQ8CGAx"

            },
            "avatar": "11111111111111111111111111111111111111111111"
        }

        $http({
            method: 'POST',
            url: baseUrls.botAPIUrl + "Bot/",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiYWEzOGRmZWYtNDFhOC00MWUyLTgwMzktOTJjZTY0YjM4ZDFmIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDIzODExMTgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAzODExMTh9.Gmlu00Uj66Fzts-w6qEwNUz46XYGzE8wHUhAJOFtiRo',
                'companyInfo': '1:103'
            },
            data: bot
        }).then(function successCallback(response) {
            console.log(response.data);
        }, function errorCallback(response) {
            console.log(response.data);
        });
    };
});