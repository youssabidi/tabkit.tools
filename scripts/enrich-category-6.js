const fs = require('fs');

const category6Data = {
  'bank-statement-to-excel.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Corporate Tax Preparation & Year-End Accounting Audits',
        desc: 'Small business owners, CPAs, and corporate accounting teams convert annual PDF bank statements from checking and credit card accounts into structured Excel worksheets, accelerating QuickBooks, Xero, and Sage general ledger reconciliation without manual data entry.'
      },
      {
        heading: 'Mortgage Underwriting & Loan Application Verification',
        desc: 'Loan underwriters, mortgage brokers, and credit analysts extract transaction histories from applicant bank statements to verify payroll deposit consistency, track debt obligations, and calculate average daily balances for risk assessment.'
      },
      {
        heading: 'Forensic Financial Audits & Fraud Investigation',
        desc: 'Forensic accountants and legal investigators convert legacy PDF statements into tabular spreadsheets to run automated transaction matching, identify anomalous withdrawals, and build court-admissible financial exhibits.'
      }
    ],
    tableRows: [
      ['Extraction Pipeline', 'Client-Side PDF.js text matrix parser with heuristic column detection', 'Server-side OCR cloud API with data retention'],
      ['Financial Confidentiality', 'Bank account numbers, balances, and transaction details stay 100% in RAM', 'Uploaded across public internet to third-party databases'],
      ['Format Support', 'Exports native Microsoft Excel (.xlsx) and clean RFC 4180 CSV', 'Restricted to plain text or basic CSV'],
      ['Multi-Page Continuity', 'Seamlessly handles 50+ page continuous statements without losing rows', 'Fails or drops rows on page boundary transitions'],
      ['Processing Speed', 'Instant client-side parsing (10-30 pages processed in under 3 seconds)', '10 - 60 seconds server processing and queue delay']
    ],
    pitfalls: [
      {
        title: 'Scanned Raster PDFs vs Native Vector Text Streams',
        text: 'PDF bank statements downloaded directly from banking portals contain native digital text streams that can be extracted with 100% precision. In contrast, paper statements scanned with a smartphone or flatbed scanner are flat pixel images lacking text, requiring Optical Character Recognition (OCR). Verify your PDF contains selectable text.'
      },
      {
        title: 'Multi-Line Transaction Description Wrapping',
        text: 'Long merchant descriptions (such as wire transfer details or foreign exchange notes) frequently wrap onto two or three lines in PDF tables. Naive parsers treat each wrapped line as an independent transaction, misaligning debit and credit columns. TabKit merges wrapped description lines into single transaction records.'
      },
      {
        title: 'Negative Number Discrepancies (Parentheses vs Minus Signs)',
        text: 'Financial institutions format withdrawals differently: some use parentheses ($100.00), others use trailing minus signs (100.00-), and others rely on separate Debit/Credit columns without negative signs. TabKit normalizes amounts into standardized signed floating-point numbers.'
      }
    ]
  },
  'convert-chase-statement-to-excel.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Chase Business & Personal Account Reconciliation',
        desc: 'Cardholders and business managers convert Chase checking, savings, and Chase Ink / Sapphire credit card statements into Excel workbooks, accurately mapping Chase\'s transaction tables into clean rows.'
      },
      {
        heading: 'Categorized Expense Audits & Schedule C Tax Filing',
        desc: 'Self-employed contractors and business owners extract itemized Chase expenses to classify deductible business expenses for IRS Schedule C tax filings.'
      },
      {
        heading: 'Loan Application Documentation for Chase Customers',
        desc: 'Applicants preparing financial dossiers convert multi-month Chase PDF statements into clean spreadsheets for loan officers.'
      }
    ],
    tableRows: [
      ['Chase Table Mapping', 'Parsed sections: Deposits, Withdrawals, Checks Paid, and Fees', 'Generic parser splitting Chase summary boxes'],
      ['Date Formatting', 'Normalizes Chase MM/DD format with automatic statement year binding', 'Leaves dates as ambiguous text strings'],
      ['Confidentiality', 'Account numbers and transaction history remain strictly local in browser', 'Transmitted to third-party conversion servers'],
      ['Output Standards', 'Native .xlsx with formatted dates and currency columns', 'Unformatted text output'],
      ['Execution Speed', '< 2 seconds local execution for multi-month Chase statements', 'Cloud queue and upload delay']
    ],
    pitfalls: [
      {
        title: 'Chase Year-Boundary Transaction Date Binding',
        text: 'Chase statements print transaction dates in MM/DD format without the year on individual rows, showing the statement year only on the header cover. Statements spanning December into January require smart year binding to prevent January transactions from being assigned to the previous calendar year.'
      },
      {
        title: 'Handling Chase Separate Deposits and Withdrawals Grids',
        text: 'Chase statements frequently partition deposits and withdrawals into distinct tabular sections on separate pages. Robust extraction requires parsing each section and combining them into a unified chronological register.'
      },
      {
        title: 'Checks Paid Table Layout Variations',
        text: 'Chase checks paid sections often format check numbers, dates, and amounts in a compressed 3-column side-by-side grid. Parsing these requires grid-aware extraction to avoid interleaving check records.'
      }
    ]
  },
  'convert-bank-of-america-statement-to-excel.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Bank of America Business Checking Reconciliation',
        desc: 'Business owners and bookkeepers convert Bank of America statement PDFs into structured Excel sheets, mapping deposits, electronic withdrawals, and service fees into clean accounting rows.'
      },
      {
        heading: 'Corporate Credit Card Expense Auditing',
        desc: 'Finance departments process monthly Bank of America commercial card statements to verify employee travel expenses and identify unauthorized charges.'
      },
      {
        heading: 'Cash Flow Analysis & Working Capital Modeling',
        desc: 'Financial controllers analyze daily balance summaries across Bank of America accounts to project liquidity and cash flow trends.'
      }
    ],
    tableRows: [
      ['BoA Layout Mapping', 'Detects "Deposits and additions" and "Withdrawals and debits"', 'Generic table parser misaligning BoA running balances'],
      ['Currency Cleansing', 'Cleans currency strings, handling commas and negative signs', 'Leaves raw text strings causing formula breaks'],
      ['Confidentiality', 'Confidential financial transactions stay 100% in local memory', 'Uploaded to remote web conversion APIs'],
      ['Running Balance Support', 'Extracts and verifies running balance continuity across transactions', 'Omits balance validation'],
      ['Performance', 'Instant in-memory conversion without software installation', 'Dependent on server availability']
    ],
    pitfalls: [
      {
        title: 'Bank of America Multi-Column Running Balance Alignment',
        text: 'Bank of America statements place running balances in a separate right-hand column. If transaction descriptions wrap onto multiple lines, naive extractors align the running balance with the wrong transaction line. TabKit matches balances by line coordinates.'
      },
      {
        title: 'Service Fee and Interest Payment Section Segregation',
        text: 'BoA statements isolate monthly service fees and earned interest into standalone summary boxes at the end of the statement. Failing to incorporate these summary rows results in reconciliation imbalances.'
      },
      {
        title: 'Multi-Account Combined Statement Separation',
        text: 'Enterprise Bank of America statements often bundle multiple accounts (e.g. Operating Checking and Payroll Checking) into a single PDF. TabKit allows selecting specific account sections.'
      }
    ]
  },
  'convert-wells-fargo-statement-to-excel.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Wells Fargo Commercial & Consumer Statement Reconciliation',
        desc: 'Accounting professionals convert Wells Fargo statement PDFs into Excel workbooks, accurately capturing transaction dates, check numbers, withdrawal amounts, and daily ending balances.'
      },
      {
        heading: 'Mortgage & SBA Loan Application Processing',
        desc: 'Underwriters convert applicant Wells Fargo PDF statements into structured financial datasets for debt-to-income and cash reserve verification.'
      },
      {
        heading: 'Small Business Bookkeeping & Expense Reconciliation',
        desc: 'Entrepreneurs convert Wells Fargo debit and credit card statements for easy import into QuickBooks and spreadsheet templates.'
      }
    ],
    tableRows: [
      ['Wells Fargo Parsing', 'Extracts transaction history, check images tables, and balances', 'Fails on Wells Fargo compressed statement headers'],
      ['Check Number Binding', 'Links check numbers and cleared amounts into clean columns', 'Splits check numbers into separate broken rows'],
      ['Confidentiality', 'Account numbers and sensitive transaction details stay local', 'Transmitted to remote servers with privacy risks'],
      ['Spreadsheet Output', 'Outputs formatted Excel (.xlsx) with auto-fitted columns', 'Raw text output requiring manual cleanup'],
      ['Speed', 'Processes multi-page statements in seconds directly in browser', '15 - 45 second server round-trip latency']
    ],
    pitfalls: [
      {
        title: 'Wells Fargo Check Image Section Interleaving',
        text: 'Wells Fargo statements frequently append thumbnail images of cleared checks at the end of statements. These image sections contain dates and amounts that can confuse generic text parsers, duplicating transactions. TabKit filters out non-tabular image sections.'
      },
      {
        title: 'Daily Ledger Balance vs Transaction Sequence',
        text: 'Wells Fargo statements feature a "Daily Ledger Balance Summary" grid that lists dates and ending balances separately from transaction rows. Failing to distinguish this table can inject balance rows into transaction registers.'
      },
      {
        title: 'Negative Amount Indicators in Wire Transfers',
        text: 'Wells Fargo formats wire transfer fees and international payments with specific debit abbreviations. Accurate parsing requires identifying transaction type markers to ensure correct sign assignment.'
      }
    ]
  },
  'convert-revolut-statement-to-excel.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Revolut Multi-Currency Balance & FX Reconciliation',
        desc: 'International businesses and freelancers convert Revolut Business and Personal statements into Excel, extracting transactions across EUR, GBP, USD, and other currencies with exchange rate data.'
      },
      {
        heading: 'Crypto, Stock & Investment Portfolio Auditing',
        desc: 'Investors convert Revolut crypto and stock trading statement PDFs into spreadsheets for capital gains tax calculations and portfolio tracking.'
      },
      {
        heading: 'Cross-Border Contractor & Freelancer Invoicing Audits',
        desc: 'Remote contractors verify international client payments, FX conversion fees, and transfer times directly in Excel.'
      }
    ],
    tableRows: [
      ['Multi-Currency Handling', 'Preserves distinct currency symbols and FX exchange rates', 'Conflates multiple currencies into a single column'],
      ['Revolut Fee Breakdown', 'Separates raw transaction amounts from Revolut transfer fees', 'Merges fees into gross amount causing discrepancy'],
      ['Confidentiality', 'International financial records remain strictly local in browser', 'Uploaded to third-party conversion servers'],
      ['Date & Time Precision', 'Extracts exact timestamps down to hours and minutes', 'Truncates timestamps to dates only'],
      ['Modern Layout Support', 'Optimized for modern Revolut digital PDF statement designs', 'Fails on Revolut\'s multi-column app export layout']
    ],
    pitfalls: [
      {
        title: 'Multi-Currency Pocket Column Collisions',
        text: 'Revolut statements often list transactions from different currency pockets (EUR, GBP, USD) in a single document. Naively summing amounts without grouping by currency produces meaningless financial totals. TabKit preserves currency codes alongside amounts.'
      },
      {
        title: 'Embedded Currency Exchange (FX) Row Structure',
        text: 'Revolut records currency exchanges as dual-line transactions showing both the sold amount and bought amount. Parsers must link these paired legs to prevent artificial doubling of transaction volumes.'
      },
      {
        title: 'Pending vs Completed Transaction Distinctions',
        text: 'Revolut statements sometimes list pending card pre-authorizations alongside completed transactions. Always verify transaction status flags to avoid recording unsettled authorizations.'
      }
    ]
  },
  'convert-barclays-statement-to-excel.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Barclays UK Business & Personal Account Reconciliation',
        desc: 'UK business owners, bookkeepers, and accountants convert Barclays current and savings account statement PDFs into Excel workbooks for HMRC tax filings and Making Tax Digital (MTD) compliance.'
      },
      {
        heading: 'UK Mortgage & Visa Financial Documentation',
        desc: 'Applicants preparing documents for UK mortgage lenders or Home Office visa applications convert Barclays PDF statements into clean spreadsheets for income verification.'
      },
      {
        heading: 'Barclaycard Credit Card Expense Tracking',
        desc: 'Finance teams process monthly Barclaycard statements to itemize employee corporate card expenditures and reclaim VAT on eligible expenses.'
      }
    ],
    tableRows: [
      ['Barclays Table Support', 'Extracts Payments Out, Payments In, and Balance columns', 'Generic parsers confusing Payments In and Out columns'],
      ['UK Date Conventions', 'Strict handling of British DD/MM/YYYY date formatting', 'Inverts day and month treating dates as US MM/DD'],
      ['Confidentiality', 'Sort codes and account numbers stay 100% in local memory', 'Uploaded to third-party web conversion servers'],
      ['Format Standards', 'Outputs native .xlsx with British currency (£ GBP) formatting', 'Plain text output without formatting'],
      ['Speed', 'Processes multi-page Barclays statements in seconds', 'Server upload latency and processing queues']
    ],
    pitfalls: [
      {
        title: 'British DD/MM/YYYY vs US MM/DD/YYYY Date Inversion',
        text: 'Barclays statements format dates according to UK conventions (DD/MM/YYYY). A transaction on 05/06/2023 represents June 5 in the UK, but US-based software interprets it as May 6. TabKit enforces British date parsing for Barclays statements.'
      },
      {
        title: 'Barclays Sort Code (00-00-00) Formatting',
        text: 'Barclays statements feature UK 6-digit sort codes formatted with hyphens. Excel can misinterpret hyphenated sort codes as mathematical subtractions or dates unless formatted explicitly as text strings.'
      },
      {
        title: 'Handling Split "Payments In" and "Payments Out" Columns',
        text: 'Barclays uses separate "Payments Out" and "Payments In" columns rather than signed amounts. TabKit converts these into signed amounts (negative for Payments Out, positive for Payments In) for easy summation.'
      }
    ]
  },
  'pdf-splitter.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Large Legal & M&A Document Disaggregation',
        desc: 'Legal counsel and transaction teams extract specific exhibits, disclosure schedules, or signature pages from massive 500-page scanned court filings, annual reports, and closing binders.'
      },
      {
        heading: 'Sensitive Section Extraction & Privacy Redaction',
        desc: 'Extracting only relevant pages from multi-year tax returns or closing packages before sharing with third-party vendors prevents inadvertent exposure of private financial schedules.'
      },
      {
        heading: 'Email Attachment Size Budget Compliance',
        desc: 'Splitting multi-megabyte PDF binders into smaller page ranges enables compliance with strict 10MB or 25MB corporate email server attachment limits.'
      }
    ],
    tableRows: [
      ['Splitting Engine', 'Client-side pdf-lib WebAssembly/JavaScript stream editor', 'Server-side Ghostscript or Poppler utilities'],
      ['Range Customization', 'Custom ranges (1-5, 8, 11-14), split every N pages, or burst all', 'Rigid single-page burst only'],
      ['File Confidentiality', 'Proprietary legal and medical records never leave browser memory', 'Uploaded across public network to third-party servers'],
      ['Visual Quality', '100% lossless extraction preserving vector paths and fonts', 'Re-compresses pages causing visual degradation'],
      ['Execution Speed', 'Sub-second extraction (< 500ms) directly in client memory', 'Network upload + remote queue + download time']
    ],
    pitfalls: [
      {
        title: 'Corrupted Cross-Reference (XRef) Tables in Malformed PDFs',
        text: 'PDFs with malformed trailer dictionaries or broken xref tables fail to split in standard viewers. TabKit repairs xref tables during parsing to ensure clean page extraction.'
      },
      {
        title: 'Orphaned Document Outlines and Bookmarks',
        text: 'When extracting a sub-range of pages, document bookmarks pointing to removed pages become orphaned unless the outline tree is pruned. TabKit cleans outline references to ensure extracted files open without errors.'
      },
      {
        title: 'Shared Resource Dictionary Bloat in Extracted Files',
        text: 'In naive splitters, each extracted single-page PDF retains the entire embedded font dictionary of the original 500-page document. TabKit prunes unused fonts and resources to keep extracted file sizes minimal.'
      }
    ]
  },
  'pdf-merger.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Legal & Corporate Transaction Binder Compilation',
        desc: 'Attorneys and paralegals merge contracts, disclosure schedules, corporate resolutions, and scanned signature pages into unified PDF closing binders.'
      },
      {
        heading: 'Job Application Dossier Assembly',
        desc: 'Job seekers combine cover letters, resumes, design portfolios, transcripts, and recommendation letters into a single professional submission file.'
      },
      {
        heading: 'Multi-Department Executive Board Packets',
        desc: 'Executive assistants consolidate monthly financial reports, marketing decks, and operations summaries from different departments into a cohesive board packet.'
      }
    ],
    tableRows: [
      ['Merging Engine', 'High-performance client-side pdf-lib stream merger', 'Server-side cloud conversion queue'],
      ['Page Reordering', 'Interactive drag-and-drop file and page thumbnail reordering', 'Blind merge following alphabetical filenames'],
      ['Confidentiality', 'Executive board packets and financial reports remain local', 'Uploaded to third-party servers with retention risk'],
      ['Quality Preservation', 'Retains original vector shapes, embedded text, and color profiles', 'Re-rasterizes documents into blurry bitmaps'],
      ['Execution Speed', 'Instant client-side assembly in browser memory', 'Upload and download round-trip latency']
    ],
    pitfalls: [
      {
        title: 'Heterogeneous Page Geometry and Orientation Inconsistencies',
        text: 'Merging portrait letter documents with landscape spreadsheet schedules requires preserving individual page media boxes (/MediaBox) rather than forcing a uniform page size across the entire merged file.'
      },
      {
        title: 'AcroForm Interactive Form Field Name Collisions',
        text: 'When merging two PDF forms that both contain fields with identical names (such as "Signature" or "Date"), standard PDF viewers link the fields, causing changes in one field to overwrite the other. TabKit namespaces form fields.'
      },
      {
        title: 'Duplicate Embedded Font Table Ballooning',
        text: 'Merging multiple documents generated by the same tool can duplicate identical embedded fonts unless font dictionaries are deduplicated, unnecessarily inflating file size.'
      }
    ]
  },
  'pdf-rotator.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Batch Scanned Document ADF Feed Correction',
        desc: 'Office administrators correct upside-down or sideways pages resulting from inverted feeds in automatic document feeder (ADF) scanners.'
      },
      {
        heading: 'Mixed Orientation Document Standardization',
        desc: 'Reorienting landscape financial spreadsheets and architectural diagrams within an otherwise portrait business proposal ensures comfortable reading.'
      },
      {
        heading: 'Smartphone Document Scan Orientation Repair',
        desc: 'Smartphone document scanner apps frequently record incorrect orientation tags. Rotating pages permanently ensures consistent display across all PDF viewers.'
      }
    ],
    tableRows: [
      ['Rotation Angles', '90° Clockwise, 180° Inversion, 270° Counter-Clockwise', 'Fixed 90° clockwise only'],
      ['Modification Mode', 'Modifies /Rotate dictionary entry without re-encoding page pixels', 'Re-compresses page pixels causing loss of quality'],
      ['Confidentiality', 'Proprietary legal and corporate files remain 100% in local memory', 'Uploaded to remote web servers'],
      ['Page Granularity', 'Rotate all pages simultaneously or select individual page targets', 'All-or-nothing whole document rotation'],
      ['Lossless Guarantee', '100% lossless vector and text preservation', 'Lossy re-encoding degrading text crispness']
    ],
    pitfalls: [
      {
        title: 'Viewer-Level Rotation vs Permanent PDF Dictionary Updates',
        text: 'Some basic PDF viewers apply temporary rotation in the viewport without updating the PDF object catalog\'s /Rotate attribute. When the file is emailed to a client, it opens in its original sideways orientation. TabKit writes permanent dictionary updates.'
      },
      {
        title: 'MediaBox and CropBox Coordinate Asymmetries',
        text: 'PDFs specify /MediaBox (physical page dimensions) and /CropBox (visible region). Rotating page dimensions without properly transforming the bounding box coordinates can cause page content to be clipped in print outputs.'
      },
      {
        title: 'Annotation and Signature Coordinate Drift',
        text: 'Form fields, digital signatures, and comments have explicit bounding coordinates. Rotating page dimensions requires transforming annotation coordinates to prevent signatures from floating off into margins.'
      }
    ]
  },
  'images-to-pdf.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Expense Receipt & Invoice Reimbursement Packaging',
        desc: 'Business travelers convert smartphone photos of receipts, taxi vouchers, and hotel folios into a single organized PDF document for corporate expense reporting systems.'
      },
      {
        heading: 'Design Portfolio & Visual Case Study Delivery',
        desc: 'Designers and photographers convert high-resolution graphic renders and architectural plans into standardized PDF presentations for client review.'
      },
      {
        heading: 'Historical Paper Document Archive Digitization',
        desc: 'Archivists and paralegals assemble photographic scans of historical records, deed books, and paper contracts into clean, searchable PDF files.'
      }
    ],
    tableRows: [
      ['Input Formats', 'PNG, JPEG, WebP, GIF, and BMP raster formats', 'JPEG only'],
      ['Page Geometry', 'Auto-fit to standard page sizes (US Letter, A4) or fit to image aspect ratio', 'Forces square or distorted page sizes'],
      ['Margin Controls', 'Configurable margin padding (None, Small, Normal)', 'Fixed margins that crop image edges'],
      ['Confidentiality', 'Personal identification photos and receipts never leave browser memory', 'Uploaded to remote cloud conversion servers'],
      ['Compression Tuning', 'Adjustable JPEG compression quality to manage file size budgets', 'No compression control leading to 50MB+ files']
    ],
    pitfalls: [
      {
        title: 'Smartphone High-Megapixel File Size Explosion',
        text: 'Converting multiple 12MP or 48MP smartphone photos directly into a PDF can create a massive 80MB document that exceeds corporate email attachment limits. TabKit provides intelligent compression options to maintain readability while keeping file size under 10MB.'
      },
      {
        title: 'Non-Uniform Aspect Ratio Stretching and Distortion',
        text: 'Forcing smartphone photos (4:3 or 16:9) to stretch across fixed A4 dimensions without letterboxing distorts imagery. TabKit centers and scales images proportionally within page boundaries.'
      },
      {
        title: 'CMYK JPEG Color Inversion Artifacts',
        text: 'Photographs exported in print CMYK color mode can render as inverted negatives in web canvas renderers. TabKit normalizes color spaces into standard sRGB before PDF compilation.'
      }
    ]
  },
  'pdf-watermarker.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Confidentiality & Embargo Enforcement',
        desc: 'Investment bankers and corporate executives apply prominent diagonal "CONFIDENTIAL", "DRAFT", or "DO NOT DISTRIBUTE" watermarks across unannounced pitch decks and financial forecasts.'
      },
      {
        heading: 'Intellectual Property & Copyright Stamping',
        desc: 'Photographers, architects, and publishers embed ownership identifiers and copyright notices across preview documents before public client distribution.'
      },
      {
        heading: 'Authorized Recipient Leak Tracing',
        desc: 'Stamping recipient names or email addresses ("Prepared for Jane Doe") across distributed materials creates accountability and deters unauthorized leaks.'
      }
    ],
    tableRows: [
      ['Placement Styles', 'Diagonal Center, Header Banner, or Footer Stamp', 'Fixed diagonal center only'],
      ['Visual Customization', 'Adjustable opacity (5% - 80%), font size, rotation angle, and color', 'Rigid black/gray text with fixed opacity'],
      ['Layering Position', 'Over Content (Foreground) or Under Content (Background)', 'Always placed behind content; obscured by white pages'],
      ['Confidentiality', 'Proprietary trade secrets remain 100% in local browser memory', 'Uploaded to third-party web servers'],
      ['Document Integrity', 'Preserves original vector text and interactive form fields intact', 'Flattens documents into low-resolution raster images']
    ],
    pitfalls: [
      {
        title: 'Excessive Opacity Obscuring Underlying Text',
        text: 'Setting watermark opacity too high (above 40%) renders underlying body text illegible when printed or read on low-brightness displays. Ideal watermarks use 15% to 25% opacity with high-contrast neutral colors.'
      },
      {
        title: 'Background Watermarks Hidden by Opaque Page Fills',
        text: 'Many PDFs feature solid white vector rectangles as page backgrounds. Placing a watermark behind page content renders it completely invisible beneath the opaque white fill. Stamping over content with transparency ensures visibility.'
      },
      {
        title: 'Easily Stripped Vector Watermark Objects',
        text: 'Vector text watermarks added as distinct PDF content stream objects can be selected and deleted by users with basic PDF editing tools. For non-repudiable protection, flatten pages.'
      }
    ]
  },
  'pdf-metadata-editor.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Document Title & Search Engine Optimization Normalization',
        desc: 'Content managers update internal PDF Title, Author, Subject, and Keywords attributes so search engines and browser tabs display professional document names rather than internal file paths (e.g. Doc_v2_final_final.pdf).'
      },
      {
        heading: 'Corporate Privacy Sanitization & Author Anonymization',
        desc: 'Legal and compliance teams strip internal author usernames, local workstation file paths, and software build versions from PDF metadata before distributing documents publicly.'
      },
      {
        heading: 'Academic & Regulatory Repository Cataloging',
        desc: 'Librarians and researchers embed standardized Dublin Core metadata required by academic archives and open-access repositories.'
      }
    ],
    tableRows: [
      ['Editable Fields', 'Title, Author, Subject, Keywords, Creator, and Producer', 'Title and Author only'],
      ['Metadata Standards', 'Synchronizes classic /Info dictionary and XML-based XMP metadata', 'Edits /Info only, leaving stale XMP metadata'],
      ['Confidentiality', 'Confidential file paths and author names stripped locally in RAM', 'Transmitted to remote server with logging risks'],
      ['Lossless Modification', 'Modifies metadata streams without re-compressing page pixels', 'Re-compresses pages degrading visual fidelity'],
      ['Execution Speed', 'Sub-second metadata updating directly in browser memory', '150ms - 400ms server network latency']
    ],
    pitfalls: [
      {
        title: 'The Dual Metadata Dilemma (/Info vs XMP Streams)',
        text: 'Modern PDFs contain both a legacy /Info object dictionary and an XML-based Extensible Metadata Platform (XMP) stream. Editing /Info while leaving XMP untouched causes search engines and modern PDF readers to display conflicting metadata. TabKit synchronizes both metadata models.'
      },
      {
        title: 'Leaking Internal Workstation Paths in Producer Strings',
        text: 'PDF creation engines (like Word or InDesign) frequently embed host machine file paths (e.g. C:\\Users\\jsmith\\Projects\\...) in metadata, inadvertently exposing internal network naming conventions.'
      },
      {
        title: 'Invalidating Cryptographic Digital Signatures',
        text: 'Modifying any byte in a cryptographically signed PDF—even non-visual metadata—breaks the cryptographic document hash and invalidates digital signatures. Always edit metadata before applying signatures.'
      }
    ]
  },
  'pdf-page-numberer.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Legal Brief & Court Filing Bates Numbering',
        desc: 'Paralegals and litigation attorneys apply standardized sequential Bates numbering (e.g. BATES-000100) across legal exhibits to comply with judicial filing standards.'
      },
      {
        heading: 'Academic Thesis & Dissertation Pagination Compliance',
        desc: 'Graduate students format thesis documents with custom page numbers, skipping cover pages and beginning Arabic numbering on introductory chapters.'
      },
      {
        heading: 'Multi-Document Merged Binder Renumbering',
        desc: 'Renumbering combined packets of disparate documents ensures the complete assembled binder shares consistent, continuous page numbering.'
      }
    ],
    tableRows: [
      ['Numbering Styles', 'Arabic (1, 2, 3), Page X of Y, and Custom Bates Prefix (EXHIBIT-001)', 'Basic 1, 2, 3 numbers only'],
      ['Positioning', 'Top Left/Center/Right and Bottom Left/Center/Right with margin offsets', 'Fixed bottom center only'],
      ['First Page Suppression', 'Toggle to skip cover/title pages and start numbering on page 2', 'Forces numbering on cover page'],
      ['Confidentiality', 'Proprietary legal filings remain 100% in local browser memory', 'Uploaded to third-party web servers'],
      ['Font Customization', 'Configurable font family, size, color, and margin offset', 'Rigid unchangeable font settings']
    ],
    pitfalls: [
      {
        title: 'Page Number Collisions with Existing Document Content',
        text: 'Stamping page numbers too close to the page margin can cause numbers to overlap existing footer text or charts. TabKit provides adjustable margin padding controls to ensure clean placement.'
      },
      {
        title: 'Unwanted Page Numbering on Title and Cover Pages',
        text: 'Displaying "Page 1" on an executive proposal cover page looks unprofessional. TabKit includes a toggle to suppress numbering on the first page while maintaining accurate overall page counts.'
      },
      {
        title: 'Font Embedding Failures Causing Glyph Scrambling',
        text: 'Stamping text without embedding standard font metrics can cause page numbers to render with fallback fonts on systems lacking specific fonts. TabKit embeds standard PDF font subsets.'
      }
    ]
  },
  'pdf-text-extractor.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Automated Document Ingestion & NLP Data Pipelines',
        desc: 'Machine learning engineers extract raw text from contracts, financial reports, and whitepapers for natural language processing, vector embedding generation, and semantic search indexing.'
      },
      {
        heading: 'Accessibility & Screen-Reader Processing',
        desc: 'Converting visual PDF documents into structured text enables screen readers and text-to-speech assistive tools to read documents aloud to visually impaired users.'
      },
      {
        heading: 'Content Recovery from Orphaned PDF Files',
        desc: 'Recovering textual content from legacy PDF archives whose original word processor files were lost allows teams to update documentation without re-typing text.'
      }
    ],
    tableRows: [
      ['Extraction Pipeline', 'Client-side PDF.js text matrix parser with spatial bounding box heuristics', 'Server-side command-line pdftotext tool'],
      ['Layout Reconstruction', 'Preserves paragraph breaks, reading order, and column hierarchies', 'Interleaves columns into unreadable text'],
      ['Confidentiality', 'Sensitive contracts and proprietary research stay in local RAM', 'Uploaded across public network to third-party servers'],
      ['Output Options', 'Copy to clipboard, download formatted plain text (.txt), or export JSON', 'Plain text download only'],
      ['Execution Speed', 'Sub-second extraction for 100+ page documents in browser memory', '150ms - 600ms network round-trip latency']
    ],
    pitfalls: [
      {
        title: 'Multi-Column Reading Order Scrambling',
        text: 'PDFs store text as positioned graphic glyphs rather than linear paragraphs. Naive extractors read across the page horizontally, interleaving sentences from column 1 and column 2 into gibberish. TabKit\'s spatial bounding box algorithm reconstructs column reading order.'
      },
      {
        title: 'Scanned Bitmap PDFs Lacking Digital Text Layers',
        text: 'If a PDF was generated by scanning paper without an Optical Character Recognition (OCR) step, the document contains only flat bitmap images. Text extraction on these files yields zero characters. Verify your PDF has selectable text.'
      },
      {
        title: 'Missing ToUnicode CMaps Causing Font Scrambling',
        text: 'Some PDFs use custom font encodings without providing a ToUnicode mapping table. Extracting text from these files produces scrambled characters or unreadable symbols. TabKit decodes standard font encodings.'
      }
    ]
  },
  'pdf-to-images.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Interactive Document Preview & Thumbnail Generation',
        desc: 'Web developers and SaaS platforms convert PDF pages into high-resolution PNG or JPEG images to display interactive document previews inside web applications without requiring PDF viewer plugins.'
      },
      {
        heading: 'Slide Deck & Social Media Carousel Publishing',
        desc: 'Marketers convert PDF slide decks into crisp raster images for sharing in LinkedIn document carousels, Twitter image threads, and marketing presentations.'
      },
      {
        heading: 'Universal Compatibility for Legacy Digital Displays',
        desc: 'Rendering PDF pages into standalone image files allows content to be displayed on digital signage, mobile devices, and kiosks lacking native PDF rendering engines.'
      }
    ],
    tableRows: [
      ['Resolution Quality', 'Configurable rendering resolution up to 300 DPI for print clarity', 'Fixed low-resolution 72 DPI screen rendering'],
      ['Output Formats', 'Lossless PNG, compressed JPEG, and modern WebP formats', 'JPEG format only'],
      ['Batch Export', 'Download all pages as a zip archive or export individual pages', 'Single page export only'],
      ['Confidentiality', 'Proprietary presentations and contracts never leave browser memory', 'Uploaded to remote web conversion servers'],
      ['Execution Speed', 'Hardware-accelerated client-side canvas rendering', 'Server queue delay and network download time']
    ],
    pitfalls: [
      {
        title: 'Low Default 72 DPI Resolution Causing Text Blurriness',
        text: 'Rendering PDF pages at standard 72 DPI screen resolution causes small body text (8pt to 10pt) to appear blurry and pixelated when viewed on high-density Retina displays. TabKit renders at 2x and 3x scale factors (150 to 300 DPI) for crisp text.'
      },
      {
        title: 'Browser Memory Exhaustion on Massive Document Batches',
        text: 'Attempting to render hundreds of PDF pages simultaneously into full-resolution canvas buffers can exceed browser memory limits. TabKit renders, compresses, and zips pages sequentially to maintain smooth performance.'
      },
      {
        title: 'Flattening Interactive Hyperlinks and Text Selection',
        text: 'Converting PDF pages to raster images permanently flattens selectable text, hyperlinks, and form fields into static pixels. Keep original PDF files alongside image previews.'
      }
    ]
  },
  'pdf-password-protect.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Confidential Financial & HR Record Encryption',
        desc: 'HR managers and payroll officers encrypt employee W-2 tax forms, compensation reviews, and healthcare records before sending via email or cloud file sharing.'
      },
      {
        heading: 'Intellectual Property & Permission Restriction',
        desc: 'Publishers and researchers set owner passwords to restrict printing, content copying, and page extraction while allowing authorized users to view documents.'
      },
      {
        heading: 'Regulatory Data Protection Compliance (HIPAA, GDPR)',
        desc: 'Organizations processing sensitive personal health information (PHI) apply cryptographic encryption to documents in transit to maintain compliance with data privacy regulations.'
      }
    ],
    tableRows: [
      ['Encryption Standard', 'AES-128 and AES-256 standard PDF cryptographic encryption', 'Legacy RC4 encryption vulnerable to cracking'],
      ['Password Controls', 'User Password (required to open) and Owner Password (permissions)', 'Single password without permission controls'],
      ['Permission Granularity', 'Restrict printing, text copying, annotation editing, and assembly', 'All-or-nothing protection'],
      ['Confidentiality', 'Unencrypted source documents and passwords never leave browser memory', 'Uploaded unencrypted to remote cloud servers'],
      ['Security Guarantee', 'Industry-standard cryptographic cipher implementation', 'Simulated password protection easily bypassed']
    ],
    pitfalls: [
      {
        title: 'Weak Passwords Vulnerable to Dictionary Brute-Force Attacks',
        text: 'AES-256 encryption is mathematically unbreakable, but using a short or common password allows automated cracking tools (such as Hashcat) to recover the key in minutes. Always use high-entropy passwords (16+ characters).'
      },
      {
        title: 'Owner Password Enforcement Discrepancies in Third-Party Viewers',
        text: 'Owner passwords restricting printing or copying are enforced on an honor system by PDF viewers. Non-compliant open-source viewers can ignore owner restriction flags unless an open password is also configured.'
      },
      {
        title: 'Permanent Irrecoverability of Lost Passwords',
        text: 'Standard PDF AES encryption utilizes mathematical trapdoor functions without backdoors. If you forget or lose the open password, the document contents become permanently unrecoverable.'
      }
    ]
  },
  'pdf-sign-stamp.html': {
    title: 'Enterprise Technical Architecture & Deep Dive',
    useCases: [
      {
        heading: 'Electronic Signature & Commercial Contract Execution',
        desc: 'Consultants, freelancers, and small business owners sign service agreements, NDAs, lease agreements, and purchase orders directly in browser memory without subscription fees.'
      },
      {
        heading: 'Verification & Quality Approval Stamping',
        desc: 'Quality control managers and project leads apply dated approval stamps ("APPROVED", "REVIEWED", "PAID") across engineering drawings and vendor invoices.'
      },
      {
        heading: 'Touchscreen & Tablet Document Signing',
        desc: 'Professionals sign documents on iPads, tablets, or touchscreen laptops using styluses or finger drawing with customizable pen colors and stroke widths.'
      }
    ],
    tableRows: [
      ['Signing Methods', 'Draw signature, type with script fonts, or upload signature image', 'Draw signature only with crude line quality'],
      ['Visual Placement', 'Interactive drag-and-drop positioning with live resize handles', 'Fixed position stamping without resizing'],
      ['Confidentiality', 'High-value personal signatures and legal documents stay in local RAM', 'Signatures and documents uploaded to cloud databases'],
      ['Vector Smoothing', 'Bicubic Bezier curve smoothing preventing jagged pixelated strokes', 'Crude blocky pixelated line rendering'],
      ['Output Quality', 'High-resolution PDF export preserving underlying document text', 'Flattens document into low-resolution raster images']
    ],
    pitfalls: [
      {
        title: 'Electronic Signatures vs Cryptographic Digital Signatures',
        text: 'Drawing an electronic signature onto a PDF constitutes an Electronic Signature (e-signature). It does NOT apply a cryptographic PKI certificate (Digital Signature). Verify legal requirements in your jurisdiction.'
      },
      {
        title: 'Opaque Background Blocks Obscuring Contract Text',
        text: 'Uploading a signature photo taken with a smartphone often includes an off-white background paper tone. Stamping an opaque photo covers contract terms beneath it. TabKit provides background transparency tools.'
      },
      {
        title: 'Preserving Interactive Form Fields During Stamping',
        text: 'Stamping a signature onto a PDF form can cause certain rendering engines to inadvertently flatten or clear active form fields. TabKit preserves form field data.'
      }
    ]
  }
};

function generateHtml(data) {
  let html = `\n      <!-- Enterprise Technical Architecture & Deep Dive -->
      <div data-enriched="true" class="border-t border-workspace-border pt-10 space-y-8">
        <div>
          <h2 class="text-xl font-bold text-white mb-3">${data.title}</h2>
          <p class="text-sm text-workspace-muted leading-relaxed">
            Engineered for high-throughput production environments, enterprise developer workflows, and compliance-sensitive operations. Below is an exhaustive technical reference covering architecture, execution parameters, and edge-case behaviors.
          </p>
        </div>

        <!-- Production Use Cases -->
        <div>
          <h3 class="text-base font-bold text-white mb-4">Enterprise & Production Use Cases</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
`;

  data.useCases.forEach(uc => {
    html += `            <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/50 flex flex-col justify-between">
              <h4 class="text-sm font-bold text-workspace-text mb-2">${uc.heading}</h4>
              <p class="text-xs text-workspace-muted leading-relaxed">${uc.desc}</p>
            </div>\n`;
  });

  html += `          </div>
        </div>

        <!-- Technical Architecture Comparison -->
        <div>
          <h3 class="text-base font-bold text-white mb-3">Architectural Comparison: Client-Side Engine vs Cloud Processing</h3>
          <div class="overflow-x-auto my-4">
            <table class="w-full text-left text-xs font-mono border border-workspace-border rounded-xl overflow-hidden">
              <thead class="bg-workspace-surface border-b border-workspace-border text-workspace-text">
                <tr>
                  <th class="p-3">Evaluation Parameter</th>
                  <th class="p-3 text-workspace-accent">TabKit In-Browser Engine</th>
                  <th class="p-3 text-workspace-muted">Traditional Cloud Service</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-workspace-border text-workspace-muted">
`;

  data.tableRows.forEach(row => {
    html += `                <tr>
                  <td class="p-3 font-semibold text-workspace-text">${row[0]}</td>
                  <td class="p-3 text-workspace-accent font-medium">${row[1]}</td>
                  <td class="p-3">${row[2]}</td>
                </tr>\n`;
  });

  html += `              </tbody>
            </table>
          </div>
        </div>

        <!-- Pitfalls & Troubleshooting -->
        <div>
          <h3 class="text-base font-bold text-white mb-3">Common Pitfalls & Engineering Troubleshooting</h3>
          <div class="space-y-3">
`;

  data.pitfalls.forEach(pf => {
    html += `            <div class="p-4 rounded-xl border border-workspace-border bg-workspace-surface/40">
              <h4 class="text-sm font-semibold text-workspace-text mb-1">${pf.title}</h4>
              <p class="text-xs text-workspace-muted leading-relaxed">${pf.text}</p>
            </div>\n`;
  });

  html += `          </div>
        </div>
      </div>\n`;

  return html;
}

function processFiles() {
  console.log('Enriching Category 6: Documents & PDF (17 tools)...');
  for (const [file, data] of Object.entries(category6Data)) {
    if (!fs.existsSync(file)) {
      console.warn('File not found:', file);
      continue;
    }

    let content = fs.readFileSync(file, 'utf8');

    // If already enriched, remove previous enrichment block first
    if (content.includes('data-enriched="true"')) {
      content = content.replace(/<!-- Enterprise Technical Architecture & Deep Dive -->[\s\S]*?<\/table>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
      content = content.replace(/<div data-enriched="true"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
    }

    const generated = generateHtml(data);

    // Insertion target: Before Related Tools, or before </article>
    if (content.includes('<!-- Related Tools -->')) {
      content = content.replace('<!-- Related Tools -->', `${generated}\n      <!-- Related Tools -->`);
    } else if (content.includes('<div class="border-t border-workspace-border pt-8">')) {
      content = content.replace('<div class="border-t border-workspace-border pt-8">', `${generated}\n      <div class="border-t border-workspace-border pt-8">`);
    } else {
      content = content.replace('</article>', `${generated}\n    </article>`);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Enriched ${file}`);
  }
}

processFiles();
