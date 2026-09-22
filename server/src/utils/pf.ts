import type { PfContribution } from '@prisma/client';
import { BASIC_RATIO, PF_RATE } from '../constants/pf.js';

export type PfContributionInput = Pick<
  PfContribution,
  'year' | 'month' | 'employeePf' | 'employerPf' | 'depositDate'
>;

export function grossToBasic(gross: number | string): number {
  return roundMoney(Number(gross) * BASIC_RATIO);
}

export function calculateMonthlyPf(basic: number, daysInMonth: number, daysWorked: number) {
  const ratio = daysWorked / daysInMonth;
  const employeePf = roundMoney(basic * PF_RATE * ratio);
  const employerPf = roundMoney(basic * PF_RATE * ratio);
  return { employeePf, employerPf, totalPf: roundMoney(employeePf + employerPf) };
}

export function getDepositDate(year: number, month: number): Date {
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return new Date(nextYear, nextMonth - 1, 1);
}

export function daysBetween(start: Date, end: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / msPerDay));
}

export function hasCompletedPfTenure(
  pfStartDate: Date,
  lastWorkingDay: Date,
  years = 3
): boolean {
  const threshold = new Date(pfStartDate);
  threshold.setFullYear(threshold.getFullYear() + years);
  return lastWorkingDay >= threshold;
}

export function calculateInterestProductShare(
  contributions: PfContributionInput[],
  totalBankProfit: number,
  fundEndDate: Date
) {
  const end = new Date(fundEndDate);
  const products = contributions.map((c) => {
    const deposit = new Date(c.depositDate);
    const days = daysBetween(deposit, end);
    const amount = Number(c.employeePf) + Number(c.employerPf);
    return { ...c, amount, days, product: amount * days };
  });

  const totalProduct = products.reduce((sum, p) => sum + p.product, 0);
  if (totalProduct === 0) {
    return { share: 0, products, totalProduct: 0, breakdown: [] };
  }

  const share = roundMoney(
    (products.reduce((s, p) => s + p.product, 0) / totalProduct) * totalBankProfit
  );

  return {
    share,
    products,
    totalProduct,
    breakdown: products.map((p) => ({
      year: p.year,
      month: p.month,
      amount: p.amount,
      days: p.days,
      product: p.product,
      profitShare: roundMoney((p.product / totalProduct) * totalBankProfit),
    })),
  };
}

export interface ExitSettlementResult {
  eligibleForFull: boolean;
  employeePf: number;
  employerPf: number;
  bankProfitShare: number;
  totalPayout: number;
  pfTenureYears: number;
  interestBreakdown?: Array<{
    year: number;
    month: number;
    amount: number;
    days: number;
    product: number;
    profitShare: number;
  }>;
}

export function calculateExitSettlement({
  contributions,
  pfStartDate,
  lastWorkingDay,
  totalBankProfit = 0,
}: {
  contributions: PfContributionInput[];
  pfStartDate: Date;
  lastWorkingDay: Date;
  totalBankProfit?: number;
}): ExitSettlementResult {
  const employeeTotal = roundMoney(
    contributions.reduce((sum, c) => sum + Number(c.employeePf), 0)
  );
  const employerTotal = roundMoney(
    contributions.reduce((sum, c) => sum + Number(c.employerPf), 0)
  );

  const eligibleForFull = hasCompletedPfTenure(pfStartDate, lastWorkingDay);

  if (!eligibleForFull) {
    return {
      eligibleForFull: false,
      employeePf: employeeTotal,
      employerPf: 0,
      bankProfitShare: 0,
      totalPayout: employeeTotal,
      pfTenureYears: tenureYears(pfStartDate, lastWorkingDay),
    };
  }

  const { share, breakdown } = calculateInterestProductShare(
    contributions,
    totalBankProfit,
    lastWorkingDay
  );

  return {
    eligibleForFull: true,
    employeePf: employeeTotal,
    employerPf: employerTotal,
    bankProfitShare: share,
    totalPayout: roundMoney(employeeTotal + employerTotal + share),
    pfTenureYears: tenureYears(pfStartDate, lastWorkingDay),
    interestBreakdown: breakdown,
  };
}

function tenureYears(start: Date, end: Date): number {
  const days = daysBetween(new Date(start), new Date(end));
  return roundMoney(days / 365.25, 2);
}

function roundMoney(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(Number(value) * factor) / factor;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
