
function fncRemoveTests(code, name, rate, type, testcount, fasting, testname, projectid) {
    RemoveFromSession(code, name, rate, type, testcount, fasting, testname, projectid);
    if (code.includes("PROJ")) {
        localStorage.removeItem('Ben_Min');
        localStorage.removeItem('ben_multiple');
    }
    deleteItemFromGlobalList(code);
    DeleteCodeFromLocalSelectedItems(code);
    updateCartCount();
    //$("#" + code).css("display", "none");
    $("[id='" + code + "'").css("display", "none");

}


function CreateHardcopySession(Inhardcopy) {
    var input = {
        SessionName: SESSION.HardCopy,
        SessionValue: Inhardcopy
    };
    CreateSession(input);
}

function GetBeneficiaryInfo() {
    fncRedirectToCart();
    return false;
}

function AddBeneficiarySession(InBenId, Name, Age, Gender) {

    var input = {
        BenId: InBenId,
        Name: Name,
        Age: Age,
        Gender: Gender
    };

    apitype = POST;
    url = "/api/AddBeneficiarySession";

    //else {
    //    apitype = DELETE;
    //    url = "/api/DeleteBeneficiarySession";
    //}

    $.ajax({
        type: apitype,
        url: url,
        contentType: AjaxCallContentType,
        data: JSON.stringify(input),
        dataType: AjaxCallJson,
        async: false,
        cache: false,
        success: function (Response) {
            console.log("Add & Delete BeneficiarySession : Success");
        },
        error: function (Response) {
            console.log("Add & Delete BeneficiarySession : Failed");
            return false;
        }
    });
}

function AlertMessageToShow(id, msg) {
    AlertDivToShow(id);
    $('#' + id + '').text(msg);
}

function AlertDivToShow(id) {
    $('#' + id + '').show();
}

function AlertDivToHide(id) {
    $('#' + id + '').hide();
}

function fncProceed() {
    if (FBS_PBS_Check() && OfferSelectionCheck()) {
        if (benid === emptyString) {
            AlertBox("Please select Beneficiary to Proceed...");
            return false;
        }

        var BenSplit = benid.split(DoubleTildeString);
        var BenCount = 0;
        for (var i = 0; i < BenSplit.length; i++) {
            if (BenSplit[i] !== emptyString) {
                BenCount++;
            }
        }
        if (BenCount > 10) {
            AlertBox("Maximum 10 Beneficiaries are only allowed.. You'd selected " + BenCount + " Beneficiaries...!");
            return false;
        }
        var localStoreItems = localStorage.getItem(LOCALSTORAGE.SelectedItems);
        var ben_min = localStorage.getItem('Ben_Min');
        var ben_multiple = localStorage.getItem('ben_multiple');
        if (localStoreItems.includes("PROJ") && (BenCount < ben_min)) {
            AlertBox("Please select " + (ben_min - BenCount) + " more beneficiaries...!");
            return false;
        }
        else if (localStoreItems.includes("PROJ") && (BenCount % ben_multiple !== 0)) {
            AlertBox("Please select beneficiaries in multiple of " + ben_multiple);
            return false;
        }
        if (PayAmt > ConstHartCopyRate) {
            fncRedirectToCheckout();
        } else {
            AlertBox("Please Add some tests to Proceed...");
            return false;
        }
    }
}

function OfferSelectionCheck() {
    if (localStorage.getItem(LOCALSTORAGE.ITEMS) != null) {
        var items = JSON.parse(localStorage.getItem(LOCALSTORAGE.ITEMS));
        var itemCodesArray = Object.keys(items);
        var OffersCount = 0;
        for (var i = 0; i < itemCodesArray.length; i++) {
            if (items[itemCodesArray[i]].type === OFFER) {
                OffersCount = OffersCount + 1;
            }
        }
        if (OffersCount > 1) {
            AlertBox("Please select the only one Offer..!");
            return false;
        }
        return true;
    }
    return true;
}
