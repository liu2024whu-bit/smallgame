import {FILM_NAMES} from './film.js';

export const ALBUM_NAMES=FILM_NAMES;
export const ALBUM_SIZE=[1600,1100];
export const ALBUM_PAGE_SIZE=[620,620*314/376];
export const ALBUM_PLACES=[[24,270],[839,270],[24,830],[839,830]];
export const ALBUM_PAPERS={width:1536,height:1024,frames:Array.from({length:8},(_,i)=>[19+374*(i%4),164+385*Math.floor(i/4),376,314])};
