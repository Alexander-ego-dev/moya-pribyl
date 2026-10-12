import sharp from 'sharp';
// Crop only the surrounding photo field. Preserve the supplied artwork and relief.
const artwork = await sharp('assets/icon-reference.jpg')
  .extract({ left: 210, top: 194, width: 836, height: 836 })
  .toBuffer();
for (const [name, size] of [
  ['icon-192-v2.png', 192],
  ['icon-512-v2.png', 512],
  ['icon-maskable-v2.png', 512],
  ['apple-touch-icon-v2.png', 180],
]) await sharp(artwork).resize(size, size).png().toFile(`public/${name}`);
