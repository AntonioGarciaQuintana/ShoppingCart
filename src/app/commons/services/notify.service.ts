import { Injectable } from '@angular/core';
import { SnotifyService, SnotifyPosition } from 'ng-snotify';

@Injectable()
export class NotifyService {

    timeout = 3000;
    position: SnotifyPosition = SnotifyPosition.rightTop;
    title = 'Message system';
    constructor(private snotifyService: SnotifyService) {
    }

    private getConfig() {
        return {
            timeout: this.timeout,
            showProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            position: this.position,
        };
    }

    success(body: string) {
        this.snotifyService.success(body, this.title, this.getConfig() );
    }

    error(body: string) {
        this.snotifyService.error( body, this.title, this.getConfig() );
    }

    info(body: string) {
        this.snotifyService.info(body, this.title, this.getConfig() );
    }
}
