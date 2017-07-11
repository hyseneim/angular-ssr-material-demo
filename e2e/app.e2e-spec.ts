import { CliUniversalDemoPage } from './app.po';

describe('cli-universal-demo App', () => {
  let page: CliUniversalDemoPage;

  beforeEach(() => {
    page = new CliUniversalDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
