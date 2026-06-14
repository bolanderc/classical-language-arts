/**
 * Portfolio Automation Mock
 *
 * Intended Google Sheet columns:
 * student, book, packet_type, google_doc_id, status, include_in_portfolio,
 * term, completed_date, parent_notes
 *
 * Setup in Google Apps Script:
 * 1. Create a Google Sheet from packet-manifest.csv.
 * 2. Open Extensions > Apps Script.
 * 3. Paste this file into Code.gs.
 * 4. Set PORTFOLIO_FOLDER_ID to the Drive folder for generated portfolios.
 * 5. Run buildPortfoliosFromManifest().
 */

const PORTFOLIO_FOLDER_ID = 'PORTFOLIO_FOLDER_GOOGLE_DRIVE_ID';
const SCHOOL_YEAR = '2026';

function buildPortfoliosFromManifest() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = getManifestRows_(sheet);
  const includedRows = rows.filter((row) => String(row.include_in_portfolio).toLowerCase() === 'yes');
  const byStudent = groupBy_(includedRows, 'student');

  Object.keys(byStudent).forEach((student) => {
    const studentRows = byStudent[student];
    const doc = DocumentApp.create(`${student} - Classical Language Arts Portfolio - ${SCHOOL_YEAR}`);
    const body = doc.getBody();

    body.clear();
    body.appendParagraph('Classical Language Arts Portfolio').setHeading(DocumentApp.ParagraphHeading.TITLE);
    body.appendParagraph(`Student: ${student}`);
    body.appendParagraph(`School Year: ${SCHOOL_YEAR}`);
    body.appendParagraph('');

    appendCompletedBooksTable_(body, studentRows);
    appendParentSummary_(body);

    doc.saveAndClose();
    moveFileToPortfolioFolder_(doc.getId());
  });
}

function getManifestRows_(sheet) {
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map((header) => normalizeHeader_(header));

  return values
    .filter((row) => row.some((cell) => cell !== ''))
    .map((row) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = row[index];
      });
      return record;
    });
}

function appendCompletedBooksTable_(body, rows) {
  body.appendParagraph('Books Completed').setHeading(DocumentApp.ParagraphHeading.HEADING1);

  const tableRows = [
    ['Book', 'Packet', 'Completed', 'Parent Notes'],
    ...rows.map((row) => [
      row.book || '',
      makeDocUrl_(row.google_doc_id),
      row.completed_date || '',
      row.parent_notes || ''
    ])
  ];

  body.appendTable(tableRows);
}

function appendParentSummary_(body) {
  body.appendParagraph('Parent Summary').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Strengths:');
  body.appendParagraph('');
  body.appendParagraph('Growth:');
  body.appendParagraph('');
  body.appendParagraph('Next steps:');
}

function moveFileToPortfolioFolder_(docId) {
  const folder = DriveApp.getFolderById(PORTFOLIO_FOLDER_ID);
  const file = DriveApp.getFileById(docId);
  file.moveTo(folder);
}

function makeDocUrl_(docId) {
  if (!docId) {
    return '';
  }

  return `https://docs.google.com/document/d/${docId}/edit`;
}

function groupBy_(rows, key) {
  return rows.reduce((groups, row) => {
    const groupKey = row[key] || 'Unassigned';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(row);
    return groups;
  }, {});
}

function normalizeHeader_(header) {
  return String(header).trim().toLowerCase().replace(/\s+/g, '_');
}
