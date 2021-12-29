export const viewHash = hash => {
  window.open('https://bscscan.com/tx/' + hash);
};

export const viewToken = address => {
  window.open('https://bscscan.com/token/' + address);
};
