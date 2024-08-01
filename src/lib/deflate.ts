// 压缩字符串，然后转换为Base64
export async function compressToBase64(str: string) {
  const uint8Array = new TextEncoder().encode(str);
  const cs = new CompressionStream('deflate');
  const compressedStream = new ReadableStream({
    start(controller) {
      controller.enqueue(uint8Array);
      controller.close();
    },
  }).pipeThrough(cs);

  const reader = compressedStream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }

  // 将Uint8Array块组合为一个单一数组
  const combinedChunks = new Uint8Array(
    chunks.reduce((acc, chunk) => {
      const tmp = new Uint8Array(acc.length + chunk.length);
      tmp.set(acc, 0);
      tmp.set(chunk, acc.length);
      return tmp;
    }, new Uint8Array())
  );

  // 转换为Base64字符串
  const base64String = btoa(Array.from(combinedChunks, (byte) => String.fromCharCode(byte)).join(''));
  return base64String;
}

// Base64解码并解压字符串
export async function decompressFromBase64(base64Str: string) {
  // 解码Base64字符串
  const strData = atob(base64Str);
  const charList = strData.split('');
  const uint8Array = new Uint8Array(charList.map((ch) => ch.charCodeAt(0)));
  const ds = new DecompressionStream('deflate');
  const decompressedStream = new ReadableStream({
    start(controller) {
      controller.enqueue(uint8Array);
      controller.close();
    },
  }).pipeThrough(ds);

  const reader = decompressedStream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }

  const combinedChunks = new Uint8Array(
    chunks.reduce((acc, chunk) => {
      const tmp = new Uint8Array(acc.length + chunk.length);
      tmp.set(acc, 0);
      tmp.set(chunk, acc.length);
      return tmp;
    }, new Uint8Array())
  );

  // 将Uint8Array解码为字符串
  const decompressedStr = new TextDecoder().decode(combinedChunks);
  return decompressedStr;
}
