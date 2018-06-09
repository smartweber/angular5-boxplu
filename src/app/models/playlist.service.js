var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalsService } from '../globals.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
var PlaylistService = (function () {
    function PlaylistService(http, globals) {
        this.http = http;
        this.globals = globals;
    }
    PlaylistService.prototype.extractData = function (res) {
        var body = res.json();
        if (body) {
            return body.data || body;
        }
        else {
            return {};
        }
    };
    PlaylistService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    };
    PlaylistService.prototype.getPlaylist = function (id, limit, page) {
        return this.http
            .get(this.globals.API + ("playlists/" + id + "/assets?limit=" + limit + "&page=" + page + "&device_type=web&device_layout=web"))
            .map(this.extractData)
            .catch(this.handleError);
    };
    return PlaylistService;
}());
PlaylistService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http,
        GlobalsService])
], PlaylistService);
export { PlaylistService };
//# sourceMappingURL=playlist.service.js.map