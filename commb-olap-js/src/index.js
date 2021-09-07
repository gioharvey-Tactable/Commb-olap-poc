import { render } from 'react-dom';
import './index.css';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { PivotViewComponent, Inject, FieldList, CalculatedField, GroupingBar, Toolbar, PDFExport, ExcelExport, ConditionalFormatting } from '@syncfusion/ej2-react-pivotview';
import { SampleBase } from './sample-base';

/**
 * PivotView ToolBar Sample Olap.
 */
let dataSourceSettings = {
    catalog: 'Adventure Works DW 2008 SE',
    cube: 'Adventure Works',
    providerType: 'SSAS',
    url: 'https://bi.syncfusion.com/olap/msmdpump.dll',
    enableSorting: true,
    columns: [{ name: '[Product].[Product Categories]', caption: 'Product Categories' }, { name: '[Measures]', caption: 'Measures' }],
    valueSortSettings: { headerDelimiter: ' - ' },
    values: [{ name: '[Measures].[Customer Count]', caption: 'Customer Count' }, { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' }],
    rows: [{ name: '[Customer].[Customer Geography]', caption: 'Customer Geography' }],
    filters: [{ name: '[Date].[Fiscal]', caption: 'Date Fiscal' }],
    filterSettings: [{
            name: '[Date].[Fiscal]', items: ['[Date].[Fiscal].[Fiscal Quarter].&[2002]&[4]', '[Date].[Fiscal].[Fiscal Year].&[2005]'],
            levelCount: 3
        }
    ]
};
export class OlapSample extends SampleBase {
    constructor() {
        super(...arguments);
        this.toolbarOptions = ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
            'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'];
    }
    fetchReport(args) {
        let reportsCollection = [];
        let reeportsList = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportsCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportsCollection.map(function (item) { reeportsList.push(item.reportName); });
        args.reportName = reeportsList;
    }
    saveReport(args) {
        let report = [];
        let isSave = false;
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            report = JSON.parse(localStorage.pivotviewReports);
        }
        if (args.report && args.reportName && args.reportName !== '') {
            report.map(function (item) {
                if (args.reportName === item.reportName) {
                    item.report = args.report;
                    isSave = true;
                }
            });
            if (!isSave) {
                report.push(args);
            }
            localStorage.pivotviewReports = JSON.stringify(report);
        }
    }
    removeReport(args) {
        let reportsCollection = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportsCollection = JSON.parse(localStorage.pivotviewReports);
        }
        for (let i = 0; i < reportsCollection.length; i++) {
            if (reportsCollection[i].reportName === args.reportName) {
                reportsCollection.splice(i, 1);
            }
        }
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            localStorage.pivotviewReports = JSON.stringify(reportsCollection);
        }
    }
    loadReport(args) {
        let reportsCollection = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportsCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportsCollection.map(function (item) {
            if (args.reportName === item.reportName) {
                args.report = item.report;
            }
        });
        if (args.report) {
            this.pivotObj.dataSourceSettings = JSON.parse(args.report).dataSourceSettings;
        }
    }
    renameReport(args) {
        let reportsCollection = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportsCollection = JSON.parse(localStorage.pivotviewReports);
        }
        if (args.isReportExists) {
            for (let i = 0; i < reportsCollection.length; i++) {
                if (reportsCollection[i].reportName === args.rename) {
                    reportsCollection.splice(i, 1);
                }
            }
        }
        reportsCollection.map(function (item) { if (args.reportName === item.reportName) {
            item.reportName = args.rename;
        } });
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            localStorage.pivotviewReports = JSON.stringify(reportsCollection);
        }
    }
    beforeToolbarRender(args) {
        args.customToolbar.splice(6, 0, {
            type: 'Separator'
        });
        args.customToolbar.splice(9, 0, {
            type: 'Separator'
        });
    }
    newReport() {
        this.pivotObj.setProperties({ dataSourceSettings: { columns: [], rows: [], values: [], filters: [] } }, false);
    }
    chartOnLoad(args) {
        const locator = useLocation();
        let selectedTheme = locator.hash.split("/")[1];
        selectedTheme = selectedTheme ? selectedTheme : "Material";
        args.chart.theme =
            selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1);
    }
    render() {
        return (<div className='control-pane'>
                <div className='control-section' id='pivot-table-section' style={{ overflow: 'initial' }}>
                    <PivotViewComponent id='PivotView' ref={(scope) => { this.pivotObj = scope; }} dataSourceSettings={dataSourceSettings} width={'100%'} height={'500'} showFieldList={true} showGroupingBar={true} gridSettings={{ columnWidth: 140 }} allowExcelExport={true} allowConditionalFormatting={true} allowPdfExport={true} showToolbar={true} allowCalculatedField={true} displayOption={{ view: 'Both' }} toolbar={this.toolbarOptions} newReport={this.newReport.bind(this)} renameReport={this.renameReport.bind(this)} removeReport={this.removeReport.bind(this)} loadReport={this.loadReport.bind(this)} fetchReport={this.fetchReport.bind(this)} saveReport={this.saveReport.bind(this)} toolbarRender={this.beforeToolbarRender.bind(this)} chartSettings={{ title: 'Sales Analysis', load: this.chartOnLoad.bind(this) }}>
                        <Inject services={[FieldList, GroupingBar, CalculatedField, Toolbar, PDFExport, ExcelExport, ConditionalFormatting]}/>
                    </PivotViewComponent>
                </div>

            </div>);
    }
}

render(<OlapSample />, document.getElementById('sample'));