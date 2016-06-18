/**
 * Created by Pawan on 6/13/2016.
 */
mainApp.factory('holdMusicBackendService', function ($http) {

    var authToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3YXJ1bmEiLCJqdGkiOiJlNjk1ZDM3Ny1kMTRkLTRjMTgtYTM5Ni0xYzcwZTQ5NGFjYzMiLCJzdWIiOiJBY2Nlc3MgY2xpZW50IiwiZXhwIjoxNDY2NzgzNzA5LCJ0ZW5hbnQiOjEsImNvbXBhbnkiOjI0LCJhdWQiOiJteWFwcCIsImNvbnRleHQiOnt9LCJzY29wZSI6W3sicmVzb3VyY2UiOiJzeXNtb25pdG9yaW5nIiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJkYXNoYm9hcmRldmVudCIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJkYXNoYm9hcmRncmFwaCIsImFjdGlvbnMiOlsicmVhZCJdfSx7InJlc291cmNlIjoibm90aWZpY2F0aW9uIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiXX0seyJyZXNvdXJjZSI6ImF0dHJpYnV0ZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJncm91cCIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJyZXNvdXJjZXRhc2thdHRyaWJ1dGUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidGFzayIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJwcm9kdWN0aXZpdHkiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiU2hhcmVkIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InRhc2tpbmZvIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImFyZHNyZXNvdXJjZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJhcmRzcmVxdWVzdCIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJyZXF1ZXN0bWV0YSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJxdWV1ZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJyZXF1ZXN0c2VydmVyIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InVzZXIiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlclByb2ZpbGUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoib3JnYW5pc2F0aW9uIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiXX0seyJyZXNvdXJjZSI6InJlc291cmNlIiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJwYWNrYWdlIiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJjb25zb2xlIiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJ1c2VyU2NvcGUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlckFwcFNjb3BlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InVzZXJNZXRhIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InVzZXJBcHBNZXRhIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImNsaWVudCIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJjbGllbnRTY29wZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJEaXNwYXRjaCIsImFjdGlvbnMiOlsid3JpdGUiXX0seyJyZXNvdXJjZSI6ImZpbGVzZXJ2aWNlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiXX0seyJyZXNvdXJjZSI6ImVuZHVzZXIiLCJhY3Rpb25zIjpbInJlYWQiXX0seyJyZXNvdXJjZSI6ImNvbnRleHQiLCJhY3Rpb25zIjpbInJlYWQiXX0seyJyZXNvdXJjZSI6ImFwcHJlZyIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIl19LHsicmVzb3VyY2UiOiJjYWxscnVsZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ0cnVuayIsImFjdGlvbnMiOlsicmVhZCJdfSx7InJlc291cmNlIjoicXVldWVtdXNpYyIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJsaW1pdCIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIl19LHsicmVzb3VyY2UiOiJjZHIiLCJhY3Rpb25zIjpbInJlYWQiXX1dLCJpYXQiOjE0NjYxNzg5MDl9.HHLqJV_zYrF6S0X9fyOp1y7AwM44wMHHuLs7ZGbIHts';

    return {
        getHoldMusic: function () {
            return $http({
                method: 'GET',
                url: "http://queuemusic.104.131.67.21.xip.io/DVP/API/1.0.0.0/QueueMusic/Profiles",
                headers: {
                    'authorization':authToken
                }
            }).then(function(response)
            {
                return response;
            });
        },

        getHoldMusicFiles: function () {
            return $http({
                method: 'GET',
                url: "http://fileservice.104.131.67.21.xip.io/DVP/API/1.0.0.0/FileService/Files?fileCategory=HOLDMUSIC&fileFormat=audio/wav",
                headers: {
                    'authorization':authToken
                }
            }).then(function(response)
            {
                return response;
            });
        },
        saveHoldMusicFiles: function (resource) {
            return $http({
                method: 'POST',
                url: "http://queuemusic.104.131.67.21.xip.io/DVP/API/1.0.0.0/QueueMusic/Profile",
                headers: {
                    'authorization':authToken
                },
                data:resource
            }).then(function(response)
            {
                return response;
            });
        },
        removeHoldMusicFiles: function (resource) {
            return $http({
                method: 'DELETE',
                url: "http://queuemusic.104.131.67.21.xip.io/DVP/API/1.0.0.0/QueueMusic/Profile/"+resource.Name,
                headers: {
                    'authorization':authToken
                },
                data:resource
            }).then(function(response)
            {
                return response;
            });
        },
        updateHoldMusicFiles: function (resource) {
            return $http({
                method: 'PUT',
                url: "http://queuemusic.104.131.67.21.xip.io/DVP/API/1.0.0.0/QueueMusic/Profile/"+resource.Name,
                headers: {
                    'authorization':authToken
                },
                data:resource
            }).then(function(response)
            {
                return response;
            });
        }

    }

});