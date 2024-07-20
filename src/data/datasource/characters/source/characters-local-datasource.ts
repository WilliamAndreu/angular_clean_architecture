import { CharacterDBO } from "../local/dbo/rick-and-morty-characters.model";
import { Observable } from "rxjs";

export abstract class CharactersLocalDataSource {
    abstract getCharactersList({ page, needRequest }: { page: number; needRequest: boolean }): Observable<CharacterDBO>;
}