import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, Subscription, switchMap, throwIfEmpty } from 'rxjs';
import { GamesService } from '../games.service';
import { IVideoGame } from '../interfaces/video-game';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit, OnDestroy {
  gamesServiceSub!: Subscription;
  gamesServiceSub2!: Subscription;
  games: IVideoGame[] = [];
  filteredGames: IVideoGame[] = [];

  searchSubscription?: Subscription;
  private readonly searchSubject = new Subject<string | undefined>();

  private _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value.toLocaleLowerCase();
    this.filterGames();
  }

  constructor(private gamesService: GamesService) { }

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchQuery) => of(this.games.filter(game => game.title.toLocaleLowerCase().includes(searchQuery ?? ''))))
    ).subscribe((results) => (this.filteredGames = results));
    this.gamesServiceSub = this.gamesService.getGames().subscribe({
      next: games => {
        this.games = this.sortGames(games.games.game);
      },
      error: e => console.log(e)
    });
  }

  ngOnDestroy(): void {
    this.gamesServiceSub.unsubscribe();
    this.gamesServiceSub2.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }

  toggleDetails(element: any): void {
    //console.log(arguments);
    console.log(element);
  }

  onSearchQueryInput(event: Event) {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchQuery?.trim().toLocaleLowerCase());
  }

  sortGames(games: IVideoGame[]): IVideoGame[] {
    return games.sort((a, b) => {
      const title1 = a.title.toLocaleUpperCase();
      const title2 = b.title.toLocaleUpperCase();

      if (title1 < title2) {
        return -1;
      }
      if (title1 > title2) {
        return 1;
      }
      if (a.system.console < b.system.console) {
        return -1;
      }
      if (a.system.console > b.system.console) {
        return 1;
      }
      if (a.system.version < b.system.version) {
        return -1;
      }
      if (a.system.version > b.system.version) {
        return 1;
      }
      return 0;
    });
  }

  filterGames(): void {
    if (this.games) {
      this.filteredGames = this.games.filter(game => game.title.toLocaleLowerCase().includes(this._listFilter));
    }
  }
}
