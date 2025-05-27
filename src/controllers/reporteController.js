const pool = require('../config/db');
const PdfPrinter = require('pdfmake');
const Archivo = require('../models/archivo');

const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const printer = new PdfPrinter(fonts);

const formatFechaLarga = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const reporteController = {
  getReportes: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query(`
        SELECT p.*, i.nombre AS institucion
        FROM proyecto p
        JOIN institucion i ON p.idinstitucion = i.idinstitucion
        WHERE p.idproyecto = $1
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Proyecto no encontrado.' });
      }

      const proyecto = result.rows[0];

      const estudiantesResult = await pool.query(`
        SELECT u.nombre, u.apellidos
        FROM proyectoestudiantes pe
        JOIN usuario u ON pe.idusuario = u.idusuario
        WHERE pe.idproyecto = $1
      `, [id]);

      const estudiantes = estudiantesResult.rows;

      const archivos = await Archivo.find({ idProyecto: id })
        .sort({ fechaSubida: -1 })
        .select('nombre fechaSubida')
        .lean();

      const docDefinition = {
        pageMargins: [50, 60, 50, 60],
        content: [
          { text: 'Reporte del Proyecto Escolar', style: 'title' },
          { text: '\n' },

          { text: 'Información General del Proyecto', style: 'sectionHeader' },
          {
            table: {
              widths: ['35%', '65%'],
              body: [
                ['Nombre del Proyecto', proyecto.nombre],
                ['Descripción', proyecto.descripcion],
                ['Objetivos', proyecto.objetivos],
                ['Cronograma', proyecto.cronograma],
                ['Observaciones', proyecto.observaciones || 'N/A'],
                ['Institución', proyecto.institucion]
              ]
            },
            layout: 'lightHorizontalLines',
            style: 'table'
          },

          { text: 'Fechas del Proyecto', style: 'sectionHeader' },
          {
            columns: [
              { text: `Inicio: ${formatFechaLarga(proyecto.fechainicio)}`, width: '50%' },
              { text: `Fin: ${formatFechaLarga(proyecto.fechafin)}`, width: '50%' }
            ],
            margin: [0, 0, 0, 10]
          },

          { text: 'Estudiantes Vinculados', style: 'sectionHeader' },
          {
            ul: estudiantes.length > 0
              ? estudiantes.map(e => `${e.nombre} ${e.apellidos}`)
              : ['Sin estudiantes asignados.'],
            margin: [0, 0, 0, 10],
            style: 'text'
          },

          { text: 'Archivos Subidos', style: 'sectionHeader' },
          archivos.length > 0
            ? {
                table: {
                  widths: ['70%', '30%'],
                  body: [
                    ['Nombre del Archivo', 'Fecha de Subida'],
                    ...archivos.map(a => [
                      a.nombre,
                      formatFechaLarga(a.fechaSubida)
                    ])
                  ]
                },
                layout: 'lightHorizontalLines',
                style: 'table'
              }
            : {
                text: 'No se han subido archivos.',
                italics: true,
                style: 'text'
              },

          { text: `\nGenerado el: ${formatFechaLarga(new Date())}`, style: 'footer' }
        ],
        styles: {
          title: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            color: '#003366',
            margin: [0, 0, 0, 20]
          },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            color: '#003366',
            margin: [0, 20, 0, 10]
          },
          table: {
            margin: [0, 0, 0, 20],
            fontSize: 10
          },
          text: {
            fontSize: 11
          },
          footer: {
            fontSize: 9,
            alignment: 'right',
            color: '#888888',
            margin: [0, 30, 0, 0]
          }
        },
        defaultStyle: {
          font: 'Roboto'
        }
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=reporte_proyecto_${id}.pdf`);
      pdfDoc.pipe(res);
      pdfDoc.end();

    } catch (error) {
      console.error('Error al generar el reporte PDF:', error);
      res.status(500).json({ message: 'Error al generar el reporte PDF.' });
    }
  }
};

module.exports = reporteController;
