// preload.js (or preload.ts)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveCharacter: (character) => ipcRenderer.invoke('save-character', character),
  loadCharacter: (id) => ipcRenderer.invoke('load-character', id),
  loadAllCharacters: () => ipcRenderer.invoke('load-all-characters'),
});