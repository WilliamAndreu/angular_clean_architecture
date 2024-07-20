/**
 * Represents the Model containing general information about characters.
 */
export interface CharacterDTO {
  info: CharacterInfoModel;        // Information about the characters
  results: CharacterResultModel[]; // Details about each character
}

/**
 * Model containing specific information about characters.
 */
export interface CharacterInfoModel {
  count: number;        // Total number of characters
  pages: number;        // Total number of pages
  next: string | null;  // URL of the next page or null if there is no next page
  prev: string | null;  // URL of the previous page or null if there is no previous page
}

/**
 * Model containing specific details of each character.
 */
export interface CharacterResultModel {
  id: number;                             // Unique identifier for the character
  name: string;                           // Name of the character
  status: CharacterStatus;               // Status of the character (Alive, Dead, or unknown)
  species: string;                       // Species of the character
  type: string;                           // Type of the character
  gender: string;                         // Gender of the character
  origin: CharacterOriginModel;         // Origin information of the character
  location: CharacterLocationModel;     // Location information of the character
  image: string;                         // URL of the character's image
  episode: string[];                     // List of episode URLs the character appeared in
  url: string;                           // URL of the character's details
  created: string;                       // Timestamp of when the character was created
}

/**
 * Model representing the place of origin of a character.
 */
export interface CharacterOriginModel {
  name: string;  // Name of the origin
  url: string;   // URL providing more details about the origin
}

/**
 * Represents the status of a character.
 * Possible values: 'Alive', 'Dead', 'unknown'.
 */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

/**
 * Model representing the location of a character.
 */
export interface CharacterLocationModel {
  name: string;  // Name of the location
  url: string;   // URL providing more details about the location
}
