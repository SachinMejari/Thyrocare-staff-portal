function fncCartClick() {
    if (FBS_PBS_Check()) {
        //fncRedirectToCart();
		var Url = window.location.href;
		if (!Url.includes("Home/Checkout")) {
			fncRedirectTocheckout();
		}
    }
}

//function FBS_PBS_Check() {    
//    if (localStorage.getItem(LOCALSTORAGE.ITEMS) !== null) {
//        if (localStorage.getItem(LOCALSTORAGE.ITEMS) === "{}") {
//            AlertBox("No Item in cart");
//            return false;
//        }
//        else {
//            var items = JSON.parse(localStorage.getItem(LOCALSTORAGE.ITEMS));
//            var itemCodesArray = Object.keys(items);
//            var IsPBS = false;
//            var IsFBS = false;
//            for (var i = 0; i < itemCodesArray.length; i++) {
//                if (items[itemCodesArray[i]].code === PPBS) { IsPBS = true; }
//                if (items[itemCodesArray[i]].code === FBS) { IsFBS = true; }
//            }

//            var TotalTestsSelected = itemCodesArray.length;
//            if (IsPBS) { TotalTestsSelected--; }
//            if (IsFBS) { TotalTestsSelected--; }

//            if ((IsPBS) && (!IsFBS)) {
//                AlertBox("Please select the Fasting Blood Sugar (FBS)... to proceed with POSTPRANDIAL Blood Sugar (PBS) ");
//                return false;
//            }
//            if ((IsFBS) && (TotalTestsSelected < 1)) {
//                AlertBox("Please select the any more test to proceed with Fasting Blood Sugar(FBS) ");
//                return false;
//            }
//            return true;
//        }
//    }
//    else {
//        AlertBox("No Item in cart");
//        return false;
//    }
//    //return true;
//}

function FBS_PBS_Check() {
	if (localStorage.getItem(LOCALSTORAGE.ITEMS) != null) {
		if (localStorage.getItem(LOCALSTORAGE.ITEMS) === "{}") {
			AlertBox("No Item in cart");
			return false;
		} else {
			var items = JSON.parse(localStorage.getItem(LOCALSTORAGE.ITEMS));
			var itemCodesArray = Object.keys(items);
			var IsPBS = false;
			var IsFBS = false;
			var IsCRP = false;
			var IsHSCRP = false;
			for (var i = 0; i < itemCodesArray.length; i++) {
				if (items[itemCodesArray[i]].code == PPBS) {
					IsPBS = true;
				}
				if (items[itemCodesArray[i]].code == FBS) {
					IsFBS = true;
				}
				if (items[itemCodesArray[i]].code == CRP) {
					IsCRP = true;
				}
				if (items[itemCodesArray[i]].code == HSCRP) {
					IsHSCRP = true;
				}
			}
			if (IsCRP == true && IsHSCRP == true) {
				AlertBox("CRP and HSCRP can not book together");
				return false;
			}
			var TotalTestsSelected = itemCodesArray.length;
			var Allowed = true;
			if (IsFBS == true) {
				for (var i = 0; i < itemCodesArray.length; i++) {
					if (items[itemCodesArray[i]].fasting == "NF") {
						const a = parseInt((items[itemCodesArray[0]].rate));
						const b = parseInt((items[itemCodesArray[1]].rate));
						const c = a + b;
						if (c >= 500) {
							Allowed = true;
						}
						else {
							AlertBox("Order value needs to be more than Rs.500");
							return false;
                        }
					}
				}
			}
			if (IsFBS == true || IsPBS == true) {
				for (var i = 0; i < itemCodesArray.length; i++) {
					if ((items[itemCodesArray[i]].fasting == "CF") && ((items[itemCodesArray[i]].code != PPBS) && (items[itemCodesArray[i]].code != FBS))) {
						Allowed = true;
					}
				}
			}
		else {
				if (TotalTestsSelected > 0) {
					Allowed = true;
				}
			}

			if (Allowed == true) {
				if (IsFBS == true || IsPBS == true || IsCRP == true) {
					if (IsPBS == true || IsCRP == true) {
						var data = JSON.parse(localStorage.getItem(LOCALSTORAGE.MstTests));
						for (var i = 0; i < itemCodesArray.length; i++) {
							if (items[itemCodesArray[i]].code == FBS) {
								return true;
							} else {
								//for (var j = 0; j < itemCodesArray.length; j++) {
								let wellnessProducts = "";
								if ((items[itemCodesArray[i]].type == "PROFILE") || (items[itemCodesArray[i]].type == "POP") || (items[itemCodesArray[i]].type == "OFFER")) {
									if (items[itemCodesArray[i]].type == "PROFILE" || items[itemCodesArray[i]].type == "POP") {
										wellnessProducts = data.profile.filter(function (e) {
											return e.code == items[itemCodesArray[i]].code;
										});
									} else {
										wellnessProducts = data.offer.filter(function (e) {
											return e.code == items[itemCodesArray[i]].code;
										});
									}
									for (var j = 0; j < wellnessProducts[0].childs.length; j++) {
										if (wellnessProducts[0].childs[j].code == FBS) {
											IsFBS = true;
											break;
										} else if (IsCRP == true) {
											if (wellnessProducts[0].childs[j].code == HSCRP) {
												AlertBox("CRP and HSCRP can not book together");
												return false;
											}
										}
									}
									//console.log(wellnessProducts)
								}
							}
							//}
						}
						if (IsFBS == false && IsPBS == true) {
							AlertBox("Please select Fasting Blood Sugar to Availd PPBS");
							return false;
						}
					} else {
						if (TotalTestsSelected > 1) {
							return true;
						} else {
							AlertBox("Please select 1 Fasting Profile");
							return false;
						}
					}

				}
			}
			 else {
				AlertBox("Selected Combination is not allowed for Booking");
				
			}
			return true;
		}
	} else {
		AlertBox("No Item in cart");
		return false;
	}
}


function AlertBox(Msg, element) {
    var optionsProps = {
        options: 1,
        title: MSGBOX.Alert,
        message: Msg,
        optionTitle: MSGBOX.Ok,
        onOptionClick: messageBoxHide(),
        onMessageBoxClose: null,
        onMessageBoxopen: null,
        focusElement: element
    };
    callMessageBox(optionsProps);
}

function callMessageBox(optionsProps) {
    var defaultOptions = {
        options: 1,
        title: "Message Box",
        message: "Thank You !",
        optionTitle: "Ok",
        onOptionClick: messageBoxHide(),
        onMessageBoxClose: null,
        onMessageBoxopen: null
    };
    var optionObject = optionsProps ? optionsProps : defaultOptions;
    var alertMessageBox = $("#alertMessageBox");
    var alertMessageContent = $("#alertMessageContent");
    var setObject = {
        box: "alertMessageBox",
        boxContainer: "alertMessageContent",
        title: optionObject.title,
        message: optionObject.message,
        options: optionObject.options,
        optionTitle: optionObject.optionTitle,
        onOptionClick: optionObject.onOptionClick,
        focusElement: optionObject.focusElement
    };
    setMessageBoxProps(setObject);
}

//function Ordervalue() {
//	var a = (items[itemCodesArray[i]].rate);
//	var b = (items[itemCodesArray[i]].rate);
//	var c = (a + b);
//	if (c > 500) {
//		Allowed = true
//		return true;
//	}
//}

function messageBoxShow(box, boxContainer, callBackOption) {
    var alertMessageBox = $("#" + box);
    var btnOk = alertMessageBox.find(".btnSubmit");
    var alertMessageContent = alertMessageBox.find("#" + boxContainer);
    alertMessageBox.show();
    btnOk.focus();
    //var alertMessageTopMargin = "-" + alertMessageContent.outerHeight(true) / 2 + "px";
    //var alertMessageLeftMargin = "-" + alertMessageContent.outerWidth(true) / 2 + "px";
    //alertMessageContent.css({
    //    "margin-top": alertMessageTopMargin,
    //    "margin-left": alertMessageLeftMargin
    //});
    if (callBackOption) {
        callBackOption();
    } else {
        return false;
    }
}

function messageBoxHide(box, element) {
    var alertMessageBox = $("#" + box);
    alertMessageBox.hide();
    if (element !== undefined) {
		if (document.getElementById(element)) {
			if (element != "txtAppdt") {
				document.getElementById(element).focus();
			}
        }
        else {
            $("#" + element).focus();
        }
        return true;
    } else {
        return true;
    }
}

function setMessageBoxProps(messageObj) {
    var alertMessageBox = $("#" + messageObj.box);
    var alertMessageContent = alertMessageBox.find("#" + messageObj.boxContainer);
    var alertMessageTitle = alertMessageContent.find(".title");
    var alertMessage = alertMessageContent.find(".message");
    var btnSubmit = alertMessageContent.find(".btnSubmit");
    var btnCancel = alertMessageContent.find(".btnCancel");

    alertMessageTitle.html(messageObj.title);
    alertMessage.html(messageObj.message);
    btnSubmit.val(messageObj.optionTitle);

    if (messageObj.options && messageObj.options !== 2) {
        btnSubmit.click(function () {
            messageBoxHide(messageObj.box, messageObj.focusElement);
            return true;
        });
    } else {
        btnCancel.show();
        btnSubmit.click(function () {
            onOptionClick();
        });
    }
    btnCancel.click(function () {
        messageBoxHide(messageObj.box);
    });
    messageBoxShow(messageObj.box, messageObj.boxContainer);
}