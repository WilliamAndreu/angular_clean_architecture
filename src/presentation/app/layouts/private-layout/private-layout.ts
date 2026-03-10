import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.scss',
  standalone: true,
})
export class PrivateLayout {}
