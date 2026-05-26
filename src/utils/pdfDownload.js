import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { payslipApi } from '../api/payslipApi.js';

function safePart(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-z0-9_-]+/gi, '_')
    .replace(/^_+|_+$/g, '');
}

export function getPayslipFileName(payslip) {
  const employeeCode = safePart(payslip.employee_code);
  const month = safePart(payslip.month || payslip.pay_month || 'payslip');
  const year = safePart(payslip.year || payslip.pay_year || '');
  const prefix = employeeCode ? `payslip_${employeeCode}` : 'payslip';
  return [prefix, month, year].filter(Boolean).join('_') + '.pdf';
}

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function getPdfBlob(payslip) {
  if (!payslip?.id) {
    throw new Error('Unable to download payslip PDF.');
  }
  const response = await payslipApi.getPayslipPdf(payslip.id);
  return new Blob([response.data], { type: 'application/pdf' });
}

async function readBlobError(blob) {
  try {
    const text = await blob.text();
    if (!text) return '';
    const parsed = JSON.parse(text);
    return parsed.detail || parsed.message || JSON.stringify(parsed);
  } catch {
    return '';
  }
}

export async function getPdfErrorMessage(error) {
  const responseData = error?.response?.data;
  if (responseData instanceof Blob) {
    return (await readBlobError(responseData)) || 'Unable to download payslip PDF.';
  }
  return responseData?.detail || responseData?.message || (responseData ? JSON.stringify(responseData) : '') || 'Unable to download payslip PDF.';
}

function openBlobUrl(blob) {
  const url = window.URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => window.URL.revokeObjectURL(url), 60000);
}

function downloadBlobUrl(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

async function savePdfToDevice(blob, fileName) {
  const base64Data = await blobToBase64(blob);
  const result = await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Documents
  });
  return result.uri;
}

export async function viewPayslipPdf(payslip) {
  const blob = await getPdfBlob(payslip);
  const fileName = getPayslipFileName(payslip);

  if (Capacitor.isNativePlatform()) {
    const uri = await savePdfToDevice(blob, fileName);
    await Browser.open({ url: uri });
    return fileName;
  }

  openBlobUrl(blob);
  return fileName;
}

export async function downloadPayslipPdf(payslip) {
  const blob = await getPdfBlob(payslip);
  const fileName = getPayslipFileName(payslip);

  if (Capacitor.isNativePlatform()) {
    await savePdfToDevice(blob, fileName);
    return fileName;
  }

  downloadBlobUrl(blob, fileName);
  return fileName;
}
