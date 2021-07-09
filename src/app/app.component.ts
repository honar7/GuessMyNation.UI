import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalStatic } from 'src/GlobalStatic';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Guess My Nation';
  player: Player;
  playerName = '';

  constructor(
    public httpClient: HttpClient
  ) {
    this.player = new Player('');
  }

  ngOnInit() {
    this.playerName = 'Guest';
    this.player = new Player('Guest');
    this.title = 'Guess My Nation';
  }

  addUser() {
    // const model: CreatePlayerModel('ali');
    const headers = { 'content-type': 'application/json', 'accept': ' */*' }
    this.httpClient.post<any>(
      environment.serverUrl + GlobalStatic.CreatePlayer,
      { name: this.playerName },
      {
        'headers': headers,
      }).subscribe(
        data => {
          console.log(data);

        }
      );
  }

}


export class Player {
  constructor(_name: string) {
    this.name = _name;
  }
  name: string;
}

