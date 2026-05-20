export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  lyrics: string;
  link: string;
}

export interface SetlistItem {
  songId: string;
  played: boolean;
}

export interface Setlist {
  id: string;
  name: string;
  date: string;
  items: SetlistItem[];
}
