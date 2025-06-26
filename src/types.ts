// Type definitions for the Genshin TTRPG application

export interface User {
  username: string;
  role: "player" | "gm";
}

export interface Campaign {
  id: string;
  name: string;
  notes: string;
  sessionCount: number;
  inviteCode: string;
  playerIds: string[];
}

export interface Character {
  id: string;
  name: string;
  vision: string;
  rank: number;
  evasion: number;
  speed: number;
  pronouns: string;
  career: string;
  background: string;
  specialty: string;
  damage: string;
  currentHp: number;
  maxHp: number;
  careerDice: string;
  lifeMarkers: boolean[];
  deathMarkers: boolean[];
  race: string;
  racialFeatures: string;
  portrait: string | null;
  campaignIds?: string[];
  stats: {
    Strength: number;
    Grip: number;
    Overpower: number;
    Speed: number;
    Willpower: number;
    Recovery: number;
    Survival: number;
    Leadership: number;
    StreetSmarts: number;
    Gossip: number;
    Communication: number;
    Adaption: number;
    Immunity: number;
    Endurance: number;
    Resistance: number;
    Health: number;
    Presence: number;
    Perception: number;
    Investigation: number;
    Insight: number;
  } & Record<string, number>;
}

// Props interfaces
export interface CampaignEditorProps {
  initial: Campaign | null;
  onSave: (campaign: Campaign) => void;
  onCancel: () => void;
}

export interface CampaignListProps {
  campaigns: Campaign[];
  onCreate: () => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
  onManagePlayers: (campaign: Campaign) => void;
}

export interface GameMastersPanelProps {
  user: User;
}

export interface ManagePlayersModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export interface CharacterDashboardProps {
  onSelect: (character: Character) => void;
}

export interface CharacterSelectProps {
  characters: Character[];
  onSelect?: (character: Character) => void;
}

export interface PlayerSheetProps {
  character: Character;
  readOnly?: boolean;
  onBack: () => void;
}

export interface PlayersPanelProps {
  user: User;
}

// Electron API types
export interface ElectronAPI {
  saveCharacter: (character: Character) => Promise<boolean>;
  loadCharacter: (id: string) => Promise<Character | null>;
  loadAllCharacters: () => Promise<Character[]>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
