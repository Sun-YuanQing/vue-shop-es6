/* 绑定所有 render 业务台账 **/
/* 作废
function ViewBind() {
    var TblDictNames = viewModel.TblDict.result.condition.taiZhangName;
    var DictItem = TblDictNames.split(",");
    for (var i = 0; i < DictItem.length; i++) {
        var TblDictName = DictItem[i];
        if (viewModel.TblDict.result.list[TblDictName].instruction.PresentType == "Single") {
            tmplSingleBind(TblDictName);
        }
        else if (viewModel.TblDict.result.list[TblDictName].instruction.PresentType == "List") {r.seco
            tmplListBind(TblDictName + "_tmpl", TblDictName, TblDictName);
        }
    }
}
**/

var selector = "#";

function SingleViewBind_MultiView(tableId) {
    if (_selector == ".") {
        selector = ".";
    }
    else {
        selector = "#";
    }
    $(selector + tableId + " [data-disp]").each(function () {
        $(this).html(GetFlddisp_MultiView($(this).attr("data-disp").toLowerCase()));
    });
    $(selector + tableId).link(true, viewModel.TblDict.result.list);
}


/*根据data- 获取显示名*/
function GetFlddisp_MultiView(dispStr) {
    var dispArray = dispStr.split(".");
    var TblDictName = dispArray[0], ItemName = dispArray[1];
    var returnValue = "";
    try {
        returnValue = viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].flddisp + "：";
    }
    catch (e) {
        alert('显示项:' + ItemName + "发生异常!");
    }
    return returnValue;
}


/*Single 生成HTML并绑定*/
function SingleViewBind(TblDictName, _selector) {

    try {
        if (_selector == ".") {
            selector = ".";
        }
        else {
            selector = "#";
        }
        //视图模型不存在数据时
        if (viewModel.TblDict.result.list[TblDictName].data.length == 0) {
            //新增数据项
            Add(TblDictName);
            //设置初始值
            //InitMethod(TblDictName);
        }
        //生成html
        Generate(TblDictName);
        //生成多级联动菜单
        GenerateMultSelect(TblDictName);
        //绑定数据
        tmplSingleBind(TblDictName);
    } catch (ex) {
        //debugger
    }

}

//多级联动，目前只支持二级联动
function GenerateMultSelect(TblDictName) {
    if (typeof (multilevel) != "undefined") {
        //循环所有多级列表
        for (var m in multilevel) {
            //找到指定台账多级列表
            if (multilevel[m].TableName == TblDictName) {
                //取数据源
                var JsonText = viewModel.TblDict.result.list[TblDictName].instruction.flddict[multilevel[m].first].jsonText
                var Jsondata = $.parseJSON(JsonText);

                //找一级select
                var cmb = $(selector + TblDictName + " select[data-link='" + multilevel[m].first + "']");
                //一级select不使用时
                if (typeof (cmb.attr("data-link")) != "undefined") {
                    var cmbOpt = cmb.get(0).options;
                    //清空
                    for (var i = cmbOpt.length - 1; i >= 0; i--) {
                        cmbOpt.remove(i);
                    }
                    //添加opt
                    var optEmpty = new Option("请选择...", "");
                    cmbOpt.add(optEmpty);
                    for (var i = 0; i < Jsondata.first.length; i++) {
                        var opt = new Option(Jsondata.first[i], Jsondata.first[i]);
                        cmbOpt.add(opt);
                    }
                }

                //如果二级不存在
                if (!multilevel[m].second) {
                    continue;
                }
                //找二级select
                var cmb2 = $(selector + TblDictName + " select[data-link='" + multilevel[m].second + "']");
                var cmbOpt2 = cmb2.get(0).options;

                //var firstval = Jsondata.first[0];
                var firstval = null;
                if (cmb.attr("data-Default") == "true") {
                    firstval = Jsondata.first[0];
                }

                //默认去一级取第一个
                //var firstval = Jsondata.first[0];
                //取一级的台账数据
                if (viewModel.TblDict.result.list[TblDictName].data[0][multilevel[m].first] != "" && viewModel.TblDict.result.list[TblDictName].data[0][multilevel[m].first] != null) {
                    firstval = viewModel.TblDict.result.list[TblDictName].data[0][multilevel[m].first];
                }
                if (viewModel.TblDict.result.list[TblDictName].data[0][multilevel[m].first] == null) {
                    //回绑一级数据
                    if (cmb.attr("data-Default") == "true") {
                        viewModel.TblDict.result.list[TblDictName].data[0][multilevel[m].first] = Jsondata.first[0];
                    }
                }

                //清空
                for (var i = cmbOpt2.length - 1; i >= 0; i--) {
                    cmbOpt2.remove(i);
                }

                var optEmpty2 = new Option("请选择...", "");
                cmbOpt2.add(optEmpty2);
                //if (cmb.attr("data-Default") == "true") {
                //添加opt
                if (firstval != null) {
                    try {
                        for (var i = 0; i < Jsondata.second[firstval].length; i++) {
                            var opt = new Option(Jsondata.second[firstval][i], Jsondata.second[firstval][i]);
                            cmbOpt2.add(opt);
                        }
                    } catch (ex) { }
                    ////回绑二级数据
                    //if (viewModel.TblDict.result.list[TblDictName].data[0][multilevel[m].first] != "" && viewModel.TblDict.result.list[TblDictName].data[0][multilevel[m].first] != null) {
                    //}
                    //else {
                    //viewModel.TblDict.result.list[TblDictName].data[0][multilevel[m].second] = Jsondata.second[firstval][0];
                    //}
                    //}
                }

                //触发事件
                if (typeof (cmb) != "undefined") {
                    $(cmb).change(function () {
                        for (var i = cmbOpt2.length - 1; i >= 0; i--) {
                            cmbOpt2.remove(i);
                        }

                        var optEmpty2 = new Option("请选择...", "");
                        cmbOpt2.add(optEmpty2);
                        if ($(this).val().length > 0) {
                            for (var i = 0; i < Jsondata.second[$(this).val()].length; i++) {
                                var opt = new Option(Jsondata.second[$(this).val()][i], Jsondata.second[$(this).val()][i]);
                                cmbOpt2.add(opt);
                            }
                        }
                        //回绑二级数据
                        //if (typeof (Jsondata.second[$(this).val()][0]) != "undefined") {
                        //    viewModel.TblDict.result.list[TblDictName].data[0][multilevel[m].second] = Jsondata.second[$(this).val()][0];
                        //}
                        // alert(viewModel.TblDict.result.list[TblDictName].data[0][multilevel[m].second]);
                    });
                }
            }
        }
    }
}


/*Single 绑定**/
function tmplSingleBind(TblDictName) {
    $(selector + TblDictName).link(true, viewModel.TblDict.result.list[TblDictName].data[0]);
    $(selector + TblDictName)
    .on("change", "input,select,textarea", function () {
        if (viewModel.TblDict.result.list[TblDictName].data[0]["_command"] != "新增") {
            $.observable(viewModel.TblDict.result.list[TblDictName].data[0]).setProperty("_command", "修改");
        }
    });
}


/* List绑定**/
function tmplListBind(tmplid, TblDictName, panel, _selector) {
    var template = $.templates("#" + tmplid);
    template.link(_selector + panel, { result: viewModel.TblDict.result.list[TblDictName].data });

    $(_selector + panel)
   .on("click", ".remove", function () {
       var pkName = viewModel.TblDict.result.list[TblDictName].instruction.pk_item;
       //如果主键项不为空，添加到del_key选项
       if ($.view(this).data[pkName] != null && $.view(this).data[pkName] != "") {
           viewModel.TblDict.result.list[TblDictName].instruction.del_key.push($.view(this).data[pkName]
               );
       }
       //移除绑定
       var index = $.view(this).getIndex();
       $.observable(viewModel.TblDict.result.list[TblDictName].data).remove(index);
   })
   .on("change", "input,select", function () {
       var dataItem = $.view(this).data;
       if ($.view(this).data["_command"] != "新增") {
           $.observable(dataItem).setProperty("_command", "修改");
       }
   });
}

/*新增 render 记录方法**/
function Add(TblDictName) {
    var Items = GetTblDictNewItem(TblDictName);
    var NewRow = GetNewRowJson(TblDictName, Items);

    $.observable(viewModel.TblDict.result.list[TblDictName].data).insert(viewModel.TblDict.result.list[TblDictName].data.length, NewRow);
}

/*生成新记录**/
function GetNewRowJson(TblDictName, Items) {
    var ItemsArray = Items.split(",");
    Html = "{";
    for (var i = 0; i < ItemsArray.length; i++) {
        if (i == 0) {
            Html += "\"" + ItemsArray[i] + "\":null";
        }
        else {
            Html += ",\"" + ItemsArray[i] + "\":null";
        }
    }
    Html += ",\"_command\":\"新增\"";
    Html += "}";

    var rowData = jQuery.parseJSON(Html);
    return rowData;
}

/*生成所有业务台账 JS 模板 及 html **/
/*作废
function GetTblDict() {
    var jsRenderTmpl = "";
    var HtmlTmpl = "";

    var TblDictNames = viewModel.TblDict.result.condition.taiZhangName;

  
    var DictItem = TblDictNames.split(",");

    for (var i = 0; i < DictItem.length; i++) {
        var TblDictName = DictItem[i];
        var Items = GetTblDictItem(TblDictName);
        if (Items.length > 0) {

            if (viewModel.TblDict.result.list[TblDictName].instruction.PresentType == "Single") {
                HtmlTmpl += RenderSingleHtml(TblDictName, Items);
            }
            else if (viewModel.TblDict.result.list[TblDictName].instruction.PresentType == "List") {
                jsRenderTmpl += RenderListTmpl(TblDictName, Items);
                HtmlTmpl += RenderListHtml(TblDictName, Items);
            }
        }
    }
    $("#JsTmpl").html(jsRenderTmpl);
    $("#HtmlTmpl").html(HtmlTmpl);
}
*/

/*获取台账所有数据项**/
function GetTblDictItem(TblDictName) {
    var Items;
    //显示项
    var DisplayItems = viewModel.TblDict.result.list[TblDictName].instruction.display_items.toLowerCase();
    //编辑项
    var EditItems = viewModel.TblDict.result.list[TblDictName].instruction.edit_items.toLowerCase();

    if (DisplayItems != "" && EditItems != "") {
        Items = DisplayItems + "," + EditItems;
    }
    else if (DisplayItems != "" && EditItems == "") {
        Items = DisplayItems;
    }
    else if (DisplayItems == "" && EditItems != "") {
        Items = EditItems;
    }
    return Items;
}

/*新增台账所有数据项**/
function GetTblDictNewItem(TblDictName) {
    var Items;
    //显示项
    var DisplayItems = viewModel.TblDict.result.list[TblDictName].instruction.display_items.toLowerCase();
    //编辑项
    var EditItems = viewModel.TblDict.result.list[TblDictName].instruction.edit_items.toLowerCase();
    //隐藏项
    var HiddenItems = viewModel.TblDict.result.list[TblDictName].instruction.hidden_items.toLowerCase();

    if (DisplayItems != "" && EditItems != "" && HiddenItems != "") {
        Items = DisplayItems + "," + EditItems + "," + HiddenItems;
    }
    else if (EditItems != "" && DisplayItems != "") {
        Items = DisplayItems + "," + EditItems;
    }
    else if (EditItems != "" && HiddenItems != "") {
        Items = EditItems + "," + HiddenItems;
    }
    else if (DisplayItems != "" && HiddenItems != "") {
        Items = DisplayItems + "," + HiddenItems;
    }
    else if (EditItems != "" && DisplayItems == "" && HiddenItems == "") {
        Items = EditItems;
    }
    else if (DisplayItems != "" && EditItems == "" && HiddenItems == "") {
        Items = DisplayItems;
    }
    else if (HiddenItems != "" && EditItems == "" && DisplayItems == "") {
        Items = HiddenItems;
    }
    return Items;
}


/*根据data- 属性生成代码*/
function Generate(TblDictName) {
    $(selector + TblDictName + " [data-disp]").each(function () {
        $(this).html(GetFlddisp(TblDictName, $(this).attr("data-disp").toLowerCase()));
    });
    $(selector + TblDictName + " [data-tmplink]").each(function () {
        $(this).html(GenerateControl(TblDictName, $(this).attr("data-tmplink").toLowerCase(), this));
    });
}

/*根据data- 获取显示名*/
function GetFlddisp(TblDictName, ItemName) {
    var returnValue = "";
    try {
        returnValue = viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].flddisp + "：";
    }
    catch (e) {
        alert('显示项:' + ItemName + "发生异常!");
    }
    return returnValue;
}

/*根据data- 生成控件*/
function GenerateControl(TblDictName, ItemName, obj) {

    var Type = "";
    var validate = "";
    var Sytle = "";
    if (typeof ($(obj).attr("data-tmptype")) != "undefined") {
        Type = $(obj).attr("data-tmptype");
    }
    else {
        Type = viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].type;
        
    }
    if (typeof ($(obj).attr("data-tmpstyle")) != "undefined") {
        Sytle = $(obj).attr("data-tmpstyle");
    }
    else {
        Sytle = "width:90%;";
    }

    if (typeof ($(obj).attr("data-tmpvali")) != "undefined") {
        validate = $(obj).attr("data-tmpvali");
    }
    var Control = "";
    if (Type == "text") {
        Control += " <input  style=\"" + Sytle + "\"  type=\"text\" data-link=\"" + ItemName + "\" data-basicvali=\"" + viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].validate + "\" data-appendvali=\"" + validate + "\" />";
        return Control;
    }
    else if (Type == "select") {
        Control += "<select  style=\"" + Sytle + "\"  data-link=\"" + ItemName + "\" data-basicvali=\"" + viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].validate + "\" data-appendvali=\"" + validate + "\">";
        Control += "<option value=\"\">请选择...</option>";
        for (var i = 0; i < viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].option.length; i++) {
            Control += "<option value=\"" + viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].option[i].value + "\">" + viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].option[i].text + "</option>";
        }
        Control += "</select>";
        return Control;
    }
    else if (Type == "jsonText") {
        var Default = "";
        if (typeof ($(obj).attr("data-Default")) != "undefined") {
            Default = $(obj).attr("data-Default");
        }
        Control += "<select style=\"" + Sytle + "\"  data-link=\"" + ItemName + "\" data-basicvali=\"" + viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].validate + "\" data-appendvali=\"" + validate + "\" data-Default=\"" + Default + "\"></select>";
        //一级select
        if (typeof (viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName]["rootnodename"]) == "undefined") {
            var flag = true;
            for (var m in multilevel) {
                if (multilevel[m].first == ItemName && multilevel[m].TableName == TblDictName) {
                    flag = false;
                }
            }
            //不在multilevel时添加
            if (flag == true) {
                multilevel.push({ "first": ItemName, "TableName": TblDictName });
            }
        }
            //二级select
        else if (viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName]["nodelevel"] == "second") {
            //alert(ItemName);
            var flag = true;
            for (var m in multilevel) {
                //存在时修改二级
                if (multilevel[m].first == viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName]["rootnodename"]) {
                    flag = false;
                    multilevel[m].second = ItemName;
                }
            }
            //不存在时添加
            if (flag == true) {
                multilevel.push({ "first": viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName]["rootnodename"], "second": ItemName, "TableName": TblDictName });
            }
        }
        return Control;
    }
    else if (Type == "datetime") {
        Control += " <input style=\"" + Sytle + "\" type=\"text\" data-link=\"" + ItemName + "\" data-basicvali=\"" + viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].validate + "\" data-appendvali=\"" + validate + "\"/>";
        return Control;
    }

    else if (Type == "label") {
        Control += "<span data-link=\"" + ItemName + "\"/>";
        return Control;
    }
    else if (Type == "label_select") {
        var ItemValue = viewModel.TblDict.result.list[TblDictName].data[0][ItemName];
        if (ItemValue != null) {
            for (var i = 0; i < viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].option.length; i++) {
                if (viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].option[i].value == ItemValue) {
                    Control += "<span>" + viewModel.TblDict.result.list[TblDictName].instruction.flddict[ItemName].option[i].text + "</span>";
                }
            }
        }
        return Control;
    }
}


/*日期格式化*/
function ChangeDateTimeFormat(TblDictName) {
    $(selector + TblDictName + " [data-link]").each(function () {
        if (typeof ($(this).attr("data-basicvali")) != "undefined") {
            if ($(this).attr("data-basicvali").toString().indexOf("custom[date]") >= 0) {
                if ($(this).val() != "") {
                    $(this).val(($(this).val().split(" ")[0]));
                    if ($(this).val().length > 10)
                        $(this).val($(this).val().split("T")[0]);
                }
                //$(this).datetimepicker({
                //    format: 'yyyy-mm-dd', language: "zh-CN", minView: 4, pickTime:false,
                //    autoclose: true
                //});
                $(this).datepicker({
                    changeMonth: true,
                    changeYear: true,
                    inline: true
                });
            }
        }
    });
}


function FormatShortDt(TblDictName, dts) {
    var target = dts.split(',');
    if (target != null && target.length > 0) {
        for (var i = 0; i < target.length; i++) {
            var el = $(selector + TblDictName).find("td[data-link='" + target[i] + "']");
            var str = el.text().replace(/-/g, "/");
            if (str != null && str != "") {
                str = new Date(str);
                str = GetMyDate(str);
                el.text(str);
            }
            else {
                el = $(selector + TblDictName).find("[data-link='" + target[i] + "']");
                var str = el.val().replace(/-/g, "/");
                if (str != null && str != "") {
                    str = new Date(str);
                    str = GetMyDate(str);
                    el.val(str);
                }
            }
        }
    }
}

//将表单中带有空格的长日期，替换为短日期
function FormatShortDtOfSpace(TblDictName, dts) {
    var target = dts.split(',');
    if (target != null && target.length > 0) {
        for (var i in target) {
            $(selector + TblDictName).find("[data-link='" + target[i] + "']").each(function () {
                var textStr = $(this).text();
                var str = textStr.replace(/-/g, "/");
                if (str != null && str != "") {
                    $(this).text(textStr.split(" ")[0]);
                }
                else {
                    $(this).val($(this).val().split(" ")[0]);
                }
            });
        }
    }
}

//将表单中带有T的长日期，替换为短日期
function FormatShortDtOfT(TblDictName, dts) {
    var target = dts.split(',');
    if (target != null && target.length > 0) {
        for (var i in target) {
            $(selector + TblDictName).find("[data-link='" + target[i] + "']").each(function () {
                var textStr = $(this).text();
                var str = textStr.replace(/-/g, "/");
                if (str != null && str != "") {
                    $(this).text(textStr.split("T")[0]);
                }
                else {
                    $(this).val($(this).val().split("T")[0]);
                }
            });
        }
    }
}


function DateConvertToString(date) {
    var returnValue = GetMyDate(date) + " " + GetTimeString(date);
    return returnValue;
}


function GetMyDateString(date) {
    return date.split(" ")[0];
}


//获取日期与时间中的日期部分且以字符串返回
function GetMyDate(date) {
    var date1, date2;
    date1 = date.getMonth() + 1 + "";
    if (date1.length < 2)
        date1 = "0" + date1;
    date2 = date.getDate() + "";
    if (date2.length < 2)
        date2 = "0" + date2;
    return date.getFullYear() + "-" + date1 + "-" + date2;
}

//获取日期与时间中的时间部分且以字符串返回
function GetTimeString(dateObject) {
    var timeString;
    var hours = dateObject.getHours();
    if (hours < 10)
        hours = "0" + hours;
    var minutes = dateObject.getMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;
    var seconds = dateObject.getSeconds();
    if (seconds < 10)
        seconds = "0" + seconds;
    timeString = hours + ":" + minutes + ":" + seconds;
    return timeString;
}

//获取系统参数
function GetSysVal(varname) {
    var sysval = "";
    $.ajax({
        url: "../Common/GetSysValText?" + new Date(),
        type: "GET",
        data: { varname: varname },
        dataType: "json",
        success: function (data) {
            sysval = data.result;
        },
        async: false
    });
    return sysval;
}


$(function ($) {
    if ($.datepicker) {
        $.datepicker.regional['zh-CN'] = {
            clearText: '清除',
            clearStatus: '清除已选日期',
            closeText: '关闭',
            closeStatus: '不改变当前选择',
            prevText: '<上月',
            prevStatus: '显示上月',
            prevBigText: '<<',
            prevBigStatus: '显示上一年',
            nextText: '下月>',
            nextStatus: '显示下月',
            nextBigText: '>>',
            nextBigStatus: '显示下一年',
            currentText: '今天',
            currentStatus: '显示本月',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
            monthStatus: '选择月份',
            yearStatus: '选择年份',
            weekHeader: '周',
            weekStatus: '年内周次',
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            dayStatus: '设置 DD 为一周起始',
            dateStatus: '选择 m月 d日, DD',
            dateFormat: 'yy-mm-dd',
            firstDay: 1,
            initStatus: '请选择日期',
            isRTL: false
        };
        $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
    }
});



//以下方法[chekDate]验证类似"YYYY-MM-DD"格式的日期输入.包括日期实际性验证.
//若日期正确,返回true;否则返回false.
function checkDate(theDate) {
    var reg = /^\d{4}-((0{0,1}[1-9]{1})|(1[0-2]{1}))-((0{0,1}[1-9]{1})|([1-2]{1}[0-9]{1})|(3[0-1]{1}))$/;
    var result = true;
    if (!reg.test(theDate))
        result = false;
    else {
        var arr_hd = theDate.split("-");
        var dateTmp;
        dateTmp = new Date(arr_hd[0], parseFloat(arr_hd[1]) - 1, parseFloat(arr_hd[2]));
        if (dateTmp.getFullYear() != parseFloat(arr_hd[0])
       || dateTmp.getMonth() != parseFloat(arr_hd[1]) - 1
        || dateTmp.getDate() != parseFloat(arr_hd[2])) {
            result = false
        }
    }
    return result;
}



//类似于sql函数中的用法
Date.prototype.dateAdd = function (interval, number) {
    var d = this;
    var k = { 'y': 'FullYear', 'q': 'Month', 'm': 'Month', 'w': 'Date', 'd': 'Date', 'h': 'Hours', 'n': 'Minutes', 's': 'Seconds', 'ms': 'MilliSeconds' };

    var n = { 'q': 3, 'w': 7 };
    eval('d.set' + k[interval] + '(d.get' + k[interval] + '()+' + ((n[interval] || 1) * number) + ')');
    return d;
}

var request =
{
    QueryString: function (val) {
        var uri = window.location.search;
        var re = new RegExp("" + val + "=([^&?]*)", "ig");
        return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
    }
}


//附件上传类
function AttObj(taiZhang, attTbl, linkname) {

    if (linkname == undefined)
        linkname = "";
    this.uploadAttList = [];//新增加的附件
    this.attTbl = attTbl;
    this.linkname = linkname;
    this.taiZhang = taiZhang;
    this.loadAtt = function (attIds, _isUpload, _isDelete, isReset)//加载附件列表
    {
        if (isReset) {
            this.uploadAttList = [];
        }
        if (_isUpload == undefined)
            _isUpload = false;
        if (_isDelete == undefined)
            _isDelete = false;
        if (attIds == undefined || attIds == null) {
            for (var i = 0; i < viewModel.TblDict.result.list[this.attTbl].data.length; i++) {
                attIds += viewModel.TblDict.result.list[this.attTbl].data[i].attserial + ",";
            }
            if (attIds.length > 0) {
                attIds = attIds.substr(0, attIds.length - 1);
            }
        }
        
        $.get("../Common/fileUpload?" + new Date(), { isUpload: _isUpload, isDelete: _isDelete, ids: attIds }, function (data) {
            $("#attrList").html(data);
        }, "html");
    };
    this.attUploadCallback = function (newAttid, loadDataFn) {//附件上传成功通知业务页面的回调函数    
         
        var obj = {
            attserial: newAttid,
            linkname: this.linkname,
            uid: UserInfo.UserID,
            _command: '新增'
        }
        var pkname = viewModel.TblDict.result.list[this.taiZhang].instruction.pk_item;
        try
        {
            obj[pkname] = viewModel.TblDict.result.list[this.taiZhang].data[0][pkname];
        }
        catch(e)
        {

        }

        this.uploadAttList.push(obj);

        var oriAttList = [];//最终要检索的附件包含原有的已经存在于业务的附件，加临时上传成功的附件，临时上传附件即为uploadAttList
        for (var i = 0; i < viewModel.TblDict.result.list[this.attTbl].data.length; i++) {
            oriAttList.push(viewModel.TblDict.result.list[this.attTbl].data[i].attserial);
        }
        for (var i = 0; i < this.uploadAttList.length; i++) {
            oriAttList.push(this.uploadAttList[i].attserial);
        }

        if (loadDataFn != undefined && typeof (loadDataFn) == "function")
            loadDataFn(oriAttList.join());
    };
    this.delAtt = function (attid) {//删除的附件可能是临时附件，也可能是原有的业务附件
        var returnValue = "";
        var tempAttList = this.uploadAttList;
        for (var i = 0; i < this.uploadAttList.length; i++) {
            if (this.uploadAttList[i].attserial == attid) {
                returnValue = this.delTblAtt(attid);
                if (returnValue == "") {
                    tempAttList = deleteItem(tempAttList, i);
                    this.uploadAttList = tempAttList;
                    return "";
                }
            }
        }
        for (var i = 0; i < viewModel.TblDict.result.list[this.attTbl].data.length; i++) {
            if (attid == viewModel.TblDict.result.list[this.attTbl].data[i].attserial) {
                returnValue = this.delTblAtt(attid);
                if (returnValue == "") {
                    viewModel.TblDict.result.list[this.attTbl] = deleteItem(viewModel.TblDict.result.list[this.attTbl], i);
                }
                return returnValue;
            }
        }
        return returnValue;
    };
    this.delTblAtt = function (attid) {
        var returnValue = "";
        $.ajax({
            url: "../Common/DelAtt?" + new Date(),
            type: "GET",
            async: false,
            data: { ids: attid, type: this.attTbl },
            dataType: "json",
            async: false,
            success: function (data) {
                returnValue = data.result;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                returnValue = "error";
                alert('网络请求错误!');
            }
        });
        return returnValue;
    };
}

//region"全局函数"
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}


//构造viewmodel
function ConstViewModel(list, taiZhangName) {
    viewModel = {
        TblDict: {
            result: {
                list: list,
                condition: {
                    taiZhangName: taiZhangName
                }
            }
        },
    };
}

//提交保存业务台账
function SaveTbls(valid, TblName) {
    if (valid == false) {
        $.observable(viewModel.TblDict.result.list[TblName].data[0]).setProperty("_command", "查询");
    }

    if ($(".contentform").valid() == false && valid != false) {
        return;
    }
    var a = Math.random();
    var strTblDict = JSON.stringify(viewModel.TblDict);
    $.ajax({
        type: "POST", url: "../Common/SaveTbls?a=" + a,
        data: { TblDictJson: strTblDict },
        success: function (data) {
            if (data.ErrorMessage == "") {
                alert("保存成功");
                RefreshPage();
            }
            else {
                alert(data.ErrorMessage);
            }
        }, async: false
    });
}

function DelTbls(TblName) {
    var pkName = viewModel.TblDict.result.list[TblName].instruction.pk_item;
    if (viewModel.TblDict.result.list[TblName].data[0][pkName] != null && viewModel.TblDict.result.list[TblName].data[0][pkName] != "") {
        viewModel.TblDict.result.list[TblName].instruction.del_key.push(viewModel.TblDict.result.list[TblName].data[0][pkName]);
    }
    SaveTbls(false, TblName);
}