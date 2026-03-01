"""
Generate synthetic demo PDF documents for Trutina demo cases.
Each PDF matches the demo-data.ts case data with realistic Australian
payslip, bank statement, and employment letter layouts.
"""

from fpdf import FPDF
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'demo-docs')
os.makedirs(OUT, exist_ok=True)


class PayslipPDF(FPDF):
    """Australian payslip layout."""

    def header(self):
        self.set_font('Helvetica', 'B', 14)
        self.cell(0, 8, self.company_name, align='C', new_x='LMARGIN', new_y='NEXT')
        self.set_font('Helvetica', '', 8)
        self.cell(0, 5, f'ABN: {self.company_abn}', align='C', new_x='LMARGIN', new_y='NEXT')
        self.cell(0, 5, self.company_address, align='C', new_x='LMARGIN', new_y='NEXT')
        self.ln(3)
        self.set_draw_color(200, 200, 200)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)
        self.set_font('Helvetica', 'B', 12)
        self.cell(0, 8, 'PAY SLIP', align='C', new_x='LMARGIN', new_y='NEXT')
        self.ln(2)

    def add_row(self, label, value, bold=False):
        self.set_font('Helvetica', 'B' if bold else '', 9)
        self.cell(90, 6, label)
        self.set_font('Helvetica', 'B' if bold else '', 9)
        self.cell(0, 6, str(value), align='R', new_x='LMARGIN', new_y='NEXT')

    def add_section(self, title):
        self.ln(3)
        self.set_fill_color(240, 240, 245)
        self.set_font('Helvetica', 'B', 9)
        self.cell(0, 7, f'  {title}', fill=True, new_x='LMARGIN', new_y='NEXT')
        self.ln(1)

    def add_separator(self):
        self.set_draw_color(200, 200, 200)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(2)


class BankStatementPDF(FPDF):
    """Australian bank statement layout."""

    def header(self):
        self.set_font('Helvetica', 'B', 16)
        self.cell(0, 10, self.bank_name, align='L', new_x='LMARGIN', new_y='NEXT')
        self.set_font('Helvetica', '', 8)
        self.cell(0, 5, 'Statement of Account', new_x='LMARGIN', new_y='NEXT')
        self.ln(2)
        self.set_draw_color(0, 70, 140)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.set_line_width(0.2)
        self.ln(4)

    def add_account_info(self, name, bsb, account, period):
        self.set_font('Helvetica', 'B', 9)
        self.cell(40, 5, 'Account Name:')
        self.set_font('Helvetica', '', 9)
        self.cell(0, 5, name, new_x='LMARGIN', new_y='NEXT')

        self.set_font('Helvetica', 'B', 9)
        self.cell(40, 5, 'BSB:')
        self.set_font('Helvetica', '', 9)
        self.cell(50, 5, bsb)
        self.set_font('Helvetica', 'B', 9)
        self.cell(30, 5, 'Account No:')
        self.set_font('Helvetica', '', 9)
        self.cell(0, 5, account, new_x='LMARGIN', new_y='NEXT')

        self.set_font('Helvetica', 'B', 9)
        self.cell(40, 5, 'Statement Period:')
        self.set_font('Helvetica', '', 9)
        self.cell(0, 5, period, new_x='LMARGIN', new_y='NEXT')
        self.ln(4)

    def add_summary(self, opening, credits, debits, closing):
        self.set_fill_color(235, 240, 250)
        self.set_font('Helvetica', 'B', 9)
        self.cell(0, 7, '  Account Summary', fill=True, new_x='LMARGIN', new_y='NEXT')
        self.ln(1)
        for label, val in [('Opening Balance', opening), ('Total Credits', credits),
                           ('Total Debits', debits), ('Closing Balance', closing)]:
            self.set_font('Helvetica', '', 9)
            self.cell(120, 6, f'  {label}')
            self.set_font('Helvetica', 'B' if label == 'Closing Balance' else '', 9)
            self.cell(0, 6, f'${val:,.2f}', align='R', new_x='LMARGIN', new_y='NEXT')
        self.ln(3)

    def add_transactions(self, txns):
        self.set_fill_color(235, 240, 250)
        self.set_font('Helvetica', 'B', 8)
        self.cell(25, 7, '  Date', fill=True)
        self.cell(80, 7, 'Description', fill=True)
        self.cell(30, 7, 'Debit', fill=True, align='R')
        self.cell(30, 7, 'Credit', fill=True, align='R')
        self.cell(0, 7, 'Balance', fill=True, align='R', new_x='LMARGIN', new_y='NEXT')

        self.set_font('Helvetica', '', 8)
        for txn in txns:
            date, desc, debit, credit, balance = txn
            self.cell(25, 5.5, date)
            self.cell(80, 5.5, desc)
            self.cell(30, 5.5, f'${debit:,.2f}' if debit else '', align='R')
            self.cell(30, 5.5, f'${credit:,.2f}' if credit else '', align='R')
            self.cell(0, 5.5, f'${balance:,.2f}', align='R', new_x='LMARGIN', new_y='NEXT')


class EmploymentLetterPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 14)
        self.cell(0, 10, self.company_name, new_x='LMARGIN', new_y='NEXT')
        self.set_font('Helvetica', '', 8)
        self.cell(0, 5, f'ABN: {self.company_abn}', new_x='LMARGIN', new_y='NEXT')
        self.cell(0, 5, self.company_address, new_x='LMARGIN', new_y='NEXT')
        self.ln(8)


# ─── CASE 1: Clean (Sarah Mitchell) ───

def gen_mitchell_payslip():
    pdf = PayslipPDF()
    pdf.company_name = 'Westfield Health Services Pty Ltd'
    pdf.company_abn = '94 218 763 490'
    pdf.company_address = '45 St Georges Terrace, Perth WA 6000'
    pdf.add_page()

    pdf.add_section('Employee Details')
    pdf.add_row('Employee Name', 'Sarah J. Mitchell')
    pdf.add_row('Employee ID', 'EMP-2847')
    pdf.add_row('Position', 'Senior Physiotherapist')
    pdf.add_row('Pay Period', '01 Jan 2026 - 15 Jan 2026')
    pdf.add_row('Payment Date', '16 Jan 2026')
    pdf.add_row('Pay Frequency', 'Fortnightly')

    pdf.add_section('Earnings')
    pdf.add_row('Base Salary (Fortnightly)', '$4,230.77')
    pdf.add_row('Overtime (3.5 hrs @ 1.5x)', '$148.08')
    pdf.add_separator()
    pdf.add_row('Gross Pay', '$4,378.85', bold=True)

    pdf.add_section('Deductions')
    pdf.add_row('PAYG Withholding Tax', '$987.00')
    pdf.add_row('Medicare Levy (2%)', '$87.58')
    pdf.add_separator()
    pdf.add_row('Total Deductions', '$1,074.58', bold=True)

    pdf.add_section('Net Pay')
    pdf.add_row('Net Pay', '$3,304.27', bold=True)

    pdf.add_section('Superannuation')
    pdf.add_row('Super Guarantee (11.5%)', '$503.57')
    pdf.add_row('Super Fund', 'Australian Super')
    pdf.add_row('Member No.', '1234 5678 9012')

    pdf.add_section('Year to Date')
    pdf.add_row('YTD Gross', '$4,378.85')
    pdf.add_row('YTD Tax', '$987.00')
    pdf.add_row('YTD Super', '$503.57')

    pdf.ln(6)
    pdf.set_font('Helvetica', 'I', 7)
    pdf.cell(0, 4, 'Generated by KeyPay Payroll Platform', align='C', new_x='LMARGIN', new_y='NEXT')

    pdf.output(os.path.join(OUT, 'mitchell_payslip_jan2026.pdf'))


def gen_mitchell_bank():
    pdf = BankStatementPDF()
    pdf.bank_name = 'National Australia Bank'
    pdf.add_page()
    pdf.add_account_info('Sarah J Mitchell', '086-174', '4738 29156', '01 Dec 2025 - 31 Dec 2025')
    pdf.add_summary(3842.16, 9215.40, 8647.93, 4409.63)

    txns = [
        ('01/12', 'Opening Balance', None, None, 3842.16),
        ('02/12', 'Westfield Health - Salary', None, 4378.85, 8221.01),
        ('03/12', 'Coles Supermarkets', 124.50, None, 8096.51),
        ('05/12', 'RAC Insurance - Motor', 189.00, None, 7907.51),
        ('07/12', 'BP Fuel - Subiaco', 78.42, None, 7829.09),
        ('10/12', 'ANZ Transfer - Savings', 2000.00, None, 5829.09),
        ('12/12', 'Medicare Rebate', None, 86.55, 5915.64),
        ('15/12', 'Woolworths', 98.63, None, 5817.01),
        ('16/12', 'Westfield Health - Salary', None, 4378.85, 10195.86),
        ('18/12', 'Home Loan Repayment', 2850.00, None, 7345.86),
        ('20/12', 'Synergy - Electricity', 287.15, None, 7058.71),
        ('22/12', 'Water Corporation', 156.80, None, 6901.91),
        ('24/12', 'Telstra Mobile', 89.00, None, 6812.91),
        ('26/12', 'JB Hi-Fi', 349.00, None, 6463.91),
        ('28/12', 'Aldi Stores', 67.43, None, 6396.48),
        ('30/12', 'ANZ Transfer - Savings', 1500.00, None, 4896.48),
        ('31/12', 'Interest Earned', None, 371.15, 4409.63),  # adjusted to close
        ('31/12', 'Account Fee', 858.00, None, 4409.63),  # net to closing
    ]
    # Fix: last two need to net to closing
    # 4896.48 + 371.15 - 858.00 = 4409.63 ✓
    pdf.add_transactions(txns)

    pdf.output(os.path.join(OUT, 'mitchell_nab_dec2025.pdf'))


# ─── CASE 2: AI Fake (James Chen) ───

def gen_chen_payslip():
    """Deliberately flawed payslip - AI-generated with math errors."""
    pdf = PayslipPDF()
    pdf.company_name = 'Pinnacle Construction Group'
    pdf.company_abn = '51 824 753 166'  # Will be flagged as cancelled
    pdf.company_address = '120 Collins Street, Melbourne VIC 3000'
    pdf.add_page()

    pdf.add_section('Employee Details')
    pdf.add_row('Employee Name', 'James W. Chen')
    pdf.add_row('Employee ID', 'PC-0394')
    pdf.add_row('Position', 'Project Manager')
    pdf.add_row('Pay Period', '01 Jan 2026 - 31 Jan 2026')
    pdf.add_row('Payment Date', '31 Jan 2026')
    pdf.add_row('Pay Frequency', 'Monthly')

    pdf.add_section('Earnings')
    pdf.add_row('Base Salary (Monthly)', '$14,583.33')
    pdf.add_row('Car Allowance', '$750.00')
    pdf.add_separator()
    pdf.add_row('Gross Pay', '$15,333.33', bold=True)

    pdf.add_section('Deductions')
    # DELIBERATE ERROR: tax doesn't match ATO tables for this income
    pdf.add_row('PAYG Withholding Tax', '$3,847.00')
    pdf.add_separator()
    pdf.add_row('Total Deductions', '$3,847.00', bold=True)

    pdf.add_section('Net Pay')
    # DELIBERATE ERROR: 15333.33 - 3847.00 = 11486.33, but shows 11,842.00
    pdf.add_row('Net Pay', '$11,842.00', bold=True)

    pdf.add_section('Superannuation')
    # DELIBERATE ERROR: 11.5% of 15333.33 = 1763.33, shows 1,380.00 (only 9%)
    pdf.add_row('Super Guarantee (11.5%)', '$1,380.00')
    pdf.add_row('Super Fund', 'REST Industry Super')
    pdf.add_row('Member No.', '8847 3921 0055')

    pdf.add_section('Year to Date')
    pdf.add_row('YTD Gross', '$15,333.33')
    pdf.add_row('YTD Tax', '$3,847.00')
    pdf.add_row('YTD Super', '$1,380.00')

    pdf.ln(6)
    pdf.set_font('Helvetica', 'I', 7)
    # DELIBERATE: Chrome PDF producer is suspicious — legit payroll uses Xero/MYOB/KeyPay
    pdf.cell(0, 4, 'Saved with Chrome PDF Renderer', align='C', new_x='LMARGIN', new_y='NEXT')

    pdf.output(os.path.join(OUT, 'chen_payslip_jan2026.pdf'))


# ─── CASE 3: Bad ABN (Emma Thompson) ───

def gen_thompson_payslip():
    pdf = PayslipPDF()
    pdf.company_name = 'GreenLeaf Organics Pty Ltd'
    pdf.company_abn = '29 475 182 693'  # Cancelled ABN
    pdf.company_address = '8 Marine Parade, Southport QLD 4215'
    pdf.add_page()

    pdf.add_section('Employee Details')
    pdf.add_row('Employee Name', 'Emma L. Thompson')
    pdf.add_row('Employee ID', 'GLO-0127')
    pdf.add_row('Position', 'Marketing Manager')
    pdf.add_row('Pay Period', '01 Jan 2026 - 15 Jan 2026')
    pdf.add_row('Payment Date', '16 Jan 2026')
    pdf.add_row('Pay Frequency', 'Fortnightly')

    pdf.add_section('Earnings')
    pdf.add_row('Base Salary (Fortnightly)', '$4,615.38')
    pdf.add_separator()
    pdf.add_row('Gross Pay', '$4,615.38', bold=True)

    pdf.add_section('Deductions')
    pdf.add_row('PAYG Withholding Tax', '$1,102.00')
    pdf.add_row('Medicare Levy (2%)', '$92.31')
    pdf.add_separator()
    pdf.add_row('Total Deductions', '$1,194.31', bold=True)

    pdf.add_section('Net Pay')
    pdf.add_row('Net Pay', '$3,421.07', bold=True)

    pdf.add_section('Superannuation')
    pdf.add_row('Super Guarantee (11.5%)', '$530.77')
    pdf.add_row('Super Fund', 'Sunsuper')
    pdf.add_row('Member No.', '6612 9034 7788')

    pdf.add_section('Year to Date')
    pdf.add_row('YTD Gross', '$4,615.38')
    pdf.add_row('YTD Tax', '$1,102.00')
    pdf.add_row('YTD Super', '$530.77')

    pdf.ln(6)
    pdf.set_font('Helvetica', 'I', 7)
    pdf.cell(0, 4, 'Generated by MYOB Payroll v2025.4', align='C', new_x='LMARGIN', new_y='NEXT')

    pdf.output(os.path.join(OUT, 'thompson_payslip_jan2026.pdf'))


def gen_thompson_employment_letter():
    pdf = EmploymentLetterPDF()
    # DELIBERATE: Different ABN from payslip (29 475 182 693 vs 41 293 847 126)
    pdf.company_name = 'GreenLeaf Organics Pty Ltd'
    pdf.company_abn = '41 293 847 126'
    pdf.company_address = '8 Marine Parade, Southport QLD 4215'
    pdf.add_page()

    pdf.set_font('Helvetica', '', 9)
    pdf.cell(0, 6, '16 January 2026', new_x='LMARGIN', new_y='NEXT')
    pdf.ln(4)
    pdf.cell(0, 6, 'To Whom It May Concern,', new_x='LMARGIN', new_y='NEXT')
    pdf.ln(4)

    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(0, 7, 'RE: Confirmation of Employment - Emma Louise Thompson', new_x='LMARGIN', new_y='NEXT')
    pdf.ln(3)

    body = (
        'This letter confirms that Emma Louise Thompson (Date of Birth: 14 March 1991) '
        'has been employed by GreenLeaf Organics Pty Ltd in the capacity of Marketing Manager '
        'since 3 February 2023 on a full-time, permanent basis.\n\n'  # DELIBERATE: date conflict with payslip YTD
        'Her current remuneration package is as follows:\n'
    )
    pdf.set_font('Helvetica', '', 9)
    pdf.multi_cell(0, 5.5, body)

    pdf.ln(2)
    for label, val in [('Base Salary', '$120,000.00 per annum'),
                       ('Superannuation', '11.5% ($13,800.00)'),
                       ('Total Package', '$133,800.00 per annum'),
                       ('Pay Frequency', 'Fortnightly'),
                       ('Employment Type', 'Full-time, Permanent')]:
        pdf.set_font('Helvetica', 'B', 9)
        pdf.cell(50, 6, label + ':')
        pdf.set_font('Helvetica', '', 9)
        pdf.cell(0, 6, val, new_x='LMARGIN', new_y='NEXT')

    pdf.ln(4)
    pdf.set_font('Helvetica', '', 9)
    pdf.multi_cell(0, 5.5,
        'Ms Thompson is a valued member of our team and has consistently performed at a high level. '
        'She is currently not subject to any performance management processes.\n\n'
        'Should you require any further information, please do not hesitate to contact the undersigned.\n\n'
        'Kind regards,\n\n\n'
    )
    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(0, 6, 'David Richardson', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(0, 5, 'General Manager', new_x='LMARGIN', new_y='NEXT')
    pdf.cell(0, 5, 'GreenLeaf Organics Pty Ltd', new_x='LMARGIN', new_y='NEXT')
    pdf.cell(0, 5, 'Ph: (07) 5528 4100', new_x='LMARGIN', new_y='NEXT')

    pdf.output(os.path.join(OUT, 'thompson_employment_letter.pdf'))


# ─── CASE 4: Bank Fraud (David Kowalski) ───

def gen_kowalski_payslip():
    pdf = PayslipPDF()
    pdf.company_name = 'Harbour View Plumbing Pty Ltd'
    pdf.company_abn = '38 612 493 087'
    pdf.company_address = '27 Parramatta Road, Homebush NSW 2140'
    pdf.add_page()

    pdf.add_section('Employee Details')
    pdf.add_row('Employee Name', 'David M. Kowalski')
    pdf.add_row('Employee ID', 'HVP-0058')
    pdf.add_row('Position', 'Licensed Plumber')
    pdf.add_row('Pay Period', '01 Jan 2026 - 15 Jan 2026')
    pdf.add_row('Payment Date', '16 Jan 2026')
    pdf.add_row('Pay Frequency', 'Fortnightly')

    pdf.add_section('Earnings')
    pdf.add_row('Base Salary (Fortnightly)', '$4,038.46')
    pdf.add_row('Tool Allowance', '$75.00')
    pdf.add_separator()
    pdf.add_row('Gross Pay', '$4,113.46', bold=True)

    pdf.add_section('Deductions')
    pdf.add_row('PAYG Withholding Tax', '$892.00')
    pdf.add_row('Medicare Levy (2%)', '$82.27')
    pdf.add_row('Union Dues - PPTEU', '$42.50')
    pdf.add_separator()
    pdf.add_row('Total Deductions', '$1,016.77', bold=True)

    pdf.add_section('Net Pay')
    pdf.add_row('Net Pay', '$3,096.69', bold=True)

    pdf.add_section('Superannuation')
    pdf.add_row('Super Guarantee (11.5%)', '$473.05')
    pdf.add_row('Super Fund', 'Cbus Super')
    pdf.add_row('Member No.', '9901 4423 6677')

    pdf.add_section('Year to Date')
    pdf.add_row('YTD Gross', '$4,113.46')
    pdf.add_row('YTD Tax', '$892.00')
    pdf.add_row('YTD Super', '$473.05')

    pdf.ln(6)
    pdf.set_font('Helvetica', 'I', 7)
    pdf.cell(0, 4, 'Generated by Xero Payroll', align='C', new_x='LMARGIN', new_y='NEXT')

    pdf.output(os.path.join(OUT, 'kowalski_payslip_jan2026.pdf'))


def gen_kowalski_bank():
    """Bank statement with deliberate balance mismatch."""
    pdf = BankStatementPDF()
    pdf.bank_name = 'Commonwealth Bank of Australia'
    pdf.add_page()
    pdf.add_account_info('David M Kowalski', '062-000', '1029 3847', '01 Dec 2025 - 31 Dec 2025')

    # DELIBERATE: opening + credits - debits != closing (off by ~$16,240)
    # Real: 2450.00 + 12891.55 - 11234.20 = 4107.35
    # Shows closing as $20,347.55 — inflated by $16,240.20
    pdf.add_summary(2450.00, 12891.55, 11234.20, 20347.55)

    txns = [
        ('01/12', 'Opening Balance', None, None, 2450.00),
        ('02/12', 'Harbour View Plumbing - Wages', None, 3096.69, 5546.69),
        ('03/12', 'Bunnings Warehouse', 234.80, None, 5311.89),
        ('05/12', 'NRMA Insurance', 178.00, None, 5133.89),
        ('07/12', 'Woolworths Metro', 89.45, None, 5044.44),
        ('09/12', 'Transfer from Savings', None, 1500.00, 6544.44),
        ('11/12', 'Origin Energy', 312.60, None, 6231.84),
        ('12/12', 'Harbour View - Bonus', None, 2000.00, 8231.84),
        ('15/12', 'Home Loan - CBA', 2680.00, None, 5551.84),
        ('16/12', 'Harbour View Plumbing - Wages', None, 3096.69, 8648.53),
        ('18/12', 'Aldi Stores', 112.35, None, 8536.18),
        ('20/12', 'Telstra', 129.00, None, 8407.18),
        ('22/12', 'Sydney Water', 198.00, None, 8209.18),
        ('24/12', 'Cash Withdrawal - ATM', 500.00, None, 7709.18),
        ('27/12', 'Transfer - J.Kowalski', None, 3198.17, 10907.35),
        ('29/12', 'Council Rates', 1800.00, None, 9107.35),
        ('30/12', 'Petrol - 7-Eleven', 95.00, None, 9012.35),
        ('31/12', 'Closing Balance', None, None, 20347.55),  # DELIBERATELY WRONG
    ]
    pdf.add_transactions(txns)

    pdf.ln(5)
    pdf.set_font('Helvetica', 'I', 7)
    pdf.cell(0, 4, 'This statement was produced on 02/01/2026. Please check entries carefully.', align='C')

    pdf.output(os.path.join(OUT, 'kowalski_cba_dec2025.pdf'))


# ─── CASE 5: Broker Cluster (Priya Sharma) ───

def gen_sharma_payslip():
    pdf = PayslipPDF()
    pdf.company_name = 'TechBridge Solutions Pty Ltd'
    pdf.company_abn = '67 910 283 451'  # Recently registered
    pdf.company_address = 'Level 4, 100 Pirie Street, Adelaide SA 5000'
    pdf.add_page()

    pdf.add_section('Employee Details')
    pdf.add_row('Employee Name', 'Priya R. Sharma')
    pdf.add_row('Employee ID', 'TBS-0012')
    pdf.add_row('Position', 'Software Engineer')
    pdf.add_row('Pay Period', '01 Jan 2026 - 31 Jan 2026')
    pdf.add_row('Payment Date', '31 Jan 2026')
    pdf.add_row('Pay Frequency', 'Monthly')

    pdf.add_section('Earnings')
    pdf.add_row('Base Salary (Monthly)', '$11,666.67')
    pdf.add_separator()
    pdf.add_row('Gross Pay', '$11,666.67', bold=True)

    pdf.add_section('Deductions')
    pdf.add_row('PAYG Withholding Tax', '$2,714.00')
    pdf.add_row('Medicare Levy (2%)', '$233.33')
    pdf.add_separator()
    pdf.add_row('Total Deductions', '$2,947.33', bold=True)

    pdf.add_section('Net Pay')
    pdf.add_row('Net Pay', '$8,719.34', bold=True)

    pdf.add_section('Superannuation')
    pdf.add_row('Super Guarantee (11.5%)', '$1,341.67')
    pdf.add_row('Super Fund', 'UniSuper')
    pdf.add_row('Member No.', '5543 8821 0099')

    pdf.add_section('Year to Date')
    pdf.add_row('YTD Gross', '$11,666.67')
    pdf.add_row('YTD Tax', '$2,714.00')
    pdf.add_row('YTD Super', '$1,341.67')

    pdf.ln(6)
    pdf.set_font('Helvetica', 'I', 7)
    pdf.cell(0, 4, 'Generated by Employment Hero Payroll', align='C', new_x='LMARGIN', new_y='NEXT')

    pdf.output(os.path.join(OUT, 'sharma_payslip_jan2026.pdf'))


if __name__ == '__main__':
    gen_mitchell_payslip()
    gen_mitchell_bank()
    gen_chen_payslip()
    gen_thompson_payslip()
    gen_thompson_employment_letter()
    gen_kowalski_payslip()
    gen_kowalski_bank()
    gen_sharma_payslip()
    print(f'Generated 8 PDFs in {OUT}')
    for f in sorted(os.listdir(OUT)):
        if f.endswith('.pdf'):
            size = os.path.getsize(os.path.join(OUT, f))
            print(f'  {f} ({size:,} bytes)')
