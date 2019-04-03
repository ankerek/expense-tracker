export const sortByAmount = (direction: 'asc' | 'desc') => (
  a: { amount: number },
  b: { amount: number }
) => {
  if (direction === 'asc') {
    return a.amount - b.amount
  }

  if (a.amount < b.amount) {
    return -1
  }
  if (a.amount > b.amount) {
    return 1
  }

  return 0
}
