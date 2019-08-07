function buttonPress() {
    let key;
    let isvalid = false;
    while (!isvalid) {
        key = keyGen();
        const firstfive = key["hashkey"].slice(0, 5);
        const geturl = "https://api.pwnedpasswords.com/range/" + firstfive;
        const data = getData(geturl);
        const jsondata = handleData(data)
        isvalid = checkformatch(jsondata, key);
    }
    document.getElementById("label1").innerHTML = key["clearkey"];
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function keyGen() {
    let chars = []
    for (i = 48; i < 58; i++) {chars.push(String.fromCharCode(i));}
    for (i = 65; i < 91; i++) {chars.push(String.fromCharCode(i));}
    for (i = 97; i < 122; i++) {chars.push(String.fromCharCode(i));}
    chars.push(String.fromCharCode(33));
    chars.push(String.fromCharCode(95));
    chars = shuffle(chars);
    let key = "";
    for (i = 0; i < 24; i++) {
        var rannumber = Math.floor(Math.random() * chars.length);
        key += chars[rannumber]
    }
    let shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(key);
    let hashKey = shaObj.getHash("HEX");
    return {"clearkey":key,"hashkey":hashKey};
}

function getData(geturl) {
    let jsondata = null;
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
    let splitdata = data.split("\n");
    let jsondata = [];
    for (i = 0; i < splitdata.length; i++) {
        let hash = splitdata[i].slice(0,35);
        let count = splitdata[i].slice(36);
        jsondata.push({hash : hash, count : count});
    }
    return jsondata;
}

function checkformatch(jsondata, key) {
    let checkkey = key["hashkey"].slice(5);
    let retvalue = false;
    for (i = 0; i < jsondata.length; i++) {
        var obj = jsondata[i];
        if (obj.hash === checkkey.toUpperCase()) {
            retvalue = false;
            console.log("MATCH FOUND AT " + i + "\n occured " + obj.count + " times");
        } else {
            retvalue = true;
        }
    }
    return retvalue;
}