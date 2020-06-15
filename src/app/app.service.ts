import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from 'src/interfaces/user-data';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    constructor(private http: HttpClient) {}
    registerUser = ({ firstName, lastName, email }: UserData) =>
        this.http.post('https://demo-api.now.sh/users', {
            firstName,
            lastName,
            email,
        });
}
