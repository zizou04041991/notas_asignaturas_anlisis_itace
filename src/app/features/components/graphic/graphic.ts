import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
//import { AppConfigService } from '@/service/appconfigservice';
import { ChartModule } from 'primeng/chart';
import { NoteService } from '../note/services/note_service';
import { NoteInterface } from '../note/interface/note_interface';

@Component({
  selector: 'app-graphic',
  imports: [ChartModule],
  templateUrl: './graphic.html',
  styleUrl: './graphic.css',
})
export class Graphic implements OnInit {
  private subjectItaceService = inject(NoteService);
  basicData: any;

  basicOptions: any;

  platformId = inject(PLATFORM_ID);

  // configService = inject(AppConfigService);

  constructor(private cd: ChangeDetectorRef) {}

  /*themeEffect = effect(() => {
        if (this.configService.transitionComplete()) {
            if (this.designerService.preset()) {
                this.initChart();
            }
        }
    });*/

  ngOnInit() {
    this.subjectItaceService.getNotes().subscribe((value) => {
      if (value.length) {
        const result = this.calcularResumenSimple(value);
        const label = result.map((item) => item.nombre);
        const backgroundColor = result.map((item) => item.color);
        const data = result.map((item) => item.promedio as any);
        this.initChart(label, backgroundColor, data);
      }
    });
  }

  calcularResumenSimple(
    data: NoteInterface[],
  ) {
    const asignaturasMap = new Map();

    // Agrupar y sumar
    data.forEach((item) => {
      const id = item.asignatura.id;
      const nota = item.nota;

      if (!asignaturasMap.has(id)) {
        asignaturasMap.set(id, {
          nombre: item.asignatura.nombre,
          color: item.asignatura.color,
          sumaNotas: nota,
          cantidad: 1,
        });
      } else {
        const data = asignaturasMap.get(id);
        data.sumaNotas += nota;
        data.cantidad++;
      }
    });

    // Calcular promedios
    return Array.from(asignaturasMap.entries()).map(([id, data]) => ({
      id: id,
      nombre: data.nombre,
      color: data.color,
      promedio: (data.sumaNotas / data.cantidad).toFixed(2),
    }));
  }

  initChart(labels: string[], backgroundColor: string[], data: number[]) {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.basicData = {
        labels,
        //['Matemática', 'Física', 'Química', 'Biología'],
        datasets: [
          {
            label: 'Notas',
            data,
            //: [540, 325, 702, 620],
            backgroundColor,
            /*: [
              'rgba(249, 115, 22, 0.2)',
              'rgba(6, 182, 212, 0.2)',
              'rgb(107, 114, 128, 0.2)',
              'rgba(139, 92, 246, 0.2)',
            ],*/
            /*borderColor: [
              'rgb(249, 115, 22)',
              'rgb(6, 182, 212)',
              'rgb(107, 114, 128)',
              'rgb(139, 92, 246)',
            ],*/
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }
}
