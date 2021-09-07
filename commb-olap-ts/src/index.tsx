import ReactDOM from 'react-dom';
import React from 'react';
import {
    PivotViewComponent, Inject, FieldList, CalculatedField, GroupingBar,
    Toolbar, PDFExport, ExcelExport, ConditionalFormatting, SaveReportArgs,
    FetchReportArgs, LoadReportArgs, RemoveReportArgs, RenameReportArgs, ToolbarArgs
} from '@syncfusion/ej2-react-pivotview';
import { SampleBase } from './sample-base';
import './index.css';

/**
 * PivotView ToolBar Sample Olap.
 */

let dataSourceSettings: Object = {
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

export class OlapSample extends SampleBase<{}, {}> {

    public pivotObj: any;
    public toolbarOptions: any = ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
        'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'];

    public constructor(){
      super(...arguments)
    }

    fetchReport(args: FetchReportArgs): void {
        let reportsCollection: string[] = [];
        let reeportsList: string[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportsCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportsCollection.map(function (item: any): void { reeportsList.push(item.reportName); });
        args.reportName = reeportsList;
    }
    saveReport(args: any): void {
        let report: SaveReportArgs[] = [];
        let isSave: boolean = false;
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            report = JSON.parse(localStorage.pivotviewReports);
        }
        if (args.report && args.reportName && args.reportName !== '') {
            report.map(function (item: any): any {
                if (args.reportName === item.reportName) {
                    item.report = args.report; isSave = true;
                }
            });
            if (!isSave) {
                report.push(args);
            }
            localStorage.pivotviewReports = JSON.stringify(report);
        }
    }
    removeReport(args: RemoveReportArgs): void {
        let reportsCollection: any[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportsCollection = JSON.parse(localStorage.pivotviewReports);
        }
        for (let i: number = 0; i < reportsCollection.length; i++) {
            if (reportsCollection[i].reportName === args.reportName) {
                reportsCollection.splice(i, 1);
            }
        }
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            localStorage.pivotviewReports = JSON.stringify(reportsCollection);
        }
    }
    loadReport(args: LoadReportArgs): void {
        let reportsCollection: string[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportsCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportsCollection.map(function (item: any): void {
            if (args.reportName === item.reportName) {
                args.report = item.report;
            }
        });
        if (args.report) {
            this.pivotObj.dataSourceSettings = JSON.parse(args.report).dataSourceSettings;
        }
    }
    renameReport(args: RenameReportArgs): void {
        let reportsCollection: any[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportsCollection = JSON.parse(localStorage.pivotviewReports);
        }
        if (args.isReportExists) {
            for (let i: number = 0; i < reportsCollection.length; i++) {
                if (reportsCollection[i].reportName === args.rename) {
                    reportsCollection.splice(i, 1);
                }
            }
        }
        reportsCollection.map(function (item: any): any { if (args.reportName === item.reportName) { item.reportName = args.rename; } });
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            localStorage.pivotviewReports = JSON.stringify(reportsCollection);
        }
    }
    beforeToolbarRender(args: ToolbarArgs): void {
        args.customToolbar.splice(6, 0, {
            type: 'Separator'
        });
        args.customToolbar.splice(9, 0, {
            type: 'Separator'
        });
    }
    newReport(): void {
        this.pivotObj.setProperties({ dataSourceSettings: { columns: [], rows: [], values: [], filters: [] } }, false);
    }
    chartOnLoad(args:any): void {
        let selectedTheme = location.hash.split("/")[1];
        selectedTheme = selectedTheme ? selectedTheme : "Material";
        args.chart.theme =
            selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1);
    }
    render() {
        return (
            <div className='control-pane'>
                <div className='control-section' id='pivot-table-section' style={{ overflow: 'initial' }}>
                    <PivotViewComponent id='PivotView' ref={(scope) => { this.pivotObj = scope; }} dataSourceSettings={dataSourceSettings} width={'100%'} height={'500'} showFieldList={true} showGroupingBar={true} gridSettings={{ columnWidth: 140 }}
                        allowExcelExport={true} allowConditionalFormatting={true} allowPdfExport={true} showToolbar={true} allowCalculatedField={true} displayOption={{ view: 'Both' }} toolbar={this.toolbarOptions}
                        newReport={this.newReport.bind(this)} renameReport={this.renameReport.bind(this)} removeReport={this.removeReport.bind(this)} loadReport={this.loadReport.bind(this)} fetchReport={this.fetchReport.bind(this)}
                        saveReport={this.saveReport.bind(this)} toolbarRender={this.beforeToolbarRender.bind(this)} chartSettings={{ title: 'Sales Analysis', load: this.chartOnLoad.bind(this) }}>
                        <Inject services={[FieldList, GroupingBar, CalculatedField, Toolbar, PDFExport, ExcelExport, ConditionalFormatting]} />
                    </PivotViewComponent>
                </div>

            </div>
        )
    }
}

ReactDOM.render(
  <OlapSample />,
  document.getElementById('olap-integration')
)