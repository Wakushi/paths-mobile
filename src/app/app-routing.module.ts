import { NgModule } from "@angular/core"
import { PreloadAllModules, RouterModule, Routes } from "@angular/router"
import { HomeComponent } from "./modules/home/home.component"
import { GameComponent } from "./modules/game/game.component"

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "paths", component: GameComponent },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
