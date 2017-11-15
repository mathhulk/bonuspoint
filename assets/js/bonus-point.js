const app = require("electron");
const path = require("path");
const url = require("url");
const Store = require("electron-store");
const dateFormat = require("dateformat");

/*
 *	VARIABLES
 */
const store = new Store();
let g = new Object();

/*
 *	EVENTS
 */
$(".minimizeWindow").click(function() {
    app.remote.getCurrentWindow().minimize();
});

$(".maximizeWindow").click(function() {
    (!app.remote.getCurrentWindow().isMaximized() ? app.remote.getCurrentWindow().maximize() : app.remote.getCurrentWindow().unmaximize());
});

$(".closeWindow").click(function() {
    app.remote.getCurrentWindow().close();
});

$(document).on("click", "a[href^=\"http\"]", function(event) {
    event.preventDefault();
    app.shell.openExternal(this.href);
});

$(document).on("click", ".bulkAddSubtractPoints", function() {
	if($(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .bulkAddSubtractPointsInput").val() != "") {
		store.set("classes." + $(this).attr("data-class") + ".students." + $(this).attr("data-student"), store.get("classes." + $(this).attr("data-class") + ".students." + $(this).attr("data-student")) + parseInt($(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .bulkAddSubtractPointsInput").val()));
		$(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .points").text(parseInt($(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .points").text()) + parseInt($(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .bulkAddSubtractPointsInput").val()));
		$(".classes ." + $(this).attr("data-class") + " .total-points").text(parseInt($(".classes ." + $(this).attr("data-class") + " .total-points").text()) + parseInt($(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .bulkAddSubtractPointsInput").val()));
		$(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .bulkAddSubtractPointsInput").val("");
	}
});

$(document).on("click", ".increasePoints", function() {
	store.set("classes." + $(this).attr("data-class") + ".students." + $(this).attr("data-student"), store.get("classes." + $(this).attr("data-class") + ".students." + $(this).attr("data-student")) + 1);
	$(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .points").text(parseInt($(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .points").text()) + 1);
	$(".classes ." + $(this).attr("data-class") + " .total-points").text(parseInt($(".classes ." + $(this).attr("data-class") + " .total-points").text()) + 1);
});

$(document).on("click", ".decreasePoints", function() {
	store.set("classes." + $(this).attr("data-class") + ".students." + $(this).attr("data-student"), store.get("classes." + $(this).attr("data-class") + ".students." + $(this).attr("data-student")) - 1);
	$(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .points").text(parseInt($(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .points").text()) - 1);
	$(".classes ." + $(this).attr("data-class") + " .total-points").text(parseInt($(".classes ." + $(this).attr("data-class") + " .total-points").text()) - 1);
});

$(document).on("click", ".addStudent", function() {
	if($(".classes ." + $(this).attr("data-class") + " .addStudentInput").val() != "" && !store.has("classes." + $(this).attr("data-class") + ".students." + replaceAll($(".classes ." + $(this).attr("data-class") + " .addStudentInput").val(), " ", "_")) && /^[a-zA-Z0-9.-\s]+$/.test($(".classes ." + $(this).attr("data-class") + " .addStudentInput").val())) {
		store.set("classes." + $(this).attr("data-class") + ".students." + replaceAll($(".classes ." + $(this).attr("data-class") + " .addStudentInput").val(), " ", "_"), 0);
		$(".classes ." + $(this).attr("data-class") + " .total-students").text(parseInt($(".classes ." + $(this).attr("data-class") + " .total-students").text()) + 1);
		if(parseInt($(".classes ." + $(this).attr("data-class") + " .total-students").text()) == 1) {
			$(".classes ." + $(this).attr("data-class") + " .students").empty();
		}
		$(".classes ." + $(this).attr("data-class") + " .students").append("<tr class=\"" + replaceAll($(".classes ." + $(this).attr("data-class") + " .addStudentInput").val(), " ", "_") + "\">" +
			"<td>" + $(".classes ." + $(this).attr("data-class") + " .addStudentInput").val() + "</td>" +
			"<td class=\"points text-right\">0</td>" +
			"<td class=\"text-right\">" +
				"<form>" +
					"<input placeholder=\"Amount\" type=\"number\" class=\"bulkAddSubtractPointsInput\" maxlength=\"100\" /> <button type=\"submit\" class=\"btn btn-neutral bulkAddSubtractPoints\" data-class=\"" + $(this).attr("data-class") + "\" data-student=\"" + replaceAll($(".classes ." + $(this).attr("data-class") + " .addStudentInput").val(), " ", "_") + "\"><i class=\"fa fa-check\"></i></button>" +
				"</form>" +
			"</td>" +
			"<td class=\"text-right\"><span class=\"btn btn-neutral increasePoints\" data-class=\"" + $(this).attr("data-class") + "\" data-student=\"" + replaceAll($(".classes ." + $(this).attr("data-class") + " .addStudentInput").val(), " ", "_") + "\"><i class=\"fa fa-chevron-up\"></i></span></td>" +
			"<td class=\"text-right\"><span class=\"btn btn-neutral decreasePoints\" data-class=\"" + $(this).attr("data-class") + "\" data-student=\"" + replaceAll($(".classes ." + $(this).attr("data-class") + " .addStudentInput").val(), " ", "_") + "\"><i class=\"fa fa-chevron-down\"></i></span></td>" +
			"<td class=\"text-right\"><span class=\"btn btn-danger removeStudent\" data-class=\"" + $(this).attr("data-class") + "\" data-student=\"" + replaceAll($(".classes ." + $(this).attr("data-class") + " .addStudentInput").val(), " ", "_") + "\"><i class=\"fa fa-times\"></i></span></td>" +
		"</tr>");
		$(".classes ." + $(this).attr("data-class") + " .addStudentInput").val("");
	}
});

$(document).on("click", ".removeStudent", function(event) {
	if(event.originalEvent === undefined) {
		$(".prompt-wrapper").remove();
		$(".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student")).remove();
		$(".classes ." + $(this).attr("data-class") + " .total-students").text(parseInt($(".classes ." + $(this).attr("data-class") + " .total-students").text()) - 1);
		$(".classes ." + $(this).attr("data-class") + " .total-points").text(parseInt($(".classes ." + $(this).attr("data-class") + " .total-points").text()) - store.get("classes." + $(this).attr("data-class") + ".students." + $(this).attr("data-student")));
		store.delete("classes." + $(this).attr("data-class") + ".students." + $(this).attr("data-student"));
		if(parseInt($(".classes ." + $(this).attr("data-class") + " .total-students").text()) == 0) {
			$(".classes ." + $(this).attr("data-class") + " .students").append("<tr>" +
				"<td>No students have been added to this class.</td>" +
				"<td class=\"text-right\">-</td>" +
				"<td class=\"text-right\">-</td>" +
				"<td class=\"text-right\">-</td>" +
				"<td class=\"text-right\">-</td>" +
				"<td class=\"text-right\">-</td>" +
			"</tr>");
		}
	} else {
		checkPrompt("remove student <b>" + replaceAll($(this).attr("data-student"), "_", " ") + "</b> from class <b>" + replaceAll($(this).attr("data-class"), "_", " ") + "</b>", ".classes ." + $(this).attr("data-class") + " .students ." + $(this).attr("data-student") + " .removeStudent");
	}
});

$(document).on("click", ".addClass", function() {
	if(!store.has("classes." + replaceAll($(".main .addClassInput").val(), " ", "_") + ".status") && /^[a-zA-Z0-9.-\s]+$/.test($(".main .addClassInput").val()) && $(".main .addClassInput").val() != "") {
		$(".spoiler-btn").each(function(index) {
			if($("#" + $(this).attr("data-spoiler-id")).is(":visible")) {
				$("#" + $(this).attr("data-spoiler-id")).hide();
				$(this).text("View");
			}
		});
		store.set("classes." + replaceAll($(".main .addClassInput").val(), " ", "_") + ".status", true);
		store.set("classes." + replaceAll($(".main .addClassInput").val(), " ", "_") + ".creation", Date.now());
		$(".count").text(parseInt($(".count").text()) + 1);
		$(".classes").append("<div class=\"card card-slim " + replaceAll($(".main .addClassInput").val(), " ", "_") + "\">" +
			"<div class=\"card-title\">" +
				"<span class=\"name\">" + $(".main .addClassInput").val() + "</span> <span class=\"btn btn-title btn-success\"><span class=\"total-students\">0</span> students</span> <span class=\"btn btn-title btn-success\"><span class=\"total-points\">0</span> points</span> <span class=\"btn btn-title btn-neutral spoiler-btn\" data-spoiler-id=\"spoiler-" + replaceAll($(".main .addClassInput").val(), " ", "_") + "\">Close</span> <span class=\"btn btn-title btn-danger resetClass\" data-class=\"" + replaceAll($(".main .addClassInput").val(), " ", "_") + "\">Reset</span> <span class=\"btn btn-title btn-danger removeClass\" data-class=\"" + replaceAll($(".main .addClassInput").val(), " ", "_") + "\">Remove</span>" +
			"</div>" +
			"<div class=\"spoiler\" id=\"spoiler-" + replaceAll($(".main .addClassInput").val(), " ", "_") + "\">" +
				"<div class=\"card-content\">" +
					"Created on " + dateFormat(Date.now(), "mmmm dS, yyyy") +
				"</div>" +
				"<div class=\"table-wrapper\">" +
					"<table>" +
						"<thead>" +
							"<tr>" + 
								"<th>Student</td>" +
								"<th class=\"text-right\">Points</td>" +
								"<th class=\"text-right\">Add or Subtract Points</td>" +
								"<th class=\"text-right\">Increase Points</td>" +
								"<th class=\"text-right\">Decrease Points</td>" +
								"<th class=\"text-right\">Remove Student</td>" +
							"</tr>" +
						"</thead>" +
						"<tbody class=\"students\">" +
							"<tr>" +
								"<td>No students have been added to this class.</td>" +
								"<td class=\"text-right\">-</td>" +
								"<td class=\"text-right\">-</td>" +
								"<td class=\"text-right\">-</td>" +
								"<td class=\"text-right\">-</td>" +
								"<td class=\"text-right\">-</td>" +
							"</tr>" +
						"</tbody>" +
					"</table>" +
				"</div>" +
				"<div class=\"card-title\"><b>Add Student</b></div>" +
				"<div class=\"card-content\">" +
					"<form>" +
						"<input placeholder=\"John Smith\" type=\"text\" class=\"addStudentInput\" maxlength=\"100\" /> <button type=\"submit\" class=\"btn btn-neutral btn-title addStudent\" data-class=\"" + replaceAll($(".main .addClassInput").val(), " ", "_") + "\">Create</button>" +
					"</form>" +
				"</div>" +
			"</div>" +
		"</div>");
		$(".main .addClassInput").val("");
	}
});

$(document).on("click", ".removeClass", function(event) {
	if(event.originalEvent === undefined) {
		$(".prompt-wrapper").remove();
		store.delete("classes." + $(this).attr("data-class"));
		$(".classes ." + $(this).attr("data-class")).remove();
		$(".count").text(parseInt($(".count").text()) - 1);
	} else {
		checkPrompt("remove class <b>" + replaceAll($(this).attr("data-class"), "_", " ") + "</b>", ".classes ." + $(this).attr("data-class") + " .removeClass");
	}
});

$(document).on("click", ".resetClass", function(event) {
	if(event.originalEvent === undefined) {
		$(".prompt-wrapper").remove();
		$(".classes ." + $(this).attr("data-class") + " .total-points").text("0");
		var save = $(this).attr("data-class");
		$.each(store.get("classes." + $(this).attr("data-class") + ".students"), function(index, value) {
			store.set("classes." + save + ".students." + index, 0);
			$("." + save + " .students ." + index + " .points").text("0");
		});
	} else {
		checkPrompt("reset class <b>" + replaceAll($(this).attr("data-class"), "_", " ") + "</b>", ".classes ." + $(this).attr("data-class") + " .resetClass");
	}
});

$(document).on("click", ".spoiler-btn", function() {
	if($("#" + $(this).attr("data-spoiler-id")).is(":visible")) {
		$("#" + $(this).attr("data-spoiler-id")).hide();
		$(this).text("View");
	} else {
		$(".spoiler-btn").each(function(index) {
			if($("#" + $(this).attr("data-spoiler-id")).is(":visible")) {
				$("#" + $(this).attr("data-spoiler-id")).hide();
				$(this).text("View");
			}
		});
		$("#" + $(this).attr("data-spoiler-id")).show();
		$(this).text("Close");
	}
});

$(document).on("submit", "form", function(event) {
	event.preventDefault();
});

/*
 *	BONUS POINT
 */
function page() {
	$(".classes").empty();
	if(store.get("classes") === undefined) {
		$(".count").text(0);
	} else {
		$(".count").text(Object.keys(store.get("classes")).length);
	}
	$.each(store.get("classes"), function(index, value) {
		if(store.get("classes." + index + ".students") == undefined) {
			g["students"] = 0;
		} else {
			g["students"] = Object.keys(store.get("classes." + index + ".students")).length;
		}
		local = "<div class=\"card card-slim " + index + "\">" +
			"<div class=\"card-title\">" +
				"<span class=\"name\">" + replaceAll(index, "_", " ") + "</span> <span class=\"btn btn-title btn-success\"><span class=\"total-students\">" + g["students"] + "</span> students</span> <span class=\"btn btn-title btn-success\"><span class=\"total-points\"></span> points</span> <span class=\"btn btn-title btn-neutral spoiler-btn\" data-spoiler-id=\"spoiler-" + index + "\">View</span> <span class=\"btn btn-title btn-danger resetClass\" data-class=\"" + index + "\">Reset</span> <span class=\"btn btn-title btn-danger removeClass\" data-class=\"" + index + "\">Remove</span>" +
			"</div>" +
			"<div class=\"spoiler\" id=\"spoiler-" + index + "\">" +
				"<div class=\"card-content\">" +
					"Created on " + dateFormat(value.creation, "mmmm dS, yyyy") +
				"</div>" +
				"<div class=\"table-wrapper\">" +
					"<table>" +
						"<thead>" +
							"<tr>" + 
								"<th>Students</td>" +
								"<th class=\"text-right\">Points</td>" +
								"<th class=\"text-right\">Add or Subtract Points</td>" +
								"<th class=\"text-right\">Increase Points</td>" +
								"<th class=\"text-right\">Decrease Points</td>" +
								"<th class=\"text-right\">Remove Student</td>" +
							"</tr>" +
						"</thead>" +
						"<tbody class=\"students\">";
				g["points"] = 0;
				$.each(value.students, function(student, points) {
					g["points"] += points;
					local += "<tr class=\"" + student + "\">" +
						"<td>" + replaceAll(student, "_", " ") + "</td>" +
						"<td class=\"points text-right\">" + points + "</td>" +
						"<td class=\"text-right\">" +
							"<form>" +
								"<input placeholder=\"Amount\" type=\"number\" class=\"bulkAddSubtractPointsInput\" maxlength=\"100\" /> <button type=\"submit\" class=\"btn btn-neutral bulkAddSubtractPoints\" data-class=\"" + index + "\" data-student=\"" + student + "\"><i class=\"fa fa-check\"></i></button>" +
							"</form>" +
						"</td>" +
						"<td class=\"text-right\"><span class=\"btn btn-neutral increasePoints\" data-class=\"" + index + "\" data-student=\"" + student + "\"><i class=\"fa fa-chevron-up\"></i></span></td>" +
						"<td class=\"text-right\"><span class=\"btn btn-neutral decreasePoints\" data-class=\"" + index + "\" data-student=\"" + student + "\"><i class=\"fa fa-chevron-down\"></i></span></td>" +
						"<td class=\"text-right\"><span class=\"btn btn-danger removeStudent\" data-class=\"" + index + "\" data-student=\"" + student + "\"><i class=\"fa fa-times\"></i></span></td>" +
					"</tr>";
				});
				if(g["students"] == 0) {
					local += "<tr>" +
						"<td>No students have been added to this class.</td>" +
						"<td class=\"text-right\">-</td>" +
						"<td class=\"text-right\">-</td>" +
						"<td class=\"text-right\">-</td>" +
						"<td class=\"text-right\">-</td>" +
						"<td class=\"text-right\">-</td>" +
					"</tr>";
				}
				local += "</tbody>" +
					"</table>" +
				"</div>" +
				"<div class=\"card-title\"><b>Add Student</b></div>" +
				"<div class=\"card-content\">" +
					"<form>" +
						"<input placeholder=\"John Smith\" type=\"text\" class=\"addStudentInput\" maxlength=\"100\" /> <button type=\"submit\" class=\"btn btn-neutral btn-title addStudent\" data-class=\"" + index + "\">Create</button>" +
					"</form>" +
				"</div>" +
			"</div>" +
		"</div>";
		$(".classes").append(local);
		$(".classes ." + index + " .total-points").text(g["points"]);
	});
	$(".spoiler").hide();
}

/*
 *	TOOLS
 */
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

function checkPrompt(message, click) {
	$("body").append("<div class=\"prompt-wrapper\">" +
		"<div class=\"prompt\">" +
			"<p>Are you sure you want to proceed with the following actions?</p>" +
			"<ul>" +
				"<li>" + message + "</li>" +
			"</ul>" +
			"<button type=\"button\" onclick=\"$('.prompt-wrapper').remove()\" class=\"btn btn-title btn-neutral\">Cancel</button> <button type=\"button\" onclick=\"$('" + click + "').click()\" class=\"btn btn-title btn-danger\">Proceed</button>" +
		"</div>" +
	"</div>");
}

/*
 *	LOAD
 */
page();




