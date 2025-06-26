// preload.js (or preload.ts)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveCharacter: (character: any) => ipcRenderer.invoke('save-character', character),
  loadCharacter: (id: any) => ipcRenderer.invoke('load-character', id),
  loadAllCharacters: () => ipcRenderer.invoke('load-all-characters'),
});