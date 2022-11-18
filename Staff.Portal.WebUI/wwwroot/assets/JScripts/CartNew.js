$(document).ready(function () {
    if (localStorage.getItem(LOCALSTORAGE.MstTests) !== null) {
        updateCartCount();
        fncReCreateCartSession();
        setSelectedProductDropdown();
    }

   

});

function addOrBuyAction(event, self, buyNow, cantGray) {
    var $element = $($(self).find('span.hide'));
    var isbuyLink = $(self).find("a[data-link]") && $(self).find("a[data-link]").attr("data-link") === 'addTestAction' ? true : false;
    var jsonItem = $element.html();

    if (compareStr($(self).children()[1].innerHTML, Already_Added_To_Cart) || compareStr($(self).children()[1].innerHTML, emptyString)) {
        return false;
    }

    var item = jsonItem.replace(/(<([^>]+)>)/ig, '');
    item = JSON.parse(item);

    if (compareStr($(self).children()[1].innerHTML, Delete_From_Cart)) {

        deleteItemFromGlobalList(item.code);
        DeleteFromCartTestRevert(item.code);
        RemoveLocalSelectedItem(item.code);

        if (item.code.includes("PROJ")) {
            localStorage.removeItem('Ben_Min');
            localStorage.removeItem('ben_multiple');
        }
        TweakCartButtons(false);
    }
    else {
        var selecteditem = item.code;

        var localStoreItems = localStorage.getItem(LOCALSTORAGE.SelectedItems);

        

        if (!(localStoreItems === null)) {
            if (localStoreItems.includes("PROJ") && selecteditem.includes("PROJ")) {
                AlertBox('Please select only one Offer');
                return false;
            }
        }

        checkAdditionalTests(item);

        addItemToGlobalList(jsonItem);
        DeleteFromCartTest(item.code);
        if (isbuyLink) {
            SetLocalSelectedItem(jsonItem);
        } else {
            cantGray ? null : SetLocalSelectedItem(jsonItem);
        }

        if (selecteditem.includes("PROJ")) {
            localStorage.setItem('Ben_Min', item.ben_min);
            localStorage.setItem('ben_multiple', item.ben_multiple);
        }
    }

    setTimeout(function () {
        updateCartCount();
    }, 500);
    fncReCreateCartSession();
    setSelectedProductDropdown();
}

function SetLocalSelectedItem(item) {
    var localStoreItems = localStorage.getItem(LOCALSTORAGE.SelectedItems);
    var storeId;
    if (localStoreItems) {
        if (localStoreItems.indexOf(JSON.parse(item).code) < 0) {
            storeId = localStoreItems + commaString + JSON.parse(item).code;
        } else {
            return false;
        }
    } else {
        storeId = commaString + JSON.parse(item).code;
    }
    localStorage.setItem(LOCALSTORAGE.SelectedItems, storeId);

    setSelected();
}

function setSelectedProductDropdown() {
    if (localStorage.getItem(LOCALSTORAGE.ITEMS) !== null) {
        if (localStorage.getItem(LOCALSTORAGE.ITEMS) === "{}") {
            $('#SelectedProduct').empty();
            $('#SelectedProduct').append("<li style='list-style:none;display:inline-block;margin:2px;border: 1px solid #5370CE; font-size:14px;padding: 5px 8px; width: fit-content; border-radius: 5px;'>No item in cart.</li>");
            //$('div a.site-btn').prop('disabled', true);
            $('div a.site-btn').removeAttr("href");
            return false;
        }
    }


    var SelectedItems = JSON.parse(localStorage.getItem(LOCALSTORAGE.ITEMS));
    var array = ["HVA", "SEEL", "E22", "BTHAL", "CUA", "ELEMENTS", "H3", "H5", "H6", "MA", "BEAP", "HAP"];

    if (SelectedItems !== null) {
        if (SelectedItems.length > 0 || SelectedItems !== null) {
            $('#SelectedProduct').empty();
            $('div a.site-btn').attr("href", "/Cart/checkout");
            $.each(SelectedItems, function (key, value) {
                //var prod = jQuery.inArray(value.code, array) > -1 ? value.name : value.code;
                var prod = array.includes(value.code) ? value.name : value.code;
                $('#SelectedProduct').append("<li style='list-style:none;display:inline-block;margin:2px;border: 1px solid #5370CE; font-size:14px;padding: 5px 8px; width: fit-content; border-radius: 5px;'>" + value.name + "(" + value.testcount + " tests) | &#8360;. " + value.rate + " <button class='btn btn-sm btn-danger' onclick=\"addOrBuyAction(event, this)\" style='width: auto;padding: 0px;font-size:11px;border-color:#fff;display:contents'><span class='hide'>{&quot;code&quot;: &quot;" + value.code + "&quot;, &quot;fasting&quot;: &quot;" + value.fasting + "&quot;, &quot;name&quot;: &quot;" + value.name + "&quot;, &quot;type&quot;: &quot;" + value.type + "&quot;, &quot;group_name&quot; : &quot;TSH&quot;, &quot;test_count&quot; : &quot;" + value.testcount + "&quot;, &quot;testnames&quot; : &quot;" + value.testname + "&quot;, &quot;rate&quot;: { &quot;b2b&quot;: &quot;100&quot;, &quot;b2c&quot;: &quot" + value.rate + "&quot;, &quot;id&quot;: &quot;" + value.code + "&quot;, &quot;offer_rate&quot;: &quot;" + value.rate + "&quot;, &quot;pay_amt&quot;: &quot;100&quot; }}</span><span class='hide'>Delete From Cart</span><i class='fa fa-window-close'></i></button></li>");
            });
        }
    }
}

function setSelected() {
    var localStoreSelectedItems = localStorage.getItem(LOCALSTORAGE.SelectedItems);
    var storeIds;
    if (localStoreSelectedItems === null) {
        storeIds = emptyString;
    }
    else {
        storeIds = localStoreSelectedItems.indexOf(commaString) !== -1 ? localStoreSelectedItems.split(commaString) : localStoreSelectedItems;
    }

    var selectedBox;
    var relatedTests;

    if (storeIds) {
        if ($.isArray(storeIds)) {
            for (var i = 0; i < storeIds.length; i++) {
                var sId = storeIds[i];
                if (sId !== emptyString) {
                    //selectedBox = $("#" + sId);
                    selectedBox = $("[id='" + sId + "'");
                    relatedTests = selectedBox.find("input[relTest]").val();
                    showSelected(sId);
                    DeleteFromCartTest(sId);
                    setSelectedTests(relatedTests);
                }
            }
        } else {
            //selectedBox = $("#" + storeIds);
            selectedBox = $("[id='" + sId + "'");
            relatedTests = selectedBox.find("input[relTest]").val();
            showSelected(storeIds);
            DeleteFromCartTest(storeIds);
            setSelectedTests(relatedTests);
        }
    }
}

function setSelectedTests(tests) {

    if (tests !== undefined) {
        if (tests !== null) {
            var selectedTests = tests.indexOf(commaString) !== -1 ? tests.split(commaString) : tests;
            if ($.isArray(selectedTests)) {
                for (var i = 0; i < selectedTests.length; i++) {
                    var tId = selectedTests[i];
                    showSelected(tId);
                    AlreadyAddedtoCartTest(tId);
                }
            } else {
                showSelected(selectedTests);
                AlreadyAddedtoCartTest(selectedTests);
            }
        }
    }
}

function showSelected(boxId) {
    if (boxId !== "") {
        //$("#" + boxId).find(".related-test1").css('background-color', '	#D0D0D0');
        //$("#" + boxId).find(".related-test1").css('cursor', 'not-allowed');

        $("[id='" + boxId + "'").find(".related-test1").css('background-color', '	#D0D0D0');
        $("[id='" + boxId + "'").find(".related-test1").css('cursor', 'not-allowed');
    }
}

function AlreadyAddedtoCartTest(test) {
    //$("#Bookbtn_" + test).hide();
    //$("#Addedbtn_" + test).show();

    $("[id='Bookbtn_" + test + "'").hide();
    $("[id='Deletebtn_" + test + "'").hide();
    $("[id='Addedbtn_" + test + "'").show();
}

function RemoveLocalSelectedItem(code) {
    var localStoreItems = localStorage.getItem(LOCALSTORAGE.SelectedItems);
    var storeId;
    if (localStoreItems) {
        if (localStoreItems.indexOf(commaString + code) < 0) {
            storeId = localStoreItems.replace(commaString + code, emptyString);
            localStorage.setItem(LOCALSTORAGE.SelectedItems, storeId);
        }
    }
    SetRemove(code);
}

function SetRemove(code) {
    DeleteCodeFromLocalSelectedItems(code);
    hideSelected(code);
    //var selectedBox = $("#" + code);
    var selectedBox = $("[id='" + code + "'");
    var relatedTests = selectedBox.find("input[relTest]").val();
    removeSelectedTests((relatedTests === "") ? code : relatedTests);
}

function removeSelectedTests(tests) {
    if (tests != null) {
        var selectedTests = tests.indexOf(commaString) !== -1 ? tests.split(commaString) : tests;
        if ($.isArray(selectedTests)) {
            for (var i = 0; i < selectedTests.length; i++) {
                var tId = selectedTests[i];
                hideSelected(tId);
                AddedtoCartTest(tId);
            }
        } else {
            hideSelected(selectedTests);
            AddedtoCartTest(selectedTests);
        }
    }
}

function AddedtoCartTest(test) {
    //$("#Bookbtn_" + test).show();
    //$("#Addedbtn_" + test).hide();
    $("[id='Bookbtn_" + test + "'").show();
    $("[id='Addedbtn_" + test + "'").hide();
}

function DeleteFromCartTest(test) {
    //$("#Bookbtn_" + test).hide();
    //$("#Addedbtn_" + test).hide();
    //$("#Deletebtn_" + test).show();

    $("[id='Bookbtn_" + test + "'").hide();
    $("[id='Addedbtn_" + test + "'").hide();
    $("[id='Deletebtn_" + test + "'").show();
}

function DeleteFromCartTestRevert(test) {
    //$("#Bookbtn_" + test).show();
    //$("#Addedbtn_" + test).hide();
    //$("#Deletebtn_" + test).hide();    
    $("[id='Bookbtn_" + test + "'").show();
    $("[id='Addedbtn_" + test + "'").hide();
    $("[id='Deletebtn_" + test + "'").hide();
}

function hideSelected(boxId) {
    //$("#" + boxId).find(".related-test1").css('background-color', 'white');
    $("[id='" + boxId + "'").find(".related-test1").css('background-color', 'white');
}

function updateCartCount() {
    var globallyAddedItems = getObjectFromLS(lsObject.ITEMS);

    //my code start
    var myarray = Object.keys(globallyAddedItems);
    var child = JSON.parse(localStorage.getItem(LOCALSTORAGE.MstTests));

    var arrsecond = [], arrthird = [];
    if (child !== null) {
        for (var i = 0; i < child.profile.length; i++) {
            arrsecond[i] = child.profile[i].code;
        }
        for (var i = 0; i < child.offer.length; i++) {
            arrthird[i] = child.offer[i].code;
        }
    }
    var s = [], t = [];

    myarray.forEach((e1) => arrsecond.forEach((e2) => {
        if (e1 === e2) {
            s.push(arrsecond.indexOf(e1));
        }
    }));

    myarray.forEach((e1) => arrthird.forEach((e2) => {
        if (e1 === e2) {
            t.push(arrthird.indexOf(e1));
        }
    }));

    if (t !== undefined) {

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
                for (k = 0; k < myarray.length; k++) {
                    arr.forEach(function (el) {
                        if (myarray.indexOf(el) > -1) {
                            myarray.splice(el, 1);
                            DeleteCodeFromLocalSelectedItems(el)
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
                for (k = 0; k < myarray.length; k++) {
                    arr.forEach(function (el) {
                        if (myarray.indexOf(el) > -1) {
                            myarray.splice(el, 1);
                            DeleteCodeFromLocalSelectedItems(el);
                        }
                    });
                }
            }
        }
    }
    //my code end
    var itemsInCart = globallyAddedItems ? Object.keys(myarray).length : 0;

    //$('#cart-number').text(itemsInCart);
    $('.total-count').html(itemsInCart);
}

function checkAdditionalTests(jsonItem) {
    if (jsonItem.additionalTests === "0") {
        var localStoreItems = localStorage.getItem(LOCALSTORAGE.SelectedItems);
        if (localStoreItems) {

            if (localStoreItems.indexOf(',') === 0) {
                localStoreItems = localStoreItems.substring(1, localStoreItems.length);
            }
            var items = localStoreItems.split(',');

            for (var i = 0; i < items.length; i++) {
                deleteItemFromGlobalList(items[i]);
                DeleteFromCartTestRevert(items[i]);
                RemoveLocalSelectedItem(items[i]);

                if (items[i].includes("PROJ")) {
                    localStorage.removeItem('Ben_Min');
                    localStorage.removeItem('ben_multiple');
                }
            }
        }
        TweakCartButtons(true);
    }
    //else {
    //    TweakCartButtons(false);
    //}
}

function TweakCartButtons(val) {
    //$("#ProductList > ul").filter(function () {
    //    $(this).toggle($(this).find(".packageNames").text().toLowerCase().indexOf(type.toLowerCase()) > -1);
    //});
    $("#ProductList > ul > li > button.btn.report-bttn-icons.add-to-cart").attr("disabled", val);
}


//add an item to global item list
function addItemToGlobalList(item) {
    if (item) {
        item = item.replace(/(<([^>]+)>)/ig, '');
        item = JSON.parse(item);
        let itemList = getObjectFromLS(lsObject.ITEMS);
        if (item.type == "OFFER") {
            itemList[item.code] = {
                code: item.code,
                name: item.name,
                rate: item.rate.offerRate,
                type: item.type,
                testcount: item.testCount,
                fasting: item.fasting,
                bookingtype: item.bookingtype,
                testname: item.testNames,
                projectid: item.rate.id
            };
        }
        else {
            itemList[item.code] = {
                code: item.code,
                name: item.name,
                rate: item.rate.b2C,
                type: item.type,
                testcount: item.testCount,
                fasting: item.fasting,
                bookingtype: item.bookingtype,
                testname: item.testNames,
                projectid: item.rate.id
            };
        }
        setObjectToLS(lsObject.ITEMS, itemList);
    } else {
        console.log('please pass item to add');
    }
}

function setObjectToLS(prop, value) {
    localStorage.setItem(prop, JSON.stringify(value));
}

function deleteItemFromGlobalList(id) {
    if (id) {
        var usedItems = getUniqueItemsFromArray(getItemsFromAllBenificiaries());
        if (usedItems === null) {
            var globalItems = getObjectFromLS(lsObject.ITEMS);
            delete globalItems[id];
            setObjectToLS(lsObject.ITEMS, globalItems);
            renderHtml(lsObject.ITEMS);
            return;
        }
        if (usedItems.indexOf(id) !== -1) {
            var item = getObjectFromLS(lsObject.ITEMS, id, 'name');
            alertModal(true, { title: 'item is already present', body: item + ' is already present in a beneficiary. First remove the beneficiary then remove it' })
        } else {
            var globalItems = getObjectFromLS(lsObject.ITEMS);
            delete globalItems[id];
            setObjectToLS(lsObject.ITEMS, globalItems);
            renderHtml(lsObject.ITEMS);
            updateCartCount();
            setSelectedProductDropdown();
        }
    } else {
        console.log('pass id of object to delete from global list');
    }
}

function DeleteCodeFromLocalSelectedItems(code) {
    var localStoreSelectedItems = localStorage.getItem(LOCALSTORAGE.SelectedItems);
    localStorage.setItem(LOCALSTORAGE.SelectedItems, localStoreSelectedItems.replace(commaString + code, emptyString));
}
