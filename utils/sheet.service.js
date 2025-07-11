const ExcelJS = require('exceljs');
const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');

async function parseSheet(filePath, originalname) {
    const ext = path.extname(originalname).toLowerCase();
    let columns = [];
    let rows = [];

    if (ext === '.csv') {
        const fileContent = fs.readFileSync(filePath);
        const records = parse(fileContent, { columns: true, skip_empty_lines: true });
        rows = records;
        if (rows.length > 0) {
            columns = Object.keys(rows[0]);
        }
    } else if (ext === '.xlsx') {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.worksheets[0]; // Default to first sheet
        if (worksheet.getRow(1).values) {
            columns = worksheet.getRow(1).values.slice(1);
        }
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header
                let rowData = {};
                const rowValues = row.values.slice(1);
                columns.forEach((header, index) => {
                    rowData[header] = rowValues[index];
                });
                rows.push(rowData);
            }
        });
    } else {
        throw new Error('Unsupported file type. Please upload a .csv or .xlsx file.');
    }

    const previewHead = rows.slice(0, 10);
    const previewTail = rows.slice(-10);

    return { columns, rows, previewHead, previewTail, filename: originalname };
}

function filterColumns(rows, selected) {
    return rows.map(row => {
        let newRow = {};
        selected.forEach(header => {
            newRow[header] = row[header];
        });
        return newRow;
    });
}

async function writeXlsx(columns, rows, targetPath) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('selection');
    worksheet.addRow(columns);
    rows.forEach(row => {
        const rowValues = columns.map(header => row[header]);
        worksheet.addRow(rowValues);
    });
    await workbook.xlsx.writeFile(targetPath);
}

module.exports = { parseSheet, filterColumns, writeXlsx };