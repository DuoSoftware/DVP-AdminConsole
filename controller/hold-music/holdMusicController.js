/**
 * Created by Pawan on 6/13/2016.
 */
mainApp.controller("holdMusicController", function ($scope, $state, holdMusicBackendService, loginService) {

    $scope.holdMusicList = [];
    $scope.holdMusicFiles = [];
    $scope.addNew = false;
    $scope.searchCriteria = "";

    $scope.languages = [
        {"code": "ab", "name": "Abkhaz", "nativeName": "?????"},
        {"code": "aa", "name": "Afar", "nativeName": "Afaraf"},
        {"code": "af", "name": "Afrikaans", "nativeName": "Afrikaans"},
        {"code": "ak", "name": "Akan", "nativeName": "Akan"},
        {"code": "sq", "name": "Albanian", "nativeName": "Shqip"},
        {"code": "am", "name": "Amharic", "nativeName": "????"},
        {"code": "ar", "name": "Arabic", "nativeName": "???????"},
        {"code": "an", "name": "Aragonese", "nativeName": "Aragon�s"},
        {"code": "hy", "name": "Armenian", "nativeName": "???????"},
        {"code": "as", "name": "Assamese", "nativeName": "???????"},
        {"code": "av", "name": "Avaric", "nativeName": "???? ????, ???????? ????"},
        {"code": "ae", "name": "Avestan", "nativeName": "avesta"},
        {"code": "ay", "name": "Aymara", "nativeName": "aymar aru"},
        {"code": "az", "name": "Azerbaijani", "nativeName": "az?rbaycan dili"},
        {"code": "bm", "name": "Bambara", "nativeName": "bamanankan"},
        {"code": "ba", "name": "Bashkir", "nativeName": "??????? ????"},
        {"code": "eu", "name": "Basque", "nativeName": "euskara, euskera"},
        {"code": "be", "name": "Belarusian", "nativeName": "??????????"},
        {"code": "bn", "name": "Bengali", "nativeName": "?????"},
        {"code": "bh", "name": "Bihari", "nativeName": "???????"},
        {"code": "bi", "name": "Bislama", "nativeName": "Bislama"},
        {"code": "bs", "name": "Bosnian", "nativeName": "bosanski jezik"},
        {"code": "br", "name": "Breton", "nativeName": "brezhoneg"},
        {"code": "bg", "name": "Bulgarian", "nativeName": "????????? ????"},
        {"code": "my", "name": "Burmese", "nativeName": "?????"},
        {"code": "ca", "name": "Catalan; Valencian", "nativeName": "Catal�"},
        {"code": "ch", "name": "Chamorro", "nativeName": "Chamoru"},
        {"code": "ce", "name": "Chechen", "nativeName": "??????? ????"},
        {"code": "ny", "name": "Chichewa; Chewa; Nyanja", "nativeName": "chiChe?a, chinyanja"},
        {"code": "zh", "name": "Chinese", "nativeName": "?? (Zh?ngw�n), ??, ??"},
        {"code": "cv", "name": "Chuvash", "nativeName": "????? ?????"},
        {"code": "kw", "name": "Cornish", "nativeName": "Kernewek"},
        {"code": "co", "name": "Corsican", "nativeName": "corsu, lingua corsa"},
        {"code": "cr", "name": "Cree", "nativeName": "???????"},
        {"code": "hr", "name": "Croatian", "nativeName": "hrvatski"},
        {"code": "cs", "name": "Czech", "nativeName": "?esky, ?e�tina"},
        {"code": "da", "name": "Danish", "nativeName": "dansk"},
        {"code": "dv", "name": "Divehi; Dhivehi; Maldivian;", "nativeName": "??????"},
        {"code": "nl", "name": "Dutch", "nativeName": "Nederlands, Vlaams"},
        {"code": "en", "name": "English", "nativeName": "English"},
        {"code": "eo", "name": "Esperanto", "nativeName": "Esperanto"},
        {"code": "et", "name": "Estonian", "nativeName": "eesti, eesti keel"},
        {"code": "ee", "name": "Ewe", "nativeName": "E?egbe"},
        {"code": "fo", "name": "Faroese", "nativeName": "f�royskt"},
        {"code": "fj", "name": "Fijian", "nativeName": "vosa Vakaviti"},
        {"code": "fi", "name": "Finnish", "nativeName": "suomi, suomen kieli"},
        {"code": "fr", "name": "French", "nativeName": "fran�ais, langue fran�aise"},
        {"code": "ff", "name": "Fula; Fulah; Pulaar; Pular", "nativeName": "Fulfulde, Pulaar, Pular"},
        {"code": "gl", "name": "Galician", "nativeName": "Galego"},
        {"code": "ka", "name": "Georgian", "nativeName": "???????"},
        {"code": "de", "name": "German", "nativeName": "Deutsch"},
        {"code": "el", "name": "Greek, Modern", "nativeName": "????????"},
        {"code": "gn", "name": "Guaran�", "nativeName": "Ava�e?"},
        {"code": "gu", "name": "Gujarati", "nativeName": "???????"},
        {"code": "ht", "name": "Haitian; Haitian Creole", "nativeName": "Krey�l ayisyen"},
        {"code": "ha", "name": "Hausa", "nativeName": "Hausa, ??????"},
        {"code": "he", "name": "Hebrew (modern)", "nativeName": "?????"},
        {"code": "hz", "name": "Herero", "nativeName": "Otjiherero"},
        {"code": "hi", "name": "Hindi", "nativeName": "??????, ?????"},
        {"code": "ho", "name": "Hiri Motu", "nativeName": "Hiri Motu"},
        {"code": "hu", "name": "Hungarian", "nativeName": "Magyar"},
        {"code": "ia", "name": "Interlingua", "nativeName": "Interlingua"},
        {"code": "id", "name": "Indonesian", "nativeName": "Bahasa Indonesia"},
        {
            "code": "ie",
            "name": "Interlingue",
            "nativeName": "Originally called Occidental; then Interlingue after WWII"
        },
        {"code": "ga", "name": "Irish", "nativeName": "Gaeilge"},
        {"code": "ig", "name": "Igbo", "nativeName": "As?s? Igbo"},
        {"code": "ik", "name": "Inupiaq", "nativeName": "I�upiaq, I�upiatun"},
        {"code": "io", "name": "Ido", "nativeName": "Ido"},
        {"code": "is", "name": "Icelandic", "nativeName": "�slenska"},
        {"code": "it", "name": "Italian", "nativeName": "Italiano"},
        {"code": "iu", "name": "Inuktitut", "nativeName": "??????"},
        {"code": "ja", "name": "Japanese", "nativeName": "??? (??????????)"},
        {"code": "jv", "name": "Javanese", "nativeName": "basa Jawa"},
        {"code": "kl", "name": "Kalaallisut, Greenlandic", "nativeName": "kalaallisut, kalaallit oqaasii"},
        {"code": "kn", "name": "Kannada", "nativeName": "?????"},
        {"code": "kr", "name": "Kanuri", "nativeName": "Kanuri"},
        {"code": "ks", "name": "Kashmiri", "nativeName": "???????, ???????"},
        {"code": "kk", "name": "Kazakh", "nativeName": "????? ????"},
        {"code": "km", "name": "Khmer", "nativeName": "?????????"},
        {"code": "ki", "name": "Kikuyu, Gikuyu", "nativeName": "G?k?y?"},
        {"code": "rw", "name": "Kinyarwanda", "nativeName": "Ikinyarwanda"},
        {"code": "ky", "name": "Kirghiz, Kyrgyz", "nativeName": "?????? ????"},
        {"code": "kv", "name": "Komi", "nativeName": "???? ???"},
        {"code": "kg", "name": "Kongo", "nativeName": "KiKongo"},
        {"code": "ko", "name": "Korean", "nativeName": "??? (???), ??? (???)"},
        {"code": "ku", "name": "Kurdish", "nativeName": "Kurd�, ??????"},
        {"code": "kj", "name": "Kwanyama, Kuanyama", "nativeName": "Kuanyama"},
        {"code": "la", "name": "Latin", "nativeName": "latine, lingua latina"},
        {"code": "lb", "name": "Luxembourgish, Letzeburgesch", "nativeName": "L�tzebuergesch"},
        {"code": "lg", "name": "Luganda", "nativeName": "Luganda"},
        {"code": "li", "name": "Limburgish, Limburgan, Limburger", "nativeName": "Limburgs"},
        {"code": "ln", "name": "Lingala", "nativeName": "Ling�la"},
        {"code": "lo", "name": "Lao", "nativeName": "???????"},
        {"code": "lt", "name": "Lithuanian", "nativeName": "lietuvi? kalba"},
        {"code": "lu", "name": "Luba-Katanga", "nativeName": ""},
        {"code": "lv", "name": "Latvian", "nativeName": "latvie�u valoda"},
        {"code": "gv", "name": "Manx", "nativeName": "Gaelg, Gailck"},
        {"code": "mk", "name": "Macedonian", "nativeName": "?????????? ?????"},
        {"code": "mg", "name": "Malagasy", "nativeName": "Malagasy fiteny"},
        {"code": "ms", "name": "Malay", "nativeName": "bahasa Melayu, ???? ??????"},
        {"code": "ml", "name": "Malayalam", "nativeName": "??????"},
        {"code": "mt", "name": "Maltese", "nativeName": "Malti"},
        {"code": "mi", "name": "Maori", "nativeName": "te reo M?ori"},
        {"code": "mr", "name": "Marathi", "nativeName": "?????"},
        {"code": "mh", "name": "Marshallese", "nativeName": "Kajin M?aje?"},
        {"code": "mn", "name": "Mongolian", "nativeName": "??????"},
        {"code": "na", "name": "Nauru", "nativeName": "Ekakair? Naoero"},
        {"code": "nv", "name": "Navajo, Navaho", "nativeName": "Din� bizaad, Din�k?eh?�"},
        {"code": "nb", "name": "Norwegian Bokmal", "nativeName": "Norsk bokm�l"},
        {"code": "nd", "name": "North Ndebele", "nativeName": "isiNdebele"},
        {"code": "ne", "name": "Nepali", "nativeName": "??????"},
        {"code": "ng", "name": "Ndonga", "nativeName": "Owambo"},
        {"code": "nn", "name": "Norwegian Nynorsk", "nativeName": "Norsk nynorsk"},
        {"code": "no", "name": "Norwegian", "nativeName": "Norsk"},
        {"code": "ii", "name": "Nuosu", "nativeName": "??? Nuosuhxop"},
        {"code": "nr", "name": "South Ndebele", "nativeName": "isiNdebele"},
        {"code": "oc", "name": "Occitan", "nativeName": "Occitan"},
        {"code": "oj", "name": "Ojibwe, Ojibwa", "nativeName": "????????"},
        {
            "code": "cu",
            "name": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
            "nativeName": "????? ??????????"
        },
        {"code": "om", "name": "Oromo", "nativeName": "Afaan Oromoo"},
        {"code": "or", "name": "Oriya", "nativeName": "?????"},
        {"code": "os", "name": "Ossetian, Ossetic", "nativeName": "???? �????"},
        {"code": "pa", "name": "Panjabi, Punjabi", "nativeName": "??????, ???????"},
        {"code": "pi", "name": "Pali", "nativeName": "????"},
        {"code": "fa", "name": "Persian", "nativeName": "?????"},
        {"code": "pl", "name": "Polish", "nativeName": "polski"},
        {"code": "ps", "name": "Pashto, Pushto", "nativeName": "????"},
        {"code": "pt", "name": "Portuguese", "nativeName": "Portugu�s"},
        {"code": "qu", "name": "Quechua", "nativeName": "Runa Simi, Kichwa"},
        {"code": "rm", "name": "Romansh", "nativeName": "rumantsch grischun"},
        {"code": "rn", "name": "Kirundi", "nativeName": "kiRundi"},
        {"code": "ro", "name": "Romanian, Moldavian, Moldovan", "nativeName": "rom�n?"},
        {"code": "ru", "name": "Russian", "nativeName": "??????? ????"},
        {"code": "sa", "name": "Sanskrit (Sa?sk?ta)", "nativeName": "?????????"},
        {"code": "sc", "name": "Sardinian", "nativeName": "sardu"},
        {"code": "sd", "name": "Sindhi", "nativeName": "??????, ????? ??????"},
        {"code": "se", "name": "Northern Sami", "nativeName": "Davvis�megiella"},
        {"code": "sm", "name": "Samoan", "nativeName": "gagana faa Samoa"},
        {"code": "sg", "name": "Sango", "nativeName": "y�ng� t� s�ng�"},
        {"code": "sr", "name": "Serbian", "nativeName": "?????? ?????"},
        {"code": "gd", "name": "Scottish Gaelic; Gaelic", "nativeName": "G�idhlig"},
        {"code": "sn", "name": "Shona", "nativeName": "chiShona"},
        {"code": "si", "name": "Sinhala, Sinhalese", "nativeName": "?????"},
        {"code": "sk", "name": "Slovak", "nativeName": "sloven?ina"},
        {"code": "sl", "name": "Slovene", "nativeName": "sloven�?ina"},
        {"code": "so", "name": "Somali", "nativeName": "Soomaaliga, af Soomaali"},
        {"code": "st", "name": "Southern Sotho", "nativeName": "Sesotho"},
        {"code": "es", "name": "Spanish; Castilian", "nativeName": "espa�ol, castellano"},
        {"code": "su", "name": "Sundanese", "nativeName": "Basa Sunda"},
        {"code": "sw", "name": "Swahili", "nativeName": "Kiswahili"},
        {"code": "ss", "name": "Swati", "nativeName": "SiSwati"},
        {"code": "sv", "name": "Swedish", "nativeName": "svenska"},
        {"code": "ta", "name": "Tamil", "nativeName": "?????"},
        {"code": "te", "name": "Telugu", "nativeName": "??????"},
        {"code": "tg", "name": "Tajik", "nativeName": "??????, to?ik?, ???????"},
        {"code": "th", "name": "Thai", "nativeName": "???"},
        {"code": "ti", "name": "Tigrinya", "nativeName": "????"},
        {"code": "bo", "name": "Tibetan Standard, Tibetan, Central", "nativeName": "???????"},
        {"code": "tk", "name": "Turkmen", "nativeName": "T�rkmen, ???????"},
        {"code": "tl", "name": "Tagalog", "nativeName": "Wikang Tagalog, ????? ??????"},
        {"code": "tn", "name": "Tswana", "nativeName": "Setswana"},
        {"code": "to", "name": "Tonga (Tonga Islands)", "nativeName": "faka Tonga"},
        {"code": "tr", "name": "Turkish", "nativeName": "T�rk�e"},
        {"code": "ts", "name": "Tsonga", "nativeName": "Xitsonga"},
        {"code": "tt", "name": "Tatar", "nativeName": "???????, tatar�a, ????????"},
        {"code": "tw", "name": "Twi", "nativeName": "Twi"},
        {"code": "ty", "name": "Tahitian", "nativeName": "Reo Tahiti"},
        {"code": "ug", "name": "Uighur, Uyghur", "nativeName": "Uy?urq?, ?????????"},
        {"code": "uk", "name": "Ukrainian", "nativeName": "??????????"},
        {"code": "ur", "name": "Urdu", "nativeName": "????"},
        {"code": "uz", "name": "Uzbek", "nativeName": "zbek, ?????, ???????"},
        {"code": "ve", "name": "Venda", "nativeName": "Tshiven?a"},
        {"code": "vi", "name": "Vietnamese", "nativeName": "Ti?ng Vi?t"},
        {"code": "vo", "name": "Volapuk", "nativeName": "Volap�k"},
        {"code": "wa", "name": "Walloon", "nativeName": "Walon"},
        {"code": "cy", "name": "Welsh", "nativeName": "Cymraeg"},
        {"code": "wo", "name": "Wolof", "nativeName": "Wollof"},
        {"code": "fy", "name": "Western Frisian", "nativeName": "Frysk"},
        {"code": "xh", "name": "Xhosa", "nativeName": "isiXhosa"},
        {"code": "yi", "name": "Yiddish", "nativeName": "??????"},
        {"code": "yo", "name": "Yoruba", "nativeName": "Yor�b�"},
        {"code": "za", "name": "Zhuang, Chuang", "nativeName": "Sa? cue??, Saw cuengh"}
    ];

    $scope.showAlert = function (title, content, type) {

        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.GetHoldMusic = function () {
        holdMusicBackendService.getHoldMusic().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking Hold Music list " + response.data.Exception);
            }
            else {
                $scope.holdMusicList = response.data.Result;
                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking Hold music  " + error);
        });
    };

    $scope.GetHoldMusicFiles = function () {
        holdMusicBackendService.getHoldMusicFiles().then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in picking Hold Music list " + response.data.Exception);
            }
            else {
                $scope.holdMusicFiles = response.data.Result;
                $scope.addNew = !$scope.addNew;
                //$scope.MasterAppList = response.data.Result;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Error in picking Hold music  " + error);
        });
    };

    $scope.addHoldMusic = function () {

        $scope.GetHoldMusicFiles();
    };
    $scope.cancelSave = function () {
        $scope.addNew = false;
    };

    $scope.saveHoldMusic = function (resource) {

        if ($scope.newHoldMusic.AnnouncementTime == "" || $scope.newHoldMusic.AnnouncementTime == null) {
            $scope.newHoldMusic.AnnouncementTime = 0;
        }

        holdMusicBackendService.saveHoldMusicFiles(resource).then(function (response) {

            if (!response.data.IsSuccess) {
                console.info("Error in adding new Hold Music " + response.data.Exception);
                $scope.showAlert("Error", "Error in saving ", "error");
            }
            else {
                $scope.addNew = !response.data.IsSuccess;

                $scope.holdMusicList.splice(0, 0, response.data.Result);
                $scope.newHoldMusic = {};
                $scope.showAlert("Success", "Saving succeeded", "success");
                $scope.searchCriteria = "";


            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.info("Exception in adding new Hold Music " + error);
            $scope.showAlert("Error", "Error in saving ", "error");
        });
    };

    $scope.reloadMusicListPage = function () {
        $state.reload();
    };

    $scope.removeDeleted = function (item) {


        var index = $scope.holdMusicList.indexOf(item);
        if (index != -1) {
            $scope.holdMusicList.splice(index, 1);
            $scope.showAlert("Success", "Successfully removed", "success");
        }
        else {
            $scope.showAlert("Error", "Error in removing ", "error");
        }

    };

    $scope.GetHoldMusic();

    $scope.makeFirstAnnounementEmpty = function () {
        $scope.newHoldMusic.FirstAnnounement = null;
    };
    $scope.makeMOHEmpty = function () {
        $scope.newHoldMusic.MOH = null;
    };
    $scope.makeAnnouncementEmpty = function () {
        $scope.newHoldMusic.Announcement = null;
    };

});