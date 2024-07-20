/**
 * Represents general information about characters.
 */
export interface CharactersEntity {
  info: CharacterInfo;        // Information about the characters
  results: CharacterResult[]; // Details about each character
}

/**
 * Specific information about characters.
 */
export interface CharacterInfo {
  count: number;        // Total number of characters
  pages: number;        // Total number of pages
  next: string | null;  // URL of the next page or null if there is no next page
  prev: string | null;  // URL of the previous page or null if there is no previous page
}

/**
 * Specific details of each character.
 */
export interface CharacterResult {
  id: number;                             // Unique identifier for the character
  name: string;                           // Name of the character
  status: CharacterStatus;               // Status of the character (Alive, Dead, or unknown)
  species: string;                       // Species of the character
  type: string;                           // Type of the character
  gender: string;                         // Gender of the character
  origin: CharacterLocation;             // Origin information of the character
  location: CharacterLocation;           // Location information of the character
  image: string;                         // URL of the character's image
  episode: string[];                     // List of episode URLs the character appeared in
  url: string;                           // URL of the character's details
  created: string;                       // Timestamp of when the character was created
}

/**
 * Represents the status of a character.
 * Possible values: 'Alive', 'Dead', 'unknown'.
 */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

/**
 * Represents the location of a character.
 */
export interface CharacterLocation {
  name: string;  // Name of the location
  url: string;   // URL providing more details about the location
}
