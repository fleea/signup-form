import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    Validators,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    AbstractControl,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AppService } from './app.service';
import { UserData } from 'src/interfaces/user-data';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'signup-form';
    signUpForm: FormGroup;
    passwordError: ValidationErrors;
    matcher = new ErrorStateMatcher();
    userData: UserData;
    constructor(
        private formBuilder: FormBuilder,
        private appService: AppService
    ) {}
    ngOnInit() {
        this.signUpForm = this.formBuilder.group(
            {
                firstName: ['', [Validators.required]],
                lastName: ['', [Validators.required]],
                email: ['', [Validators.required, EmailValidator]],
                password: ['', PasswordValidator],
                repeatPassword: ['', PasswordValidator],
            },
            {
                validator: [
                    EquivalentPasswordMatchingValidator,
                    NotIncludesNameValidator,
                ],
            }
        );

        this.signUpForm.get('password').statusChanges.subscribe((val) => {
            this.passwordError = this.signUpForm.get('password').errors;
            console.log(this.passwordError);
        });
    }

    // PASSWORD INDICATION
    isPassMinLength = (password: AbstractControl) =>
        !password.hasError('required') && !password.hasError('minlength');
    isFailMinLength = (password: AbstractControl) =>
        !password.hasError('required') && !!password.hasError('minlength');
    passMinLengthClass = (password: AbstractControl) => ({
        pass: this.isPassMinLength(password),
        fail: this.isFailMinLength(password),
    });
    isPassUpperLower = (password: AbstractControl) =>
        !password.hasError('required') && !password.hasError('pattern');
    isFailUpperLower = (password: AbstractControl) =>
        !password.hasError('required') && !!password.hasError('pattern');
    passUpperLowerClass = (password: AbstractControl) => ({
        pass: this.isPassUpperLower(password),
        fail: this.isFailUpperLower(password),
    });
    isPassIncludingName = (password: AbstractControl) =>
        !password.hasError('required') && !password.hasError('includingName');
    isFailIncludingName = (password: AbstractControl) =>
        !password.hasError('required') && !!password.hasError('includingName');
    passIncludingNameClass = (password: AbstractControl) => ({
        pass: this.isPassIncludingName(password),
        fail: this.isFailIncludingName(password),
    });
    isPassNotEquivalent = (password: AbstractControl) =>
        !password.hasError('required') && !password.hasError('notEquivalent');
    isFailNotEquivalent = (password: AbstractControl) =>
        !password.hasError('required') && !!password.hasError('notEquivalent');
    passNotEquivalentClass = (password: AbstractControl) => ({
        pass: this.isPassNotEquivalent(password),
        fail: this.isFailNotEquivalent(password),
    });
    onSubmit = () => {
        console.log(this.signUpForm.valid, this.signUpForm);
        this.appService
            .registerUser(this.signUpForm.value)
            .subscribe((val: UserData) => {
                console.log(this.signUpForm.value);
                // The API doesn't return anything, just assume that our data has been saved here.
                this.userData = this.signUpForm.value;
            });
    };
}
const PasswordUpperLowerValidator = Validators.pattern(
    '^(?=.*?[a-z])(?=.*?[A-Z]).*$'
);
const PasswordValidator = [
    Validators.required,
    Validators.minLength(8),
    PasswordUpperLowerValidator,
];
const EmailValidator = Validators.pattern(
    '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'
);
/**
 * @param control value of new typed password
 * This is run everytime the password input changed
 * We could use manual validator (listening to value changes and validating it manually), but Abstract Control gives more sophisticated solution.
 * It's important to use Control Group generic validation since we need to access several values when deciding password is valid or not
 */
const EquivalentPasswordMatchingValidator: ValidatorFn = (
    fg: FormGroup
): ValidationErrors | null => {
    const { password, repeatPassword } = fg.value;
    if (password !== repeatPassword) {
        fg.controls['password'].setErrors({
            ...fg.controls['password'].errors,
            notEquivalent: true,
        });
        fg.controls['repeatPassword'].setErrors({
            ...fg.controls['repeatPassword'].errors,
            notEquivalent: true,
        });
    }
    return null;
};

/**
 * Should be a minimum of eight characters,
 * Should contain lower and uppercase letters,
 * Should not contain user’s first or last name.
 */
const NotIncludesNameValidator: ValidatorFn = (
    fg: FormGroup
): ValidationErrors | null => {
    const { firstName, lastName, password } = fg.value;
    const includingName = includesString(password, [firstName, lastName]);
    if (includingName) {
        fg.controls['password'].setErrors({
            ...fg.controls['password'].errors,
            includingName,
        });
    }
    return null;
};

const includesString = (word: string, toInclude: string[]) => {
    const isIncluded = toInclude.filter((wordToInclude: string) => {
        return (
            !!wordToInclude &&
            word.toLowerCase().includes(wordToInclude.toLowerCase())
        );
    });
    return !!isIncluded.length;
};
