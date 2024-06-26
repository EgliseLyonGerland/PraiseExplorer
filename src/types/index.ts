export interface Song {
  id: string;
  title: string;
  authors?: string;
  copyright?: string;
  lyrics?: {
    text: string;
    type: "chorus" | "verse";
  }[];
}
