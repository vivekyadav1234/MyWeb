import { InventblueUiPage } from './app.po';

describe('inventblue-ui App', () => {
  let page: InventblueUiPage;

  beforeEach(() => {
    page = new InventblueUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
