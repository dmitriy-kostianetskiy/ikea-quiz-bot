import * as gm from 'gm';

const imageMagic = gm.subClass({ imageMagick: true });

export async function buildImage(
  topLeftImage: string,
  topRightImage: string,
  bottomLeftImage: string,
  bottomRightImage: string,
  size: number
): Promise<Buffer> {
  const image = imageMagic(size, size)
    .in('-page', '+0+0')
    .in(topLeftImage)
    .in('-page', `+${size}+0`)
    .in(topRightImage)
    .in('-page', `+0+${size}`)
    .in(bottomLeftImage)
    .in('-page', `+${size}+${size}`)
    .in(bottomRightImage)
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
