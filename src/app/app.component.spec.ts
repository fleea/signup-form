import { BrowserModule } from '@angular/platform-browser';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
    ErrorStateMatcher,
    ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SignUp Form', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [
                BrowserModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatIconModule,
                HttpClientTestingModule,
            ],

            providers: [
                {
                    provide: ErrorStateMatcher,
                    useClass: ShowOnDirtyErrorStateMatcher,
                },
            ],
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be invalid when empty', () => {
        expect(component.signUpForm.valid).toBeFalsy();
    });

    // FIRST NAME
    it('first name should be invalid when first loaded', () => {
        const firstName = component.signUpForm.controls['firstName'];
        expect(firstName.valid).toBeFalsy();
    });

    it('first name should be required', () => {
        const firstName = component.signUpForm.controls['firstName'];
        firstName.setValue('');
        expect(firstName.hasError('required')).toBeTruthy();
    });

    it('first name should allow single letter', () => {
        const firstName = component.signUpForm.controls['firstName'];
        firstName.setValue('A');
        expect(firstName.valid).toBeTruthy();
    });

    it('first name should allow crazy name', () => {
        const firstName = component.signUpForm.controls['firstName'];
        // Whatever crazy name should be allowed
        firstName.setValue('X Æ A-12');
        expect(firstName.valid).toBeTruthy();
    });

    // LAST NAME
    it('last name should be invalid when first loaded', () => {
        const lastName = component.signUpForm.controls['lastName'];
        expect(lastName.valid).toBeFalsy();
    });

    it('last name should be required', () => {
        const lastName = component.signUpForm.controls['lastName'];
        lastName.setValue('');
        expect(lastName.hasError('required')).toBeTruthy();
    });

    it('last name should allow normal name', () => {
        const lastName = component.signUpForm.controls['lastName'];
        lastName.setValue('Shelby');
        expect(lastName.valid).toBeTruthy();
    });

    it('last name should allow non alphabet name', () => {
        const lastName = component.signUpForm.controls['lastName'];
        lastName.setValue('劉德華');
        expect(lastName.valid).toBeTruthy();
    });

    // EMAIL
    it('email should be invalid when first loaded', () => {
        const email = component.signUpForm.controls['email'];
        expect(email.valid).toBeFalsy();
    });
    it('email should be required', () => {
        const email = component.signUpForm.controls['email'];
        email.setValue('');
        expect(email.hasError('required')).toBeTruthy();
    });
    it('email should not be valid without @', () => {
        const email = component.signUpForm.controls['email'];
        email.setValue('thomas');
        expect(email.valid).toBeFalsy();
    });
    // Angular default Validator email will pass this test, but we don't want that.
    it('email should not be valid without domain', () => {
        const email = component.signUpForm.controls['email'];
        email.setValue('thomas@shelby');
        expect(email.valid).toBeFalsy();
    });

    it('email should be valid with domain', () => {
        const email = component.signUpForm.controls['email'];
        email.setValue('thomas@shelby.me');
        expect(email.valid).toBeTruthy();
    });

    it('email should be valid with the subdomain', () => {
        const email = component.signUpForm.controls['email'];
        email.setValue('me@thomas.shelby.com');
        expect(email.valid).toBeTruthy();
    });

    it('email should be valid with standard domain', () => {
        const email = component.signUpForm.controls['email'];
        email.setValue('thomas.shelby@gmail.com');
        expect(email.valid).toBeTruthy();
    });
    // TODO: LEVELLING UP
    xit('email should be valid with the new top level domain', () => {
        const email = component.signUpForm.controls['email'];
        email.setValue('thomas@shelby.travel');
        expect(email.valid).toBeTruthy();
    });

    xit('email with unicode character should be valid', () => {
        const email = component.signUpForm.controls['email'];
        email.setValue('θσερ@εχαμπλε.ψομ'); // I got this from Wikipedia, don't ask me the meaning of this :P
        expect(email.valid).toBeTruthy();
    });

    xit('email with accent should be valid', () => {
        const email = component.signUpForm.controls['email'];
        email.setValue('Dörte@Sörensen.example.com');
        expect(email.valid).toBeTruthy();
    });

    xit('email should not be valid if does not begin with letter', () => {
        const email = component.signUpForm.controls['email'];
        email.setValue('___thomas.shelby@gmail.com');
        expect(email.valid).toBeFalsy();
        email.setValue('1thomas.shelby@gmail.com');
        expect(email.valid).toBeFalsy();
    });

    // PASSWORD
    it('password should be invalid when first loaded', () => {
        const password = component.signUpForm.controls['password'];
        expect(password.valid).toBeFalsy();
    });
    it('password should be required', () => {
        const password = component.signUpForm.controls['password'];
        password.setValue('');
        expect(password.hasError('required')).toBeTruthy();
    });
    it('password should be at least 8 characters', () => {
        const password = component.signUpForm.controls['password'];
        password.setValue('abcdefg');
        expect(password.hasError('minlength')).toBeTruthy();
        password.setValue('abcdefgh');
        expect(password.hasError('minlength')).toBeFalse();
    });
    it('password should not contain first or last name', () => {
        const firstName = component.signUpForm.controls['firstName'];
        const lastName = component.signUpForm.controls['lastName'];
        const password = component.signUpForm.controls['password'];
        firstName.setValue('first');
        firstName.setValue('lastName');

        password.setValue('abcdefg');
        expect(password.hasError('includingName')).toBeFalsy();

        password.setValue('afirst');
        expect(password.hasError('includingname')).toBeTruthy();
    });
});
