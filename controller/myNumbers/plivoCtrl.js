mainApp.controller("PlivoController", function ($scope, plivoAPI) {

    $scope.numberPrefix = '';
    $scope.searchType = "pattern";
    $scope.numberType = "any";
    $scope.isProcessing = false;
    $scope.numFilters = {};
    $scope.currentPage = 1;

    $scope.parseFloat = parseFloat;
    

    $scope.supportedCountries = [
        { prefix: "+1", code: "US", name: "United States (+1)" },
        { prefix: "+54", code: "AR", name: "Argentina (+54)" },
        { prefix: "+61", code: "AU", name: "Australia (+61)" },
        { prefix: "+43", code: "AT", name: "Austria (+43)" },
        { prefix: "+973", code: "BH", name: "Bahrain (+973)" },
        { prefix: "+32", code: "BE", name: "Belgium (+32)" },
        { prefix: "+55", code: "BR", name: "Brazil (+55)" },
        { prefix: "+359", code: "BG", name: "Bulgaria (+359)" },
        { prefix: "+1", code: "CA", name: "Canada (+1)" },
        { prefix: "+56", code: "CL", name: "Chile (+56)" },
        { prefix: "+86", code: "CN", name: "China (+86)" },
        { prefix: "+57", code: "CO", name: "Colombia (+57)" },
        { prefix: "+385", code: "HR", name: "Croatia (+385)" },
        { prefix: "+53", code: "CU", name: "Cuba (+53)" },
        { prefix: "+357", code: "CY", name: "Cyprus (+357)" },
        { prefix: "+420", code: "CZ", name: "Czech Republic (+420)" },
        { prefix: "+45", code: "DK", name: "Denmark (+45)" },
        { prefix: "+1", code: "DO", name: "Dominican Republic (+1)" },
        { prefix: "+20", code: "EG", name: "Egypt (+20)" },
        { prefix: "+503", code: "SV", name: "El Salvador (+503)" },
        { prefix: "+372", code: "EE", name: "Estonia (+372)" },
        { prefix: "+358", code: "FI", name: "Finland (+358)" },
        { prefix: "+33", code: "FR", name: "France (+33)" },
        { prefix: "+995", code: "GE", name: "Georgia (+995)" },
        { prefix: "+49", code: "DE", name: "Germany (+49)" },
        { prefix: "+233", code: "GH", name: "Ghana (+233)" },
        { prefix: "+30", code: "GR", name: "Greece (+30)" },
        { prefix: "+852", code: "HK", name: "Hong Kong (+852)" },
        { prefix: "+36", code: "HU", name: "Hungary (+36)" },
        { prefix: "+91", code: "IN", name: "India (+91)" },
        { prefix: "+62", code: "ID", name: "Indonesia (+62)" },
        { prefix: "+353", code: "IE", name: "Ireland (+353)" },
        { prefix: "+972", code: "IL", name: "Israel (+972)" },
        { prefix: "+39", code: "IT", name: "Italy (+39)" },
        { prefix: "+81", code: "JP", name: "Japan (+81)" },
        { prefix: "+371", code: "LV", name: "Latvia (+371)" },
        { prefix: "+370", code: "LT", name: "Lithuania (+370)" },
        { prefix: "+352", code: "LU", name: "Luxembourg (+352)" },
        { prefix: "+60", code: "MY", name: "Malaysia (+60)" },
        { prefix: "+356", code: "MT", name: "Malta (+356)" },
        { prefix: "+52", code: "MX", name: "Mexico (+52)" },
        { prefix: "+31", code: "NL", name: "Netherlands (+31)" },
        { prefix: "+64", code: "NZ", name: "New Zealand (+64)" },
        { prefix: "+47", code: "NO", name: "Norway (+47)" },
        { prefix: "+92", code: "PK", name: "Pakistan (+92)" },
        { prefix: "+507", code: "PA", name: "Panama (+507)" },
        { prefix: "+51", code: "PE", name: "Peru (+51)" },
        { prefix: "+63", code: "PH", name: "Philippines (+63)" },
        { prefix: "+48", code: "PL", name: "Poland (+48)" },
        { prefix: "+351", code: "PT", name: "Portugal (+351)" },
        { prefix: "+1", code: "PR", name: "Puerto Rico (+1)" },
        { prefix: "+974", code: "QA", name: "Qatar (+974)" },
        { prefix: "+40", code: "RO", name: "Romania (+40)" },
        { prefix: "+7", code: "RU", name: "Russia (+7)" },
        { prefix: "+966", code: "SA", name: "Saudi Arabia (+966)" },
        { prefix: "+65", code: "SG", name: "Singapore (+65)" },
        { prefix: "+421", code: "SK", name: "Slovakia (+421)" },
        { prefix: "+386", code: "SI", name: "Slovenia (+386)" },
        { prefix: "+27", code: "ZA", name: "South Africa (+27)" },
        { prefix: "+82", code: "KR", name: "South Korea (+82)" },
        { prefix: "+34", code: "ES", name: "Spain (+34)" },
        { prefix: "+46", code: "SE", name: "Sweden (+46)" },
        { prefix: "+41", code: "CH", name: "Switzerland (+41)" },
        { prefix: "+886", code: "TW", name: "Taiwan, Province Of China (+886)" },
        { prefix: "+66", code: "TH", name: "Thailand (+66)" },
        { prefix: "+90", code: "TR", name: "Turkey (+90)" },
        { prefix: "+380", code: "UA", name: "Ukraine (+380)" },
        { prefix: "+971", code: "AE", name: "United Arab Emirates (+971)" },
        { prefix: "+44", code: "GB", name: "United Kingdom (+44)" },
        { prefix: "+84", code: "VN", name: "Vietnam (+84)" },
    ]

    var plivoSearchOpts = {};

    $scope.setCountryPrefix = function(country){
        $scope.numberPrefix = country.prefix;
    };

    $scope.searchNumbers = function(reset){
        var reset = reset || false;

        if(reset){
            $scope.currentPage = 1;
        }

        plivoSearchOpts = {};
        
        if(!$scope.selectedCountry){
            $scope.showAlert("Plivo Number Search", 'error', "Please select the country!");
            return false;
        };

        $scope.isProcessing = true;

        plivoSearchOpts["country_iso"] = $scope.selectedCountry.code;
        plivoSearchOpts["type"] = $scope.numberType;

        if($scope.searchType == "pattern" && $scope.numFilters.searchNumPattern){
            plivoSearchOpts["pattern"] = $scope.numFilters.searchNumPattern;
        }else if($scope.searchType == "region" && $scope.numFilters.searchRegion){
            plivoSearchOpts["region"] = $scope.numFilters.searchRegion;
        }

        plivoSearchOpts["offset"] = ($scope.currentPage - 1) * 20;

        plivoAPI.searchNumbers(plivoSearchOpts).then(function (response) {
            if (response.IsSuccess) {
                $scope.numberSearchResult = {
                    numbers: response.Result.objects,
                    meta: response.Result.meta
                }
                $scope.showAlert("Plivo Number Search", 'success', response.CustomMessage);
            } else {
                $scope.showAlert("Plivo Number Search", 'error', response.CustomMessage);
            }
            $scope.isProcessing = false;
        }, function (err) {
            $scope.showAlert("Plivo Number Search", 'error', "Number search failed!");
            $scope.isProcessing = false;
        });

        
    };

});   