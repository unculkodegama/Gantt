import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getNewTaskClicked() {
    element(by.buttonText('Nová úloha')).click();
    element(by.id('in1')).sendKeys('uloha 1');
    element(by.id('in2')).sendKeys('5/15/2018');
    element(by.id('in3')).sendKeys('5/17/2018');
    element(by.id('in4')).sendKeys('Tyrkysová');
    element(by.id('in5')).click();

    browser.sleep(2500);
    element(by.id('uloha 1')).click();
    browser.sleep(2500);
    element(by.buttonText('Zmazať')).click();
    browser.sleep(2500);
  }

  zoom() {
    element(by.id('zoom')).click();
    browser.sleep(2500);
    element(by.id('zoom')).click();
    browser.sleep(2500);
  }
}

