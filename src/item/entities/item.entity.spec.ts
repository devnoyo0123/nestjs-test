import { Item } from './item.entity';

describe('Item', () => {
  it('should be defined', () => {
    expect(new Item()).toBeDefined();
  });

  it('재고수량 주는지 테스트', () => {
    // given
    const item: Item = new Item();
    item.stockQuantity = 10;

    // then
    item.removeStock(2);

    expect(item.stockQuantity).toEqual(8);
  });

  it('재고수량 초과시 에러 발생', () => {
    // given
    const item: Item = new Item();
    item.stockQuantity = 10;

    // then
    // https://jestjs.io/docs/expect#tothrowerror
    expect(() => {
      item.removeStock(11);
    }).toThrow();
  });
});
