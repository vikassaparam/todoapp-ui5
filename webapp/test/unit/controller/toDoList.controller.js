/*global QUnit*/

sap.ui.define([
	"compractisetodolist/todolist/controller/toDoList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("toDoList Controller");

	QUnit.test("I should test the toDoList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
