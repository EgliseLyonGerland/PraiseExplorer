export default function extractDocumentId(docName: string) {
  const segments = docName.split("/");
  return segments[segments.length - 1];
}
