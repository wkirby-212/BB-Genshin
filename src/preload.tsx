// preload.ts
const { contextBridge, ipcRenderer } = require('electron');
// import type { Character } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
  saveCharacter: (character: any) => ipcRenderer.invoke('save-character', character),
  loadCharacter: (id: string) => ipcRenderer.invoke('load-character', id),
  loadAllCharacters: () => ipcRenderer.invoke('load-all-characters'),
});
