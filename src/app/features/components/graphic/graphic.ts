import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
//import { AppConfigService } from '@/service/appconfigservice';
import { ChartModule } from 'primeng/chart';
import { NoteService } from '../note/services/note_service';
import { NoteInterface } from '../note/interface/note_interface';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-graphic',
  imports: [ChartModule, MessageModule],
  templateUrl: './graphic.html',
  styleUrl: './graphic.css',
})
export class Graphic implements OnInit {
  private subjectItaceService = inject(NoteService);
  basicData: any;

  basicOptions: any;

  platformId = inject(PLATFORM_ID);
  countData: number = 0;

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
  this.subjectItaceService.getNotes().subscribe((response: any) => {
    console.log('Respuesta:', response);

    // Determinar si la respuesta es un array o un objeto paginado
    let notas: NoteInterface[] = [];
    if (Array.isArray(response)) {
      notas = response;
    } else if (response.results && Array.isArray(response.results)) {
      notas = response.results;
    }

    if (notas.length > 0) {
      this.countData = notas.length;
      const { labels, backgroundColor, data } = this.calcularResumenSimple(notas) as any;
      this.initChart(labels, backgroundColor, data);
    } else {
      this.countData = 0;
    }
  });
}
calcularResumenSimple(data: any[]) {
  const asignaturasMap = new Map<string, any>();

  data.forEach((item) => {
    // Normalizar: trim, pasar a minúsculas (opcional), eliminar espacios múltiples
    const nombreRaw = item.asignatura_nombre;
    const nombreNormalizado = nombreRaw.trim().replace(/\s+/g, ' '); // espacios simples
    // Si quieres ignorar mayúsculas/minúsculas, usa .toLowerCase() también
    // const nombreNormalizado = nombreRaw.trim().toLowerCase().replace(/\s+/g, ' ');
    
    const color = item.asignatura_color;
    const nota = item.nota;

    if (!asignaturasMap.has(nombreNormalizado)) {
      asignaturasMap.set(nombreNormalizado, {
        nombre: nombreRaw,        // guardamos el original para mostrar
        color: color,
        sumaNotas: nota,
        cantidad: 1,
      });
    } else {
      const entry = asignaturasMap.get(nombreNormalizado);
      entry.sumaNotas += nota;
      entry.cantidad++;
    }
  });

  const labels: string[] = [];
  const backgroundColor: string[] = [];
  const chartData: number[] = [];

  for (const entry of asignaturasMap.values()) {
    labels.push(entry.nombre);               // nombre original legible
    backgroundColor.push(entry.color);
    const promedio = entry.sumaNotas / entry.cantidad;
    chartData.push(Number(promedio.toFixed(2)));
  }

  return { labels, backgroundColor, data: chartData };
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
            label: 'calificaciones',
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
