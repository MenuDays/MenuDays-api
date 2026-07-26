import fs from "fs";
import path from "path";
import axios from "axios";

const seedPath = path.join(
  __dirname,
  "..",
  "prisma",
  "seeds",
  "ciudades.seed.ts",
);

const salidaPath = path.join(
  __dirname,
  "ciudades-con-coordenadas.ts",
);

const seed = fs.readFileSync(seedPath, "utf8");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const alias: Record<string, string> = {
  "Oña": "San Felipe de Oña",
  "Sígsig": "Sigsig",
  "Chimbo": "San José de Chimbo",
  "Espejo": "El Ángel",
  "Montúfar": "San Gabriel",
  "San Pedro de Huaca": "Huaca",
  "Colta": "Villa La Unión",
  "Quinindé": "Rosa Zárate",
  "Rioverde": "Rioverde",
  "Isabela": "Puerto Villamil",
  "Alfredo Baquerizo Moreno (Jujan)": "Jujan",
  "Durán": "Durán",
  "General Antonio Elizalde (Bucay)": "Bucay",
  "Marcelino Maridueña": "Coronel Marcelino Maridueña",
  "Antonio Ante": "Atuntaqui",
  "San Miguel de Urcuquí": "Urcuquí",
  "Espíndola": "Amaluza",
  "24 de Mayo": "Sucre",
  "Tiwintza": "Santiago",
  "Quijos": "Baeza",
  "Mejía": "Machachi",
  "Pedro Moncayo": "Tabacundo",
  "Rumiñahui": "Sangolquí",
  "San Miguel de los Bancos": "Los Bancos",
  "Cascales": "El Dorado de Cascales",
  "Putumayo": "Puerto El Carmen",
  "Sucumbíos": "La Bonita",
  "Baños de Agua Santa": "Baños",
  "Nangaritza": "Guayzimi",
};

async function buscarCiudad(
  ciudad: string,
  provincia: string,
) {
  const nombreAlias = alias[ciudad];

  const consultas = [
    `${ciudad}, ${provincia}, Ecuador`,
    nombreAlias
      ? `${nombreAlias}, ${provincia}, Ecuador`
      : null,
    `${ciudad} Ecuador`,
    nombreAlias
      ? `${nombreAlias} Ecuador`
      : null,
    ciudad,
    nombreAlias ?? null,
  ].filter(Boolean) as string[];

  for (const query of consultas) {
    try {
      const { data } = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: query,
            format: "jsonv2",
            limit: 1,
          },
          headers: {
            "User-Agent":
              "MenuDays Coordinate Importer",
          },
        },
      );

      if (data.length) {
        console.log(
          `   ✔ Encontrada con: ${query}`,
        );

        return {
          lat: data[0].lat,
          lon: data[0].lon,
        };
      }
    } catch {}

    await sleep(300);
  }

  return null;
}

async function main() {
  const regex =
    /\/\/ ===========================\s*\/\/ ([^\n]+)[\s\S]*?(?=(\/\/ ===========================)|$)/g;

  let resultado = seed;

  let match;

  while ((match = regex.exec(seed)) !== null) {
    const provincia = match[1].trim();

    const bloque = match[0];

    const nuevoBloque = await reemplazarBloque(
      bloque,
      provincia,
    );

    resultado = resultado.replace(
      bloque,
      nuevoBloque,
    );
  }

  fs.writeFileSync(salidaPath, resultado);

  console.log(
    "Archivo generado:",
    salidaPath,
  );
}

async function reemplazarBloque(
  texto: string,
  provincia: string,
) {
  const regexCiudad =
    /{\s*nombre:\s*"([^"]+)",\s*provincia_id:\s*([^}]+?)}/gs;

  let nuevo = texto;

  let ciudad;

  while ((ciudad = regexCiudad.exec(texto)) !== null) {
    const nombre = ciudad[1];

    console.log(
      `Buscando ${nombre} (${provincia})...`,
    );

    const geo = await buscarCiudad(
      nombre,
      provincia,
    );

    await sleep(1100);

    if (!geo) {
      console.log(
        "❌ No encontrada:",
        nombre,
      );
      continue;
    }

    nuevo = nuevo.replace(
      ciudad[0],
      `{
  nombre: "${nombre}",
  latitud: new Prisma.Decimal("${geo.lat}"),
  longitud: new Prisma.Decimal("${geo.lon}"),
  provincia_id: ${ciudad[2]}
}`,
    );

    console.log("✅");
  }

  return nuevo;
}

main();