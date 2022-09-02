import sharp from 'sharp';
import fetch from 'node-fetch';

export const resolveImage = async (
  imgSrc: string | null = null,
  isBase64 = false,
): Promise<string> => {
  if (!imgSrc)
    imgSrc =
      'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg';

  if (!isBase64) return imgSrc;

  const response = await fetch(imgSrc);
  const data = await response.buffer();

  if (response.status === 404) return resolveImage();

  const buffer = await sharp(data)
    .resize(250, 375, {
      fit: sharp.fit.cover,
      position: 'center',
      kernel: 'lanczos2',
      fastShrinkOnLoad: false,
    })
    .sharpen({
      sigma: 0.2,
    })
    .webp({
      quality: 80,
      lossless: true,
      nearLossless: true,
      alphaQuality: 100,
    })
    .toBuffer();

  return `data:image/webp;base64,${buffer.toString('base64')}`;
};
