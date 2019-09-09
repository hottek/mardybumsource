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
    $("#clipButton").show();
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
    let i;
    let chars = []
    for (i = 48; i < 58; i++) {chars.push(String.fromCharCode(i));}
    for (i = 65; i < 91; i++) {chars.push(String.fromCharCode(i));}
    for (i = 97; i < 122; i++) {chars.push(String.fromCharCode(i));}
    chars.push(String.fromCharCode(33));
    chars.push(String.fromCharCode(95));
    chars = shuffle(chars);
    let key = "";
    for (i = 0; i < 24; i++) {
        const randomnumber = Math.floor(Math.random() * chars.length);
        key += chars[randomnumber]
    }
    let shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(key);
    let hashKey = shaObj.getHash("HEX");
    return {"clearkey":key,"hashkey":hashKey};
}

function getData(geturl) {
    let jsonData = null;
    $.ajax({
        type: "GET",
        async: false,
        url: geturl,
        success: function (data) {
            jsonData = data;
        }
    });
    return jsonData;
}

function handleData(data) {
    let splitData = data.split("\n");
    let jsonData = [];
    for (i = 0; i < splitData.length; i++) {
        let hash = splitData[i].slice(0,35);
        let count = splitData[i].slice(36);
        jsonData.push({hash : hash, count : count});
    }
    return jsonData;
}

function checkformatch(jsonData, key) {
    let checkKey = key["hashkey"].slice(5);
    let returnValue = false;
    for (i = 0; i < jsonData.length; i++) {
        var obj = jsonData[i];
        if (obj.hash === checkKey.toUpperCase()) {
            returnValue = false;
            console.log("MATCH FOUND AT " + i + "\n occured " + obj.count + " times");
        } else {
            returnValue = true;
        }
    }
    return returnValue;
}

function copyToClip() {
    const pw = document.getElementById("label1").innerText;
    window.prompt("Copy to clipboard: Ctrl+C", pw);
}