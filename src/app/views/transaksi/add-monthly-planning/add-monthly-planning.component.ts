import { Component, OnInit, ViewChild, ViewChildren, QueryList,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { DetailDailyMonthlyPlanCuring } from 'src/app/models/DetailDailyMonthlPlanCuring';
import { DetailMonthlyPlanningCuring } from 'src/app/models/DetailMonthlyPlanningCuring';
import { DetailShiftMonthlyPlanCuring } from 'src/app/models/DetailShiftMonthlyPlanCuring';
import { MonthlyDailyPlan } from 'src/app/models/DetailMonthlyPlan';
import { ChangeMould } from 'src/app/models/ChangeMould';

import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { MonthlyPlanCuringService } from 'src/app/services/transaksi/monthly plan curing/monthly-plan-curing.service';
import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';

declare var $: any;

@Component({
  selector: 'app-add-monthly-planning',
  templateUrl: './add-monthly-planning.component.html',
  styleUrls: ['./add-monthly-planning.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', overflow: 'hidden' })), 
      state('expanded', style({ height: '*' })), 
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
     
})
export class AddMonthlyPlanningComponent implements OnInit {
  
  // Variable declaration
  allData: any;
  changeDate: string = '';
  changeMould: ChangeMould[] = [];
  childHeadersColumnsMP: string[] = ['workDay'];
  dailyMonthlyPlanningCuring: DetailDailyMonthlyPlanCuring[] = [];
  dailyMonthlyPlanningTass: any[] = [];
  dataSourceMO: MatTableDataSource<MarketingOrder>;
  dataSourceMOQS: MatTableDataSource<any>;
  dataSourceMP: MatTableDataSource<any>;
  dateHeadersCurring: any[] = [];
  dateHeadersTass: any[] = [];
  description: any[] = [];

  selectedND: any = null; // Ensure this is defined

  dataFrontRear = [
    { 'Paket': 'Data 1', 'Item Curing': ['Data 2', 'Data 3'] },
    { 'Paket': 'Data 4', 'Item Curing': ['Data 5', 'Data 6', 'Data 7'] }
  ];
  

  dataCheating = [
    { 'Item Curing': 'Value A1', 'Work Center Text': 'Value B1' },
    { 'Item Curing': 'Value A2', 'Work Center Text': 'Value B2' },
    { 'Item Curing': 'Value A2', 'Work Center Text': 'Value B2' },
    { 'Item Curing': 'Value A2', 'Work Center Text': 'Value B2' },
    { 'Item Curing': 'Value A2', 'Work Center Text': 'Value B2' }
  ];
  displayedColumnsMO: string[] = [ 'no', 'month0', 'month1', 'month2'];

  columnNameMap: { [key: string]: string } = {
    no: 'No',
    version: 'Cheating Version',
    mo_V: 'MO Version',
    month0: 'Month 1',
    month1: 'Month 2',
    month2: 'Month 3',
  };
  objVarLim = {
    limitChange: null,
    maxA: null,
    maxB: null,
    maxC: null,
    maxD: null,
    minA: null,
    minB: null,
    minC: null,
    minD: null
  };
  displayedColumnsMOF: string[] = ['select', 'no', 'month0', 'month1', 'month2', 'action'];
  displayedColumnsMOQS: string[] = ['mo_V', 'month0', 'month1', 'month2'];
  displayedColumnsMOQSF: string[] = ['mo_V','month0', 'month1', 'month2', 'action'];
  displayedColumnsMP: string[] = ['no', 'partNumber', 'dateDailyMp', 'totalPlan'];
  innerDisplayedColumns = ['version'];
  innerDisplayedColumnsF = ['version', 'action'];
  
  filteredChangeMould: any[] = [];  // Data yang sudah difilter
  filterType: string = 'changeDate';  // Default filter type

  kapaShift1: number = 0;
  kapaShift2: number = 0;
  kapaShift3: number = 0;

  marketingOrders: MarketingOrder[] = [];
  monthNow: number;
  yearNow: number;

  monthlyDailyPlan: MonthlyDailyPlan[] = [];
  monthlyPlanningsCurring: any[] = [];
  monthlyPlanningTass: any[] = [];
  monly: MonthlyDailyPlan[] = [];

  pageOfItems: Array<any>;
  pageSize: number = 5;
  partNum: number = 0;

  productDetails: any[] = [];
  searchTerm: string = '';  // Term pencarian
  searchTextMO: string = '';
  searchTextMOQS: string = '';
  selectedDetail: { idDetailDaily: number; countProduction: number } | null = null;
  
  shift: number = 0;
  shiftMonthlyPlanningCuring: DetailShiftMonthlyPlanCuring[] = [];
  shiftMonthlyPlanningTass: any[] = [];
  showMonthlyPlanning: boolean = false;
  totalKapa: number = 0;
  totalPages: number = 5;
  wct: string = '';
  workCenterText: string[] = [];
  @ViewChild('sortmMO', { static: false }) sortmMO!: MatSort;
  @ViewChild('paginatorMO', { static: false }) paginatorMO!: MatPaginator;
  @ViewChild('sortmMOQS', { static: false }) sortmMOQS!: MatSort;
  @ViewChild('paginatorMOQS', { static: false }) paginatorMOQS!: MatPaginator;
  @ViewChild('sortmMP', { static: false }) sortmMP!: MatSort;
  @ViewChild('paginatorMP', { static: false }) paginatorMP!: MatPaginator;
  @ViewChildren(MatTable) innerTables!: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  
  constructor(private router: Router, 
    private moService: MarketingOrderService, 
    private mpService: MonthlyPlanCuringService, 
    private parseDateService: ParsingDateService,
    private cd: ChangeDetectorRef
  ) { }

  isDateColumn(value: any): boolean {

    if(typeof value !== 'object'){
      return false;
    }
    return value && !isNaN(Date.parse(value));
  }
  
  
  parseDate(dateParse: string): string {
    return this.parseDateService.convertDateToString(dateParse);
  }

  formatDate(date: string | Date): string {
    if (!date) {
      return '';
    }
    const dateObj = new Date(date);

    const formattedDate = `${('0' + dateObj.getDate()).slice(-2)}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${dateObj.getFullYear()}`;
    return formattedDate;
  }
  

  ngOnInit(): void {
    //this.getAllMarketingOrder();
    this.getAllMoOnlyMonth();
    this.showMonthlyPlanning = true;
  }
  ngAfterViewInit() {
    if (this.dataSourceMO) {
      this.dataSourceMO.sort = this.sortmMO;
      this.dataSourceMO.paginator = this.paginatorMO;
    }
    // if (this.dataSourceMOQS) {
    //   this.dataSourceMOQS.sort = this.sortmMOQS;
    //   this.dataSourceMOQS.paginator = this.paginatorMOQS;
    // }
  }
  
  selectedMo: any = null; // Track selected item

  onSelectionChange(month0: any, month1: any, month2: any) {
    console.log("Selected Months:", month0, month1, month2);
  }

  openDetailModal(version: any): void {
    console.log(this.selectedND);
    let filteredFrontRear = this.selectedND.FrontRear.filter(item => item.versionCheating === version);
    let filteredMachineProduct = this.selectedND.machineProducts.filter(item => item.versionCheating === version);
    console.log("data product",filteredMachineProduct)
    // Accumulate the filtered data
    let combinedDataFrontRear = filteredFrontRear.reduce((acc, item) => {
      // If frontRearParallelId is 0, set the value as "No FrontRear"
      const key = item.frontRearParallelId === 0 ? "No FrontRear" : item.frontRearParallelId;
  
      // If the key doesn't exist in accumulator, add it
      if (!acc[key]) {
          acc[key] = {
              Paket: key,  // Use the determined key
              Data: item.itemCuring
          };
      } else {
          // If it exists, concatenate the itemCuring value
          acc[key].Data += '<br>' + item.itemCuring;
      }
      return acc;
  }, {});
  
    
    // Convert the result to an array if needed
    let resultFronRear = Object.values(combinedDataFrontRear);
    console.log(resultFronRear);

    let combinedDataMachineProduct = filteredMachineProduct.reduce((acc, item) => {
      // If the frontRearParallelId doesn't exist in accumulator, add it
    if (!acc[item.itemCuring]) {
        acc[item.itemCuring] = {
            "Item Curing": item.itemCuring,  // Change key to 'Paket'
            "Work Center Text": item.workCenterText             // Change key to 'Data'
        };
    } else {
        // If it exists, concatenate the itemCuring value
        acc[item.itemCuring][ "Work Center Text"] += '<br>' + item.workCenterText;
    }
      return acc;
    }, {});
    let resultMachineProduct = Object.values(combinedDataMachineProduct);
    console.log(resultMachineProduct);
  
    const tableOne = this.createTable(resultFronRear, ['Paket', 'Data']);
    const tableTwo = this.createTable(resultMachineProduct, ['Item Curing', 'Work Center Text']);
    Swal.fire({
      title: `Detail Information`,
      html: `
        <p><strong>ID:</strong> Version ${version}</p>
        <hr />
        <h3>Front Rear</h3>
        ${tableOne}
        <hr />
        <h3>Cheating</h3>
        ${tableTwo}
      `,
      showCloseButton: true,
      focusConfirm: false,
      width: '80%', // Adjust width if necessary
      confirmButtonText: 'Close'
    });
  }

  // Helper function to create table HTML content
  createTable(data: any[], columns: string[]): string {
    console.log(data);
    let tableHTML = '<table class="table table-bordered table-striped" style="width:100%;">';
    tableHTML += '<thead><tr>';
    columns.forEach(column => {
      tableHTML += `<th>${column}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
  
    data.forEach(row => {
      tableHTML += '<tr>';
      columns.forEach(column => {
        let cellData = row[column];
  
        // Check if the value in 'Item Curing' is an array
        if (Array.isArray(cellData)) {
          // Join array elements with commas or another separator
          cellData = cellData.join(', ');
        }
  
        tableHTML += `<td>${cellData}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    
    return tableHTML;
  }
    
  onDetail(nd: any,version:any): void {

    this.selectedND = nd;
    this.openDetailModal(version);
  }
  onExecute():void{

  }
  
  selectAll(event: any): void {
    const checked = event.target.checked;
    this.marketingOrders.forEach((order) => {
      order.selected = checked;
    });
  }

  onSearchChangeMO(): void {
    this.dataSourceMO.filter = this.searchTextMO.trim().toLowerCase();
  }

  resetSearchMO(): void {
    this.searchTextMO = '';
    this.dataSourceMO.filter = '';
  }
  onSearchChangeMOQS(): void {
    this.dataSourceMOQS.filter = this.searchTextMOQS.trim().toLowerCase();
  }

  resetSearchMOQS(): void {
    this.searchTextMOQS = '';
    this.dataSourceMOQS.filter = '';
  }

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
  expandedElement: any | null;

  toggleRow(element: any) {
    console.log("ele",element);
    // Toggle row expansion
    if (element.versions && (element.versions as MatTableDataSource<any>).data.length) {
      this.expandedElement = this.expandedElement === element ? null : element;
      this.cd.detectChanges(); 
    }else{
      Swal.fire({
        icon: 'info',
        title: 'No Data',
        text: 'No versions found.',
        timer: null,
        showConfirmButton: true,
        confirmButtonText: 'Ok',
      });
    }

    this.innerTables.forEach((table, index) => {
      if (table.dataSource) {
        console.log(`Table ${index + 1} Data:`, (table.dataSource as MatTableDataSource<any>).data);
      } else {
        console.log(`Table ${index + 1} has no data source.`);
      }
    });

  }


  async getAllMoOnlyMonth(): Promise<void> {
    this.moService.getAllMoOnlyMonth().subscribe(
      async (response: ApiResponse<any[]>) => {
        // Get unique combinations of MONTH0, MONTH1, and MONTH2
        let mapMonth = response.data.map((order) => {
          return {
            month0: new Date(order.MONTH0), // Format to Date objects for uniqueness
            month1: new Date(order.MONTH1),
            month2: new Date(order.MONTH2),
          };
        });
  
        let uniqueMap = new Map();
    
        mapMonth.forEach(order => {
          let key = `${order.month0.getTime()}-${order.month1.getTime()}-${order.month2.getTime()}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, order);
          }
        });
    
        // Get the unique combinations of months
        let uniqueMonths = Array.from(uniqueMap.values());
        console.log(uniqueMonths);
    
        this.marketingOrders = uniqueMonths;
    
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
    
          let buffer = response.data
            .filter(o => o.VERSION !== 0)
            .reduce((acc, order) => {
              let key = `${order.VERSION}_${order.MONTH0}_${order.MONTH1}_${order.MONTH2}`;
              const month0Date = new Date(`${order.MONTH0}`);
              const month1Date = new Date(`${order.MONTH1}`);
              const month2Date = new Date(`${order.MONTH2}`);
              if (!acc[key]) {
                acc[key] = {  
                  month0: month0Date,  
                  month1: month1Date,  
                  month2: month2Date,  
                  MO_ID: [order.MO_ID], 
                  mo_V: order.VERSION,
                };
              } else {
                acc[key].MO_ID.push(order.MO_ID);
              }
              return acc;
            }, {});
  
          // Convert object back to array
          buffer = Object.values(buffer);
  
          // Create an array of promises for all getCheatingFrontRearByMoId calls
          const frontRearPromises = buffer.map(data => {
            return this.moService.getCheatingFrontRearByMoId(data.MO_ID[0], data.MO_ID[1]).toPromise().then(
              (responseFrontRear: ApiResponse<any[]>) => {
                const uniqueVersions = responseFrontRear.data
                  .map(frontRear => frontRear.versionCheating) // Extract versionCheating from each FrontRear object
                  .filter((value, index, self) => self.indexOf(value) === index) // Filter unique versions
                  .map(version => ({ version: version }));
          
                // Adding the getMachineProductsmoByIdMo call
                return this.moService.getMachineProductsmoByIdMo(data.MO_ID[0], data.MO_ID[1]).toPromise().then(
                  (responseMachineProduct: ApiResponse<any[]>) => {
                    const machineProducts = responseMachineProduct.data; // Get machine products data
          
                    const versionedData = {
                      ...data,
                      FrontRear: responseFrontRear.data,
                      versions: new MatTableDataSource(uniqueVersions),
                      machineProducts: machineProducts, // Add machine products to the returned data
                    };
          
                    console.log("Versioned Data:", versionedData);
                    return versionedData;
                  }
                );
              }
            );
          });
          
  
          // Wait for all the promises to resolve
          const versionedBuffer = await Promise.all(frontRearPromises);
          console.log(versionedBuffer);
  
          // Use the versionedBuffer data for dataSourceMOQS
          this.dataSourceMOQS = new MatTableDataSource(versionedBuffer);
          this.dataSourceMOQS.sort = this.sortmMOQS;
          this.dataSourceMOQS.paginator = this.paginatorMOQS;
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
  
  getRandomVersion() {
    return Math.floor(Math.random() * 10) + 1; // Generates a random number between 1 and 10
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

  getTotalPlan(idCuring: number, date: string): number | string {
    // Cari data yang sesuai dengan idCuring dan tanggal
    const matchingData = this.monly.find((header) => this.formatDate(header.dateDailyMp) === date && header.detailIdCuring === idCuring);
    return matchingData ? matchingData.totalPlan : '-';
  }

  navigateToAddArDefectReject(month0: Date, month1: Date, month2: Date) {
    this.navigateWithFormattedDates('/transaksi/add-mo-ar-defect-reject/', month0, month1, month2);
  }
  
  navigateToFrontRear(month0: Date, month1: Date, month2: Date, version: string) {
    this.navigateWithFormattedDates('/transaksi/add-mo-front-rear/', month0, month1, month2, version);
  }
  
  navigateWithFormattedDates(route: string, month0: Date, month1: Date, month2: Date, version?: string) {
    const formattedMonth0 = this.formatDate(month0);
    const formattedMonth1 = this.formatDate(month1);
    const formattedMonth2 = this.formatDate(month2);
  
    // If version is provided, add it to the route
    if (version) {
      this.router.navigate([route, formattedMonth0, formattedMonth1, formattedMonth2, version]);
    } else {
      this.router.navigate([route, formattedMonth0, formattedMonth1, formattedMonth2]);
    }
  }
  

  navigateToViewMp() {
    this.router.navigate(['/transaksi/view-monthly-planning']);
  }

  navigateToViewMoFrontRear() {
    this.router.navigate(['/transaksi/add-mo-front-rear']);
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

  viewDetail(): void {
    this.fillChangeMould(this.changeMould);

    $('#changeMould').modal('show');
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
    this.dataSourceMP.sort = this.sortmMP;
    this.dataSourceMP.paginator = this.paginatorMP;
  }

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

  fillChangeMould(changeMould: any[]): void {
    this.changeMould = changeMould;
    this.filteredChangeMould = [...changeMould]; // Menampilkan data awal
  }

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

}

