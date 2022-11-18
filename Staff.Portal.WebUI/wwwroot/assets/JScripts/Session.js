function fncReCreateCartSession() {
    if (localStorage.getItem(LOCALSTORAGE.ITEMS) != null) {
        var items = JSON.parse(localStorage.getItem(LOCALSTORAGE.ITEMS));
        var child = JSON.parse(localStorage.getItem(LOCALSTORAGE.MstTests));
        var itemCodesArray = Object.keys(items);
        var arrsecond = [],arrthird=[];
        for (var i = 0; i < child.profile.length; i++) {
            arrsecond[i] = child.profile[i].code;
        }
        for (var i = 0; i < child.offer.length; i++) {
            arrthird[i] = child.offer[i].code;
        }
        var s = [],t=[];

        itemCodesArray.forEach((e1) => arrsecond.forEach((e2) => {
            if (e1 == e2) {
                s.push(arrsecond.indexOf(e1));
            }
        }));
        itemCodesArray.forEach((e1) => arrthird.forEach((e2) => {
            if (e1 == e2) {
                t.push(arrthird.indexOf(e1));
            }
        }));

        if (t != undefined) {

            for (var i = 0; i < t.length; i++) {
                var arr = [];
                for (var j = 0; j < child.offer[t[i]].childs.length; j++) {
                    var chitem = child.offer[t[i]].childs[j].code;
                    arr[j] = chitem;
                }


                $.each(arr, function (id, val) {
                    arr[id] = $.trim(val);
                });
                if (arr != undefined) {
                    for (k = 0; k < itemCodesArray.length; k++) {
                        itemCodesArray.forEach(function (el) {
                            if (arr.indexOf(el) > -1) {
                                itemCodesArray.splice(el, 1);
                                deleteItemFromGlobalList(el);
                                DeleteCodeFromLocalSelectedItems(el);
                                $("#Deletebtn_" + el).hide();
                                var first = $("#" + el + " .packageNames").text();
                                var two = $("#" + itemCodesArray[0] + " .packageNames").text();
                                if (!(first == "" || two == "")) {
                                    AlertBox(first + ' has been upgraded to ' + two);
                                }
                            }
                        });
                    }
                }
            }
        }

        if (s != undefined) {
            
            for (var i = 0; i < s.length; i++) {
                var arr = [];
                for (var j = 0; j < child.profile[s[i]].childs.length; j++) {
                    var chitem = child.profile[s[i]].childs[j].code;
                    arr[j] = chitem;
                }


                $.each(arr, function (id, val) {
                    arr[id] = $.trim(val);
                });   
                if (arr != undefined) {
                    for (k = 0; k < itemCodesArray.length; k++) {
                        itemCodesArray.forEach(function (el) {
                            if (arr.indexOf(el) > -1) {
                                itemCodesArray.splice(el, 1);
                                deleteItemFromGlobalList(el);
                                DeleteCodeFromLocalSelectedItems(el);
                                $("#Deletebtn_" + el).hide();
                                var first = $("#" + el + " .packageNames").text();
                                var two = $("#" + itemCodesArray[0] + " .packageNames").text();
                                if (!(first == "" || two == "")) {
                                    AlertBox(first + ' has been upgraded to ' + two);
                                }
                            }
                            else console.log("itemCodesArray does not contain " + el);
                        });
                    }
                }
            }
        }

    }

    var CartSession = emptyString;
    for (var i = 0; i < itemCodesArray.length; i++) {
        CartSession = CartSession + DoubleTildeString + items[itemCodesArray[i]].code + hashString + items[itemCodesArray[i]].name + hashString + items[itemCodesArray[i]].rate + hashString + items[itemCodesArray[i]].type + hashString + items[itemCodesArray[i]].testcount + hashString + items[itemCodesArray[i]].fasting + hashString + items[itemCodesArray[i]].testname + hashString + items[itemCodesArray[i]].projectid;
    }
    if (CartSession != emptyString) {
        var input = {
            SessionName: SESSION.Cart,
            SessionValue: CartSession
        };
        CreateSession(input);
    }
}

function ReSetSessionLocalStroage(tests) {
    var testsList = hashString + tests;
    if (localStorage.getItem(LOCALSTORAGE.ITEMS) != null) {
        var items = JSON.parse(localStorage.getItem(LOCALSTORAGE.ITEMS));
        var itemCodesArray = Object.keys(items);
        for (var i = 0; i < itemCodesArray.length; i++) {
            if (testsList.indexOf(hashString + items[itemCodesArray[i]].code) != -1) {
                deleteItemFromGlobalList(items[itemCodesArray[i]].code);
            }
        }
        fncReCreateCartSession();
    }
}

function CreateSession(input) {
    $.ajax({
        type: POST,
        url: "/api/CreateSession",
        contentType: AjaxCallContentType,
        data: JSON.stringify(input),
        dataType: AjaxCallJson,
        async: false,
        cache: false,
        success: function (Response) {            
            console.log("Success");
            return true;
        },
        error: function () {            
            return false;
        }
    });    
}