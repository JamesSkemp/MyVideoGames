import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVideoGamesJson } from './interfaces/video-games-json';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private gamesUrl = "https://media.jamesrskemp.com/json/video_games.json";
  private gamesXmlUrl = "https://media.jamesrskemp.com/xml/video_games.xml";
  private requestHeaders = new HttpHeaders()
    .set('Content-Type', 'text/xml');

  constructor(private http: HttpClient) { }

  getGames(): Observable<IVideoGamesJson> {
    return this.http.get<IVideoGamesJson>(this.gamesUrl);
  }

  getGamesXml(): Observable<Object> {
    return this.http.get(this.gamesXmlUrl, { headers: this.requestHeaders, responseType: 'text' });
  }
}
