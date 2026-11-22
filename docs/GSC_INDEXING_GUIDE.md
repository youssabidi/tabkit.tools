# Google Search Console (GSC) Priority Indexing & Submission Guide

> **Platform:** TabKit Tools ([https://tabkit.tools](https://tabkit.tools))  
> **Sitemap:** [https://tabkit.tools/sitemap.xml](https://tabkit.tools/sitemap.xml)  
> **Status:** Live & Production Ready (v25)

---

## 1. Primary Sitemap Submission

1. Log into [Google Search Console](https://search.google.com/search-console).
2. Select the property: `https://tabkit.tools/` (or domain property `tabkit.tools`).
3. In the left navigation menu, navigate to **Indexing** &rarr; **Sitemaps**.
4. In the **Add a new sitemap** input field, enter:
   ```text
   sitemap.xml
   ```
5. Click **Submit**.
6. Verify status shows **"Success"** and shows 68 discovered canonical URLs.

---

## 2. Priority URL Inspection & Manual Indexing

Google Search Console limits manual indexing requests (typically 10–20 per day). Prioritize these 15 high-volume, competitive search target pages in order:

### Priority Queue

| Priority | Canonical URL | Primary Intent / Search Keyword |
| :---: | :--- | :--- |
| **01** | `https://tabkit.tools/` | Core workbench, multi-tool PWA |
| **02** | `https://tabkit.tools/cron-expression-generator` | "cron generator", "cron schedule builder", "crontab guru alternative" |
| **03** | `https://tabkit.tools/chmod-calculator` | "chmod calculator", "linux permissions visualizer" |
| **04** | `https://tabkit.tools/bank-statement-to-excel` | "bank statement to excel", "pdf statement converter" |
| **05** | `https://tabkit.tools/invoice-generator` | "free invoice generator", "client-side invoice maker" |
| **06** | `https://tabkit.tools/curl-converter` | "curl to fetch", "curl to python converter" |
| **07** | `https://tabkit.tools/json-to-typescript` | "json to typescript", "json to zod schema" |
| **08** | `https://tabkit.tools/pdf-merger` | "merge pdf client side", "private pdf merger" |
| **09** | `https://tabkit.tools/pdf-splitter` | "split pdf online free", "extract pdf pages" |
| **10** | `https://tabkit.tools/password-strength` | "password entropy checker", "password strength meter" |
| **11** | `https://tabkit.tools/regex-tester` | "regex tester visual", "regular expression validator" |
| **12** | `https://tabkit.tools/unix-timestamp-converter` | "unix epoch converter", "timestamp to date" |
| **13** | `https://tabkit.tools/sql-formatter` | "format sql online", "prettify sql query" |
| **14** | `https://tabkit.tools/secure-password-generator` | "random password generator offline", "secure password maker" |
| **15** | `https://tabkit.tools/excel-formula-builder` | "excel formula builder", "spreadsheet formula assistant" |

### Execution Workflow (Per URL)

1. Paste the target URL into the top search bar (**"Inspect any URL in..."**).
2. Press `Enter` to run the live index check.
3. If the page is not indexed or recently modified, click **"TEST LIVE URL"** to confirm HTTP 200, valid Schema.org structured data, and mobile usability.
4. Click **"REQUEST INDEXING"**.
5. Repeat for the 15 URLs listed above.

---

## 3. Critical Indexation Rules & Caveats

> [!WARNING]
> **DO NOT manually request indexing for Bank Statement Alias Pages:**
> - `https://tabkit.tools/convert-chase-statement-to-excel`
> - `https://tabkit.tools/convert-bank-of-america-statement-to-excel`
> - `https://tabkit.tools/convert-wells-fargo-statement-to-excel`
> - `https://tabkit.tools/convert-citibank-statement-to-excel`
> - `https://tabkit.tools/convert-capital-one-statement-to-excel`
> 
> These pages intentionally serve `<meta name="robots" content="noindex, follow" />` and canonicalize to `https://tabkit.tools/bank-statement-to-excel` to prevent search engine keyword cannibalization. Submitting them to GSC will trigger false "Submitted URL marked 'noindex'" warnings.

---

## 4. Post-Submission Monitoring Checklist

- [ ] **Day 3:** Check GSC **Pages** report for newly discovered and crawled pages.
- [ ] **Day 7:** Verify all 15 priority URLs show **"URL is on Google"** with valid rich results (SoftwareApplication, HowTo, FAQ).
- [ ] **Day 14:** Review **Performance** report for impressions and clicks across high-intent queries (e.g., cron, chmod, bank statement, pdf).
