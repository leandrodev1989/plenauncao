import { Song, Setlist } from '../types';

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Porque Ele Vive',
    artist: 'Harpa Cristã',
    key: 'G',
    link: 'https://www.youtube.com/watch?v=reXf4Fidm-w',
    lyrics: `Deus enviou Seu Filho amado
Para salvar, para perdoar
Na cruz morreu por meus pecados
Mas ressurgiu e vivo com o Pai está

Porque Ele vive, posso crer no amanhã
Porque Ele vive, temor não há
Mas bem eu sei, eu sei, que a minha vida
Está nas mãos do meu Jesus, que vivo está

E quando, enfim, chegar a hora
Em que a morte enfrentarei
Sem medo, então, terei vitória
Verei na Glória o meu Jesus que vivo está`
  },
  {
    id: 'song-2',
    title: 'Em Teus Braços',
    artist: 'Laura Souguellis',
    key: 'G',
    link: 'https://www.youtube.com/watch?v=076zUepIcx4',
    lyrics: `Seguro estou nos braços
Daquele que nunca me deixou
Seu amor perfeito sempre esteve
Repousado em mim

E se eu passar pelo vale acharei conforto em Teu amor
Pois Eu sei que não temerei

Porque dizes que sou Teu
E que cuidas de mim
E que estás comigo
Em Teus braços é o meu descanso`
  },
  {
    id: 'song-3',
    title: 'Quão Grande é o Meu Deus',
    artist: 'Soraya Moraes',
    key: 'C',
    link: 'https://www.youtube.com/watch?v=A5bCq3bN1X8',
    lyrics: `Quão grande é o meu Deus
Cantarei quão grande é o meu Deus
E todos hão de ver
Quão grande é o meu Deus

Com esplendor de um Rei
Vestido de majestade
A terra se alegra, a terra se alegra
Ele envolve a Si na Luz
E as trevas tentam fugir
E tremem à Sua voz, tremem à Sua voz`
  },
  {
    id: 'song-4',
    title: 'O Escudo',
    artist: 'Voz da Verdade',
    key: 'Am',
    link: 'https://www.youtube.com/watch?v=d_kFpQnshgA',
    lyrics: `Por toda a minha vida, ó Senhor, Te louvarei
Pois meu fôlego é Tua vida, e nunca me cansarei
Posso ouvir a Tua voz, é mais doce do que o mel
Que me tira desta cova, e me leva até o céu

Não há ferrolhos nem portas que se fechem diante da Tua voz
Não há doenças, nem culpa que fiquem de pé diante de nós
E a tempestade se acalma quando Ela sopra em nosso viver
O Seu nome é doce, o Seu nome é o escudo de todo o que crer`
  },
  {
    id: 'song-5',
    title: 'Todavia Me Alegrarei',
    artist: 'Samuel Messias',
    key: 'E',
    link: 'https://www.youtube.com/watch?v=o0vI97bofH0',
    lyrics: `Eu tenho um Deus que não vai deixar
Essa tempestade me afogar
Ele dita as regras, Ele manda no vento
Ele acalma o mar

Mesmo se tudo der errado
E se os campos não produzirem
E se a videira murchar
E o rebanho morrer no curral
Todavia me alegrarei
Todavia me alegrarei no Senhor`
  }
];

export const INITIAL_SETLISTS: Setlist[] = [
  {
    id: 'setlist-1',
    name: 'Culto de Domingo - Manhã',
    date: '2026-05-24',
    items: [
      { songId: 'song-1', played: true },
      { songId: 'song-3', played: false },
      { songId: 'song-2', played: false }
    ]
  },
  {
    id: 'setlist-2',
    name: 'Culto de Jovens',
    date: '2026-05-30',
    items: [
      { songId: 'song-5', played: false },
      { songId: 'song-2', played: false }
    ]
  }
];
