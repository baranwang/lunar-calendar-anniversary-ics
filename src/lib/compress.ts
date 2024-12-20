import { deflateSync, inflateSync } from "zlib";

// 压缩字符串，然后转换为Base64
export async function compressToBase64(str: string) {
  return deflateSync(str).toString('base64');
}

// Base64解码并解压字符串
export async function decompressFromBase64(base64Str: string) {
  return inflateSync(Buffer.from(base64Str, 'base64')).toString();
}
