function loginHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    var username = $("[name=uname]").val().trim();
    var password = $("[name=password]").val().trim();

    if (username === "") {
        AlertBox("Please enter username");
        return false;
    }
    if (password === "") {
        AlertBox("Please enter password");
        return false;
    }

    if (username !== "" && password !== "") {
        sendLoginInfo(username, password);
    }
    return false;
}

function sendLoginInfo(username, password) {
    var IsValid = false;
    var input = {
        UserName: username,
        Password: password
    };
    $.ajax({
        type: POST,
        url: "/api/SignIn",
        contentType: AjaxCallContentType,
        data: JSON.stringify(input),
        dataType: AjaxCallJson,
        async: true,
        cache: false,
        success: function (Response) {
            if (Response.respId !== RES00001) {
                AlertBox(Response.response);
                $("[name=uname]").val("");
                $("[name=password]").val("");
                return false;
            } else {
                IsValid = true;
                var today = new Date();                
                localStorage.setItem("LoggedInTime", today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear());
                RedirectToHome();
            }
        },
        error: function () {
            return false;
        }
    });

    //if (IsValid == true) {
    //    RedirectToHome();
    //}
}
