// preload.js (or preload.ts)
var _a = require('electron'), contextBridge = _a.contextBridge, ipcRenderer = _a.ipcRenderer;
contextBridge.exposeInMainWorld('electronAPI', {
    saveCharacter: function (character) { return ipcRenderer.invoke('save-character', character); },
    loadCharacter: function (id) { return ipcRenderer.invoke('load-character', id); },
    loadAllCharacters: function () { return ipcRenderer.invoke('load-all-characters'); },
});
