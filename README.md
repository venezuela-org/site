# Conexión RedJIV

**Tu primera contribución científica: pequeña, pública y revisable.** Una propuesta para conectar estudiantes e investigadores con trabajo científico remoto de utilidad pública, vinculada a RedJIV, un grupo de la ACFIMAN.

**Your first scientific contribution: small, public and reviewable.** A proposal connecting students and researchers through useful remote scientific work, connected to RedJIV, a group of ACFIMAN.

| Quiero… / I want to… | Español | English |
| --- | --- | --- |
| Explorar / Explore | [Página](https://venezuela-org.github.io/site/) | [Website](https://venezuela-org.github.io/site/en/) |
| Empezar / Get started | [6 fichas de tareas](public/es/primeras-contribuciones.md) | [6 starter briefs](public/en/first-contributions.md) |
| Entender la propuesta / Understand the proposal | [Plan público](public/es/plan-publico.md) | [Public plan](public/en/public-plan.md) |
| Compartir un borrador / Share a draft | [Cómo contribuir](CONTRIBUTING.md#español) | [Contribution guide](CONTRIBUTING.md#english) |
| Presentarme / Introduce myself | [Discord](https://discord.gg/yWhUUvrhpj) | [Discord](https://discord.gg/yWhUUvrhpj) |

No necesitas programar: puedes comprobar fuentes, mejorar documentación, revisar accesibilidad o aprender a leer una tarea de mapeo. Cada ficha propone un primer borrador de **60–120 minutos**, sus límites y criterios de revisión. Son propuestas educativas, no asignaciones activas ni una garantía de mentoría. Confirma prioridad y revisión con la comunidad antes de ampliar el trabajo.

You do not need to code: check sources, improve documentation, review accessibility or learn to read a mapping task. Each brief proposes a **60–120-minute** first draft with scope and review criteria. These are educational proposals, not active assignments or guaranteed mentorship. Confirm priority and review availability with the community before expanding the work.

> **No es un servicio de emergencia / Not an emergency service.** No publiques casos personales ni solicitudes urgentes en este repositorio. Usa los canales oficiales de tu localidad. Do not post personal cases or urgent requests here; use local official channels.

## Prueba algo ahora / Try something now

- [Tabla con datos sintéticos](examples/synthetic-table/README.md): ejecuta un ejemplo completo, cambia una fila y comprueba el resultado. / Run a complete example, change a row and check the result.
- [Plantilla de verificación de fuentes](examples/source-check/README.md): una tabla vacía y los campos que necesitas. / An empty table with the fields you need.

## Desarrollo / Development

Requiere Node.js 22 o posterior. **Sin dependencias ni instalación de paquetes.** Los HTML y documentos públicos generados se incluyen en Git para servir directamente con GitHub Pages.

Requires Node.js 22 or newer. **No dependencies or package installation.** Generated HTML and public documents are committed so GitHub Pages can serve them directly. `.nojekyll` preserves the static routes and downloadable Markdown files.

```sh
npm run build     # Generate both languages, guides and Markdown documents
npm run verify    # Check generated files, links, content and interactive behaviour
python3 -m http.server 8000
```

Abre / Open `http://localhost:8000/`, `/en/`, `/guia/` or `/en/guide/`. El sitio también se puede leer abriendo `index.html` directamente; copiar al portapapeles depende de los permisos del navegador. The site can also be read by opening `index.html` directly; clipboard access depends on browser permissions.

### Dónde editar / Where to edit

| Archivo / File | Responsabilidad / Purpose |
| --- | --- |
| `content/site.json` | Fuente única bilingüe: textos, tareas, rutas, enlaces y fecha editorial / Bilingual source for copy, tasks, routes, links and editorial date |
| `scripts/build.mjs` | Generación determinista y escape de texto / Deterministic generation and text escaping |
| `assets/site.css` | Diseño adaptable, foco, contraste e impresión / Responsive layout, focus, contrast and print |
| `assets/site.js` | Filtros y copia opcionales; sin red ni almacenamiento / Optional filters and copy, with no network calls or storage |
| `tests/` | Comportamiento, enlaces, contenido y salida generada / Behaviour, links, content and generated output |
| `index.html`, `en/`, `guia/`, `public/` | Salida generada: no editar a mano / Generated output: do not edit by hand |

Después de editar el contenido o las plantillas, ejecuta `npm run build` y añade también los archivos generados al PR. After editing content or templates, run `npm run build` and include generated files in the PR. CI checks that they match.

## Revisión antes de publicar / Review before publishing

- Confirma con la comunidad el estado de la propuesta; no inventes fechas, financiación, alianzas, plazas ni personas revisoras. / Confirm proposal status with the community; do not invent dates, funding, partnerships, openings or reviewers.
- Comprueba fuentes externas en origen. La fecha editorial indica revisión de los textos, **no verificación de que un servicio está operativo**. / Check external sources at their origin. The editorial date records a copy review, **not verification that a service is operational**.
- Revisa teclado, zoom al 200 %, móvil, ES/EN, JavaScript desactivado e impresión. / Check keyboard navigation, 200% zoom, mobile, ES/EN, disabled JavaScript and printing.
- La guía `/guia/` o `/en/guide/` está preparada para imprimir con fichas completas y direcciones de contacto. / The guide routes print complete briefs and contact addresses.

## Publicación y privacidad / Publishing and privacy

Publica únicamente el contenido público de este repositorio. Los inventarios de miembros, contactos, intake y documentos operativos privados pertenecen a otro espacio. No añadas datos personales, historiales clínicos, casos de menores ni ubicaciones de personas vulnerables, ni siquiera en issues, commits o capturas. No hay formularios de recepción, analítica, cookies ni almacenamiento del mensaje de presentación en la página. El navegador solo copia el texto cuando se lo pides. Los enlaces a terceros te llevan fuera del sitio.

Publish only this repository’s public content. Member inventories, contacts, intake and private operational documents belong elsewhere. Do not add personal data, clinical histories, children’s cases or locations of vulnerable people, including in issues, commits or screenshots. The page has no intake forms, analytics, cookies or introduction-message storage. The browser copies text only when requested. Third-party links leave the site.

En GitHub Pages, configura la rama `main` y la carpeta raíz como fuente; consulta la configuración vigente del repositorio antes de cambiarla. Este PR no cambia hosting ni publica una versión. / For GitHub Pages, use `main` and the repository root as the source; check the repository’s current configuration before changing it. This PR does not change hosting or publish a release.

## Licencia / License

[CC BY-SA 4.0](LICENSE.md), atribución / attribution: Conexión RedJIV, con el apoyo de / supported by [Creative Commons Venezuela](https://ve.creativecommons.net/). La ilustración vectorial es original, con asistencia de IA. `img/ccve.png`, de Creative Commons Venezuela, se conserva con su crédito y se usa para la vista previa social. / The vector illustration is original, made with AI assistance. Creative Commons Venezuela’s `img/ccve.png` is retained with attribution and used for social previews.
