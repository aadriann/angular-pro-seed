import { Component, ChangeDetectorRef, Output, ViewChild, ElementRef, ViewChildren, AfterViewInit, EventEmitter, /*ContentChild*/ ContentChildren,  QueryList, AfterContentInit } from '@angular/core';

import { AuthRememberComponent } from './auth-remember.component';
import { AuthMessageComponent } from './auth-message.component';

import { User } from './auth-form.interface';

@Component({
  selector: 'auth-form',
  styles: ['.email{ border-color: #9f72e6;'],
  template: `
    <div>
      <form (ngSubmit)="onSubmit(form.value)" #form="ngForm">
        <ng-content select="h3"></ng-content>
        <!-- We can use an #id or .class to select an element in ng-content -->
        <label>
          Email address
          <input type="email" name="email" ngModel #email>
        </label>
        <label>
          Password
          <input type="password" name="password" ngModel>
        </label>
        <ng-content select="auth-remember"></ng-content>
        <auth-message [style.display]="(showMessage ? 'inherit' : 'none')">
        </auth-message>
        <!-- ViewChildren example
        <auth-message [style.display]="(showMessage ? 'inherit' : 'none')">
        </auth-message>
        <auth-message [style.display]="(showMessage ? 'inherit' : 'none')">
        </auth-message>-->
        <ng-content select="button"></ng-content>
      </form>
    </div>
  `
})
export class AuthFormComponent implements AfterContentInit, AfterViewInit {

  showMessage: boolean;

  @ViewChild('email') email: ElementRef;

  @ViewChildren(AuthMessageComponent) message: QueryList<AuthMessageComponent>;
 // @ViewChildr(AuthMessageComponent) message: AuthMessageComponent;

  /* Control 1 child of the parent 
  @ContentChild(AuthRememberComponent) remember: AuthRememberComponent; */
  /* Control all children of the parent @ContentChildren
  @ContentChildren(AuthRememberComponent) remember: QueryList<AuthRememberComponent>;*/

  @ContentChildren(AuthRememberComponent) remember: QueryList<AuthRememberComponent>;

  @Output() submitted: EventEmitter<User> = new EventEmitter<User>();

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.email.nativeElement.setAttribute('placeholder', 'Enter your email address');
    this.email.nativeElement.classList.add('email');
    this.email.nativeElement.focus();
    // Cuando uso viewChildren se modifica en AfterViewInit
    if(this.message) {
      this.message.forEach((message) => {
        message.days = 30;
      });
      this.cd.detectChanges();
    }
  }

  ngAfterContentInit() {
    // Cuando uso viewChild se modifica en AfterContentInit.
    /*if(this.message) {
      this.message.days = 30;
    }*/
    if (this.remember){
      this.remember.forEach((item) => item.checked.subscribe((checked: boolean) => this.showMessage = checked));
      //this.remember.checked.subscribe((checked: boolean) => this.showMessage = checked);
    }
  }

  onSubmit(value: User) {
    this.submitted.emit(value);
  }
}
