import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title !: string;
  public spaceChar: string = "&nbsp;";

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {

  }

  goToStart() {
    this.router.navigate(['start']);
  }

  goToDraw(){
    this.router.navigate(['draw']);
 }

 goToRoot() {
    window.location.href = '../index.html';
 }
}
