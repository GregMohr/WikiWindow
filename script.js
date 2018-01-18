//feature: shrink/grow header on scroll down/up
//feature: continuos scroll to move through results
//feature: add language variant support to direct to the various wiki language sites
//feature: add autocompletion on search field or embed mediawiki's?
//feature: add collapsible for copy/pasting notes from articles. Save to disk/cloud. Should slide over, not push aside, iframe
//feature: go to wikipedia button
//feature: history pane with breadcrumbs?
//feature: notes button should expand when hovered over with a draggable search results item
//feature: notes section should have a link groups button that expands a small user link group section
//feature: user added pane, could be serialized to notes save, or as cookie
//feature: add text/title toggle for searching
//feature: add to each result: close x, options(search alike, add to user group) hover expands subheader (title : brief desc)
//feature: enable autosave with localStorage
/*
//feature: options button for each result:
    var bt = document.createElement('span');
    bt.className = "rs-btn pull-left glyphicon glyphicon-th-large";
    $(".result").prepend(bt);
*/
var siteBase = "https://en.wikipedia.org/";
var articleBase = siteBase + "wiki/";
var endpoint = siteBase + "w/api.php";
var defaultOptions = "?action=query&format=json&origin=*"

$(document).ready(function () {
    if (sessionStorage.results) {
        showResults();
    }
    if (sessionStorage.term) {
        $("#search").val(sessionStorage.term);
    }
    if (sessionStorage.selected) {
        showSelected(sessionStorage.selected);
    }
});
function getSearchResults(e) {
    if (e == undefined || e.keyCode === 13) {
        var term = $("#search").val();
        sessionStorage.setItem("term", term);
        $.getJSON(endpoint + defaultOptions + `&list=search&continue=&srsearch=intitle:${term}&srprop=snippet&srlimit=12`, function (data) {
            processResults(data.query.search);
        });
    }
}
function getRandomResults() {
    sessionStorage.removeItem("term");
    $("#search").val("");
    var queryMods = "&prop=extracts&generator=random&exchars=150&exintro=1&explaintext=1&grnnamespace=0&grnlimit=12";
    $.getJSON(endpoint + defaultOptions + queryMods, function (data) {
        console.log("random results: " + JSON.stringify(data.query.pages));
        processResults(data.query.pages);
    });
}
function processResults(results) {
    var tempDiv = document.createElement('div');
    for (var idx in results) {
        var rsP = document.createElement('p');
        rsP.className = "result col-xs-2 text-center";
        rsP.setAttribute("data-title", results[idx].title);
        rsP.innerHTML = results[idx].title;
        rsP.setAttribute("data-short-desc", results[idx].snippet || results[idx].extract);

        tempDiv.appendChild(rsP);
    }
    //$(".result").attr("onclick", "showSelected(this.title)");//doesn't seem to work in this method, moved to showResults
    sessionStorage.setItem("results", JSON.stringify(tempDiv.innerHTML));
    showResults();
}
function showResults() {
    $("#results").empty();
    $("#results").html(JSON.parse(sessionStorage.results));

    //These are jQuery to cut down on serialize/deserialize of function expression
    //They don't work correctly as part of processResults method for some reason
    $(".result").attr("onclick", "showSelected(this.getAttribute('data-title'))");
    $(".result").attr("onmouseover", "showSubheader(this.getAttribute('data-title'), this.getAttribute('data-short-desc'))");
    $(".result").attr("onmouseout", "hideSubheader()");

    if ($("#results").css("display") == "none") {
        toggleResults();
    }
}
function toggleResults() {
    $("#results").slideToggle();
    $("#rslt-icon").toggleClass("glyphicon-plus glyphicon-minus");
}
function showSelected(title) {
    var uri = articleBase + encodeURIComponent(title);
    $("#content").attr("src", uri).attr("title", title);
    sessionStorage.setItem("selected", title);
}
function showSubheader(title, description) {
    $("#subheader").html(title + " : " + description);
    $("#subheader").show();
}
function hideSubheader() {
    $("#subheader").hide();
}