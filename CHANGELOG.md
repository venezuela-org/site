# Changelog

## v1.4 (referencias en terreno y cierre)

- Canales establecidos con referencias específicas de Venezuela, verificadas: guía del CICR para afectados (con teléfonos de búsqueda de la Cruz Roja Venezolana), UNICEF LAC, OCHA Venezuela, ReliefWeb (página del desastre) y Cáritas Venezuela.
- HOT (SOS Venezuela) añadido a los canales con acción inmediata (Tasking Manager y MapSwipe); el track A se redefine para construir sobre HOT, no duplicarlo.
- Directorio privado ampliado con las iniciativas en curso detectadas (HOT, ve360_, Cáritas La Guaira, Medicina UCV, Cámara Suiza, Mundo UR) y sus implicaciones por track.
- Diagramas del manual interno corregidos (tracks y ecosistema, sin superposiciones, líneas de borde a borde).
- Ilustración de Creative Commons Venezuela integrada en la sección Apoyar, con crédito; nota de transparencia de IA ajustada para ser exacta.
- Metadatos sociales corregidos al repositorio real (venezuela-org.github.io/site) usando la ilustración como vista previa.

## v1.3 (engagement y una sola identidad visual)

- Página pública rediseñada para enganchar a estudiantes y académicos, con palancas honestas: identidad, concreción, autoría, entrada de baja fricción y prueba social real.
- Nueva banda de cifras reales de la red: 48 investigadores, 9 disciplinas, 14 países, 6 tracks, con conteo animado (respeta reduced motion).
- Chip de "Próximo sprint" en el hero, con la fecha real y los días que faltan, calculado en el navegador (10 jul, 24 jul, 7 ago 2026).
- Sección "Empieza en 3 pasos" (Discord, track y horas, primer entregable) con CTA directa.
- Nueva sección "Tu nombre, primero": la autoría como incentivo central, con una ilustración original de un paper con el primer autor resaltado y DOI en Zenodo.
- Motivo de marca compartido: anillos sísmicos concéntricos y regla degradada ámbar a teal bajo los títulos.
- `ops.html` alineado al mismo lenguaje visual (misma regla degradada, sombras, mini banda de cifras, cinta teal de manual interno) para que ambas páginas se sientan un solo producto.
- Menú simplificado: Situación, Origen, Empezar, Tracks, Ecosistema, Autoría, Apoyar, Plan.

## v1.2 (origen y principios)

- Se quitó la sección de Presentaciones. Eran dos enlaces de Google Slides sin contenido claro y no aportaban.
- Nueva banda "De dónde viene": el proyecto se enmarca en el linaje de CoAfina y el hackathon de datos abiertos de LA-CoNGA, con su idea original de convertir datos abiertos en soluciones que transformen realidades. Añadida también al plan público.
- Nueva sección "Lo que nos hace distintos": tarjetas de principios con analogías sencillas, en el espíritu de ethereum.org (perfil bajo, no duplicar sino conectar, utilidad antes que ruido, abierto y verificable, autoría, vía organismos establecidos).
- Se conserva el estilo cálido, el contexto y las ilustraciones originales.

## v1.1 (ecosistema)

- Nueva sección pública "Ecosistema digital de emergencia: no duplicar, conectar mejor". El proyecto se posiciona como capa de coordinación, verificación, documentación y protección, no como otra plataforma.
- Directorio seguro de plataformas ciudadanas existentes por categoría, con propósito, dominio, estado (todo "por verificar"), sensibilidad de datos, fecha de revisión y advertencias. No se reproduce ningún dato personal.
- Aviso claro de que el proyecto no reemplaza servicios de emergencia, hospitales, Protección Civil ni registros oficiales, y de que circulan sitios de imitación (se marca el mismatch venetebusca.com contra venezuelatebusca.com y radarvzla.com contra radarvenezuela.org).
- Se priorizan canales establecidos: CICR y Cruz Roja (Restablecimiento del Contacto), UNICEF, OCHA. Para niños: solo enlace y advertencia fuerte, verificación presencial y protección infantil.
- Nuevo track F, mapeo del ecosistema digital, con entregable a 7 días (directorio verificado) y a 30 días (recomendación de interoperabilidad y protección de datos). Añadido a la página y a los documentos privados (MVD y DoD, plan a 30 días, RACI, riesgos, clasificación de datos, y un directorio de trabajo `11-ecosistema-directorio.md`).

## v1.0 (final pass)

Cambios grandes:
- Separación de dos capas: página pública segura (`index.html`, fuente en `public/`) y documentos de operación privados (`private/`). La página pública ya no incrusta los documentos detallados.
- Se retiraron de la página pública: nombres de personas dentro de Venezuela, ubicaciones inferidas, estructura de GitHub y cifras de víctimas fijas en el hero.
- Los documentos detallados y sensibles se movieron a `private/` (incluye el inventario de talento y el detalle de grupos con leads).

Añadido a la página pública:
- Caja de "Situación" con fecha de actualización, fuentes y aviso de que las cifras son preliminares y cambian. Sin número de víctimas en el hero.
- Sección "Qué entregaremos en 30 días".
- Sección "Lo que no haremos".
- CTAs claras: Sumarse, Leer el plan, Apoyar, Discord.
- Presentaciones enlazadas como tarjetas (retiradas más adelante en la v1.2).
- Metadatos de vista previa social (Open Graph y Twitter).
- Texto alternativo en imágenes, etiquetas aria, navegación por teclado con foco visible, contraste revisado y soporte de prefers-reduced-motion.
- Nota de transparencia de IA acotada a las ilustraciones.

Documentos de operación nuevos (`private/`):
- Resumen ejecutivo, plan a 30 días, MVD y definición de terminado por track, RACI, registro de riesgos, intake, montaje de GitHub, clasificación de datos, presupuesto, gobernanza y seguridad, decisiones para el comité.

Realismo:
- Arranque con E, A y C. D tras salvaguardas de datos y ética. B si geociencias confirman. Cada track con un primer entregable remoto de baja dependencia.

Otros:
- `LICENSE.md` (CC BY-SA 4.0), `CHANGELOG.md`, README actualizado con advertencia de privacidad y estructura.

## Historial previo

Iteraciones anteriores: página de ideas, plan bilingüe, sitio navegable, experiencia de scroll cálida, tablero con hackathon de largo plazo, ilustraciones originales, Discord y presentaciones, crédito y licencia de Creative Commons Venezuela.
