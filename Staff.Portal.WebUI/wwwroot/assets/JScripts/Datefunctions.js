function reverseDate(n) {
    return n && (n = n.split("/").reverse().join("-")), n;
}


function reverseDate1(n) {
    return n && (n = n.split("-").reverse().join("-")), n;
}