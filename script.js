const assignedStore = 'json/assignedStore.json';
const brandDateData = 'json/brandDateData.json';

//const assignedStore = 'https://gitlab.com/eduardo-dev/data-table-test/raw/master/assignedStore.json';
//const brandDateData = 'https://gitlab.com/eduardo-dev/data-table-test/raw/master/brandDateData.json';

var dataArray = [];
var getData = function(url){
    return new Promise(function(reslve , reject){
    var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function(){
            if(xhr.status != 200){
                reject(xhr.status);
            } else{
                reslve(xhr.response);
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/xml');
        xhr.send();
    });
}

function getDataFormate(data){
    var items; 
    if(data){
        items = JSON.parse(data);
    }
    return items;
}

function getItemId(data, identifier){
   return data.filter(function(item){
        if(item.identifier == identifier){
            return item;
        }
    });
}
function getDataIitems(items, keyName){
    items.forEach( (element ,i ) => {
       dataItem = element[keyName];
    });
    return  dataItem;
}

function totalItem(data){
    sumaTotal = 0;
    if(typeof(data) === "object"){
     for(let item in data ){
         sumaTotal += data[item]
     }
    }
    return sumaTotal;
}
function getCount(data){
    sumaTotal = 0;
    if(typeof(data) === "object"){
        for(let item in data ){
            if(data[item] == 0){
                sumaTotal += 1;
            }
        }
    }
    return sumaTotal;
}
function getTotalItems(data){
    sumaTotal = 0;
    if(typeof(data) === "object"){
        for(let item in data ){ 
            sumaTotal += 1;
        }
    }
    return sumaTotal;
}
function getDataTable(data, dataDate){
    var dataTable = [];
    var item = [];
    if(data.data){
        data.data.forEach( (element, i)=> { 
            item = {
                title:element.name,
                peasants:totales(dataDate,element.identifier, "peasants"),
                visitors:totales(dataDate,element.identifier, "visitors"),
                cabinet:totales(dataDate,element.identifier, "cabinet"),
                tickets:totales(dataDate,element.identifier, "tickets"),
                revenue:totales(dataDate,element.identifier, "revenue"),
                items:totales(dataDate,element.identifier, "items"),
                permanence:totales(dataDate,element.identifier, "permanence"),
                uptime:totaCount(dataDate,element.identifier, "uptime"),
                permanenceCount:permanenceCount(dataDate,element.identifier, "permanence")
           }
           dataTable.push(item);
        });

    }
    return dataTable;
}
function totales(DateData,keyId,itemName){
    let itemFind = getItemId(DateData , keyId);
    var dataArrayItemName = getDataIitems(itemFind,itemName);
    var suma = totalItem(dataArrayItemName)

    return suma;
}
function totaCount(DateData,keyId,itemName){
    let itemFind = getItemId(DateData , keyId);
    var dataArrayItemName = getDataIitems(itemFind,itemName);
    var suma = getCount(dataArrayItemName)
  
    return suma;
}
function permanenceCount(DateData,keyId,itemName){
    let itemFind = getItemId(DateData , keyId);
    var dataArrayItemName = getDataIitems(itemFind,itemName);
    var suma = getTotalItems(dataArrayItemName)
   
    return suma;
}
function showPromedio(){
    isCheck = document.getElementById('showCheck');
    var promedio=document.getElementsByClassName('promedio');
  
    if (isCheck.checked == true){
        promedio.style.display=='none';
    }else{
        promedio.style.display=='block';
    }
 
}
function getHtml(data){
    var html = '';
    html+='<div><div class="form-check">';
    html+='<input class="form-check-input" type="checkbox" value="" onclick="showPromedio()" id="showCheck">';
    html+='<label class="form-check-label" for="defaultCheck1">Mostrar Promedios</label>';
    html+='</div>';
    html +='<table class="table table-dark"><thead><tr>';
    html +='<th scope="col">Title</th>';
    html +='<th scope="col">Peasants</th>';
    html +='<th scope="col">visitors</th>';
   
    html +='<th class="promedio" scope="col">Attraction</th>';
    
    html +='<th scope="col">Cabinet</th>';
    html +='<th scope="col">Tickets</th>';
    html +='<th scope="col">Persuasion</th>';
    html +='<th scope="col">Revenue</th>';
    html +='<th class="promedio" scope="col">AverageTicket</th>';
    html +='<th scope="col">Items</th>';
    html +='<th class="promedio"  scope="col">ItemperTicket</th>';
    html +='<th class="promedio"  scope="col">AveragePermanence</th>';
    html +='<th scope="col">Uptime</th>';
    html +='</tr></thead>';
        data.forEach(element => {
            html +='<tr>';
            html +='<td>'+element.title+'</td>';
            html +='<td>'+element.peasants+'</td>';
            html +='<td>'+element.visitors+'</td>';
            
            html +='<td class="promedio" >'+(element.peasants/element.visitors).toFixed(2)+'</td>';
            
            html +='<td>'+element.cabinet+'</td>';
            html +='<td>'+element.tickets+'</td>';
            html +='<td class="promedio" >'+(element.tickets/element.visitors).toFixed(2)+'</td>';
            html +='<td>'+(element.revenue).toFixed(2)+'</td>';
            html +='<td class="promedio" >'+(element.revenue/element.tickets).toFixed(2)+'</td>';
            html +='<td>'+element.items+'</td>';
            html +='<td class="promedio" >'+((element.items/element.tickets)/100).toFixed(2)+'</td>';
            html +='<td class="promedio" >'+(((element.permanence*100)/element.permanenceCount)/6000000).toFixed(2)+'</td>';
            html +='<td>'+element.uptime+'</td>';
        html +='</tr>'; 
        });
    html +='</table></div>';
    return html; 
}

async function dataJson(){
    var getAssignedStore = await getData(assignedStore);
    var getBrandDateData = await getData(brandDateData);
    var dataBrandDateData = getDataFormate(getBrandDateData);
    var dataAssignedStore = getDataFormate(getAssignedStore);
    var dataArrayFormate = getDataTable(dataAssignedStore, dataBrandDateData);
    var Html = getHtml(dataArrayFormate);
    var wrapperHtml = document.getElementById('table-container');
    wrapperHtml.innerHTML = Html;
}

dataJson();