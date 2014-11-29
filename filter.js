/****************filer部分**********************/
//重绘表格
function drawTable(e) {
	var table = e.target.nextSibling;
	var tabel_data = getTableInitData(table);
	var row_math_flag = false; //行匹配标记
	var tabel_html = '';
	var cells_html = '';

	for (var i = 0; i < tabel_data.length; i++) {
		cells_html = '';
		row_math_flag = false;
		for (var j = 0; j < tabel_data[i].length; j++) {

			cells_html += '<td>';

			if (tabel_data[i][j].indexOf(e.target.value) != -1) {
				row_math_flag = true;
				cells_html += tabel_data[i][j].replace(e.target.value, '<font class="strong">' + e.target.value + '</font>');

			} else {
				cells_html += tabel_data[i][j];
			}
			cells_html += '</td>';
		}
		//如果存在匹配的单元格，则添加这行
		if (row_math_flag) {
			tabel_html += '<tr>' + cells_html + '</tr>';
		}
	}
	table.getElementsByTagName('tbody')[0].innerHTML = tabel_html;

}


function makeAllTablesFilterable(tables) {
	for (var i = 0; i < tables.length; i++) {
		createTimeDiv(tables[i],'zzy');
	}
}