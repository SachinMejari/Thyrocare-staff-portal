//$(document).ready(function () {
//    if (localStorage.getItem(LOCALSTORAGE.MstTests) !== null) {
//        bindProducts(JSON.parse(localStorage.getItem(LOCALSTORAGE.MstTests)));
//    }
//});

var exceptionalTest = ["HVA", "SEEL", "E22", "BTHAL", "CUA", "ELEMENTS", "H3", "H5", "H6", "MA", "BEAP", "HAP"];

function setFilteredWhenSearched() {
    let params = (new URL(location)).searchParams;
    var searchQuery = params.get('searchQuery');
    if (searchQuery !== "") {
        $('#SearchOnTest').val(searchQuery);
        FilterByText();
    }
}

$("#SearchOnTest").bind('keydown', function (e) {
    if (e.keyCode == 13)
        e.preventDefault();
});

function CreateCartSession(item) {
    if (item) {
        var input = {
            code: item.code,
            name: item.name,
            rate: item.rate.b2c,
            type: item.type,
            testcount: item.test_count,
            fasting: item.fasting,
            testname: item.testnames,
            projectid: item.rate.id
        };

        $.ajax({
            type: "POST",
            url: "/api/AddCart",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(input),
            dataType: "json",
            async: false,
            cache: false,
            success: function (Response) {
                console.log("Success");
            },
            error: function () {
                console.log("Failed");
                return false;
            }
        });
    }
}

function DeleteFromCartSession(item) {
    var input = {
        code: item.code,
        name: item.name,
        rate: item.rate.b2c,
        type: item.type,
        testcount: item.test_count,
        fasting: item.fasting,
        bookingtype: item.bookingtype,
        testname: item.testnames,
        projectid: item.rate.id
    };

    $.ajax({
        type: DELETE,
        url: "/api/DeleteCart",
        contentType: AjaxCallContentType,
        data: JSON.stringify(input),
        dataType: AjaxCallJson,
        async: false,
        cache: false,
        success: function (Response) {
            console.log("/api/DeleteCart : Success");
        },
        error: function () {
            console.log("/api/DeleteCart : Failed");
            return false;
        }
    });
}


function checkCode() {

    if ($('#PromoCode').val() === "") {
        AlertBox('Enter Mobile No. Or Promocode');
        return false;
    }
    var Mobile = "";
    var Coupon = "";
    var phoneno = /^[0-9]+$/;
    if (($('#PromoCode').val().length === 10) && ($('#PromoCode').val().match(phoneno))) {
        Mobile = $('#PromoCode').val();
    }    
    else {
        Coupon = $('#PromoCode').val();        
    }

    if (Coupon !== "") {
        CheckCoupon(Coupon);
    }
    else if (Mobile !== "") {
        GetLastAvailedDtl(Mobile);
    }
    
    GetProducts(Mobile, Coupon);


    $("#multi").slider('setValue', 10000);

    $("#Package").prop('checked', false);
    $("#Profile").prop('checked', false);
    $("#Test").prop('checked', false);
    $("#cwellness").prop('checked', false);
    $("#food").prop('checked', false);
    $("#heart").prop('checked', false);
    $("#thyroid").prop('checked', false);
    $("#vitamin").prop('checked', false);
    $("#fasting").prop('checked', false);
    $("#Non-fasting").prop('checked', false);

}
function CheckCoupon(Coupon) {
    var input = {
        ApiKey: emptyString,
        CouponCode: Coupon
    };

    $.ajax({
        type: POST,
        url: "/api/CheckCoupon",
        contentType: AjaxCallContentType,
        data: JSON.stringify(input),
        dataType: AjaxCallJson,
        async: true,
        cache: false,
        success: function (Response) {
            console.log(Response);

            if (Response.Response === RES00001) {
                if (Response.Valid === "Y") {
                    input = {
                        SessionName: "TSP",
                        SessionValue: Response.HospitalCode
                    };
                    CreateSession(input);

                } else if (Response.Valid === "N") {
                    AlertBox("Invalid Coupon");
                    return false;
                }
                else {
                    AlertBox("Something went wrong!");
                    return false;
                }
            }
        },
        error: function (Response) {
            return false;
        }
    });
    return false;
}


function GetLastAvailedDtl(Mobile) {
    var input = {
        ApiKey: emptyString,
        Mobile: Mobile
    };

    $.ajax({
        type: POST,
        url: "/api/lastAvailedDtl",
        contentType: AjaxCallContentType,
        data: JSON.stringify(input),
        dataType: AjaxCallJson,
        async: true,
        cache: false,
        success: function (Response) {
            console.log(Response);
            if (Response.customerType === "LOYALTY") {
                $("#CustomerType").text(Response.customerType);
                $("#LastAvailedOn").text(Response.lastAvailedOn);
                $("#AvailedProduct").text(Response.availedProduct);
            } else {
                $("#CustomerType").text(Response.customerType);
                $("#LastAvailedOn").text("");
                $("#AvailedProduct").text("");
            }
        },
        error: function (Response) {
            return false;
        }
    });
    return false;
}

function GetProducts(Mobile, Coupon) {

    var input = {
        apiKey: emptyString,
        productType: ALL,
        Mobile: Mobile,
        Coupon: Coupon,
        CDE: $('#CDE').is(':checked')
    };

    $.ajax({
        type: POST,
        url: "/api/Products",
        contentType: AjaxCallContentType,
        data: JSON.stringify(input),
        dataType: AjaxCallJson,
        async: true,
        cache: false,
        success: function (Response) {
            console.log("/api/Products --> Success");
            console.log(Response.master);

            localStorage.setItem(LOCALSTORAGE.MstTests, JSON.stringify(Response.master));

            if (Response.master !== null) {
                bindProducts(Response.master);
            }
        },
        error: function (Response) {
            console.log("/api/Products --> Failed");
            return false;
        }
    });
    return false;
}

function bindProducts(master) {

    $("div#ProductList").html("");

    if (master.offer.length > 0)
        bindOffers(master.offer);

    if (!$('#CDE').is(':checked') && $('#PromoCode').val().length != 16) {
        if (master.profile.length > 0)
            bindProfiles(master.profile);

        if (master.tests.length > 0)
            bindTests(master.tests);
    }

    $(".test-img.img_display")
        .on('error', function () { $(this).attr("src", "https://b2capi.thyrocare.com/API_Beta/Images/B2C/PROFILE/P179/AAROGYAM 1.2_INDEX.JPG"); })
        .attr("src", $(this).attr('src'));


    setSelected();
}

function bindOffers(products) {
    var html = "";

    for (i = 0; i < products.length; i++) {

        var StrOfferTestCodes = "";
        products[i].childs.forEach(function (ItemOfferChilds) {
            if (ItemOfferChilds.code.indexOf("/") === -1 && ItemOfferChilds.code.indexOf("%") === -1) {
                StrOfferTestCodes += "," + ItemOfferChilds.code.replace("/", "#").replace("%", "@").trim();
            }
        });

        StrOfferTestCodes = StrOfferTestCodes.substring(0, 1) === "," ? StrOfferTestCodes.substring(1, StrOfferTestCodes.length) : StrOfferTestCodes;

        var imgurl = "https://b2capi.thyrocare.com/API_Beta/Images/B2C/PROFILE/P688/Aarogyam XL_INDEX.jpg";
        if (products[i].imageMaster !== null) {
            products[i].imageMaster.forEach(function (itemUrls) {
                if (itemUrls.imgLocations !== null && itemUrls.imgLocations !== "") {
                    imgurl = itemUrls.imgLocations;
                    return false;
                }
            });
        }
        var rate = 0;
        var MinBen = parseInt(products[i].benMin);
        if (MinBen > 1) {
            rate = parseInt(products[i].rate.offerRate);
            rate = rate * MinBen;
        }
        else {
            rate = parseInt(products[i].rate.offerRate);
        }

        html += "<ul class='ul_padding_left_zero test_list package' id='" + products[i].code + "'>";

        html += "<li class='border_left'>";
        html += "<input id='' type='hidden' relTest='true' value='" + StrOfferTestCodes + "' />";
        html += "<img src='" + imgurl + "' class='test-img img_display'>";
        html += "<span class='Category hide'>" + products[i].category + "</span>";
        html += "<span class='fasting hide'>" + products[i].fasting + "</span>";
        html += "</li>";

        html += "<li>";
        html += "<p class='packageNames hide'>" + products[i].name + "</p>";
        var str = products[i].name;
        var res = str.replace(/ /g, "_");
        res = res.replace(".", "$");
        html += "<a href='https://wellness.thyrocare.com/Cart/ProfileDetail?Offer=" + res + "' style='color:black'>" + products[i].name + "</a> (" + products[i].testCount + " test)";
        html += "</li>";

        html += "<li class='li_price'>";
        html += "Rs <span class='Rate'>" + rate + "</span>";
        html += "</li>";

        html += "<li class='border_right'>";
        html += "<button class='btn report-bttn-icons add-to-cart' style='cursor:pointer;' id='Bookbtn_" + products[i].code + "' onclick='addOrBuyAction(event, this, false, false)'>";
        html += "<span class='hide'>{ &quot;code&quot;: &quot;" + products[i].code + "&quot;,&quot;additionalTests&quot;: &quot;" + products[i].additionalTests + "&quot;,&quot;benMin&quot;: &quot;" + products[i].benMin + "&quot;,&quot;benMultiple&quot;: &quot;" + products[i].benMultiple + "&quot;, &quot;fasting&quot;: &quot;" + products[i].fasting + "&quot;, &quot;name&quot;: &quot;" + products[i].name + "&quot;, &quot;type&quot;: &quot;" + products[i].type + "&quot;, &quot;groupName&quot; : &quot;" + products[i].groupName + "&quot;, &quot;testCount&quot; : &quot;" + products[i].testCount + "&quot;, &quot;testNames&quot; : &quot;" + products[i].testNames + "&quot;, &quot;rate&quot;: { &quot;b2B&quot;: &quot;" + products[i].rate.b2B + "&quot;, &quot;b2C&quot;: &quot;" + products[i].rate.b2C + "&quot;, &quot;id&quot;: &quot;" + products[i].code + "&quot;, &quot;offerRate&quot;: &quot;" + products[i].rate.offerRate + "&quot;, &quot;payAmt&quot;: &quot;" + products[i].rate.payAmt + "&quot; }, &quot;related_tests&quot; : [] }</span>";
        html += "<i class='fa fa-shopping-cart' data-link='addTestAction'></i>";
        html += "</button>";
        html += "<button class='btn report-bttn-icons add-to-cart' id='Deletebtn_" + products[i].code + "' disabled style='display: none;'>";
        html += "<i class='fa fa-check'></i>";
        html += "</button>";
        html += "<button class='btn report-bttn-icons add-to-cart related-test-inner1' id='Addedbtn_" + products[i].code + "' disabled style='display:none;'>";
        html += "<i class='fa fa-check'></i>";
        html += "</button>";
        html += "</li>";

        html += "</ul>";
    }

    $("div#ProductList").append(html);
}

function bindProfiles(products) {

    var html = "";

    for (i = 0; i < products.length; i++) {

        var StrOfferTestCodes = "";
        products[i].childs.forEach(function (ItemOfferChilds) {
            if (ItemOfferChilds.code.indexOf("/") === -1 && ItemOfferChilds.code.indexOf("%") === -1) {
                StrOfferTestCodes += "," + ItemOfferChilds.code.replace("/", "#").replace("%", "@").trim();
            }
        });

        StrOfferTestCodes = StrOfferTestCodes.substring(0, 1) === "," ? StrOfferTestCodes.substring(1, StrOfferTestCodes.length) : StrOfferTestCodes;

        var imgurl = "https://b2capi.thyrocare.com/API_Beta/Images/B2C/PROFILE/P688/Aarogyam XL_INDEX.jpg";
        if (products[i].imageMaster !== null) {
            products[i].imageMaster.forEach(function (itemUrls) {
                if (itemUrls.imgLocations !== null && itemUrls.imgLocations !== "") {
                    imgurl = itemUrls.imgLocations;
                    return false;
                }
            });
        }

        html += "<ul class='ul_padding_left_zero test_list Profile' id='" + products[i].code + "'>";

        html += "<li class='border_left'>";
        html += "<input id='' type='hidden' relTest='true' value='" + StrOfferTestCodes + "' />";
        html += "<img src='" + imgurl + "' class='test-img img_display'>";
        html += "<span class='Category hide'>" + products[i].category + "</span>";
        html += "<span class='fasting hide'>" + products[i].fasting + "</span>";
        html += "</li>";

        html += "<li>";
        html += "<p class='packageNames hide'>" + products[i].name + "</p>";
        var str = products[i].name;
        var res = str.replace(/ /g, "_");
        res = res.replace(".", "$");
        html += "<a href='https://wellness.thyrocare.com/Cart/ProfileDetail?Profile=" + res + "' style='color:black' target='_blank'>" + products[i].name + "</a> (" + products[i].testCount + " test)";
        html += "</li>";
        html += "<li class='li_price'>";
        html += "Rs <span class='Rate'>" + products[i].rate.b2C + "</span>";
        html += "</li>";

        html += "<li class='border_right'>";
        html += "<button class='btn report-bttn-icons add-to-cart' style='cursor:pointer;' id='Bookbtn_" + products[i].code + "' onclick='addOrBuyAction(event, this, false, false)'>";
        html += "<span class='hide'>{ &quot;code&quot;: &quot;" + products[i].code + "&quot;,&quot;additionalTests&quot;: &quot;" + products[i].additionalTests + "&quot;,&quot;benMin&quot;: &quot;" + products[i].benMin + "&quot;,&quot;benMultiple&quot;: &quot;" + products[i].benMultiple + "&quot;, &quot;fasting&quot;: &quot;" + products[i].fasting + "&quot;, &quot;name&quot;: &quot;" + products[i].name + "&quot;, &quot;type&quot;: &quot;" + products[i].type + "&quot;, &quot;groupName&quot; : &quot;" + products[i].groupName + "&quot;, &quot;testCount&quot; : &quot;" + products[i].testCount + "&quot;, &quot;testNames&quot; : &quot;" + products[i].testNames + "&quot;, &quot;rate&quot;: { &quot;b2B&quot;: &quot;" + products[i].rate.b2B + "&quot;, &quot;b2C&quot;: &quot;" + products[i].rate.b2C + "&quot;, &quot;id&quot;: &quot;" + products[i].code + "&quot;, &quot;offerRate&quot;: &quot;" + products[i].rate.offerRate + "&quot;, &quot;payAmt&quot;: &quot;" + products[i].rate.payAmt + "&quot; }, &quot;related_tests&quot; : [] }</span>";
        html += "<i class='fa fa-shopping-cart' data-link='addTestAction'></i>";
        html += "</button>";
        html += "<button class='btn report-bttn-icons add-to-cart' id='Deletebtn_" + products[i].code + "' disabled style='display: none;'>";
        html += "<i class='fa fa-check'></i>";
        html += "</button>";
        html += "<button class='btn report-bttn-icons add-to-cart related-test-inner1' id='Addedbtn_" + products[i].code + "' disabled style='display:none;'>";
        html += "<i class='fa fa-check'></i>";
        html += "</button>";
        html += "</li>";

        html += "</ul>";
    }

    $("div#ProductList").append(html);
}

function bindTests(products) {
    var html = "";

    for (i = 0; i < products.length; i++) {

        //var prod = $.inArray(products[i].code, exceptionalTest) ? products[i].code : products[i].name;
        var prod = !exceptionalTest.includes(products[i].code) ? products[i].code : products[i].name;

        var imgurl = "/assets/images/Test.png";

        html += "<ul class='ul_padding_left_zero test_list Test' id='" + prod + "'>";

        html += "<li class='border_left'>";
        html += "<img src='" + imgurl + "' class='test-img img_display'>";
        html += "<span class='Category hide'>" + products[i].category + "</span>";
        html += "<span class='fasting hide'>" + products[i].fasting + "</span>";
        html += "</li>";

        html += "<li>";
        html += "<p class='packageNames hide'>" + products[i].name + "</p>";
        var str = products[i].name;
        var res = str.replace(/ /g, "_");
        res = res.replace(".", "$");
        html += "<a href='https://wellness.thyrocare.com/Cart/TestDetail?Test=" + res + "' style='color:black' target='_blank'>" + products[i].name + "</a> (1 test)";
        html += "</li>";

        html += "<li class='li_price'>";
        html += "Rs <span class='Rate'>" + products[i].rate.b2C + "</span>";
        html += "</li>";

        html += "<li class='border_right'>";
        html += "<button class='btn report-bttn-icons add-to-cart' style='cursor:pointer;' id='Bookbtn_" + prod + "' onclick='addOrBuyAction(event, this, false, false)'>";
        html += "<span class='hide'>{ &quot;code&quot;: &quot;" + prod + "&quot;, &quot;fasting&quot;: &quot;" + products[i].fasting + "&quot;, &quot;name&quot;: &quot;" + products[i].name + "&quot;, &quot;type&quot;: &quot;" + products[i].type + "&quot;, &quot;testCount&quot; : &quot;&quot;, &quot;rate&quot;: { &quot;b2B&quot;: &quot;" + products[i].rate.b2B + "&quot;, &quot;b2C&quot;: &quot;" + products[i].rate.b2C + "&quot;, &quot;id&quot;: &quot;" + products[i].code + "&quot;, &quot;testNames&quot;: &quot;" + products[i].rate.testNames + "&quot;, &quot;offerRate&quot;: &quot;" + products[i].rate.offerRate + "&quot;, &quot;payAmt&quot;: &quot;" + products[i].rate.payAmt + "&quot; }, &quot;related_tests&quot; : [] }</span>";
        html += "<i class='fa fa-shopping-cart' data-link='addTestAction'></i>";
        html += "</button>";
        html += "<button class='btn report-bttn-icons add-to-cart' id='Deletebtn_" + prod + "' disabled style='display: none;'>";
        html += "<i class='fa fa-check'></i>";
        html += "</button>";
        html += "<button class='btn report-bttn-icons add-to-cart related-test-inner1' id='Addedbtn_" + prod + "' disabled style='display:none;'>";
        html += "<i class='fa fa-check'></i>";
        html += "</button>";
        html += "</li>";

        html += "</ul>";
    }

    $("div#ProductList").append(html);
}