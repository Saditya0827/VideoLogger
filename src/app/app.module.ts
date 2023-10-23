import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddVideoLogComponent } from './component/add-video-log/add-video-log.component';
import { PreviewRecordingComponent } from './component/preview-recording/preview-recording.component';
import { ComponentPlaceholderDirective } from './directive/component-placeholder.directive';
import { PreviousLogComponent } from './component/previous-log/previous-log.component';
import { NotFoundComponent } from './component/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    AddVideoLogComponent,
    PreviewRecordingComponent,
    ComponentPlaceholderDirective,
    PreviousLogComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
