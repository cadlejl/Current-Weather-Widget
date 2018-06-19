import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { 
    Http,

    // JSONP (JSON with Padding) is a method for sending JSON data without worrying about cross-domain issues.
    // JSONP does not use the XMLHttpRequest object.
    // JSONP uses the <script> tag instead.
    Jsonp 
} from "@angular/http";
import { map, catchError } from 'rxjs/operators';

import { FORCAST_ROOT, FORCAST_KEY, GEOCODE_KEY, GEOCODE_ROOT } from "../constants/constants";

@Injectable()
export class WeatherService {
    constructor(private jsonp: Jsonp, private http: Http) {}

    // Testing method pre observable: this can be deleted
    logCurrentLocation(): [number, number] {
        // Check that navigator.geolocation ("API?", "property?") is available in browser
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                console.log("Position: ", position.coords.latitude, ",", position.coords.longitude);
            },
            err => console.error("Unable to get the position - ", err));
        } else {
            console.error("Geolocation is not available");
            return [0,0];
        }
    }

    getcurrentLocation(): Observable<any> {
        // Check that navigator.geolocation ("API?", "property?") is available in browser
        if (navigator.geolocation) {
            return Observable.create(observer => {
                navigator.geolocation.getCurrentPosition(pos => {
                    observer.next(pos);
                }),
                err => {
                    return Observable.throw(err);
                }
            });
        } else {
            return Observable.throw("Geolocation is not available");
        }
    }

    getCurrentWeather(lat: number, long: number): Observable<any> {
        const url = FORCAST_ROOT + FORCAST_KEY + "/" + lat + "," + long;
        const queryParams = "?callback=JSONP_CALLBACK";

        return this.jsonp.get(url + queryParams).pipe(
            map(data => data.json()), 
            catchError(err => {
                console.error("Unable to get weather data - ", err);
                return Observable.throw(err.json());
            })
        );
    }

    getLocationName(lat: number, long: number): Observable<any> {
        const url = GEOCODE_ROOT;
        const queryParams = "?latlng=" + lat + "," + long + "&key=" + GEOCODE_KEY;

        return this.http.get(url + queryParams).pipe(
            map(loc => loc.json()),
            catchError(err => {
                console.error("Unable to get location - ", err);
                return Observable.throw(err);
            })
        );
    }
}