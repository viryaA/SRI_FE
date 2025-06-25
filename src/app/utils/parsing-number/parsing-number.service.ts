import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParsingNumberService {
  constructor() {}

  separatorAndDecimalInput(value: string): string {
    let formattedValue = value.replace(/[^\d,]/g, '');
    const commaIndex = formattedValue.indexOf(',');
    if (commaIndex !== -1) {
      formattedValue = formattedValue.slice(0, commaIndex + 1) + formattedValue.slice(commaIndex + 1).replace(/,/g, '');
    }
    if (formattedValue.includes(',')) {
      const parts = formattedValue.split(',');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      formattedValue = parts.join(',');
    } else {
      formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return formattedValue;
  }

  separatorAndDecimalView(value: number): string {
    if (value !== null && value !== undefined) {
      // Jika nilai adalah 0, kembalikan '0' saja
      if (value === 0) {
        return '0';
      }

      let strValue = value.toString();

      const parts = strValue.split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1] ? ',' + parts[1].padEnd(2, '0') : ',00';

      // Jika angkanya tunggal (1 digit) dan tidak memiliki bagian desimal, tambahkan ,00
      if (integerPart.length === 1 && !parts[1]) {
        return `${integerPart},00`;
      }

      // Format bagian integer dengan pemisah ribuan
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      // Gabungkan bagian integer dan bagian desimal
      return formattedInteger + decimalPart;
    }
    return '';
  }

  separatorTableView(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  toBackendTimestamp (dateString: string, timeString: string): string {
    const iso = new Date(`${dateString}T${timeString}:00Z`).toISOString(); // UTC
    return iso.replace('Z', '+0000'); // Convert to format like "2025-06-21T18:41:00.000+0000"
  }
}

// parsing-date.util.ts
export function toBackendTimestamp(dateString: string, timeString: string): string {
  // Combine date and time
  const localDate = new Date(`${dateString}T${timeString}:00`);

  // Get local components
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  const seconds = String(localDate.getSeconds()).padStart(2, '0');
  const milliseconds = String(localDate.getMilliseconds()).padStart(3, '0');

  // Get timezone offset in minutes
  const offsetMinutes = -localDate.getTimezoneOffset(); // JavaScript offset is inverse
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const offsetHours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, '0');
  const offsetMins = String(Math.abs(offsetMinutes) % 60).padStart(2, '0');

  // Final format
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}${offsetMins}`;
}

