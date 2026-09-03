/**
 * One-off: sube las fotos de EJEMPLO de menús (assets/menu-presets del
 * repo de la app) a Cloudinary, bajo MenuDays/menu-presets/<carpeta>/<n>.
 *
 * Motivo: en el APK release esas imágenes venían bundleadas con require()
 * y en Android resolvían a un recurso "drawable" sin ruta file:// -> el
 * subidor de multipart no las podía leer y "publicar menú con foto de
 * ejemplo" tiraba error. Hosteándolas, la app las baja como archivo real
 * y las sube igual que una foto de cámara. De paso el APK pesa ~3.5MB
 * menos.
 *
 * Uso (desde menu-days-api/):  node scripts/upload-menu-presets.js
 *
 * Imprime un mapa { "<carpeta>-<n>": "<secure_url>" }.
 *
 * NOTA: las imágenes fuente (MenuDays-app/assets/menu-presets/) se
 * quitaron del repo de la app para aligerar el APK. Si hay que
 * re-subirlas, restaurarlas desde el historial de git:
 *   git -C ../MenuDays-app checkout <commit-previo> -- assets/menu-presets
 * o apuntar PRESETS_DIR abajo a otra carpeta con la misma estructura.
 */
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// assets/menu-presets del repo de la app (hermano de este repo).
const PRESETS_DIR = path.resolve(
  __dirname,
  '../../MenuDays-app/assets/menu-presets',
);

const CLOUD_FOLDER = 'MenuDays/menu-presets';

async function main() {
  if (!fs.existsSync(PRESETS_DIR)) {
    console.error(`No existe la carpeta de presets: ${PRESETS_DIR}`);
    process.exit(1);
  }

  const folders = fs
    .readdirSync(PRESETS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  /** @type {Record<string, string>} */
  const map = {};
  let ok = 0;
  let fail = 0;

  for (const folder of folders) {
    const dir = path.join(PRESETS_DIR, folder);
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    for (const file of files) {
      const n = path.basename(file, path.extname(file));
      const presetId = `${folder}-${n}`;
      const localPath = path.join(dir, file);

      try {
        const res = await cloudinary.uploader.upload(localPath, {
          folder: `${CLOUD_FOLDER}/${folder}`,
          public_id: n,
          overwrite: true,
          unique_filename: false,
          use_filename: false,
          resource_type: 'image',
          format: 'jpg',
          // Normaliza a un tamaño razonable para una card (no hace falta
          // más resolución; abarata la bajada en la app).
          transformation: [{ width: 1080, crop: 'limit', quality: 'auto:good' }],
        });
        map[presetId] = res.secure_url;
        ok++;
        console.log(`  ✓ ${presetId} -> ${res.secure_url}`);
      } catch (err) {
        fail++;
        console.error(`  ✗ ${presetId}:`, err && err.message ? err.message : err);
      }
    }
  }

  console.log(`\n=========  ${ok} OK, ${fail} con error  =========\n`);
  console.log(JSON.stringify(map, null, 2));
  console.log('\n===============================================\n');
}

main();
