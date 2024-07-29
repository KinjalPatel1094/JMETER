/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 87.5, "KoPercent": 12.5};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.725, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.725, 500, 1500, "FlightsPage"], "isController": false}, {"data": [0.8, 500, 1500, " LoginPage"], "isController": false}, {"data": [0.65, 500, 1500, "PurchasePage"], "isController": false}, {"data": [0.725, 500, 1500, "MainPage"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 80, 10, 12.5, 580.5875, 183, 1768, 427.0, 1058.2000000000003, 1631.6000000000004, 1768.0, 6.655574043261232, 39.782653910149754, 1.9761985232945092], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["FlightsPage", 20, 3, 15.0, 637.5, 269, 1657, 452.5, 1625.1000000000004, 1656.0, 1657.0, 2.034381039568711, 14.393643194995423, 0.25827103041399657], "isController": false}, {"data": [" LoginPage", 20, 1, 5.0, 512.1500000000001, 197, 1144, 359.5, 945.1000000000001, 1134.2499999999998, 1144.0, 1.904036557501904, 10.714296339489719, 0.2305669268849962], "isController": false}, {"data": ["PurchasePage", 20, 4, 20.0, 674.3, 183, 1768, 521.5, 1637.9000000000003, 1762.1, 1768.0, 1.889287738522577, 12.39660577649726, 1.5391053041753258], "isController": false}, {"data": ["MainPage", 20, 2, 10.0, 498.4000000000001, 184, 1024, 438.5, 1006.8000000000004, 1024.0, 1024.0, 1.9133263178035014, 8.888372357218024, 0.2391657897254377], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,637 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 10.0, 1.25], "isController": false}, {"data": ["The operation lasted too long: It took 1,518 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 10.0, 1.25], "isController": false}, {"data": ["The operation lasted too long: It took 1,529 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 10.0, 1.25], "isController": false}, {"data": ["The operation lasted too long: It took 1,024 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 2, 20.0, 2.5], "isController": false}, {"data": ["The operation lasted too long: It took 1,657 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 10.0, 1.25], "isController": false}, {"data": ["The operation lasted too long: It took 1,650 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 10.0, 1.25], "isController": false}, {"data": ["The operation lasted too long: It took 1,144 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 10.0, 1.25], "isController": false}, {"data": ["The operation lasted too long: It took 1,062 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 10.0, 1.25], "isController": false}, {"data": ["The operation lasted too long: It took 1,768 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, 10.0, 1.25], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 80, 10, "The operation lasted too long: It took 1,024 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 2, "The operation lasted too long: It took 1,637 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "The operation lasted too long: It took 1,518 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "The operation lasted too long: It took 1,529 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "The operation lasted too long: It took 1,657 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["FlightsPage", 20, 3, "The operation lasted too long: It took 1,637 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "The operation lasted too long: It took 1,518 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "The operation lasted too long: It took 1,657 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": [" LoginPage", 20, 1, "The operation lasted too long: It took 1,144 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PurchasePage", 20, 4, "The operation lasted too long: It took 1,529 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "The operation lasted too long: It took 1,650 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "The operation lasted too long: It took 1,062 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "The operation lasted too long: It took 1,768 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 1, "", ""], "isController": false}, {"data": ["MainPage", 20, 2, "The operation lasted too long: It took 1,024 milliseconds, but should not have lasted longer than 1,000 milliseconds.", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
