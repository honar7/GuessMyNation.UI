import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalStatic } from 'src/GlobalStatic';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.css']
})
export class MainGameComponent implements OnInit {
  buttonList: NationButton[] | undefined;

  Japanese: NationButton | undefined;
  Thai: NationButton | undefined;
  Chinese: NationButton | undefined;
  Korean: NationButton | undefined;

  constructor(public httpClient: HttpClient) { }

  ngOnInit(): void {
    this.initButton();
    this.getNationButton();
  }

  initButton() {
    this.Japanese = new NationButton(1, 1, 'Japanese');
    this.Thai = new NationButton(2, 2, 'Thai');
    this.Chinese = new NationButton(3, 3, 'Chinese');
    this.Korean = new NationButton(4, 4, 'Korean');
  }

  getNationButton() {
    this.httpClient.get<any>(
      environment.serverUrl + GlobalStatic.GetButtons, {
      'headers': GlobalStatic.headers,
    }).subscribe(
      data => {
        if (data) {
          this.buttonList = data;
        }
      }
    );
  }


}

export class NationButton {

  constructor(
    id: number,
    code: number,
    name: string
  ) {
  }

  id: number | undefined;
  code: number | undefined;
  name: string | undefined;
}
