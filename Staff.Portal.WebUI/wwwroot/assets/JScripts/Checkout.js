$(document).ready(function () {
    ReCalcuatedWithBenCount();
    AddBen();
    if ($("#txtMobile").val() != "") {
        $("input[name='txtMobile']").attr("readonly", true);
    }

    //if (window.location.href.indexOf("?val") > -1) {
    //    var params = new window.URLSearchParams(window.location.search);
    //    var mobile = params.get('val');
    //    $("#txtMobile").val(mobile);
    //    $("input[name='txtMobile']").attr("readonly", true);

    //}
    //else {
    //    $("input[name='txtMobile']").attr("readonly", false);
    //}

    SpecialServiceTypeBind();
    $('#SameDayReport').change(function () {
        if (!this.checked) {
            $("#txtAppdt").val("");
            $('#SelectSlot').empty();
            $('#SelectSlot').append("<option value=''>Select the Slot</option>");
        }
    });
});


function FormattingDate(Input) {
    if (Input == emptyString) {
        return emptyString;
    } else {
        var arrayDts = Input.split("-");
        if (arrayDts[0].length != 4) {
            $("#txtAppdt").val(emptyString);
            $("#txtAppdt").focus();
            return emptyString;
        }
        return arrayDts[0] + "-" + arrayDts[1] + "-" + arrayDts[2];
    }
}

function fncPincodeblur(obj) {
    valid_pin(obj);
    fncGetAppSlots();
}

function setOrderType() {
    fncSubmit('POSTPAID');
}


function fncSubmit(OrderType) {

    //if (!fncProceed()) {
    //    return false;
    //}

    $loading.show();

    if (!FBS_PBS_Check()) {
        $loading.hide();
        return false;
    }

    if (localStorage.getItem("SelectedItems") === "") {
        AlertBox("Please add test");
        $loading.hide();
        return false;
    }

    if ($('#txtPincode').val() === emptyString) {
        AlertBox("Please Enter Pincode");
        $loading.hide();
        return false;
    }

    ErrorMsg = MinimumLengthCheck("#txtPincode", MinLength_Pincode);
    if (ErrorMsg !== emptyString) {
        AlertBox("Pincode " + ErrorMsg, "txtPincode");
        $loading.hide();
        return false;
    }

    var ln = $("#BenCount").val();
    if (ln == "") {
        AlertBox("Please add beneficiary");
        $loading.hide();
        return false;
    } else {
        for (var i = 1; i <= parseInt(ln); i++) {
            if ($("#Name" + i).val().trim() == emptyString || $("#Name" + i).val().trim().length < 2) {
                AlertBox("Please Enter Full Name for " + i + " beneficiary and Minimnum 2 Character");
                $loading.hide();
                return false;
            }
            else if ($("#Age" + i).val().trim() == emptyString || parseInt($("#Age" + i).val().trim()) < 1) {
                AlertBox("Please Enter Age for " + i + " beneficiary and Age Should Greater than 0");
                $loading.hide();
                return false;
            }
            else if ($("#Gender" + i + " option:selected").val() == emptyString) {
                AlertBox("Please Select Gender for " + i + " beneficiary");
                $loading.hide();
                return false;
            }

            AddBeneficiarySession("" + i, $("#Name" + i).val(), $("#Age" + i).val(), $("#Gender" + i + " option:selected").val());
        }
    }

    $loading.show();
    if ($('#txtMobile').val().trim() === emptyString) {
        AlertBox("Please Enter Mobile No");
        $loading.hide();
        return false;
    }



    if ($('#txtEmail').val().trim() === emptyString) {
        AlertBox("Please Enter Email Id");
        $loading.hide();
        return false;
    }

    if ($('#txtAddress').val().trim() === emptyString && $('input[name="CollectionType"]:checked').val() != "COLLECTION CENTER") {
        AlertBox("Please Enter Address");
        $loading.hide();
        return false;
    }




    var ErrorMsg = emptyString;
    ErrorMsg = MinimumLengthCheck("#txtAddress", MinLength_Address);
    if (ErrorMsg !== emptyString && $('input[name="CollectionType"]:checked').val() != "COLLECTION CENTER") {
        AlertBox("Address " + ErrorMsg, "txtAddress");
        $loading.hide();
        return false;
    }
    var InAddress = Trim($("#txtAddress").val());
    var InPincode = Trim($("#txtPincode").val());
    var InAppDate = Trim($("#txtAppdt").val());
    var isDisabled = $('#txtAppdt').prop('disabled');


    if (!isDisabled) {
        if (InAppDate === emptyString) {
            AlertBox("Please select the Date time for Appointment...", "txtAppdt");
            $loading.hide();
            return false;
        }

        if ($('#SelectSlot').length) {
            if ($('input[name="CollectionType"]:checked').val() =="HOME" && $("#SelectSlot").val() === emptyString) {
                AlertBox("Please select the Time Slot...", "SelectSlot");
                $loading.hide();
                return false;
            }
        }
        else {
            fncGetAppSlots();
            AlertBox("Please select the Time Slot...", "SelectSlot");
            $loading.hide();
            return false;
        }
    }

    if (!$('input[id="chkmessage"]').is(':checked')) {
        AlertBox("Please Confirm authorized");
        $loading.hide();
        return false;
    }

    //if ($('#txtLatitude').val().trim() === emptyString && $('input[name="CollectionType"]:checked').val() != "COLLECTION CENTER") {
    //    AlertBox("Please Enter Latitude");
    //    $loading.hide();
    //    return false;
    //}

    //if ($('#txtLongitude').val().trim() === emptyString && $('input[name="CollectionType"]:checked').val() != "COLLECTION CENTER") {
    //    AlertBox("Please Enter Longitude");
    //    $loading.hide();
    //    return false;
    //}

    InAppDate = reverseDate1(InAppDate) + " " + $("#SelectSlot").val();


    var Servicetype = Trim($("#ServiceType").val());
    var techniciandet = Trim($("#TechniciansSafety").val());

    var reach = "COMM:";
    var selected = new Array();

    $("#divCheckReach input[type=checkbox]:checked").each(function () {
        selected.push(this.value);
    });

    if (selected.length > 0) {
        reach = reach + selected.join("~");
    }

    var ordermode = Trim($("#SelectOrderedMode").val());
    //if (ordermode === "undefined") {
    //    ordermode = emptyString;
    //}

    var source = Trim($("#SelectSource").val());
    //if (source === "undefined") {
    //    source = emptyString;
    //}
    var ReachMeOn = reach + "~~" + ordermode + "~~" + source;

    var Remarks = Trim($("#txtRemarks").val());
    if (Remarks === "undefined") {
        Remarks = emptyString;
    }
    if ($("#txtClientMobile").val() != undefined) {
        Remarks += "~ClientType:" + $("#SelectClientType").val();
    }

    var authorize = Trim($("#chkmessage").val());
    if (authorize === "on") {
        authorize = 'Y';
    }
    else {
        authorize = 'N';
    }

    var SameDayReport = "";
    if ($('input[name="SameDayReport"]:checked').val() != undefined) {
        SameDayReport = $('input[name="SameDayReport"]:checked').val();
    }

    console.log(SameDayReport);

    var Latitude = Trim($("#txtLatitude").val());
    var Longitude = Trim($("#txtLongitude").val());

    var ReferedByID = "";
    var ReferedBy = "";
    if ($("#DdlDoctor").val() != "" && $("#DdlDoctor").val() != undefined) {
        ReferedByID = $("#DdlDoctor").val();
        ReferedBy = $("#DdlDoctor option:selected").text();
    }
    //fncProfileSubmit();
    CreateSessionsBeforeSubmit(InAddress, InPincode, InAppDate, OrderType, Servicetype, techniciandet, ReachMeOn, Remarks, authorize, Latitude, Longitude, SameDayReport, ReferedByID, ReferedBy);
    // return false;

    $loading.show();
    RedirectToBookingSummary();

}

function CreateSessionsBeforeSubmit(InAddress, InPincode, InAppDate, OrderType, Servicetype, techniciandet, ReachMeOn, Remarks, authorize, Latitude, Longitude, SameDayReport, ReferedByID, ReferedBy) {
    var input = {
        SessionName: SESSION.BookingCheckoutInfo,
        SessionValue: InAddress + DoubleTildeString + InPincode + DoubleTildeString + InAppDate
    };
    CreateSession(input);

    input = {
        SessionName: SESSION.OrderType,
        SessionValue: OrderType
    };
    CreateSession(input);

    input = {
        SessionName: "email",
        SessionValue: $('#txtEmail').val()
    };
    CreateSession(input);

    input = {
        SessionName: "mobile",
        SessionValue: $('#txtMobile').val()
    };
    CreateSession(input);
    input = {
        SessionName: "ReachMeOn",
        SessionValue: ReachMeOn
    };
    CreateSession(input);
    input = {
        SessionName: "Remarks",
        SessionValue: Remarks + "~BookingType:" + localStorage.getItem("BookingType")
    };
    CreateSession(input);
    input = {
        SessionName: "authorize",
        SessionValue: authorize
    };

    CreateSession(input);
    input = {
        SessionName: "Longitude",
        SessionValue: Longitude
    };
    CreateSession(input);
    input = {
        SessionName: "Latitude",
        SessionValue: Latitude
    };
    CreateSession(input);

    input = {
        SessionName: SESSION.Servicetype,
        SessionValue: Servicetype
    };
    CreateSession(input);

    input = {
        SessionName: "SameDayReport",
        SessionValue: SameDayReport
    };
    CreateSession(input);

    if ($("#txtClientMobile").val() != undefined) {
        input = {
            SessionName: "Doctor",
            SessionValue: $("#txtClientMobile").val()
        };
        CreateSession(input);
    }


    if ($("#SelectDoctors").val() != undefined && $("#SelectDoctors").val() != "") {
        input = {
            SessionName: "Doctor",
            SessionValue: $("#SelectDoctors").val()
        };
        CreateSession(input);
    }



    input = {
        SessionName: "DoctorName",
        SessionValue: ReferedBy
    };
    CreateSession(input);


    input = {
        SessionName: "DoctorID",
        SessionValue: ReferedByID
    };
    CreateSession(input);

    input = {
        SessionName: "CollectionType",
        SessionValue: $('input[name="CollectionType"]:checked').val()
    };
    CreateSession(input);

}


function fncGetAppSlots() {


    var InAppDt = "";
    if ($('input[name="SameDayReport"]:checked').val() != undefined) {
        var someDate = new Date();
        var numberOfDaysToAdd = 6;
        someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

        var dd = someDate.getDate();
        var mm = someDate.getMonth() + 1;
        var y = someDate.getFullYear();

        InAppDt = y + '-' + mm + '-' + dd;
    }
    else {
        InAppDt = reverseDate1($("#txtAppdt").val());
    }

    //$("#txtAppdt").val(moment($("#txtAppdt").val(), 'MM/DD/YYYY').format('DD/MM/YYYY'));

    var InPincode = $("#txtPincode").val();
    if (InPincode === emptyString) {
        AlertBox("Please enter pincode");
        $("#txtAppdt").val("");
        return false;
    }

    if (InPincode !== emptyString && InPincode !== "pincode" && InAppDt !== emptyString) {

        var ProductNames = "NA";
        var items = JSON.parse(localStorage.getItem(LOCALSTORAGE.ITEMS));
        var itemCodesArray = Object.keys(items);
        for (var i = 0; i < itemCodesArray.length; i++) {
            if (items[itemCodesArray[i]].type === "PROFILE") {
                if (ProductNames == "NA") {
                    ProductNames = items[itemCodesArray[i]].testname;
                } else {
                    ProductNames += "," + items[itemCodesArray[i]].testname;
                }
            }
        }

        $(".modal").show();
        $.ajax({
            type: GET,
            url: "/api/AppointmentSlots/" + InPincode + "/" + InAppDt + "/" + ProductNames + "/NA",
            contentType: AjaxCallContentType,
            dataType: AjaxCallJson,
            async: true,
            cache: false,
            success: function (Response) {
                $('#SelectSlot').empty();
                if (Response.respId=="RES00001") {
                    $('#SelectSlot').append(Response.responseString);
                }
                else {
                    $('#SelectSlot').append("<option value=''>Select the Slot</option>");
                    AlertBox(Response.response);
                }
            },
            error: function () {
                $('#SelectSlot').empty();
                $('#SelectSlot').append("<option value=''>Select the Slot</option>");
                return false;
            }
        });
        $(".modal").hide();
    }
    else {
        $("#SelectSlot").val(emptyString);
        document.getElementById("SelectSlot").innerHTML = emptyString;
        return false;
    }

}

$("#txtEmail").blur(function () {
    var email = $("#txtEmail").val();
    if (email == "") {
        AlertBox("Please enter Email ID");
        return false;
    }
    var input = {
        emailId: email
    };
    $.ajax({
        type: "POST",
        url: "/api/ValidateEmail",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(input),
        dataType: "json",
        async: true,
        cache: false,
        success: function (Response) {
            if (Response.respId == "RES01011") {
                cartCall();
            }
            else {
                AlertBox("Invalid Email ID");
                $("#txtEmail").val('');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });
});


function fnSameUserDtl() {
    if ($('#chksameas').is(":checked")) {
        $.ajax({
            type: GET,
            url: "/api/SameUserDtl",
            contentType: AjaxCallContentType,
            dataType: AjaxCallJson,
            async: false,
            cache: false,
            success: function (Response) {
                $("#Name1").val(Response.responseString);
            },
            error: function () {
                return false;
            }
        });
    }
}


//function CreatePostPaidOrder(InAddress, InPincode, InLandMark, InAppointment) {
//    var input = {
//        api_key: emptystring,
//        mobile: emptystring,
//        email: emptystring,
//        address: InAddress,
//        pincode: InPincode,
//        std: emptystring,
//        phone_no: emptystring,
//        tsp: emptystring,
//        service_type: emptystring,
//        orderid: emptystring,
//        order_by: emptystring,
//        remarks: emptystring,
//        report_code: emptystring,
//        ref_code: emptystring,
//        product: emptystring,
//        rate: emptystring,
//        hc: emptystring,
//        appt_date: InAppointment,
//        discount: emptystring,
//        reports: emptystring,
//        pay_type: POSTPAID,
//        margin: "0",
//        bencount: emptystring,
//        landmark: InLandMark,
//        geo_location: emptystring,
//        bendataxml: emptystring
//    };

//    $.ajax({
//        type: POST,
//        url: "/api/PostOrderData",
//        contentType: AjaxCallContentType,
//        data: JSON.stringify(input),
//        dataType: AjaxCallJson,
//        async: true,
//        cache: false,
//        success: function (Response) {
//            console.log("Success");
//        },
//        error: function () {
//            return false;
//        }
//    });
//}

//function CreatePrePaidOrder(InAddress, InPincode, InLandMark, InAppointment) {
//    var input = {
//        api_key: emptystring,
//        type: emptystring,
//        domain: emptystring,
//        refurl: emptystring,
//        curreny: emptystring,
//        redirect_url: emptystring,
//        cancel_url: emptystring,
//        orderid: emptystring,
//        ref_code: emptystring,
//        address: InAddress,
//        pincode: InPincode,
//        product: emptystring,
//        std: emptystring,
//        phone_no: emptystring,
//        mobile: emptystring,
//        email: emptystring,
//        remarks: emptystring,
//        tsp: emptystring,
//        service_type: emptystring,
//        order_by: emptystring,
//        report_code: emptystring,
//        rate: emptystring,
//        hc: emptystring,
//        appt_date: InAppointment,
//        reports: emptystring,
//        pay_type: PREPAID,
//        bencount: emptystring,
//        landmark: InLandMark,
//        geo_location: emptystring,
//        bendataxml: emptystring
//    };

//    $.ajax({
//        type: POST,
//        url: "/api/PostOrderData",
//        contentType: AjaxCallContentType,
//        data: JSON.stringify(input),
//        dataType: AjaxCallJson,
//        async: true,
//        cache: false,
//        success: function (Response) {
//            console.log("Success");
//        },
//        error: function () {
//            return false;
//        }
//    });
//}


//function sepreatevalueonComma() {
//    $("[fid='splitvalues']").each(function () {
//        var splitAblevalues = $(this).find("label").html();
//        var splitValues = splitAblevalues.indexOf(",") > -1 ? splitAblevalues.split(',') : splitAblevalues;
//        var rednderValues = '';
//        if ($.isArray(splitValues)) {
//            for (var i = 0; i < splitValues.length; i++) {
//                rednderValues += splitValues[i] + '</br>';
//            }
//        } else {
//            rednderValues = splitValues;
//        };

//        $(this).find("label").html(rednderValues);
//    });

//}

function AddBen() {
    var Cnt = $("#BenCount").val();

    if (Cnt != "") {
        //ReCalcuatedWithBenCount();
        cartCall();
        var html = "";
        for (i = 1; i <= parseInt(Cnt); i++) {
            html += "<div class='form-group row chk_out_mt'>";
            html += "<label class='col-md-4 col-lg-4 lbl_font' for='bene_name'>Beneficiary Name " + i + " <span id='star'>*</span></label>";
            html += "<div class='col-md-8 col-lg-8'>";
            html += "<div class='d-flex'>";
            html += "<input type='text' class='form-control' placeholder='Full Name' maxlength='70' id='Name" + i + "' onkeypress='return onlyAlphabets(event, this);'>";
            html += "<input type='text' class='form-control actual_margin' placeholder='Age' id='Age" + i + "' maxlength='2' onkeypress='return isNumberKey(event);'>";
            html += "<select class='ui dropdown form-control blue_ddl ddl_monthly actual_margin' onchange='CHeckPSABooking()' id='Gender" + i + "'>";
            html += "<option value=''>Select</option>";
            html += "<option value='M'>Male</option>";
            html += "<option value='F'>Female</option>";
            html += "</select>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

        }
        $("#dBen").html(html);
    }
    else {
        $("#dBen").html("");
        AlertBox('Please select beneficiary count');
    }
}

function BindUserType() {
    $.ajax({
        type: GET,
        url: "/api/GetUserType/" + $("#txtClientMobile").val(),
        contentType: AjaxCallContentType,
        dataType: AjaxCallJson,
        async: true,
        cache: false,
        success: function (Response) {
            console.log(Response);
            var trHTML = '';
            var optionHTML = '';
            $('#SelectClientType').empty();
            trHTML += '<option value=""> --Select Type-- </option>'
            if (Response.respId == "RES0000") {
                $.each(Response.users, function (i, item) {
                    trHTML += '<option value=' + item.type + '>' + item.type + '</option>';
                });
            }
            $('#SelectClientType').append(trHTML);
        },
        error: function () {
            return false;
        }
    });
}


