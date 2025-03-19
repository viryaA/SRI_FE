import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { DashboardPPIC } from '../../services/Dashboard/PPIC/pic.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import Swal from 'sweetalert2';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductType } from '../../models/ProductType';
import { ProductTypeService } from '../../services/master-data/productType/productType.service';
import { ApiResponse } from '../../response/Response';

@Component({
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  filterForm: FormGroup;
  typeOptions: any[] = [
    { label: 'FED', value: 'FED' },
    { label: 'FDR', value: 'FDR' },
  ];
  errorMessage: string | null = null;
  categoryOptions: any[] = []; // Data untuk dropdown Category
  marketingOrders: any[] = []; // Data produk dari database
  filteredMarketingOrders: any[] = []; // Data produk yang sudah difilter
  type: string = ''; // Tambahkan ini
  category: string = ''; // Tambahkan ini

  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];
  public mainChartData4: Array<number> = [];
  public mainChartData5: Array<number> = [];
  public mainChartData6: Array<number> = [];

  select2Options = {
    placeholder: 'Pilih Type...', // Teks placeholder
    allowClear: true, // Memungkinkan pengguna menghapus pilihan
    width: '100%', // Lebar dropdown
  };

  constructor(private fb: FormBuilder, private dashboardPPIC: DashboardPPIC, private productType: ProductTypeService) {
    this.loadProductType();
  }
  public uomOptionData: Array<Select2OptionData>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };
  productTypes: ProductType[];

  private loadProductType(): void {
    this.productType.getAllProductType().subscribe(
      (response: ApiResponse<ProductType[]>) => {
        this.productTypes = response.data;
        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }
        this.uomOptionData = this.productTypes.map((element) => ({
          id: element.category.toString(), // Ensure the ID is a string
          text: element.category, // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load product type: ' + error.message;
      }
    );
  }

  selectedYear: number = new Date().getFullYear(); // Default tahun ini
  availableYears: number[] = []; // Daftar tahun
  formattedYear: string = `Year: ${new Date().getFullYear()}`;

  setYear(event: any) {
    this.selectedYear = event.getFullYear();
    this.formatYear();
    this.fetchWorkDays(this.selectedYear);
  }

  selectedMonth: string = '01-NOV-24';
  selectedType: string = 'FDR';
  selectedCategory: string = 'FDR TR TT';

  // getMarketingOrders() {
  //   this.dashboardPPIC.getMoByTypeCategory(this.selectedMonth, this.selectedType, this.selectedCategory).subscribe(
  //     (data) => {
  //       console.log(data);
  //       this.marketingOrders = data; // Menyimpan data yang diterima ke dalam array marketingOrders
  //       console.log('Marketing Orders: ', this.marketingOrders);
  //     },
  //     (error) => {
  //       console.error('Error fetching marketing orders:', error);
  //     }
  //   );
  // }

  convertMonthYear(input) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    let [year, month] = input.split('-');
    let shortYear = year.slice(-2); // Ambil dua digit terakhir dari tahun
    let shortMonth = months[parseInt(month) - 1]; // Ambil nama bulan

    return `01-${shortMonth}-${shortYear}`;
  }

  // Apply filter based on form values
  applyFilter(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Mo and MP.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const filterValue = this.filterForm.value;
    filterValue.monthYear = this.convertMonthYear(filterValue.monthYear);
    console.log('FILTER: ', filterValue.monthYear, filterValue.type, filterValue.category);

    this.dashboardPPIC.getMoByTypeCategory(filterValue.monthYear, filterValue.type, filterValue.category).subscribe(
      (data) => {
        Swal.close();
        console.log('data: ', data);
        this.marketingOrders = data;
      },
      (error) => {
        Swal.close();
        console.error('Error fetching marketing orders:', error);
        this.errorMessage = 'Error fetching marketing orders.';
      }
    );
  }

  // Method untuk meng-update formattedYear sesuai kebutuhan format
  formatYear(): void {
    this.formattedYear = `Year: ${this.selectedYear}`;
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.availableYears.push(i);
    }
  }
  onYearChange(event: any) {
    const fullDate = event.target.value; // Format: "YYYY-MM-DD"
    this.selectedYear = parseInt(fullDate.split('-')[0], 10); // Ambil hanya tahunnya
    this.fetchWorkDays(this.selectedYear);
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      monthYear: [''], // Input bulan dan tahun
      type: [''], // Dropdown type
      category: [''], // Dropdown category
    });

    this.generateYears();
    this.applyFilter();
    this.fetchWorkDays(this.selectedYear); // Ambil data untuk tahun default
  }

  fetchWorkDays(year: number) {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Mo and MP.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.dashboardPPIC.getWorkDayAllMonth(year).subscribe((data) => {
      this.mainChartData1 = data.map((d: any) => d.totalWdTl);
      this.mainChartData2 = data.map((d: any) => d.totalWdTt);
      this.mainChartData3 = data.map((d: any) => d.wdNormalTire);
      this.mainChartData4 = data.map((d: any) => d.wdOtTt);
      this.mainChartData5 = data.map((d: any) => d.wdOtTl);
      this.mainChartData6 = data.map((d: any) => d.wdNormalTube);

      Swal.close();
      this.updateChart();
    });
  }

  updateChart() {
    this.mainChartData = [
      { data: this.mainChartData1, label: 'Total WD TL' },
      { data: this.mainChartData2, label: 'Total WD TT' },
      { data: this.mainChartData3, label: 'WD Normal Tire' },
      { data: this.mainChartData4, label: 'WD OT TT' },
      { data: this.mainChartData5, label: 'WD OT TL' },
      { data: this.mainChartData6, label: 'WD Normal Tube' },
    ];
    console.log('Filter NIH: ');
  }

  public mainChartData: Array<any> = [];
  public mainChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Opsi untuk bar chart
  public mainChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: { drawOnChartArea: false },
        },
      ],
      yAxes: [
        {
          ticks: { beginAtZero: true, maxTicksLimit: 5 },
        },
      ],
    },
    legend: { display: true },
  };

  // Ubah chart type menjadi 'bar'
  public mainChartType = 'bar';
}
