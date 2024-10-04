import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Hls from 'hls.js';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements AfterViewInit {
  @ViewChild('video', { static: false }) videoElement!: ElementRef;

  videoSrc: string = 'https://130.188.225.121:7770/test/index.m3u8';

  constructor() {}

  ngAfterViewInit() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Fatal network error encountered, trying to recover...", data);
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Fatal media error encountered, trying to recover...", data);
              hls.recoverMediaError();
              break;
            default:
              // cannot recover
              hls.destroy();
              break;
          }
        }
      });
      
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari and browsers that support HLS natively
      video.src = this.videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }
}
