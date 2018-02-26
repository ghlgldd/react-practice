var QMT_Dashboard = (function () {
    var program, site, status, from_time, to_time, status_pie_chart, ageing_pie_chart, status_pie_grid, ageing_pie_grid;
    var program_value = 'All', site_value = 'All', crf_value = 'All', status_value = 'All', from_time_value, to_time_value, list_obj;
    var state_back = false, ageing_back = false, state_data = undefined, ageing_data = undefined;
    var timer;
    var _container;
    var user_agent = manageSys.getBrowser();
    var state_color = {
         "Clarification To CRA": '#198cff',
         "Clarification To CS": '#0066cc',
         "Clarification To DM": '#26a5ff',
         "Clarification To MM": '#084b8a',
         "Closed": '#b2b2b2',
         "Open": '#ffe359',
         "Queried": '#f8971d',
         "Resolved": '#8ec31f'
    };
    var statue_message;
    var ageing_message;
    var datasoucestudy = new kendo.data.DataSource({
        transport: {
            read: {
                dataType: "json",
                url: QMT_RESTFUL_URL + "QMT/GetFilterStudyList"
            }
        },
        schema: {
            data: "StudyDetailsList"
        }
    });

    function set_query_value(){
        if(program.value().length == 0){
            program_value = ["All"];
        }
        else{
            program_value = program.value();
        }
        site_value = site.value();
        crf_value = crf.value();
        status_value = status.value();
        from_time_value = from_time.value();
        to_time_value = to_time.value();
    }

    function query_detail(isReset) {
        list_obj = [
            {"ColumnName": "Study", "Value": program_value || "All"},
            {"ColumnName": "Site", "Value": site_value || "All"},
            {"ColumnName": "CRF", "Value": crf_value || "All"},
            {"ColumnName": "QueryStatus", "Value": status_value || "All"},
            {"ColumnName": "From", "Value": [from_time_value]},
            {"ColumnName": "To", "Value": [to_time_value]}
        ];

        if (program_value == undefined && site_value == undefined && crf_value == undefined && status_value == undefined) {
            list_obj = [
                {"ColumnName": "Study", "Value": ["All"]},
                {"ColumnName": "Site", "Value": ["All"]},
                {"ColumnName": "CRF", "Value": ["All"]},
                {"ColumnName": "QueryStatus", "Value": ["All"]},
                {"ColumnName": "From", "Value": [""]},
                {"ColumnName": "To", "Value": [""]}
            ];
        }
        var datasouce_status = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    contentType: 'application/json',
                    url: QMT_RESTFUL_URL + "QMT/PieChartData",
                    type: 'POST'
                },
                parameterMap: function () {
                    return JSON.stringify(list_obj);
                }
            },
            schema: {
                data: function(response){
                    return response.GetDashboardDetails || [];
                }
            },
            error: function (response) {
                console.log(response.ResponseMessage)
            }
        });

        var datasource_ageing = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    contentType: 'application/json',
                    url: QMT_RESTFUL_URL + "QMT/AgeingReportsData",
                    type: 'POST'
                },
                parameterMap: function () {
                    return JSON.stringify(list_obj);
                }
            },
            schema: {
                data: function(response){
                    return response.GetDashboardDetails || [];
                }
            },
            error: function (response) {
                console.log(response.ResponseMessage);
            }
        });

        datasouce_status.read(list_obj).then(function (){
            var _data = datasouce_status.data(), arr = [];
            state_back = true;
            state_data = _data;
            if(!_data || !_data.length){
                $('#status_pie_chart').hide();
                $('#status_grid').hide();
                $('.db_center_content').prepend('<text style="font:16px Arial,Helvetica,sans-serif;position: relative;left: 43%;top: 33px;" x="346.5" y="29" stroke="none" fill="#8e8e8e" fill-opacity="1" id="a_therr">Query by Status</text>')
                statue_message.show().find('p').text(isReset ? 'There are no queries available for the studies you have access' : 'There are no queries found for the filtered criteria');
                return;
            }
            statue_message.hide();
            for (var i = 0, l = _data.length; i < l; i++) {
                if (state_color[_data[i].StatusName]) {
                    _data[i].color = state_color[_data[i].StatusName];
                }
                arr.push(_data[i]);
            }
            status_pie_grid.setDataSource(datasouce_status);
            status_pie_chart.setDataSource(arr);
        });

        datasource_ageing.read(list_obj).then(function () {
            var _data = datasource_ageing.data(), arr = [];
            ageing_back = true;
            ageing_data = _data;
            if(!_data || !_data.length){
            $('#ageing_pie_chart').hide();
            $('#ageing_grid').hide();
            $('.db_right_content').prepend('<text style="font:16px Arial,Helvetica,sans-serif;position: relative;left: 43%;top: 33px;" x="346.5" y="29" stroke="none" fill="#8e8e8e" fill-opacity="1" id="a_ageing">Ageing > 30 days</text>')
                ageing_message.show().find('p').text(isReset ? 'There are no queries available for the studies you have access' : 'There are no queries found for the filtered criteria');
                return;
            }
            ageing_message.hide();
            for (var i = 0, l = _data.length; i < l; i++) {
                if (state_color[_data[i].StatusName]) {
                    _data[i].color = state_color[_data[i].StatusName];
                }
                arr.push(_data[i]);
            }
            ageing_pie_grid.setDataSource(datasource_ageing);
            ageing_pie_chart.setDataSource(arr);
        });
    }

    function getPieCharDataList(ColumnName, value,isaging) {
        set_query_value();
	    if (from_time_value == null) {
            from_time_value = "";
        } else {
            from_time_value = kendo.toString(new Date(from_time.value()), 'M/dd/yyyy');
        }
        if (to_time_value == null) {
            to_time_value = "";
        } else {
            to_time_value = kendo.toString(new Date(to_time.value()), 'M/dd/yyyy');
        }
        var d_list = [
            {"ColumnName": "Study", "Value": program_value},
            {"ColumnName": "Site", "Value": site_value},
            {"ColumnName": "CRF", "Value": crf_value},
            {"ColumnName": "QueryStatus", "Value": status_value},
            {"ColumnName": "From", "Value": [from_time_value]},
            {"ColumnName": "To", "Value": [to_time_value]}
        ];
        for (var i = 0, l = d_list.length; i < l; i++) {
            if (d_list[i].ColumnName == ColumnName) {
                d_list[i].Value = [ColumnName == 'QueryStatus' ? value.replace(/\s/ig, '') : value];
                landing.getPieCharDataList(d_list,isaging);
                break;
            }
        }
    }

    function reset() {
        $('#status_pie_chart').show();
         $('#ageing_pie_chart').show();
        $('#status_grid').show();
        $('#ageing_grid').show();
        $('#a_therr').remove();
        $('#a_ageing').remove();
        manageSys.validsession();
        program_value = program.value('');
        site_value = site.value('');
        crf_value = crf.value('');
        status_value = status.value('');
        from_time_value = from_time.value(new Date());
        to_time_value = to_time.value(new Date());
        from_time_value = from_time.value('');
        to_time_value = to_time.value('');
        to_time.min(new Date(1900, 1, 1));
        //site.enable(false);
        query_detail(true);
    }

    function apply() {
        manageSys.validsession();
        $('#status_pie_chart').show();
         $('#ageing_pie_chart').show();
        $('#status_grid').show();
        $('#ageing_grid').show();
        $('#a_therr').remove();
        $('#a_ageing').remove();
        program_value = program.value();
        site_value = site.value();
        crf_value = crf.value();
        status_value = status.value();
        from_time_value = from_time.value();
        to_time_value = to_time.value();
        if (from_time_value == null) {
            from_time_value = "";
        } else {
            from_time_value = kendo.toString(new Date(from_time.value()), 'M/dd/yyyy');
        }
        if (to_time_value == null) {
            to_time_value = "";
        } else {
            to_time_value = kendo.toString(new Date(to_time.value()), 'M/dd/yyyy');
        }

        if (program_value == '' || program_value.indexOf('All') > -1) {
            program_value = ["All"]
        }
        if (site_value == '' || site_value.indexOf('All') > -1) {
            site_value = ["All"]
        }
        if (crf_value == '' || crf_value.indexOf('All') > -1) {
            crf_value = ["All"]
        }
        if (status_value == '' || status_value.indexOf('All') > -1) {
            status_value = ["All"]
        }
        query_detail(false);
    }
    var labels_template = "#= category#, #= value #";
    return {
        getPieCharDataList: getPieCharDataList,
        init: function (container, study_data) {
            _container = container;
            container.html($('#dash_board_template').html());
            statue_message = container.find('.db_center_content').find('.message_content');
            ageing_message = container.find('.db_right_content').find('.message_content');

            datasoucestudy.read().then(function () {
                var data = datasoucestudy.data();
                var _ds_study_change = 0;
                program = $("#db_program").kendoMultiSelect({
                    tagMode: "single",
                    optionLabel: "All",
                    dataTextField: "StudyName",
                    dataValueField: "StudyId",
                    placeholder: 'All',
                    autoClose: false,
                    dataSource: data,
                    tagTemplate: kendo.template($("#study_tagTemplate").html()),
                    close: function (e) {
                        var site = $("#db_site").data("kendoMultiSelect");
                        var program = $("#db_program").data('kendoMultiSelect');
                        var crf = $("#db_crf").data("kendoMultiSelect");
                        if(_ds_study_change != 0 || program.value().length == 0){
                            var value = this.value();
                            var filterCondition = {};
                                filterCondition.StudyList = [];
                            if(value.length == 0){
                                filterCondition.StudyList[0] = {StudyId:'All'};
                            }else{
                                if(value.indexOf('All') > -1){
                                    value ='All'
                                    filterCondition.StudyList[0] = {StudyId:'All'};
                                }else{
                                    for(m in value){
                                        filterCondition.StudyList[m] = {StudyId:value[m]};
                                    }
                                }
                            }
                            var _dataDource = new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        dataType: "json",
                                        contentType:'application/json',
                                        url: QMT_RESTFUL_URL+"QMT/FilterSiteList",
                                        type:"POST"
                                    },
                                    parameterMap:function(){
                                        return JSON.stringify(filterCondition);
                                    }
                                },
                                schema:{
                                    data:"SiteDetailsList"
                                }
                            });

                            var _dataDource_crf = new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        dataType: "json",
                                        contentType: 'application/json',
                                        url: QMT_RESTFUL_URL + "QMT/GetFilterCRFList",
                                        type: "POST"
                                    },
                                    parameterMap: function () {
                                        return JSON.stringify(filterCondition);
                                    }
                                },
                                schema: {
                                    data: "CRFDetailsList",
                                    errors: function (response) {
                                        if (response.ResponseCode != 'WP1022') {
                                            manageSys.utils.alertMsg("Confirmation alert", response.ResponseMessage, function () { });
                                            if (response.SiteDetailsList == null) {
                                                return [];
                                            }
                                        }
                                    }
                                }
                            });
                            crf.setDataSource(_dataDource_crf);
                            site.setDataSource(_dataDource);
                            site.value("");
                            _ds_study_change = 0;
                        }
                    },
                    select:function(e){
                        var program = $("#db_program").data('kendoMultiSelect');
                        var _select = e.item.text();
                        var _value = program.value();
                        var view = program.dataSource.view();
                        var _dropdown_value = [];
                        if(_select == "All"){
                            if(_value.indexOf('All') == -1){
                                for(var i = 1 ;i<view.length;i++){
                                    _dropdown_value.push(view[i].StudyId);
                                }
                                program.value(_dropdown_value);
                            }else if(_value.indexOf('All') > -1){
                                program.value('All');
                            }
                        }
                    },
                    change:function(e){
                        _ds_study_change++;
                        var program = $("#db_program").data('kendoMultiSelect');
                        var _value = program.value();
                        var view = program.dataSource.view();
                        if(_value.length < view.length){
                            if(_value.indexOf('All') > -1){
                                var _new_value = [];
                                for(var i =0;i<_value.length;i++){
                                    if(_value[i] != 'All'){
                                        _new_value.push(_value[i]);
                                    }
                                }
                                program.value(_new_value);
                            }
                        }
                        if(_value.length == view.length-1){
                            if(_value.indexOf('All') == -1){
                                _value.push('All');
                                program.value(_value)
                            }
                        }
                    }
                }).data("kendoMultiSelect");
                $('#db_reset').trigger('click');
            });
            var site_filterCondition = {};
                site_filterCondition.StudyList = [{StudyId:'All'}];
            site = $("#db_site").kendoMultiSelect({
                autoClose: false,
                tagMode: "single",
                optionLabel: "All",
                dataTextField: "SiteName",
                dataValueField: "SiteId",
                cascadeFrom: "program",
                placeholder: 'All',
                tagTemplate: kendo.template($("#site_tagTemplate").html()),
                dataSource:{
                    transport: {
                        read: {
                            dataType: "json",
                            contentType:'application/json',
                            url: QMT_RESTFUL_URL+"QMT/FilterSiteList",
                            type:"POST"
                        },
                        parameterMap:function(){
                            return JSON.stringify(site_filterCondition);
                        }
                    },
                    schema:{
                        data:"SiteDetailsList"
                    }
                },
                select:function(e){
                    var site = $("#db_site").data('kendoMultiSelect');
                    var _select = e.item.text();
                    var _value = site.value();
                    var view = site.dataSource.view();
                    var _dropdown_value = [];
                    if(_select == "All"){
                        if(_value.indexOf('All') == -1){
                            for(var i = 1 ;i<view.length;i++){
                                _dropdown_value.push(view[i].SiteId);
                            }
                            site.value(_dropdown_value);
                        }else if(_value.indexOf('All') > -1){
                            site.value('All');
                        }
                    }
                },
                change:function(e){
                        var site = $("#db_site").data('kendoMultiSelect');
                        var _value = site.value();
                        var view = site.dataSource.view();
                        if(_value.length < view.length){
                            if(_value.indexOf('All') > -1){
                                var _new_value = [];
                                for(var i =0;i<_value.length;i++){
                                    if(_value[i] != 'All'){
                                        _new_value.push(_value[i]);
                                    }
                                }
                                site.value(_new_value);
                            }
                        }
                        if(_value.length == view.length-1){
                            if(_value.indexOf('All') == -1){
                                _value.push('All');
                                site.value(_value)
                            }
                        }
                }
            }).data("kendoMultiSelect");

            crf = $("#db_crf").kendoMultiSelect({
                autoClose: false,
                tagMode: "single",
                dataTextField: "CRFName",
                dataValueField: "CRFId",
                cascadeFrom: "program",
                placeholder: 'All',
                tagTemplate: kendo.template($("#crf_tagTemplate").html()),
                dataSource: {
                    transport: {
                        read: {
                            dataType: "json",
                            contentType: 'application/json',
                            url: QMT_RESTFUL_URL + "QMT/GetFilterCRFList",
                            type: "POST"
                        },
                        parameterMap: function () {
                            return JSON.stringify(site_filterCondition);
                        }
                    },
                    schema: {
                        data: "CRFDetailsList"
                    }
                },
                select:function(e){
                    var crf = $("#db_crf").data('kendoMultiSelect');
                    var _select = e.item.text();
                    var _value = crf.value();
                    var view = crf.dataSource.view();
                    var _dropdown_value = [];
                    if(_select == "All"){
                        if(_value.indexOf('All') == -1){
                            for(var i = 1 ;i<view.length;i++){
                                _dropdown_value.push(view[i].CRFId);
                            }
                            crf.value(_dropdown_value);
                        }else if(_value.indexOf('All') > -1){
                            crf.value('All');
                        }
                    }
                },
                change:function(e){
                        var crf = $("#db_crf").data('kendoMultiSelect');
                        var _value = crf.value();
                        var view = crf.dataSource.view();
                        if(_value.length < view.length){
                            if(_value.indexOf('All') > -1){
                                var _new_value = [];
                                for(var i =0;i<_value.length;i++){
                                    if(_value[i] != 'All'){
                                        _new_value.push(_value[i]);
                                    }
                                }
                                crf.value(_new_value);
                            }
                        }
                        if(_value.length == view.length-1){
                            if(_value.indexOf('All') == -1){
                                _value.push('All');
                                crf.value(_value)
                            }
                        }
                }
            }).data("kendoMultiSelect");

            status = $("#db_status").kendoMultiSelect({
                autoClose: false,
                tagMode: "single",
                optionLabel: "All",
                dataTextField: "StatusName",
                dataValueField: "StatusId",
                cascadeFrom: "program",
                placeholder: 'All',
                tagTemplate: kendo.template($("#status_tagTemplate").html()),
                dataSource: {
                    transport: {
                        read: {
                            dataType: "json",
                            url: QMT_RESTFUL_URL + "QMT/GetFilterStatusList"
                        }
                    },
                    schema: {
                        data: "StatusList"
                    }
                },
                select:function(e){
                    var status = $("#db_status").data('kendoMultiSelect');
                    var _select = e.item.text();
                    var _value = status.value();
                    var view = status.dataSource.view();
                    var _dropdown_value = [];
                    if(_select == "All"){
                        if(_value.indexOf('All') == -1){
                            for(var i = 1 ;i<view.length;i++){
                                _dropdown_value.push(view[i].StatusId);
                            }
                            status.value(_dropdown_value);
                        }else if(_value.indexOf('All') > -1){
                            status.value('All');
                        }
                    }
                },
                change:function(e){
                        var status = $("#db_status").data('kendoMultiSelect');
                        var _value = status.value();
                        var view = status.dataSource.view();
                        if(_value.length < view.length){
                            if(_value.indexOf('All') > -1){
                                var _new_value = [];
                                for(var i =0;i<_value.length;i++){
                                    if(_value[i] != 'All'){
                                        _new_value.push(_value[i]);
                                    }
                                }
                                status.value(_new_value);
                            }
                        }
                        if(_value.length == view.length-1){
                            if(_value.indexOf('All') == -1){
                                _value.push('All');
                                status.value(_value)
                            }
                        }
                }
            }).data("kendoMultiSelect");

            from_time = $("#db_from_time").kendoDatePicker({
                change:function(){
                    if(this.value() == null){
                        this.value("")
                    }
                    var _to_time = $("#db_to_time").data('kendoDatePicker');
                    var _value = new Date(_to_time.value()).getTime();
                    if(new Date(this.value()).getTime() > new Date().getTime()){
                        manageSys.utils.alertMsg("Confirmation alert", '"From" date cannot be greater than Current date.<br/> Please change the date and try again.', function(){});
                        this.value(new Date());
                        this.value("");
                        return
                    }
                    if(_value > 0){
                        var this_value = new Date(this.value()).getTime();
                        if(this_value > _value){
                            manageSys.utils.alertMsg("Confirmation alert","'To' date cannot be less than 'From' date.<br/>Please select date which is greater than 'From' date and try again.", function(){});
                            this.value(new Date());
                            this.value("")
                        }else if(_value - this_value > 31536000000){
                            manageSys.utils.alertMsg("Confirmation alert",'Sorry, the date range selected should be less than or equal to 2 years.', function(){});
                            this.value(new Date());
                            this.value("");
                        }
                    }
                }
            }).data("kendoDatePicker");
            to_time = $("#db_to_time").kendoDatePicker({
               change:function(){
                    if(this.value() == null){
                        this.value("")
                    }
                    var _from_time = $("#db_from_time").data('kendoDatePicker');
                    var _value = new Date(_from_time.value()).getTime();
                    if(new Date(this.value()).getTime() > new Date().getTime()){
                        manageSys.utils.alertMsg("Confirmation alert",'"To" date cannot be greater than Current date.<br/>Please change the date and try again.', function(){});
                        this.value(new Date());
                        this.value("");
                        return
                    }
                    if(_value > 0){
                        var this_value = new Date(this.value()).getTime();
                        if(this_value < _value){
                            manageSys.utils.alertMsg("Confirmation alert","'To' date cannot be less than 'From' date.<br/>Please select date which is greater than 'From' date and try again.", function(){});
                            this.value(new Date());
                            this.value("");
                        }else if(this_value - _value > 31536000000){
                            manageSys.utils.alertMsg("Confirmation alert",'Sorry, the date range selected should be less than or equal to 2 years.', function(){});
                            this.value(new Date());
                            this.value("");
                        }
                    }
               }
            }).data("kendoDatePicker");

            $('#db_reset').click(reset);

            $('#db_filter').click(apply);

            status_pie_chart = $('#status_pie_chart').kendoChart({
                title: {
                    position: "top",
                    text: "Query by Status"
                },
                legend: {
                    visible: false
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    labels: {
                        template: labels_template,
                        visible: true,
                        background: "transparent"
                    },
                    title: {
                        fontWeight: 'bold'
                    }
                },
                series: [{
                    field: "StatusCount",
                    categoryField: "StatusName",
                    type: "pie"
                }],
                tooltip: {
                    visible: false
                }
            }).data('kendoChart');

            ageing_pie_chart = $('#ageing_pie_chart').kendoChart({
                title: {
                    position: "top",
                    text: "Ageing > 30 days"
                },
                legend: {
                    visible: false
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    labels: {
                        template: labels_template,
                        visible: true,
                        background: "transparent"
                    }
                },
                series: [{
                    field: "StatusCount",
                    categoryField: "StatusName",
                    type: "pie"
                }],
                tooltip: {
                    visible: false
                }
            }).data('kendoChart');

            status_pie_grid = $("#status_grid").kendoGrid({
                scrollable: true,
                rowTemplate: kendo.template($("#RowTemplate").html()),
                columns: [{
                    field: "StatusName",
                    title: "Status"
                }, {
                    field: "StatusCount",
                    title: "Number of Queries"
                }]
            }).data('kendoGrid');

            ageing_pie_grid = $("#ageing_grid").kendoGrid({
                scrollable: true,
                rowTemplate: kendo.template($("#RowTemplate_aging").html()),
                columns: [{
                    field: "StatusName",
                    title: "Status"
                }, {
                    field: "StatusCount",
                    title: "Number of Queries"
                }]
            }).data('kendoGrid');
            this.resize();
            $(window).resize(this.resize);
            if(user_agent == 'ie10' || user_agent == 'ie11'){
                $('#db_from_time').attr('disabled','true');
                $('#db_to_time').attr('disabled','true');
            }else{
                $('#db_from_time').attr('readonly','true');
                $('#db_to_time').attr('readonly','true');
            }
        },
        resize:function(){
            $('.db_center_content, .db_right_content').width((_container.width() - $('.db_left_content').width()) / 2 - 20);
            $('.db_content').height($(window).height() - 150);
            status_pie_chart.redraw();
            ageing_pie_chart.redraw();
        }
    }
}());