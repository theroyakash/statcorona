function html(id, content) {
	document.getElementById(id).innerHTML = content;
}

google.charts.load('current', {packages: ['corechart', 'line']});
// google.charts.setOnLoadCallback(drawBasic);

let open = false;

async function drawBasic() {
  if (open) return;

  open = true;

  var dataGraph = new google.visualization.DataTable();
  dataGraph.addColumn('string', 'Date');
  dataGraph.addColumn('number', 'Cases');
  let GraphData = [];
  await fetch('https://covid19.mathdro.id/api/daily')
    .then(response => response.json())
    .then(data => {
      data.forEach((item, i) => {
        let reportdate = new Date(item.reportDate);
        let date = `${reportdate.getMonth()+1}/${reportdate.getDate()}/${reportdate.getFullYear()}`;
        GraphData.push([date, item.totalConfirmed]);
      });
      dataGraph.addRows(GraphData);
    });


  var options = {
    hAxis: {
      title: 'Date'
    },
    vAxis: {
      title: 'Cases'
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

  chart.draw(dataGraph, options);
}


function addCommas(nStr){
 nStr += '';
 var x = nStr.split('.');
 var x1 = x[0];
 var x2 = x.length > 1 ? '.' + x[1] : '';
 var rgx = /(\d+)(\d{3})/;
 while (rgx.test(x1)) {
  x1 = x1.replace(rgx, '$1' + ',' + '$2');
 }
 return x1 + x2;
}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, {});
});
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems, {onOpenStart: drawBasic});
});


fetch('https://covid19.mathdro.id/api')
  .then(response => response.json())
  .then(data => {
    html('cases', `Confirmed Cases: ${addCommas(data.confirmed.value)}`);
    html('recovered', `Patients Recovered: ${addCommas(data.recovered.value)}`);
    html('deaths', `Deaths: ${addCommas(data.deaths.value)}`);
  });

let selection = document.querySelector("#selection"); // the select element

selection.onchange = (e) => {
  // now that we know the country name the user selected its just a simple fetch GET request of that country use selection.value or e.target.value to get the country selected
  fetch(`https://covid19.mathdro.id/api/countries/${e.target.value}`)
  .then(response => response.json())
  .then(data => {
    html('country', `${e.target.value}'s Statistics`)
    //alert(data.confirmed.value);
    html('country-cases', `Confirmed Cases: ${addCommas(data.confirmed.value)}`);
    html('country-recovered', `Patients Recovered: ${addCommas(data.recovered.value)}`);
    html('country-deaths', `Deaths: ${addCommas(data.deaths.value)}`)
  });
};

fetch('https://covid19.mathdro.id/api/countries')
  .then(response => response.json())
  .then(data => {
    for (let item of data.countries) { // Loops through the countries and gets the object
      selection.innerHTML += `<option value="${item.name}">${item.name}</option>`;
    }

    let elems = document.querySelectorAll('select'); // We have to init the selection element again because we changed it
    let instances = M.FormSelect.init(elems, {}); // We have to init the selection element again because we changed it
  })
  .catch(err => {});