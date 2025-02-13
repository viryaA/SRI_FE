import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { DetailDailyMonthlyPlanCuring } from 'src/app/models/DetailDailyMonthlPlanCuring';
import { DetailMonthlyPlanningCuring } from 'src/app/models/DetailMonthlyPlanningCuring';
import { DetailShiftMonthlyPlanCuring } from 'src/app/models/DetailShiftMonthlyPlanCuring';
import { MonthlyDailyPlan } from 'src/app/models/DetailMonthlyPlan';
import { ChangeMould } from 'src/app/models/ChangeMould';

import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { MonthlyPlanCuringService } from 'src/app/services/transaksi/monthly plan curing/monthly-plan-curing.service';
import Swal from 'sweetalert2';

import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { saveAs } from 'file-saver';
import { MatTableDataSource, MatTable } from '@angular/material/table';
declare var $: any;

@Component({
  selector: 'app-add-monthly-planning',
  templateUrl: './add-monthly-planning.component.html',
  styleUrls: ['./add-monthly-planning.component.scss'],
})
export class AddMonthlyPlanningComponent implements OnInit {
  // Variable declaration
  selectedDetail: { idDetailDaily: number; countProduction: number } | null = null;
  dateHeadersTass: any[] = [];
  dateHeadersCurring: any[] = [];
  monthlyPlanningTass: any[] = [];
  dailyMonthlyPlanningTass: any[] = [];
  shiftMonthlyPlanningTass: any[] = [];

  detailMonthlyPlanCuring: DetailMonthlyPlanningCuring[] = [];
  dailyMonthlyPlanningCuring: DetailDailyMonthlyPlanCuring[] = [];
  shiftMonthlyPlanningCuring: DetailShiftMonthlyPlanCuring[] = [];
  monthlyDailyPlan: MonthlyDailyPlan[] = [];
  monly: MonthlyDailyPlan[] = [];
  description: any[] = [];
  changeMould: ChangeMould[] = [];
  productDetails: any[] = [];

  marketingOrders: MarketingOrder[] = [];
  searchText: string = '';
  allData: any;
  workCenterText: string[] = [];
  kapaShift1: number = 0;
  kapaShift2: number = 0;
  kapaShift3: number = 0;
  totalKapa: number = 0;

  partNum: number = 0;
  shift: number = 0;
  wct: string = '';
  changeDate: string = '';

  // workCenterText: any[] = [];
  // kapaShift1: number = 0;
  // kapaShift2: number = 0;
  // kapaShift3: number = 0;
  // totalKapa: number = 0;
  // shift: any[] = [];
  // wct: any[] = [];
  // changeDate: any[] = [];

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['select', 'no','type', 'month0', 'month1', 'month2'];
  displayedColumnsMP: string[] = ['no', 'partNumber', 'dateDailyMp', 'totalPlan'];
  childHeadersColumnsMP: string[] = ['workDay'];

  dataSourceMO: MatTableDataSource<MarketingOrder>;
  dataSourceMP: MatTableDataSource<any>;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChildren(MatTable) innerTables!: QueryList<MatTable<any>>;
  monthlyPlanningsCurring: any[] = [];
  showMonthlyPlanning: boolean = false;

  constructor(private router: Router, private moService: MarketingOrderService, private mpService: MonthlyPlanCuringService, private parseDateService: ParsingDateService) { }

  ngOnInit(): void {
    //this.getAllMarketingOrder();
    this.getAllMoOnlyMonth();
    this.showMonthlyPlanning = true;
  }

  parseDate(dateParse: string): string {
    return this.parseDateService.convertDateToString(dateParse);
  }

  onSearchChange(): void {
    this.dataSourceMO.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSourceMO.filter = '';
  }
  selectedItems: { [key: string]: string } = {}; // Key: type, Value: mo_id

  selectItem(mo: any) {
    if (this.selectedItems[mo.type] === mo.mo_id) {
      delete this.selectedItems[mo.type];
    } else {
      this.selectedItems[mo.type] = mo.mo_id;
    }
  }
  
  getAllMoOnlyMonth(): void {
    this.moService.getAllMoOnlyMonth().subscribe(
      (response: ApiResponse<any[]>) => {
        let mapMonth = response.data.map((order) => {
          return {
            mo_id: order.MO_ID,
            type: order.TYPE,
            month0: new Date(order.MONTH0),
            month1: new Date(order.MONTH1),
            month2: new Date(order.MONTH2),
          };
        });
    // const mapMonth = [
    //   {
    //     mo_id: 1,
    //     month0: new Date('2024-01-01'),
    //     month1: new Date('2024-02-01'),
    //     month2: new Date('2024-03-01'),
    //     type: 'FED'
    //   },
    //   {
    //     mo_id: 2,
    //     month0: new Date('2024-04-01'),
    //     month1: new Date('2024-05-01'),
    //     month2: new Date('2024-06-01'),
    //     type: 'FDR'
    //   },
    //   {
    //     mo_id: 3,
    //     month0: new Date('2024-07-01'),
    //     month1: new Date('2024-08-01'),
    //     month2: new Date('2024-09-01'),
    //     type: 'FED'
    //   },
    //   {
    //     mo_id: 4,
    //     month0: new Date('2024-10-01'),
    //     month1: new Date('2024-11-01'),
    //     month2: new Date('2024-12-01'),
    //     type: 'FDR'
    //   },
    //   {
    //     mo_id: 5,
    //     month0: new Date('2025-01-01'),
    //     month1: new Date('2025-02-01'),
    //     month2: new Date('2025-03-01'),
    //     type: 'FED'
    //   },
    //   {
    //     mo_id: 6,
    //     month0: new Date('2025-04-01'),
    //     month1: new Date('2025-05-01'),
    //     month2: new Date('2025-06-01'),
    //     type: 'FDR'
    //   }
    // ];
        this.marketingOrders = mapMonth;
        if (this.marketingOrders.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: 'No marketing orders found.',
            timer: null,
            showConfirmButton: true,
            confirmButtonText: 'Ok',
          });
        } else {
          this.dataSourceMO = new MatTableDataSource(this.marketingOrders);
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load marketing orders: ' + error.message,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    );
  }
  ngAfterViewInit() {
    this.dataSourceMO.sort = this.sort;
    this.dataSourceMO.paginator = this.paginator;
  }

  objVarLim = {
    limitChange: null,
    minA: null,
    maxA: null,
    minB: null,
    maxB: null,
    minC: null,
    maxC: null,
    minD: null,
    maxD: null
  };


  generateMonthlyPlanning() {
    const checkedMonths = this.dataSourceMO.data
      .filter(mo => mo.selected)
      .map(mo => mo.month0);

    console.log(checkedMonths);

    let month: number | null = null;
    let year: number | null = null;

    if (checkedMonths.length > 0) {
      const firstMonthDate = checkedMonths[0];
      month = firstMonthDate.getMonth() + 1;
      year = firstMonthDate.getFullYear();
    }

    console.log("Month: " + month + " Year: " + year);
    console.log("Limit Change: " + this.objVarLim.limitChange);
    console.log("min A: " + this.objVarLim.minA);
    this.getDailyMonthPlan(month, year, this.objVarLim.limitChange, this.objVarLim.minA, this.objVarLim.maxA, this.objVarLim.minB,
      this.objVarLim.maxB, this.objVarLim.minC, this.objVarLim.maxC, this.objVarLim.minD, this.objVarLim.maxD
    );
  }

  exportExcelMonthlyPlan() {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while we Download Excel the monthly plan. This might take a while.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); 
      },
    });
    const checkedMonths = this.dataSourceMO.data
      .filter(mo => mo.selected)
      .map(mo => mo.month0);

    console.log(checkedMonths);

    let month: number | null = null;
    let year: number | null = null;

    if (checkedMonths.length > 0) {
      const firstMonthDate = checkedMonths[0];
      month = firstMonthDate.getMonth() + 1;
      year = firstMonthDate.getFullYear();
    }

    console.log("Month: " + month + " Year: " + year);
    console.log("Limit Change: " + this.objVarLim.limitChange);
    console.log("min A: " + this.objVarLim.minA);
    this.exportExcelMP(month, year, this.objVarLim.limitChange, this.objVarLim.minA, this.objVarLim.maxA, this.objVarLim.minB,
      this.objVarLim.maxB, this.objVarLim.minC, this.objVarLim.maxC, this.objVarLim.minD, this.objVarLim.maxD
    );
  }

  navigateToAddArDefectReject() {
    this.router.navigate(['/transaksi/add-mo-ar-defect-reject/', this.selectedItems['FED'], this.selectedItems['FDR']]);
  }

  navigateToFrontRear() {
    this.router.navigate(['/transaksi/add-mo-front-rear/', , this.selectedItems['FED'], this.selectedItems['FDR']]);
  }

  getDailyMonthPlan(  month: number, year: number,
    limitChange: number,
    minA: number, maxA: number,
    minB: number, maxB: number,
    minC: number, maxC: number,
    minD: number, maxD: number
  ) {
    // Menampilkan dialog loading
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while we generate the monthly plan. This might take a while.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan spinner
      },
    });

    this.monthNow = month;
    this.yearNow = year;

    this.mpService.generateDetailMp(
      month, year, limitChange,
      minA, maxA, minB,
      maxB, minC, maxC,
      minD, maxD
    ).subscribe((response: ApiResponse<any>) => {
      Swal.close(); // Menutup dialog loading setelah sukses
      this.allData = response.data;
      this.fillAllData(this.allData);
    },
      (error) => {
        Swal.close(); // Menutup dialog loading jika terjadi error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load marketing order details: ' + error.message,
          confirmButtonText: 'OK',
        });
      }
    );
  }

  exportExcelMP(
    month: number, year: number,
    limitChange: number,
    minA: number, maxA: number,
    minB: number, maxB: number,
    minC: number, maxC: number,
    minD: number, maxD: number
  ) {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    this.monthNow = month;
    this.yearNow = year;

    const monthDescription = monthNames[this.monthNow - 1]; 

    const filename = `PREPARE PROD ${monthDescription.toUpperCase()} ${this.yearNow}.xlsx`;

    this.mpService
      .ExportExcelMP(
        month, year, limitChange,
        minA, maxA, minB,
        maxB, minC, maxC,
        minD, maxD
      )
      .subscribe(
        (response) => {
          Swal.close(); 

          saveAs(response, filename);

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Monthly plan Excel file (${filename}) has been downloaded successfully.`,
            confirmButtonText: 'OK',
          });
        },
        (error) => {
          Swal.close(); 

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to download monthly plan Excel file: ' + error.message,
            confirmButtonText: 'OK',
          });
        }
      );
  }

  viewDetail(): void {
    this.fillChangeMould(this.changeMould);

    $('#changeMould').modal('show');
  }

  handleCellClick(partNUmber: number, date: any): void {

    console.log('Selected detail id:', partNUmber);
    console.log('Selected Date:', date);

    const formatDate = (dateObj: Date): string => {
      const day = dateObj.getDate().toString().padStart(2, '0'); // Tambahkan leading zero
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Bulan dimulai dari 0
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    };

    console.log("Data shift 1: ");
    console.log(this.shiftMonthlyPlanningCuring);

    // Proses filter data
    const filteredData = this.shiftMonthlyPlanningCuring.filter((item) => {
      const itemDate = new Date(item.date); // Konversi string ke Date
      return (
        partNUmber === item.part_NUMBER &&
        formatDate(itemDate) === date // Bandingkan format dd-MM-yyyy
      );
    });

    console.log("Data shift 2");
    console.log(filteredData);

    let pki = this.fillDataShift(filteredData);

    // Tampilkan loading terlebih dahulu
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while saving data marketing order.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Cek secara berkala jika pki sudah menjadi 1
    const interval = setInterval(() => {
      pki = this.fillDataShift(filteredData);

      if (pki !== 0) {
        // Tutup loading setelah nilai pki berubah menjadi 1
        Swal.close();
        clearInterval(interval); // Hentikan interval

        // Tampilkan modal
        this.openDmpModal();
      }
    }, 1000); // Interval pengecekan setiap 1 detik
  }

  openDmpModal(): void {
    $('#dmpModal').modal('show');
  }


  fillAllData(data: any) {
    console.log(data);

    const monthlyPlans = data.detailMonthlyPlanCuring || [];
    const dailyPlans = data.detailDailyMonthlyPlanCuring || [];
    const shift = data.shiftMonthlyPlan || [];
    this.shiftMonthlyPlanningCuring = shift;
    this.changeMould = data.changeMould;
    this.productDetails = data.productDetails;
    console.log(this.productDetails);

    const sizePa = data.sizePa ?? null;
    this.description = data.description ?? [];

    this.monly = dailyPlans;

    this.fillDataHeaderDate(dailyPlans);

    // Merging data based on `detailIdCuring`
    let mergedData: any[] = [];

    // Loop over each daily plan
    dailyPlans.forEach((daily, index) => {
      const matchingMonthly = monthlyPlans.find(
        (monthly) => monthly.detailIdCuring === daily.detailIdCuring
      );

      const matchingProduct = this.productDetails.find(
        (product) => product.partNumber === (matchingMonthly?.partNumber || daily.partNumber)
      );

      console.log('Matching Product:', matchingProduct);

      // const matchingSizePa = sizePa.find(
      //   (sizeEntry) => sizeEntry.partNumber === (matchingMonthly?.partNumber || daily.partNumber)
      // );

      const dailyData = {
        no: index + 1,
        partNumber: matchingMonthly?.partNumber || null,
        size: matchingProduct?.description || null,
        pattern: matchingProduct?.description || null,
        total: matchingMonthly?.total || null,
        netFulfilment: matchingMonthly?.netFulfilment || null,
        grossReq: matchingMonthly?.grossReq || null,
        netReq: matchingMonthly?.netReq || null,
        reqAhmOem: matchingMonthly?.reqAhmOem || null,
        reqAhmRem: matchingMonthly?.reqAhmRem || null,
        reqFdr: matchingMonthly?.reqFdr || null,
        differenceOfs: matchingMonthly?.differenceOfs || null,

        // Fields from daily plan
        detailIdCuring: daily.detailIdCuring,
        dateDailyMp: daily.dateDailyMp,
        workDay: daily.workDay,
        totalPlan: daily.totalPlan,
      };
      console.table("WFF" + dailyData);

      const existingEntry = mergedData.find(
        (entry) => entry.partNumber === dailyData.partNumber && entry.detailIdCuring === dailyData.detailIdCuring
      );

      if (!existingEntry) {
        mergedData.push(dailyData);
      }
    });

    // Update the monthlyDailyPlan with the merged data (only unique entries)
    this.monthlyDailyPlan = mergedData;

    console.table(this.monthlyDailyPlan);

    this.dataSourceMP = new MatTableDataSource(this.monthlyDailyPlan);
    this.dataSourceMP.sort = this.sort;
    this.dataSourceMP.paginator = this.paginator;
  }

  monthNow: number;
  yearNow: number;

  fillDataHeaderDate(dailyPlans: MonthlyDailyPlan[]): void {
    const uniqueDates = new Set(); // To track already used dates
    this.dateHeadersTass = dailyPlans.map(mp => {
      const date = new Date(mp.dateDailyMp);
      const date2 = new Date(mp.dateDailyMp);

      // Format the date to dd-MM-yyyy
      const formattedDate = `${('0' + (date2.getDate())).slice(-2)}-${('0' + (date2.getMonth() + 1)).slice(-2)}-${date2.getFullYear()}`;
      console.log('Formatted Date:', formattedDate);

      const matchingData = this.description.find(
        (header) => this.formatDate(header.DATE_WD) === formattedDate
      );

      const i = 0;
      // Check if the date has already been added
      if (!uniqueDates.has(formattedDate)) {
        uniqueDates.add(formattedDate); // Mark this date as used

        return {
          date: formattedDate,
          dateDisplay: date.getDate().toString(),
          isOff: matchingData.DESCRIPTION === 'OFF', // Off day logic
          isOvertime: matchingData.DESCRIPTION === 'OT_TT' || matchingData.DESCRIPTION === 'OT_TL', // Overtime day logic
          semiOff: matchingData.DESCRIPTION === 'SEMI_OFF',
          status: mp.workDay === 0 ? 'off' : (mp.workDay > 8 ? 'overtime' : 'normal'),
          workingDay: date.getDate().toString(),
          totalPlan: mp.totalPlan
        };
      }

      return null; // Return null for duplicate dates
    }).filter(header => header !== null); // Filter out any null values
  }

  fillDataShift(detailShiftMonthlyPlanCuring: DetailShiftMonthlyPlanCuring[]): number {
    // Reset nilai
    this.workCenterText = [];
    this.kapaShift1 = 0;
    this.kapaShift2 = 0;
    this.kapaShift3 = 0;
    this.totalKapa = 0;

    // Loop untuk mengisi data
    detailShiftMonthlyPlanCuring.forEach((item) => {
      if (item.work_CENTER_TEXT) {
        this.workCenterText.push(item.work_CENTER_TEXT); // Tambahkan ke array
      }
      this.kapaShift1 += item.kapa_SHIFT_1 || 0;
      this.kapaShift2 += item.kapa_SHIFT_2 || 0;
      this.kapaShift3 += item.kapa_SHIFT_3 || 0;
      this.totalKapa += item.total_KAPA || 0;
    });

    return 1;
  }


  filteredChangeMould: any[] = [];  // Data yang sudah difilter
  filterType: string = 'changeDate';  // Default filter type
  searchTerm: string = '';  // Term pencarian

  fillChangeMould(changeMould: any[]): void {
    this.changeMould = changeMould;
    this.filteredChangeMould = [...changeMould]; // Menampilkan data awal
  }

  // Fungsi untuk menerapkan filter berdasarkan pilihan dan pencarian
  applyFilter(): void {
    let filteredData = this.changeMould;

    // Filter berdasarkan searchTerm
    if (this.searchTerm) {
      filteredData = filteredData.filter(item => {
        const field = item[this.filterType];
        return field && field.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }

    // Update hasil filter
    this.filteredChangeMould = filteredData;
  }
  
  getTotalPlan(idCuring: number, date: string): number | string {
    // Cari data yang sesuai dengan idCuring dan tanggal
    const matchingData = this.monly.find((header) => this.formatDate(header.dateDailyMp) === date && header.detailIdCuring === idCuring);
    return matchingData ? matchingData.totalPlan : '-';
  }

  formatDate(date: string | Date): string {
    if (!date) {
      return '';
    }
    const dateObj = new Date(date);

    const formattedDate = `${('0' + dateObj.getDate()).slice(-2)}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${dateObj.getFullYear()}`;
    return formattedDate;
  }

  fillDataWorkDays(): void { }



  navigateToViewMp() {
    this.router.navigate(['/transaksi/view-monthly-planning']);
  }

  navigateToViewMoFrontRear() {
    this.router.navigate(['/transaksi/add-mo-front-rear']);
  }
}
