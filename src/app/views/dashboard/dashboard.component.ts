import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { DashboardPPIC } from '../../services/Dashboard/PPIC/pic.service';

@Component({
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];
  public mainChartData4: Array<number> = [];
  public mainChartData5: Array<number> = [];
  public mainChartData6: Array<number> = [];

  constructor(private dashboardPPIC: DashboardPPIC) {}

  selectedYear: number = new Date().getFullYear(); // Default tahun ini
  availableYears: number[] = []; // Daftar tahun
  formattedYear: string = `Year: ${new Date().getFullYear()}`;

  setYear(event: any) {
    this.selectedYear = event.getFullYear();
    this.formatYear();
    this.fetchWorkDays(this.selectedYear);
  }

  // Method untuk meng-update formattedYear sesuai kebutuhan format
  formatYear(): void {
    // Contoh format: "Year: 2025"
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
    this.generateYears();
    this.fetchWorkDays(this.selectedYear); // Ambil data untuk tahun default
  }

  fetchWorkDays(year: number) {
    this.dashboardPPIC.getWorkDayAllMonth(year).subscribe((data) => {
      this.mainChartData1 = data.map((d: any) => d.totalWdTl);
      this.mainChartData2 = data.map((d: any) => d.totalWdTt);
      this.mainChartData3 = data.map((d: any) => d.wdNormalTire);
      this.mainChartData4 = data.map((d: any) => d.wdOtTt);
      this.mainChartData5 = data.map((d: any) => d.wdOtTl);
      this.mainChartData6 = data.map((d: any) => d.wdNormalTube);

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
