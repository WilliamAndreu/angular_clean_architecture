import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@views/login-view/components/login-form/login-form';

describe('Login form accessibility and submission', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideTranslateService({ lang: 'en' })] });
    const fixture = TestBed.createComponent(LoginForm);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
    return fixture;
  }

  it('shows field errors and focuses the first missing value on submit', () => {
    const fixture = setup();
    const element: HTMLElement = fixture.nativeElement;
    const username = element.querySelector<HTMLInputElement>('#username')!;
    const focus = vi.spyOn(username, 'focus');
    const submitted = vi.spyOn(fixture.componentInstance.submitted, 'emit');
    element.querySelector<HTMLFormElement>('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(focus).toHaveBeenCalledOnce();
    expect(username.getAttribute('aria-invalid')).toBe('true');
    expect(username.getAttribute('aria-describedby')).toBe('username-error');
    expect(element.querySelector('#username-error')?.textContent).toContain('Enter your username');
    expect(submitted).not.toHaveBeenCalled();
  });

  it('submits valid credentials once and blocks submissions while loading', () => {
    const fixture = setup();
    const component = fixture.componentInstance;
    const credentials = { username: 'emilys', password: 'emilyspass' };
    component.form.setValue(credentials);
    const submitted = vi.spyOn(component.submitted, 'emit');
    component.onSubmit();
    expect(submitted).toHaveBeenCalledExactlyOnceWith(credentials);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    component.onSubmit();
    expect(submitted).toHaveBeenCalledOnce();
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });
});
