var myButton = document.getElementById("button_cotact_us")
var myTable = document.getElementById("myTable")
var condition = 'sent succesfully';
myButton.addEventListener("click", addProductToTable)

var index=1
function addProductToTable() {
    event.preventDefault();
    var conNameInp = document.getElementById("nameCus")
    var conEmailInp = document.getElementById("emailCus")

    var nameCus = conNameInp.value;
    var emailCus = conEmailInp.value;

    var myTr=document.createElement("tr")

    var myTd1=document.createElement("td")
    var myTd2=document.createElement("td")
    var myTd3=document.createElement("td")
    var myTd4=document.createElement("td")

    myTd1.textContent=index;
    index++;
    myTd2.textContent=nameCus;
    myTd3.textContent=emailCus;
    myTd4.textContent=condition;

    myTr.appendChild(myTd1)
    myTr.appendChild(myTd2)
    myTr.appendChild(myTd3)
    myTr.appendChild(myTd4)
    myTable.appendChild(myTr)
}

