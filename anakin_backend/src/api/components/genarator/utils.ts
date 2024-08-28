
const Months = [
  "Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sep", "Oct", "Nov", "Dec"
]

export function getMyDateFromDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = Months[date.getMonth()] 
  const day = date.getDate() 
  console.log(`${year} ${month} ${day}`);
  return `${year} ${month} ${day}`
}