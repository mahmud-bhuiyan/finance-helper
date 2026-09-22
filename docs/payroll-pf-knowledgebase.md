# Payroll & Provident Fund Knowledge Base

> Company context: 100+ person software company in Bangladesh.  
> Last updated: 2026-09-22  
> Status: Discovery complete — only salary breakdown % and fiscal year months need accountant confirmation.

---

## Overview

| Topic | Current state |
|---|---|
| Country | Bangladesh |
| Payroll frequency | Monthly |
| Tools | Excel (no dedicated HR/payroll software) |
| PF bank | Bank Asia — FDR account |
| Main pain points | Joiners/leavers mid-year; yearly PF totals; exit settlement; interest allocation |

---

## Employee eligibility

| Employee type | PF applicable? | Notes |
|---|---|---|
| Permanent | Yes | 7% deducted from salary; employer contributes 7% |
| Intern | No | No PF deduction |
| Contract | No | No PF deduction |

**Tenure rules (PF settlement):**

- **Before 3 years of PF service:** employee receives only their own **7% contributions** (total accumulated). No employer 7%, no bank profit share.
- **After 3 years of PF service (permanent):** employee receives **employee 7% + employer 7% + share of bank profit** on exit.
- **3-year tenure counted from:** PF start date (after probation) → last working day — **not** from company join date.
- Profit / extra amount is settled **when the employee leaves**, not paid out during employment.

**Gratuity (separate from PF):**

- Applies after **5 years** of service (Bangladesh labor law context).
- **Formula:** `Last basic salary × Completed years of service`
- Example: basic 21,600, 5 years → 21,600 × 5 = **108,000 BDT**
- **Paid on:** resignation, termination, and retirement — same formula in all cases.
- Calculated in a **separate Excel file** (not same as salary/PF).

---

## Salary structure

| Item | Rule |
|---|---|
| PF calculation base | **Basic salary only** (not gross) |
| Basic split | **Always 60% of gross** for all employees |
| Gross components | See breakdown below — **provisional split, update when confirmed with accountant** |

### Gross salary breakdown (provisional)

| Component | % of gross | Example (36,000 gross) |
|---|---|---|
| Basic | 60% | 21,600 |
| House rent | 25% | 9,000 |
| Medical | 10% | 3,600 |
| Conveyance | 5% | 1,800 |
| **Total** | **100%** | **36,000** |

> PF is calculated on **basic only** (60% of gross).
| Tax (TDS) | Handled in same Excel; minimal deduction at source; employees use company tax receipts in personal return |
| Festival bonus | Same Excel. 2 Eid bonuses/year = **50% of basic** each; 1 festival = **100% of basic** |

### Example calculation

```
Gross salary     = 36,000 BDT
Basic (60%)      = 21,600 BDT

Employee PF (7%) = 21,600 × 7% = 1,512 BDT / month
Employer PF (7%) = 21,600 × 7% = 1,512 BDT / month
Total PF / month = 3,024 BDT
```

**12-month employee contribution only:** 1,512 × 12 = **18,144 BDT**

---

## Monthly PF workflow

1. Calculate employee 7% on basic → **deduct from salary**
2. Calculate employer 7% on basic → **company contribution**
3. Deposit **both amounts** into Bank Asia FDR
4. Salary is paid at **end of month**; PF is deducted from that salary
5. Deposits are made on the **1st of the following month** (deposit on 1 Mar = February PF)

### Bank & interest

| Item | Detail |
|---|---|
| Bank | Bank Asia |
| Account type | FDR (Fixed Deposit Receipt) — **single pooled account** for all employees |
| Interest rate | At least **~7%** |
| Interest type | **Compound interest** (every **6 months**) |
| Profit allocation method | **Interest product method** (amount × time) |

**Interest product method (plain language):**

Each employee’s share of bank profit is based on **amount × days** in the fund. The accountant divides total bank profit proportionally — not equally.

### Example — two full-year employees (6-month interest period)

| Employee | Monthly PF | Months | Total saved |
|---|---|---|---|
| A | 2,000 | 6 | 12,000 |
| B | 4,000 | 6 | 24,000 |

A and B receive interest in proportion to their **amount and days** — B gets roughly twice A’s share (higher amount, same duration).

### Example — mid-year joiners

| Employee | Joined | Monthly PF | Months active | Total saved |
|---|---|---|---|---|
| C | April | 2,000 | 3 (Apr–Jun) | 6,000 |
| D | June | 2,000 | 1 (Jun only) | 2,000 |

C and D receive interest only for the months/days their money was in the fund — not the full 6-month period.

**Formula approach:** Fixed method used each time — calculate each employee’s interest product (contribution × days in fund), then split total bank profit proportionally. Currently done in Excel; not formally documented outside practice.

**Bank profit source:** Bank Asia provides the figure (statement); accountant then adjusts/splits it among employees using the interest product method.

**Compounding frequency:** Every **6 months** (semi-annual).

**Deposit timing:** Deposit on the 1st = **previous month’s** PF. Salary is paid end of month; PF is cut from that salary, then deposited on the 1st of the next month.

---

## Joiners and leavers

Known pain point: when someone joins or leaves mid-year, **yearly PF amounts** and interest allocation change.

| Scenario | Impact |
|---|---|
| Joins mid-year | Fewer months of contribution; lower balance; shorter time in fund → smaller profit share |
| Leaves mid-year (before 3 yrs) | Settlement = own 7% only; must stop PF and update yearly totals |
| Leaves mid-year (after 3 yrs) | Full settlement including profit share by interest product method |

**PF start for new permanent hires:** After **probation period ends** (not from joining month). Probation length **varies** per employee — must be recorded per person.

**Resignation / exit:**
- PF runs until **last working day** — prorated for that month (not full month, not next month).

**Yearly PF summary period:** **Fiscal year** (not calendar year). Confirm exact months with accountant — commonly **July–June** in Bangladesh.

---

## Exit settlement summary

### Before 3 years

```
Payout = Sum of all employee 7% monthly contributions
Excludes = Employer 7%, bank profit
```

**Example (12 months, basic 21,600):** 1,512 × 12 = **18,144 BDT**

### After 3 years (permanent)

```
Payout = Employee 7% (total)
       + Employer 7% (total)
       + Bank profit share (interest product: amount × time)
```

**Example (36 months, basic 21,600):**

```
Employee 7%  = 1,512 × 36 = 54,432 BDT
Employer 7%  = 1,512 × 36 = 54,432 BDT
Bank profit  = Calculated at exit using interest product method
```

---

## Reports & outputs

**Monthly:**

- Payslips
- Bank salary transfer list
- PF deposit amount / ledger
- Management summary

**On exit:**

- PF settlement sheet (before/after 3-year rules)
- Gratuity calculation (separate Excel; 5+ years)

---

## Open questions

Use these when talking to the accountant again:

### Deposit & interest

- [x] Deposit on 1st — **previous month’s PF** (salary paid end of month, PF cut from salary, deposited 1st of next month)
- [x] Bank compounding: **every 6 months** (semi-annual)
- [x] One **single pooled FDR** for all PF
- [x] Bank profit figure: **both** — bank statement provides total; accountant adjusts/splits per employee
- [x] Interest product allocation: **fixed method** — split by amount × days per employee (see examples above); done in Excel each time

### Employee lifecycle

- [x] PF start date: **after probation period ends**
- [x] Probation period length: **varies** per employee/role (must be tracked individually)
- [x] Mid-month join/exit: **prorated by days worked**
- [x] 3-year tenure: **PF start date (after probation)** → last working day

### Salary & payroll

- [x] Basic: **always 60% of gross** for everyone
- [~] Salary breakdown: **provisional** — 60% basic, 25% house rent, 10% medical, 5% conveyance (confirm with accountant)
- [x] Tax deduction: **same Excel** as salary/PF. Minimal amount deducted at source; employees claim/utilize company tax receipts in their **personal tax return**.
- [x] Eid/festival bonus: **same Excel** as payroll. **2 Eid bonuses** = 50% of basic each; **1 festival** = 100% of basic.

### Gratuity

- [x] Gratuity formula: **last basic × completed years of service**
- [x] Gratuity paid on: **resignation, termination, retirement** — same formula for all
- [x] Gratuity Excel: **separate file** from salary/PF

### Process & pain points

- [x] Excel files: **3–5 files** for salary + PF
- [x] Employee data: **copied/repeated across multiple files** (no single master source)
- [x] Top automation priority: **interest/profit split on exit** (interest product method)
- [x] File access: **accountant only** edits payroll/PF files

---

## Accountant interview checklist

Full question list from discovery session — see sections A–J in chat history. Priority sections:

1. **Current process** — monthly workflow, files, pain points
2. **Joiners/leavers** — yearly PF impact
3. **Exit settlement** — 3-year rule, interest product calc
4. **Gratuity** — 5-year rule
5. **Automation priority** — what saves the most time

---

## Future system ideas (not built yet)

Possible phases if a tool is built later:

**Phase 1 — Core**

- Employee master (type, join date, basic, gross, bank account)
- Monthly payroll + PF calculation
- Employee-wise PF ledger (employee 7% vs employer 7%)
- Exit settlement (before/after 3 years)

**Phase 2 — Interest** (highest priority per accountant)

- Interest product method calculator — **exit settlement profit split**
- Bank profit import from Bank Asia statements
- Yearly PF summary per employee

**Phase 3 — Broader**

- Gratuity module (5 years)
- HR input for joiners/leavers/increments
- Payslip generation
- Employee self-service (PF balance view)

---

## Project structure

```
finance helper/
├── client/     # React app (separate Vercel project, own .env)
├── server/     # Express API (separate Vercel project, own .env)
├── docs/       # Knowledge base and documentation
└── data/       # Sample/reference data (server seed)
```

## Related files

| File | Purpose |
|---|---|
| `data/employees.json` | Sample employee data (TechNova Solutions Ltd.) — may be used for prototyping |

---

## Changelog

| Date | Update |
|---|---|
| 2026-09-22 | Initial knowledge base from discovery discussion with user and accountant |
| 2026-09-22 | Cleared open questions Q&A session; added provisional salary breakdown |
| 2026-09-22 | Gratuity rules confirmed (basic × years, all exit types, separate Excel) |
| 2026-09-22 | Final gaps closed: PF to last working day, fiscal year reporting, monthly report list |
