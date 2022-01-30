import { createTimePartition } from '../src/utils/dates';

test("roundDownTo5Mins", () => {
  const time = "2022-01-29T14:38:01.882Z"
  const result = createTimePartition(time);
  expect(result).toBe(5478223)
}); 

test("roundDownTo5Mins", () => {
  const time = "2022-01-29T14:28:01.882Z"
  const result = createTimePartition(time);
  expect(result).toBe(5478221)
});
