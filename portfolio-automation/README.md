# Portfolio Automation

This folder sketches an automation workflow outside the textbook.

The goal is to turn student response packets into portfolios during the year or at year end without asking the children to manage files manually.

## Recommended Workflow

1. Keep one Google Doc response packet per student per book.
2. Track every packet in a Google Sheet using `packet-manifest.csv` as the column model.
3. Use Google Apps Script to create or refresh portfolio documents.
4. Review the generated portfolios in Google Docs.
5. Export final portfolios to PDF at the end of the term or year.

## Why a Manifest?

The manifest becomes the source of truth. Instead of searching Drive for student work, the automation reads rows like:

```text
Emma,The Secret Garden,Writing Packet,GOOGLE_DOC_ID,Ready for Review
James,Treasure Island,Writing Packet,GOOGLE_DOC_ID,In Progress
```

That gives you student linkage, book linkage, review status, and portfolio inclusion without depending on the kids naming files perfectly.

## Suggested Google Drive Structure

```text
Classical Language Arts
  00 Admin
    Portfolio Manifest
    Portfolio Automation Script
  01 Templates
    Master Book Response Packet
    Portfolio Template
  02 Student Packets
    Emma
    James
  03 Portfolios
    Emma
    James
  04 Exports
    2026 Spring
    2026 Year End
```

## Automation Options

### Simple Version

Create a portfolio doc for each child that contains:

- student name
- term or school year
- a table of completed books
- links to response packets
- parent review notes copied from the manifest

This is reliable and fast.

### Rich Version

Create a portfolio doc that imports selected excerpts from each response packet.

This is possible, but it is more fragile because it depends on consistent headings inside every student packet. The current script starts with the simple version and leaves clear places to add excerpt importing later.

## Files

- `packet-manifest.csv`: spreadsheet template for tracking student packets
- `apps-script/Code.gs`: mock Google Apps Script for creating portfolio docs
- `portfolio-template.md`: suggested shape of the generated portfolio
