function buttonPress() {
    var key;
    var isvalid = false;
    while (!isvalid) {
        key = KeyGen();
        var firstfive = key["hashkey"].slice(0, 5);
        var geturl = "https://api.pwnedpasswords.com/range/" + firstfive;
        var data = getData(geturl);
        var jsondata = handleData(data)
        isvalid = checkformatch(jsondata, key);
    }
    console.log("pw found: " + key["clearkey"]);
    document.getElementById("label1").innerHTML = key["clearkey"];
    $("#clipButton").show();
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function KeyGen() {

    var chars = ["0","1","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","!","_"]
    chars = shuffle(chars);
    var key = "";
    for (i = 0; i < 24; i++) {
        var rannumber = Math.floor(Math.random() * chars.length);
        key += chars[rannumber]
    }
    var shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(key);
    var hashKey = shaObj.getHash("HEX");
    return {"clearkey":key,"hashkey":hashKey};
}

function getData(geturl) {
    var jsondata = null;
    $.ajax({
        type: "GET",
        async: false,
        url: geturl,
        success: function (data) {
            jsondata = data;
        }
    });
    return jsondata;
}

function handleData(data) {
    var splitdata = data.split("\n");
    var jsondata = [];
    for (i = 0; i < splitdata.length; i++) {
        var hash = splitdata[i].slice(0,35);
        var count = splitdata[i].slice(36);
        jsondata.push({hash : hash, count : count});
    }
    return jsondata;
}

function checkformatch(jsondata, key) {
    var checkkey = key["hashkey"].slice(5);
    var retvalue = false;
    var index;
    for (i = 0; i < jsondata.length; i++) {
        var obj = jsondata[i];
        if (obj.hash === checkkey.toUpperCase()) {
            index = i;
            retvalue = false;
            console.log("MATCH FOUND AT " + i + "\n occured " + obj.count + " times");
        } else {
            retvalue = true;
        }
    }
    return retvalue;
}

function copyToClip() {
    var pw = document.getElementById("label1").innerText;
    window.prompt("Copy to clipboard: Ctrl+C", pw);
}
