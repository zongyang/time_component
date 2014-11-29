/****************公用函数**********************/
function hasClassName(dom, test_name) {
	var name = dom.className;
	var reg = new RegExp('(\\s|^)' + test_name + '(\\s|$)');
	return reg.test(name);
}

function addClassName(dom, test_name) {
	var name = dom.className;
	if (!hasClassName(dom, test_name)) {
		dom.className = name + ' ' + test_name;
	}
}

function removeClassName(dom, test_name) {
	var name = dom.className;
	if (hasClassName(dom, test_name)) {
		dom.className = name.replace(new RegExp('(\\s|^)' + test_name + '(\\s|$)'), '');
	}
}
//保存所有表的数据
function saveTableData(tables) {
	for (var i = 0; i < tables.length; i++) {
		tabels_data.push(getTableArr(tables[i]));
	}
}
//获得表的二维数据(0:innerText,1:innerHTML)
function getTableArr(table, type) {
	type = (type == undefined) ? 0 : type;
	var trs = table.getElementsByTagName('tbody')[0].rows;
	var trs_copy = [];
	var cells_copy = [];
	var cells;

	for (var i = 0; i < trs.length; i++) {
		cells = trs[i].cells;
		cells_copy = [];
		for (var j = 0; j < cells.length; j++) {
			if (type == 0) {
				cells_copy.push(cells[j].innerText);
			} else {
				cells_copy.push(cells[j].innerHTML);
			}
		}
		trs_copy.push(cells_copy);
	}
	return trs_copy
}

function getAllTables() {
	return document.getElementsByTagName('table');
}
//查找tabel的原始数据
function getTableInitData(table) {
	var tables = getAllTables();
	var index;
	for (var i = 0; i < tables.length; i++) {
		if (tables[i] == table) {
			index = i;
			break;
		}
	}

	return tabels_data[index];
}


/**********************************************/
//方向数组
var DIRECTION = ['asc', 'desc'];
//所有table的数据
var tabels_data = [];
//元素class的操作
window.onload = function() {
	var tables = getAllTables();
	saveTableData(tables);
	makeAllTablesSortable(tables);
	makeAllTablesFilterable(tables);
}