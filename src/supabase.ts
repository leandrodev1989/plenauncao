import { createClient } from '@supabase/supabase-js';
import { Song, Setlist } from './types';

let rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
// Clean the URL for @supabase/supabase-js to prevent initialization issues
if (rawUrl.endsWith('/rest/v1/')) {
  rawUrl = rawUrl.substring(0, rawUrl.length - 8);
} else if (rawUrl.endsWith('/rest/v1')) {
  rawUrl = rawUrl.substring(0, rawUrl.length - 7);
}
if (rawUrl.endsWith('/')) {
  rawUrl = rawUrl.slice(0, -1);
}

const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!rawUrl && !!supabaseKey;

export const supabase = isSupabaseConfigured 
  ? createClient(rawUrl, supabaseKey)
  : null;

// Ensure tables 'songs' and 'setlists' are configured in Supabase.
// Songs model maps to table 'songs'
// Setlists model maps to table 'setlists'

export async function getSongsFromSupabase(): Promise<Song[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('title', { ascending: true });
    
    if (error) {
      console.warn('Supabase: Erro ao carregar musicas. Verifique se a tabela "songs" existe.', error);
      return null;
    }
    return data as Song[];
  } catch (err) {
    console.error('Supabase getSongsFromSupabase exception:', err);
    return null;
  }
}

export async function saveSongToSupabase(song: Song): Promise<boolean> {
  if (!supabase) return false;
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
      console.error('Supabase saveSongToSupabase error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase exception saving song:', err);
    return false;
  }
}

export async function deleteSongFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase deleteSongFromSupabase error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase exception deleting song:', err);
    return false;
  }
}

export async function getSetlistsFromSupabase(): Promise<Setlist[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('setlists')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.warn('Supabase: Erro ao carregar repertorios. Verifique se a tabela "setlists" existe.', error);
      return null;
    }
    return data as Setlist[];
  } catch (err) {
    console.error('Supabase getSetlistsFromSupabase exception:', err);
    return null;
  }
}

export async function saveSetlistToSupabase(setlist: Setlist): Promise<boolean> {
  if (!supabase) return false;
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
      console.error('Supabase saveSetlistToSupabase error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase exception saving setlist:', err);
    return false;
  }
}

export async function deleteSetlistFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('setlists')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase deleteSetlistFromSupabase error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase exception deleting setlist:', err);
    return false;
  }
}
