# Contribuir / Contributing

## Español

Puedes empezar con una [ficha de 60–120 minutos](public/es/primeras-contribuciones.md). No necesitas ser parte de la red, saber programar ni publicar tu CV. Leer y preparar un ejercicio con información pública no requiere asignación. Antes de ampliar el trabajo, pregunta si sigue siendo útil y si alguien puede revisarlo. No se garantiza respuesta inmediata, mentoría, financiación ni reconocimiento académico.

1. Elige una ficha y lee su alcance y criterios de revisión.
2. Preséntala por [Discord](https://discord.gg/yWhUUvrhpj) o abre una [propuesta](https://github.com/venezuela-org/site/issues/new?template=contribution.yml). Describe la tarea y tu disponibilidad sin compartir contactos privados. Si no hay revisión disponible, mantén el resultado como ejercicio o borrador claramente identificado.
3. Comparte un borrador pequeño. Incluye resultado, fuentes y fechas, instrucciones para comprobarlo, límites y ayuda de IA utilizada. Si no usas GitHub, acuerda la entrega del documento por Discord.
4. Para cambiar este repositorio, crea una rama o fork y abre un PR contra `main`. Explica el problema y el comportamiento resultante. Para texto o fichas, edita `content/site.json` y mantén ambos idiomas alineados. Ejecuta `npm run build` y `npm run verify`; incluye los archivos generados.
5. Espera revisión antes de presentar el resultado como aprobado o usarlo operativamente. La disponibilidad de una fuente no valida su contenido ni confirma que un servicio funciona.

### Un buen primer borrador

- Resuelve una sola pregunta o mejora concreta.
- Se puede revisar con los archivos y pasos incluidos.
- Distingue hechos, supuestos y dudas; no inventa fuentes.
- No publica datos personales. Usa datos sintéticos para ejercicios y marca que son ficticios.
- Reconoce las contribuciones reales. Autoría, orden, licencias y publicación se acuerdan antes de difundir; no se promete primer autor ni DOI.

### Salud, agua y riesgo

Las fichas son ejercicios de documentación y aprendizaje. No presentes recomendaciones clínicas, dosificaciones, criterios de seguridad estructural o instrucciones de uso en terreno como aprobados. Necesitan revisión de especialistas y las salvaguardas correspondientes. No hagas scraping de registros de víctimas ni recopiles casos personales.

### Revisar cambios de la página

Además de `npm run verify`, comprueba `/`, `/en/`, `/guia/` y `/en/guide/` con teclado, móvil y zoom al 200 %. Prueba los filtros, el estado sin resultados, la copia y su alternativa manual. Con JavaScript desactivado, todas las tareas y enlaces deben seguir disponibles. Imprime desde el principio y después de filtrar: deben aparecer todas las tareas y las direcciones de contacto. Usa la guía para imprimir los criterios completos.

Si detectas información sensible, no la reproduzcas en un issue ni una captura. Consulta [SECURITY.md](SECURITY.md). Trata a las demás personas con respeto, critica el trabajo con argumentos y no publiques información de terceros.

## English

Start with a [60–120-minute brief](public/en/first-contributions.md). You do not need to belong to the network, know how to code or publish your CV. Reading and preparing a public-information exercise does not require assignment. Before expanding the work, ask whether it remains useful and whether someone can review it. An immediate response, mentorship, funding and academic recognition are not guaranteed.

1. Choose a brief and read its scope and review criteria.
2. Introduce it on [Discord](https://discord.gg/yWhUUvrhpj) or open a [proposal](https://github.com/venezuela-org/site/issues/new?template=contribution.yml). Describe the task and your availability without private contacts. If review is unavailable, keep the result clearly labelled as an exercise or draft.
3. Share a small draft. Include the result, sources and dates, checking instructions, limitations and AI assistance used. Without GitHub, agree on document delivery through Discord.
4. To change this repository, create a branch or fork and open a PR against `main`. Explain the problem and resulting behaviour. For copy or briefs, edit `content/site.json` and keep both languages aligned. Run `npm run build` and `npm run verify`; include generated files.
5. Wait for review before presenting work as approved or using it operationally. A reachable source does not validate its content or confirm service availability.

### A good first draft

- Addresses one question or concrete improvement.
- Can be reviewed using the included files and steps.
- Separates facts, assumptions and questions; does not invent references.
- Contains no personal data. Use synthetic data for exercises and label it fictional.
- Credits actual contributions. Agree on authorship, order, licensing and publication before sharing; first authorship and a DOI are not promised.

### Health, water and hazards

The briefs are documentation and learning exercises. Do not present clinical recommendations, dosages, structural safety criteria or field instructions as approved. These require specialist review and appropriate safeguards. Do not scrape victim registries or collect personal cases.

### Reviewing page changes

Alongside `npm run verify`, check `/`, `/en/`, `/guia/` and `/en/guide/` using a keyboard, mobile viewport and 200% zoom. Try filtering, no results, copying and the manual alternative. With JavaScript disabled, every task and link must remain available. Print from the top and after filtering: every task and the contact addresses should appear. Use the guide to print complete review criteria.

If you find sensitive information, do not reproduce it in an issue or screenshot. See [SECURITY.md](SECURITY.md). Treat others respectfully, discuss the work with evidence and do not publish third-party information.
