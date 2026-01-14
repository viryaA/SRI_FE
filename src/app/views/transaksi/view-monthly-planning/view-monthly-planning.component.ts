import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MonthlyPlanCuringService } from 'src/app/services/transaksi/monthly plan curing/monthly-plan-curing.service';
import { MatTableDataSource } from '@angular/material/table';
import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApiResponse } from 'src/app/response/Response';
import { MonthlyPlanning } from 'src/app/models/MonthlyPlanning';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-view-monthly-planning',
  templateUrl: './view-monthly-planning.component.html',
  styleUrls: ['./view-monthly-planning.component.scss']
})
export class ViewMonthlyPlanningComponent implements OnInit {

  monthlyPlannings: MonthlyPlanning[] = [];
  searchText: string = '';

   // Pagination
   pageOfItems: Array<any>;
   pageSize: number = 5;
   totalPages: number = 5;
   displayedColumns: string[] = ['no', 'MONTH', 'TOTAL_PLAN_SUM', 'TOTAL_MO_MONTH_0','action'];
   dataSource: MatTableDataSource<MonthlyPlanning>;
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private mpService: MonthlyPlanCuringService, private parseDateService: ParsingDateService) { }

  ngOnInit(): void {
    this.getAllMarketingOrder();
  }

  navigateToAdd(){
    this.router.navigate(['/transaksi/add-monthly-planning'])
  }

  navigateToDetail(docNum: string): void {
    this.router.navigate(['/transaksi/view-detail-monthly-planning', docNum]);
  }

  parseDate(dateParse: string): string {
    return this.parseDateService.convertDateToString(dateParse);
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = '';
  }

  exportExcelMP(mo:any) {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while we Download Excel the monthly plan. This might take a while.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    console.log(mo);
    const date = new Date(mo.MONTH)
    const month = date.getMonth() + 1; // 11
    const year = date.getFullYear();   // 2024

    const monthDescription = monthNames[month - 1];

    const filename = `PREPARE PROD ${monthDescription.toUpperCase()} ${year}.xlsx`;

    this.mpService
      .ExportExcelMP(
        month, year, 0,
        0, 0, 0,
        0, 0, 0,
        0, 0,mo.MO_VERSION,mo.VERSION
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

  getAllMarketingOrder(): void {
    this.mpService.getAllMonthlyPlanning().subscribe(
      (response: ApiResponse<MonthlyPlanning[]>) => {
        this.monthlyPlannings = response.data;
        console.table(this.monthlyPlannings)
        if (this.monthlyPlannings.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: 'No marketing orders found.',
            timer: null,
            showConfirmButton: true,
            confirmButtonText: 'Ok',
          });
        } else {
          this.monthlyPlannings = response.data;
          this.dataSource = new MatTableDataSource(this.monthlyPlannings);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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

  protected readonly Number = Number;
}
