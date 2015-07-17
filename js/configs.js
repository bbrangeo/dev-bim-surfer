/* Reset the credentials with the server credentials */
/* Credentials set to the local host */
var serverUrl = "http://localhost:8080/";
var username = "admin@bimserver.org";
var pass = "admin";


///* Credentials set to the Remote Server uncomment to load from server */
//var serverUrl = "https://52.74.66.119:9451/bim";
//var username = "admin@bimserver.org";
//var pass = "admin";

/* Global Variable to access the bim server api */
var bimapi;

// More global Variables
//TODO more comments on the variables
var selectedNode;
var jsonData = {
    "core": {
        "data": []
    }
};
var jsonTree = {
    "core" : {
        'data' : []
    }
    //,"checkbox" : {
    //    "keep_selected_style" : false
    //    //"whole_node" : false
    //    //"three_state" : true,
    //    //"tie_selection" : false
    //}
    //,"plugins" : [ "checkbox" ]
};
var hiddenElements=[];
var toggleSwitch = false;
var loadedProjects = [];

// buildingStorey
// IfcType

// Adding the CSS elements
function addDataToDetails(i){
    /* TODO open only once  */
    $("#tenant").dialog("open");
    var div = $('#tenant_details');
    div.empty();

    // Add the Css Elements
    div.append('<h3>File</h3>');
    div.append('<p>');
    div.append('<label>Project name:</label>	St. Jones University<br />');
    div.append('<label>IFC file name:</label> modelArc.ifc<br />');
    div.append('<label>Checked In on:</label> 22-Jun-2015');
    div.append('</p>');
    div.append('<h3>Element</h3>');
    div.append('<p>');
    div.append('<label>IFC Line ID:</label>	'+jsonData['core']['data'][i]['id']+'<br />');
    div.append('<label>IFC Element type:</label> '+jsonData['core']['data'][i]['parent']+ '<br />');
    div.append('<label>IFC Global ID:</label> 763273827_jdkf<br />');
    div.append('<label>Element Name:</label> ' + jsonData['core']['data'][i]['name']);
    div.append('</p>');
}

function showPropertySet1(propertySet) {
    var finalDiv = $('#testingData');
    var div = $('<div id="table"></div>');

    div.append('<h3>'+propertySet.object.Name +'</h3>')

    var table = $('<table class="table table-bordered table-striped dataTable tbl_info" style="width: 100%">');
    var theader = $("<thead></thead>");
    var tbody = $("<tbody> </tbody>");
    var tr = $("<tr></tr>");
    tr.attr("role","row");

    var th1= ("<th>Property</th>");
    var th2= ("<th>Value</th>");

    tr.append(th1);
    tr.append(th2);

    theader.append(tr);
    table.append(theader);

    (function (propertySet) {
        propertySet.getHasProperties(function(property){
            if (property.object._t == "IfcPropertySingleValue") {
                var tr3 = $("<tr role=\"row\" class=\"odd\"></tr>");
                //tr.append("<td>" + property.object.Name + "</td>");
                var td3 = ("<td>" + property.object.Name + "</td>");
                property.getNominalValue(function(value){
                    var v = value == null ? "" : value._v;
                    var td4 = ("<td>" + v + "</td>");
                    tr3.append(td3);
                    tr3.append(td4);
                    tbody.append(tr3);
                });
            }
        });
    } )(propertySet);

    table.append(tbody);
    div.append(table);
    finalDiv.append(div);
}



function nodeSelected1(node) {
    $("#object_info table tbody tr").remove();
    $("#testingData").empty();
    if (node.id != null) {
        ifcModel.get(node.id, function(product){
            if(product != null){
                if (product.oid == node.id) {
                    var tr = $("<tr></tr>");
                    tr.append("<b>" + product.object._t + "</b>");
                    if (product.object.Name != null) {
                        tr.append("<b>" + product.object.Name + "</b>");
                    }
                    $("#object_info table tbody").append(tr);
                    product.getIsDefinedBy(function(isDefinedBy){
                        if (isDefinedBy.object._t == "IfcRelDefinesByProperties") {
                            isDefinedBy.getRelatingPropertyDefinition(function(propertySet){
                                if (propertySet.object._t == "IfcPropertySet") {
                                    showPropertySet1(propertySet);
                                }
                            });
                        }
                    });
                }
            }
        });
    }
}



//function showProperty1 (propertySet, property, headerTr, editable){
//    var tr = $("<tr></tr>");
//    tr.attr("oid", property.oid);
//    tr.attr("psetoid", propertySet.oid);
//    headerTr.after(tr);
//    if (property.changedFields != null && (property.changedFields["NominalValue"] || property.changedFields["Name"])) {
//        tr.addClass("warning");
//    }
//
//    tr.append("<td>" + property.object.Name + "</td>");
//    getValue1(tr, property, editable);
//}
//
//function showProperties1(propertySet, headerTr) {
//    propertySet.getHasProperties(function(property){
//        if (property.object._t == "IfcPropertySingleValue") {
//            showProperty1(propertySet, property, headerTr);
//        }
//    });
//}
//
//function showPropertySet1(propertySet) {
//    var headerTr = $("<tr class=\"active\"></tr>");
//    headerTr.attr("oid", propertySet.oid);
//    headerTr.attr("uri", propertySet.object.Name);
//    if (propertySet.changedFields != null && propertySet.changedFields["Name"]) {
//        headerTr.addClass("warning");
//    }
//    $("#object_info table tbody").append(headerTr);
//    var headerTd = $("<td></td>");
//    headerTr.append(headerTd);
//
//    headerTd.append("<b>" + propertySet.object.Name + "</b>");
//    showProperties1(propertySet, headerTr);
//}
//
//function getValue1(tr, property, editable) {
//    (function (tr) {
//        property.getNominalValue(function(value){
//            var td = $("<td>");
//            var v = value == null ? "" : value._v;
//            var span = $("<span class=\"value nonEditable\">" + v + "</span>");
//            td.append(span);
//            tr.append(td);
//        });
//    } )(tr);
//}
//
//function nodeSelected1(node) {
//    $("#object_info table tbody tr").remove();
//    if (node.id != null) {
//        ifcModel.get(node.id, function(product){
//            if(product != null){
//                if (product.oid == node.id) {
//                    var tr = $("<tr></tr>");
//                    tr.append("<b>" + product.object._t + "</b>");
//                    if (product.object.Name != null) {
//                        tr.append("<b>" + product.object.Name + "</b>");
//                    }
//                    $("#object_info table tbody").append(tr);
//                    product.getIsDefinedBy(function(isDefinedBy){
//                        if (isDefinedBy.object._t == "IfcRelDefinesByProperties") {
//                            isDefinedBy.getRelatingPropertyDefinition(function(propertySet){
//                                if (propertySet.object._t == "IfcPropertySet") {
//                                    showPropertySet1(propertySet);
//                                }
//                            });
//                        }
//                    });
//                }
//            }
//        });
//    }
//}
//
//function nodeUnselected1(node) {
//    $("#object_info table tbody tr").remove();
//}



//
//
//var finalDiv = $('#testingData');
//var div = $('<div id="table"></div>');
//
//div.append('<h3>'+propertySet.object.Name +'</h3>')
//
//var table = $('<table class="table table-bordered table-striped dataTable tbl_info" style="width: 100%">');
//var theader = $("<thead></thead>");
//var tbody = $("<tbody> </tbody>");
//var tr = $("<tr></tr>");
//tr.attr("role","row");
//
//var th1= ("<th>Property</th>");
//var th2= ("<th>Value</th>");
//
//tr.append(th1);
//tr.append(th2);
//
//theader.append(tr);
//table.append(theader);
//
//
//var tr2 = $("<tr role=\"row\" class=\"odd\"></tr>");
//
//var td1= ("<td>test1 </td>");
//var td2= ("<td>test 2</td>");
//
//tr2.append(td1);
//tr2.append(td2);
//tbody.append(tr2);
//table.append(tbody);
//
////(function (propertySet) {
////    propertySet.getHasProperties(function(property){
////        if (property.object._t == "IfcPropertySingleValue") {
////            var tr3 = $("<tr role=\"row\" class=\"odd\"></tr>");
////            //tr.append("<td>" + property.object.Name + "</td>");
////            var td3 = ("<td>" + property.object.Name + "</td>");
////            property.getNominalValue(function(value){
////                var v = value == null ? "" : value._v;
////                var td4 = ("<td>" + v + "</td>");
////                tr3.append(td3);
////                tr3.append(td4);
////                tbody.append(tr3);
////            });
////        }
////    });
////    //div.append(table);
////    //finalDiv.append(div);
////} )(propertySet);
//
////table.append(tbody);
//div.append(table);
//finalDiv.append(div);
