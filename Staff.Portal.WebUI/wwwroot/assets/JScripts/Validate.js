function leadingSpace(evt,t) {
    var firstChar = t.value;
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode == 32 && firstChar == "") {
        return false;
    }
}



//function isValidLatitude($latitude) {
//    var latitude = new RegExp(/^(?=.)-?((8[0-5]?)|([0-7]?[0-9]))?(?:\.[0-9]{1,20})?$/);

//    if (!latitude.test($latitude.value)) {
//        AlertBox("Invalid latitude");
//        $latitude.value = emptyString;
//    }
//}
//function isValidLongitude($longitude) {
//    var longitude = new RegExp(/^(?=.)-?((0?[8-9][0-9])|180|([0-1]?[0-7]?[0-9]))?(?:\.[0-9]{1,20})?$/);
//    if (!longitude.test($longitude.value)) {
//        AlertBox("Invalid longitude");
//        $longitude.value = emptyString;
//    } 
//} 

function onlyAlphabets(e, t) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { return true; }

        if (charCode == 32 && t.value == "")
            return false;
        else if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode == 32) || (charCode == 8))
            return true;        
        else
            return false;
    }
    catch (err) {
        alert(err.Description);
    }
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function AllowemailChars(e, t) {
    if (window.event) {
        var charCode = window.event.keyCode;
    }
    else if (e) {
        var charCode = e.which;
    }
    else { return true; }

    if ( (charCode >= 32 && charCode <= 44) || (charCode == 47) || (charCode >= 58 && charCode <= 63) || (charCode == 63) || (charCode >= 91 && charCode <= 94) || (charCode == 96) || (charCode >= 123 && charCode <= 126) ) {
        return false;
    }
    return true;    
}

function ignoreSplChars(e, t,  type) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { return true; }
    
        var splChars = [];

        if (type == Address)
        { splChars = [33, 34, 35, 36, 37, 42, 43, 58, 59, 60, 61, 62, 63, 64, 91, 93, 94, 95, 96, 123, 124, 125, 126]; }
        else if (type == Email)
        { splChars = [32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 45, 47, 58, 59, 60, 61, 62, 63, 91, 93, 94, 96, 123, 124, 125, 126]; }
        else if (type == "subject") { splChars = [33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 45, 47, 58, 59, 60, 61, 62, 63, 91, 93, 94, 96, 123, 124, 125, 126]; }

        for (var i = 0; i < splChars.length; i++) {
            if (charCode == splChars[i]) {
                return false;                
                break;                
            }
        }    
        return true;
    }
    catch (err) {
        alert(err.Description);
    }
}

//---------------PINCODE VALIDATION : START------------
function valid_pin(nn) {    
    if (nn.value != emptyString) {
        ss = nn.value.substr(0, 1);
        if (ss == "0" | ss == "9") {
            AlertBox("Pincode should not start with  0 or 9 ",nn);
            nn.value = emptyString;
            nn.focus();
            return false;
        }
        first2Char = nn.value.substr(0, 2);
        if (first2Char == "10") {
            AlertBox("Pincode should not start with  10", nn);
            nn.value = emptyString;
            nn.focus();
            return false;
        }
        if (isNaN(nn.value) == true) {
            AlertBox("Pincode should be Numbers", nn);
            nn.value = emptyString;
            nn.focus();
            return false;
        }
        if (nn.value.length < 6) {
            AlertBox("Pincode should be six digits", nn);
            nn.value = emptyString;
            nn.focus();
            return false;
        }
    }
}
//---------------PINCODE VALIDATION : END------------
//---------------CHECK ALPHA : START------------
function valid_alpha(nn) {
    if (nn.value != emptyString) {
        if (isNaN(nn.value) == false) {
            AlertBox("No Numbers are allowed.", nn);
            nn.value = emptyString;
            nn.focus();
            return false;
        }
    }
}
//---------------CHECK ALPHA : END------------
//---------------STD VALIDATION: START---------
function valid_std(nn) {
    alert("nn.value : " + nn.value);
    if (nn.value != emptyString) {
        ss = nn.value.substr(0, 1);
        if (ss != "0") {
            alert("STD code should start with 0");
            nn.value = emptyString;
            nn.focus();
            return false;
        }
        if (!((nn.value.length == 3) || (nn.value.length == 4) || (nn.value.length == 5))) {
            alert("Enter a valid STD code");
            nn.value = emptyString;
            nn.focus();
            return false;
        }
    }
}
//---------------STD VALIDATION: END---------
//---------------PHONE NO VALIDATION: START---------
function valid_phone(std, nn) {
    if (nn.value != emptyString) {
        if (std.value == emptyString) {
            alert("Enter the STD code First..");
            nn.value = emptyString;
            std.focus();
            return false;
        }
        ss = nn.value.substr(0, 1);
        if (ss == "0") {
            alert("Phone Number should not start with 0");
            nn.value = emptyString;
            nn.focus();
            return false;
        }
        if ((std.value.length + nn.value.length) != 11) {
            alert("Enter a valid Phone Number");
            nn.value = emptyString;
            nn.focus();
            return false;
        }
    }
}
//---------------PHONE NO VALIDATION: END---------
//---------------MOBILE VALIDATION: START---------
function valid_mob(m) {
    mob = m.value;
    if (mob == emptyString) return false;
    if ((!(((mob.indexOf("9") == 0 || mob.indexOf("8") == 0 || mob.indexOf("7") == 0 || mob.indexOf("6") == 0) && mob.length == 10))) || isNaN(mob)) {
        AlertBox("Invalid Mobile number.", m);
        with (m) {
            value = emptyString;
            focus();
        }
    }
    var chk = mob.substr(1, 1)
    var j = 0;
    for (var i = 2; i < 10; i++) {
        if (chk == mob.substr(i, 1)) { var j = j + 1 };
        if (j >= 8) { var exists = "NO"; }
    }
    if (exists == "NO") {
        AlertBox("Invalid Mobile no.", m)
        {
            m.value = emptyString;
            m.focus();
        }
    }
}
//---------------MOBILE VALIDATION: END---------
//---------------EMAIL VALIDATION: START---------
function emailvalidation(entered) {
    debugger;
    with (entered) {
        mails = value.length;
        if (mails >= 1) {
            firstpos = value.indexOf("@");
            dotpos = value.lastIndexOf(".");
            lastpos = value.length - 1;
            val = entered.value;
            splCount = 0;
            for (var i = 0; i < mails; i++) {
                if (val.charAt(i) == "@") {
                    splCount++;
                }
            }

            if (firstpos < 1 || dotpos - firstpos < 2 || lastpos - dotpos > 4 || lastpos - dotpos < 2 || value.substring(0, 1) == "@" || value.indexOf("@@") > -1 || value.indexOf("..") > -1 || splCount > 1) {
                AlertBox("Invalid Email ID..!", entered);
                value = emptyString;
                focus();
                return false;
            }
            else {
                return true;
            }
        }
        //if (entered.value == "") {

        //    AlertBox('Please Enter Email');
        //    return false;
        //}
        //else if (entered.value != "") {
        //    var email = entered.value;
        //    var expr = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]­{1}[a-z0-9]+)*[\.]{1}(com|ca|net|org|fr|us|qc.ca|gouv.qc.ca)$', 'i');
        //    if (!expr.test(email)) {
        //        AlertBox('Invalid Email Address');
        //        entered.value = "";
        //        return false;
        //    }


        //}
    }
}
//---------------EMAIL VALIDATION: END---------
//---------------TRIM FUNCTION: START---------
function Trim(STRING) {
    if ((STRING != emptyString) && (STRING != null)) {   
        STRING = LTrim(STRING);
        STRING = RTrim(STRING);
    }
    return STRING;
}

function RTrim(STRING) {
    while (STRING.charAt((STRING.length - 1)) == " " || STRING.charCodeAt((STRING.length - 1)) == 13 || STRING.charCodeAt((STRING.length - 1)) == 10) {
        STRING = STRING.substring(0, STRING.length - 1);
    }
    return STRING;
}

function LTrim(STRING) {
    while (STRING.charAt(0) == " " || STRING.charCodeAt(0) == 13 || STRING.charCodeAt(0) == 10) {
        STRING = STRING.replace(STRING.charAt(0), emptyString);
    }
    return STRING;
}

//---------------TRIM FUNCTION: END-------

//==============RS. TO WORDS CONVERSION
function rupeestowords(t) {    
    var junkVal = t    
    junkVal = Math.floor(junkVal);
    var obStr = new String(junkVal);
    numReversed = obStr.split(emptyString);
    actnumber = numReversed.reverse();
    if (Number(junkVal) >= 0) {
        //do nothing   
    }
    else {
        return emptyString;
    }
    if (Number(junkVal) == 0) {
       return  obStr + '' + 'Rupees Zero Only';        
    }
    if (actnumber.length > 9) {
        return emptyString;
    }
    var iWords = ["ZERO", " ONE", " TWO", " THREE", " FOUR", " FIVE", " SIX", " SEVEN", " EIGHT", " NINE"];
    var ePlace = ['TEN', ' ELEVEN', ' TWELVE', ' THIRTEEN', ' FOURTEEN', ' FIFTEEN', ' SIXTEEN', ' SEVENTEEN', ' EIGHTEEN', ' NINETEEN'];
    var tensPlace = ['DUMMY', ' TEN', ' TWENTY', ' THIRTY', ' FORTY', ' FIFTY', ' SIXTY', ' SEVENTY', ' EIGHTY', ' NINETY'];
    var iWordsLength = numReversed.length;
    var totalWords = emptyString;
    var inWords = new Array();
    var finalWord = emptyString;
    j = 0;
    for (i = 0; i < iWordsLength; i++) {
        switch (i) {
            case 0:
                if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                    inWords[j] = emptyString;
                }
                else {
                    inWords[j] = iWords[actnumber[i]];
                }
                inWords[j] = inWords[j] + ' ONLY';
                break;
            case 1:
                tens_complication();
                break;
            case 2:
                if (actnumber[i] == 0) {
                    inWords[j] = emptyString;
                }
                else if (actnumber[i - 1] != 0 && actnumber[i - 2] != 0) {
                    inWords[j] = iWords[actnumber[i]] + ' HUNDRED AND';
                }
                else {
                    inWords[j] = iWords[actnumber[i]] + ' HUNDRED';
                }
                break;
            case 3:
                if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                    inWords[j] = emptyString;
                }
                else {
                    inWords[j] = iWords[actnumber[i]];
                }
                inWords[j] = inWords[j] + " THOUSAND";
                break;
            case 4:
                tens_complication();
                break;
            case 5:
                if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                    inWords[j] = emptyString;
                }
                else {
                    inWords[j] = iWords[actnumber[i]];
                }
                inWords[j] = inWords[j] + " LAKH";
                break;
            case 6:
                tens_complication();
                break;
            case 7:
                if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                    inWords[j] = '';
                }
                else {
                    inWords[j] = iWords[actnumber[i]];
                }
                inWords[j] = inWords[j] + " CRORE";
                break;
            case 8:
                tens_complication();
                break;
            default:
                break;
        }
        j++;
    }
    function tens_complication() {
        if (actnumber[i] == 0) {
            inWords[j] = emptyString;
        }
        else if (actnumber[i] == 1) {
            inWords[j] = ePlace[actnumber[i - 1]];
        }
        else {
            inWords[j] = tensPlace[actnumber[i]];
        }
    }
    inWords.reverse();
    for (i = 0; i < inWords.length; i++) {
        finalWord += inWords[i];
    }    
    return finalWord;
}

// Before you reuse this script you may want to have your head examined
// BLINK TEXT - ADD BEFORE AFTER THE STRING WITH <BLINK>TEXT</BLINK>
function doBlink() {
    // Blink, Blink, Blink...
    var blink = document.all.tags("BLINK")
    for (var i = 0; i < blink.length; i++)
        blink[i].style.visibility = blink[i].style.visibility == "" ? "hidden" : ""
}
function startBlink() {
    // Make sure it is IE4
    if (document.all)
        setInterval("doBlink()", 1000)
}
//=============SET CURSOR POSITION IN TEXTBOX OR TEXT AREA - INPUT: ID OF TEXT BOX AND CURSOR POSITION
function setCaretPosition(elemId, caretPos) {
    var elem = document.getElementById(elemId);

    if (elem != null) {
        if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if (elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}
//---------------MAX TEXT ENTRY: START---------
function txt_max(Obj, Objmax) {
    var maxnum = Obj.value.length;
    if (Obj.value.length >= Objmax) {
        alert("Character limit reached.");
        Obj.value = Obj.value.substring(0, Objmax);
    }
}
//---------------MAX TEXT ENTRY: END---------
//--------------FUNCTION USED MIN TEXT; START------
function fun_min(v, v1) {
    //v-input object name, v1-min. character value, required to type. call this onblur of text object
    val = Trim(v.value);
    //val=val.split('  ').join(' ');
    //val=val.replace(/^\s*|\s(?=\s)|\s*$/g, " ");
    val = val.replace(/^\s*|\s*$/g, '')
    //val = val.replace(/\s{2,}/g, ' ');	
    v.value = val;
    if (val == emptyString) {        
        return false;
    }
    if ((val.length < v1) && (val != emptyString)) {
        alert("Minimum character should be " + v1 + "..");
        v.focus();
        return false;
    }
    else
        v.value = val;
}
//--------------FUNCTION USED MIN TEXT; END------
//=================Date validation - start ========================
function valid_date(v, c, f) {	//v->date //c->condition //f->format
    if (f == "YMD")
        var ddt = new Date(v.value.replace("-", "/").replace("-", "/"))
    else if (f == "DMY") {
        var dt1 = v.value.replace("-", "/").replace("-", "/").split("/")
        var ddt = new Date(dt1[2] + "/" + dt1[1] + "/" + dt1[0])
    }
    else {
        alert("Invalid Format Argument..")
        v.value = emptyString;
        return false;
    }
    var sdt = new Date(ddt.getYear(), ddt.getMonth(), ddt.getDate())
    var dt = new Date()
    var cdt = new Date(dt.getYear(), dt.getMonth(), dt.getDate())

    if (c == "LE") {
        if (sdt > cdt) {
            alert("Invalid Date..")
            v.value = emptyString;
            return false;
        }
    }
    else if (c == "GE") {
        if (sdt < cdt) {
            alert("Invalid Date..")
            v.value = emptyString;
            return false;
        }
    }
    else if (c == "L") {
        if (sdt >= cdt) {
            alert("Invalid Date..")
            v.value = emptyString;
            return false;
        }
    }
    else if (c == "G") {
        if (sdt <= cdt) {
            alert("Invalid Date..")
            v.value = emptyString;
            return false;
        }
    }
    else {
        alert("Invalid Arguments..")
        v.value = emptyString;
        return false;
    }
}
//=================Date validation - end ========================
//character count
function text_count(inp_obj, cnt_obj, mx) {
    var m = inp_obj.value;
    var mm = m.length;    
    if (cnt_obj) cnt_obj.value = mm;
    if (mm > mx) { alert("Character exceeds the Max. limit."); inp_obj.value = inp_obj.value.substring(0, mx); return true; }
}
// Format the numbers in javascript:
function format_number(pnumber, decimals) {
    if (isNaN(pnumber)) { return 0 };
    if (pnumber == emptyString) { return 0 };

    var snum = new String(pnumber);
    var sec = snum.split('.');
    var whole = parseFloat(sec[0]);
    var result = emptyString;

    if (sec.length > 1) {
        var dec = new String(sec[1]);
        dec = String(parseFloat(sec[1]) / Math.pow(10, (dec.length - decimals)));
        dec = String(whole + Math.round(parseFloat(dec)) / Math.pow(10, decimals));
        var dot = dec.indexOf('.');
        if (dot == -1) {
            dec += '.';
            dot = dec.indexOf('.');
        }
        while (dec.length <= dot + decimals) { dec += '0'; }
        result = dec;
    } else {
        var dot;
        var dec = new String(whole);
        dec += '.';
        dot = dec.indexOf('.');
        while (dec.length <= dot + decimals) { dec += '0'; }
        result = dec;
    }
    return result;
}