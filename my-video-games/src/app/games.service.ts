import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVideoGamesJson } from './interfaces/video-games-json';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private gamesUrl = "https://media.jamesrskemp.com/json/video_games.json";

  constructor(private http: HttpClient) { }

  getGames(): Observable<IVideoGamesJson> {
    return this.http.get<IVideoGamesJson>(this.gamesUrl);
  }
}
