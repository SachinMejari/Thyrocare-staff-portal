function MinimumLengthCheck(element, minlength) {
    debugger
    var elementValue = Trim($(element).val());
    if (elementValue.length < minlength) {
        return LengthErrorMsg;
    }
    else {
        return emptyString;
    }
}

