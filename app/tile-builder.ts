import * as gm from 'gm';

const imageMagic = gm.subClass({ imageMagick: true });

export function buildImage(
  [image1, image2, image3, image4]: string[],
  size: number
): Promise<Buffer> {
  const image = imageMagic(size, size)
    .in('-page', '+0+0')
    .in(image1)
    .in('-page', `+${size}+0`)
    .in(image2)
    .in('-page', `+0+${size}`)
    .in(image3)
    .in('-page', `+${size}+${size}`)
    .in(image4)
    .mosaic()
    .setFormat('png');

  return new Promise<Buffer>((resolve, reject) => {
    image.stream((error, stdout, stderr) => {
      if (error) { return reject(error); }

      const chunks = [];

      stdout.on('data', (chunk) => chunks.push(chunk));
      stdout.once('end', () => resolve(Buffer.concat(chunks)));
      stderr.once('data', (data) => reject(String(data)));
    });
  });
}
