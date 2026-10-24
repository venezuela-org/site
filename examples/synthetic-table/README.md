# Una tabla reproducible / A reproducible table

Estos datos son **inventados**. Las categorías A, B y C no representan personas, lugares ni necesidades de ayuda. / These data are **invented**. Categories A, B and C do not represent people, places or aid needs.

Con Node.js 22 o posterior, desde la raíz del repositorio / With Node.js 22 or newer, from the repository root:

```sh
node examples/synthetic-table/summarise.mjs
```

Resultado esperado / Expected output:

```text
SYNTHETIC EXAMPLE / EJEMPLO SINTÉTICO
A: 6
B: 5
C: 1
```

## Tu primer cambio / Your first change

1. Lee las cinco filas de [data.json](data.json) y comprueba los totales a mano. / Read the five rows and check the totals by hand.
2. Cambia una cantidad. Antes de ejecutar, escribe qué total esperas y por qué. / Change one count. Before running, write the expected total and why.
3. Ejecuta el comando, compara el resultado y documenta la versión con `node --version`. / Run the command, compare the result and record `node --version`.
4. Comparte el diff, el resultado esperado/observado y una limitación del ejemplo. / Share the diff, expected/observed output and one limitation.

No añadas nombres, contactos ni ubicaciones. Este ejercicio no es un análisis de la situación real. / Do not add names, contacts or locations. This exercise is not an analysis of the real situation.
