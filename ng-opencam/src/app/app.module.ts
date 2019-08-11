import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { OpencamModule } from 'projects/opencam/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    OpencamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
