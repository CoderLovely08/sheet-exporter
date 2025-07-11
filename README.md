# Sheet Exporter

A modern, user-friendly web application for uploading Excel/CSV files, previewing data, and exporting selected columns to a new Excel file.

## Features

- **File Upload**: Support for `.xlsx`, `.xls`, and `.csv` files (up to 5MB)
- **Data Preview**: View first and last 10 rows of your data with total row count
- **Column Selection**: Choose which columns to include in the export
  - Select/deselect individual columns
  - "Select All" and "Select None" buttons
  - Real-time selection counter
- **Excel Export**: Download a new Excel file with only your selected columns
- **Modern UI**: 
  - Clean, minimalist interface with smooth animations
  - Card-based layout with soft shadows
  - Responsive design for all devices
  - Professional gradient header
- **Enhanced UX**:
  - Drag & drop file uploads
  - Visual feedback on interactions
  - Loading spinners during processing
  - Clear error messages
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + A` to select all columns
  - `Ctrl/Cmd + D` to deselect all columns
- **Quick Actions**:
  - "Start Over" button to upload a new file
  - Easy navigation throughout the app

## Technology Stack

- **Backend**: Node.js + Express
- **Templating**: EJS
- **File Processing**: ExcelJS (Excel) + csv-parse (CSV)
- **File Upload**: Multer
- **UI Framework**: Custom CSS with modern design system
- **Frontend**: Vanilla JavaScript with enhanced UX features

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sheet-exporter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

## Usage

1. **Upload a File**
   - Click "Choose File" or drag and drop your file onto the upload area
   - Supported formats: CSV, XLS, XLSX (max 5MB)
   - The file name will be displayed once selected
   - Click "Upload & Process" to continue

2. **Preview & Select Columns**
   - View file information and total row count
   - Review data preview tables showing first and last 10 rows
   - Use checkboxes to select/deselect columns (all selected by default)
   - Use "Select All" or "Select None" buttons for bulk actions
   - The export button shows how many columns are selected
   - Click "Export Selected Columns" to download

3. **Download or Start Over**
   - Your browser will download "selected-columns.xlsx" with only selected columns
   - Click "Start Over" to upload a different file
   - Use keyboard shortcuts for faster column selection

## Project Structure

```
sheet-exporter/
├── index.js              # Express server and routes
├── package.json          # Project configuration
├── uploads/              # Temporary file storage
├── public/               # Static assets
│   ├── css/             
│   │   └── styles.css    # Custom CSS styles
│   └── js/              
│       └── app.js        # Client-side JavaScript
├── utils/               
│   └── sheet.service.js  # File parsing and export logic
└── views/                # EJS templates
    ├── layout.ejs        # Base layout with header
    ├── upload.ejs        # Upload interface
    ├── preview.ejs       # Column selection & preview
    └── error.ejs         # Error display
```

## API Routes

- `GET /` - Display upload form
- `POST /upload` - Handle file upload and parsing
- `GET /preview/:id` - Show data preview and column selection
- `POST /export/:id` - Export selected columns to Excel

## Configuration

The application runs on port 8000 by default. You can change this by modifying the `port` variable in `index.js`:

```javascript
const port = 8000; // Change this to your desired port
```

## Limitations

- **File Size**: Maximum 5MB per upload
- **Excel Sheets**: Only processes the first worksheet in multi-sheet Excel files
- **Memory**: Entire file is loaded into memory (not suitable for very large files)
- **Sessions**: Uses in-memory storage (data is lost on server restart)

## Development

To run in development mode with auto-reload:

```bash
npm run dev
```

## Dependencies

- `express` - Web framework
- `ejs` - Template engine
- `multer` - File upload handling
- `exceljs` - Excel file reading/writing
- `csv-parse` - CSV parsing
- `uuid` - Session ID generation

## License

[Add your license here]

## Contributing

[Add contributing guidelines here]

## Support

For issues and feature requests, please [create an issue](link-to-issues).