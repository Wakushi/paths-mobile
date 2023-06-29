import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from '../app/modules/home/home.component';
import { ChoiceComponent } from '../app/modules/choice/choice.component';
import { GaugeComponent } from '../app/shared/gauge/gauge.component';
import { GameOverComponent } from '../app/modules/game-over/game-over.component';
import { GameBarComponent } from './shared/game-bar/game-bar.component';
import { EventCardComponent } from './shared/event-card/event-card.component';
import { GameSettingsComponent } from './shared/game-settings/game-settings.component';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { DivideByTwoPipe } from './core/pipes/divide-by-two.pipe'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChoiceComponent,
    GaugeComponent,
    GameOverComponent,
    GameBarComponent,
    EventCardComponent,
    GameSettingsComponent,
    SnackbarComponent,
    DivideByTwoPipe,
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
