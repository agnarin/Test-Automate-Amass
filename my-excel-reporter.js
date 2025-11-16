import exceljs from 'exceljs';
import path from 'path';
import fs from 'fs';

class MyExcelReporter {
  constructor(options) {
    this.outputFile = options?.outputFile || 'playwright-report.xlsx';
    this.reportData = [];
  }

  onTestEnd(test, result) {
    const testCase = test.title;
    const status = result.status;
    let errorMessage = '';
    let screenshotPath = '';

    if (status === 'failed') {
      errorMessage = result.error?.message || 'Unknown error';
      
      const screenshotAttachment = result.attachments.find(
        (att) => att.name === 'screenshot'
      );
      
      if (screenshotAttachment && fs.existsSync(screenshotAttachment.path)) {
        screenshotPath = path.resolve(screenshotAttachment.path);
      }
    }

    this.reportData.push({
      testCase,
      status,
      errorMessage,
      screenshotPath,
    });
  }

  async onEnd(result) {
    console.log(`\nGenerating Excel report...`);

    const workbook = new exceljs.Workbook();
    workbook.creator = 'Playwright Reporter';
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet('Test Results');

    worksheet.columns = [
      { header: 'Test Case', key: 'testCase', width: 50 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Error Message', key: 'errorMessage', width: 70 },
      { header: 'Screenshot (on Failure)', key: 'screenshotPath', width: 70 },
    ];
    
    for (const data of this.reportData) {
      const rowData = {
        testCase: data.testCase,
        status: data.status,
        errorMessage: data.errorMessage,
        screenshotPath: data.screenshotPath ? {
          text: 'Click to open Screenshot',
          hyperlink: `file:///${data.screenshotPath}`
        } : ''
      };
      
      const row = worksheet.addRow(rowData);
      
      const statusCell = row.getCell('status');
      if (data.status === 'passed') {
        statusCell.font = { color: { argb: 'FF008000' }, bold: true }; // Green
      } else if (data.status === 'failed') {
        statusCell.font = { color: { argb: 'FFFF0000' }, bold: true }; // Red
      }
    }

    try {
      await workbook.xlsx.writeFile(this.outputFile);
      console.log(`Excel report generated successfully: ${this.outputFile}`);
    } catch (err) {
      console.error("Error generating Excel report:", err);
    }
  }
}

export default MyExcelReporter;