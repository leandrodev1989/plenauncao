import { createClient } from '@supabase/supabase-js';
import { Song, Setlist } from './types';

// 🔥 CONFIGURAÇÃO FIXA (TESTE TEMPORÁRIO)
const rawUrl = "https://xvsspyfvdvfddhwsfgwi.supabase.co";
const supabaseKey = "sb_publishable_qIhzqPVpVa4zaNXvDUAKVQ_SSfryeHH";

// 🔍 DEBUG
console.log("SUPABASE URL:", rawUrl);
console.log("SUPABASE KEY:", supabaseKey);

// ✅ CLIENTE SUPABASE
export const supabase = createClient(rawUrl, supabaseKey);

// ==========================
// SONGS
// ==========================

export async function getSongsFromSupabase(): Promise<Song[] | null> {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      console.warn('Erro ao carregar musicas:', error);
      return null;
    }

    return data as Song[];
  } catch (err) {
    console.error('Exception getSongs:', err);
    return null;
  }
}

export async function saveSongToSupabase(song: Song): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('songs')
      .upsert({
        id: song.id,
        title: song.title,
        artist: song.artist,
        key: song.key,
        lyrics: song.lyrics,
        link: song.link
      });

    if (error) {
      console.error('Erro ao salvar musica:', error);
      return false;
    }

    console.log("✅ Música salva com sucesso");
    return true;

  } catch (err) {
    console.error('Exception saving song:', err);
    return false;
  }
}

export async function deleteSongFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar musica:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception deleting song:', err);
    return false;
  }
}

// ==========================
// SETLISTS
// ==========================

export async function getSetlistsFromSupabase(): Promise<Setlist[] | null> {
  try {
    const { data, error } = await supabase
      .from('setlists')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.warn('Erro ao carregar setlists:', error);
      return null;
    }

    return data as Setlist[];
  } catch (err) {
    console.error('Exception getSetlists:', err);
    return null;
  }
}

export async function saveSetlistToSupabase(setlist: Setlist): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('setlists')
      .upsert({
        id: setlist.id,
        name: setlist.name,
        date: setlist.date,
        items: setlist.items
      });

    if (error) {
      console.error('Erro ao salvar setlist:', error);
      return false;
    }

    console.log("✅ Setlist salva com sucesso");
    return true;

  } catch (err) {
    console.error('Exception saving setlist:', err);
    return false;
  }
}

export async function deleteSetlistFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('setlists')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar setlist:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception deleting setlist:', err);
    return false;
  }
}