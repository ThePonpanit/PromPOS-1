// create a component that will format the number to the currency format
// get the number
// return the number in currency format

export const valueNumberFormatter = (number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(number);
};
