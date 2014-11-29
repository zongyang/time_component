/*
使用：
1、引入time_component.css和time_component.js文件；
2、调用createTimeDiv(table-element,col_name)，即可；
3、btnOnClick里面处理提交请求操作。

*/

//////////////////////////////////////
var time_errors = ['开始时间大于结束时间！', '请检查时间格式是否正确！'];

function createEl(name) {
	return document.createElement(name);
}

//时间计算
function getYear() {
	return {
		type: '年',
		start: 2000,
		gap: 99
	}
}

function getMonth(year) {
	return {
		type: '月',
		start: 1,
		gap: 11
	}
}

function getDay(year, month) {
	if (year == '' || month == '') {
		return;
	}

	year = parseInt(year);
	month = parseInt(month);

	var obj = {
		type: '日',
		start: 1,
		gap: 0
	};
	var xiao_yue = [4, 6, 9, 11];
	var da_yue = [1, 3, 5, 7, 8, 10, 12];
	//小月
	if (xiao_yue.indexOf(month) != -1) {
		obj.gap = 29;
		return obj;
	}
	//大月
	if (da_yue.indexOf(month) != -1) {
		obj.gap = 30;
		return obj;
	}
	//二月
	if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
		obj.gap = 28;
		return obj;
	} else {
		obj.gap = 27;
		return obj;
	}
}

//////////////////////////////////////
var TimeClass = function(year, month, day) {
	this.year = year;
	this.month = month;
	this.day = day;
}
TimeClass.prototype.getStatus = function() {
	if (this.year && this.month && this.day) {
		return 111;
	}
	if (this.year && this.month && !this.day) {
		return 110;
	}
	if (this.year && !this.month && !this.day) {
		return 100;
	}
	if (!this.year && !this.month && !this.day) {
		return 000;
	}
}
TimeClass.prototype.init = function(dirction) {
	var statues = this.getStatus();

	//取最小
	if (dirction == 0) {
		if (statues == 110) {
			this.day = 1;
		}
		if (statues == 100) {
			this.month = 1;
			this.day = 1;
		}
		if (statues == 000) {
			this.year = getYear().start;
			this.month = 1;
			this.day = 1;
		}
	}
	//取最大
	else {
		if (statues == 110) {
			var obj = getDay(this.year, this.month);
			this.day = obj.start + obj.gap;
		}
		if (statues == 100) {
			var obj;
			this.month = 12;
			obj = getDay(this.year, this.month);
			this.day = obj.start + obj.gap;
		}
		if (statues == 000) {
			var obj = getYear();
			this.year = obj.start + obj.gap;
			this.month = 12;
			this.day = 31;
		}
	}
}
TimeClass.prototype.isAvailable = function() {
	var statues = this.getStatus();
	if (statues == 111) {
		return true;
	}
	if (statues == 110) {
		return true;
	}
	if (statues == 100) {
		return true;
	}
	if (statues == 000) {
		return true;
	}
	return false;
}

//转换成时间字符串
TimeClass.prototype.toYmd = function(dirction) {
	return this.year + '-' + this.month + '-' + this.day;
}

//转换成Date对象
TimeClass.prototype.toDateObj = function() {
	return new Date(this.toYmd());
}

//////////////////////////////////////
//确定按钮
function createSerachBtn() {
	var btn = $('<button>确定</button>');
	btn.click(btnOnClick);
	return btn;
}

function btnOnClick(e) {
	var col_name;
	var submit_obj;
	var time_div = $(e.target).parent();
	var selects = time_div.find('select');
	var start = new TimeClass(selects[0].value, selects[1].value, selects[2].value);
	var end = new TimeClass(selects[3].value, selects[4].value, selects[5].value);

	start.init(0);
	end.init(1);

	//时间检测
	if (!start.isAvailable() || !end.isAvailable()) {
		alert(time_errors[1]);
		return;
	}
	if (start.toDateObj() > end.toDateObj()) {
		alert(time_errors[0]);
		return;
	}

	//提交服务器请求
	col_name = time_div.attr('col_name');

	submit_obj = {
			name: col_name,
			start: start.toYmd(),
			end: end.toYmd()
		}
		/*
	$.ajax({
		url: '',
		data: submit_obj,
		success: function(data) {

		}
	})

    */

	console.log(JSON.stringify(submit_obj));
}

//选择框
function createSelectCom(select_el, obj) {
	select_el=$(select_el);
	
	if (select_el.length==0) {
		select_el = $('<select></select>');
	}

	if (obj) {

		var option;
		select_el.append('<option></option>');

		for (var i = obj.start; i <= obj.gap + obj.start; i++) {
			select_el.append('<option value="' + i + '">' + i + '</option>');
		}
	}
	if (select_el.length > 0) {
		select_el.change(onSelectChange);
	}

	return select_el;
}

function onSelectChange(e) {
	var time_div = e.target.parentNode.parentNode;
	var selects = time_div.getElementsByTagName('select');
	var start = new TimeClass(selects[0].value, selects[1].value);
	var end = new TimeClass(selects[3].value, selects[4].value);

	if (e.target == selects[0] || e.target == selects[1]) {
		createSelectCom(selects[2], getDay(start.year, start.month));
	}

	if (e.target == selects[3] || e.target == selects[4]) {
		createSelectCom(selects[5], getDay(end.year, end.month));
	}
}

//包含年、月、日三个选择框的span
function createTimeSpan() {
	var label;
	var span = $('<span></span>');

	span.append(createSelectCom(null, getYear()));
	span.append('<label>年</label>');

	span.append(createSelectCom(null, getMonth()));
	span.append('<label>月</label>');

	span.append(createSelectCom(null));
	span.append('<label>日</label>');

	return span;
}

//时间div
function createTimeDiv(table, col_name) {
	var div = $('<div class="time_div" col_name="' + col_name + '"></div>');
	var label = $('<label>-</label>');

	div.append(createTimeSpan());
	div.append(label);
	div.append(createTimeSpan());
	div.append(createSerachBtn());
	div.insertBefore($(table));
}