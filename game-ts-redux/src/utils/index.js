// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

export const getEllipsisTxt = (str, n = 5) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`
  }
  return ''
}

export const getRoundedString = (data, n = 2) => {
  if (data) {
    return `${Number(data).toFixed(2).toString()}`
  }
  return ''
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

export function makeid(length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function randomNickNameGenarate() {
  var adjs = [
    'Autumn',
    'Hidden',
    'Bitter',
    'Misty',
    'Silent',
    'Empty',
    'Dry',
    'Dark',
    'Summer',
    'Icy',
    'Delicate',
    'Quiet',
    'White',
    'Cool',
    'Spring',
    'Winter',
    'Patient',
    'Twilight',
    'Dawn',
    'Crimson',
    'Wispy',
    'Weathered',
    'Blue',
    'Billowing',
    'Broken',
    'Cold',
    'Gay',
    'Damp',
    'Falling',
    'Frosty',
    'Green',
    'Long',
    'Late',
    'Lingering',
    'Bold',
    'Little',
    'Morning',
    'Muddy',
    'Old',
    'Red',
    'Rough',
    'Still',
    'Small',
    'Sparkling',
    'Throbbing',
    'Shy',
    'Wandering',
    'Withered',
    'Wild',
    'Smart',
    'Orange',
    'Young',
    'Holy',
    'Solitary',
    'Fragrant',
    'Aged',
    'Snowy',
    'Proud',
    'Floral',
    'Restless',
    'Divine',
    'Polished',
    'Ancient',
    'Purple',
    'Lively',
    'Nameless',
  ]

  var nouns = [
    'Waterfall',
    'River',
    'Breeze',
    'Moon',
    'Rain',
    'Wind',
    'Sea',
    'Morning',
    'Snow',
    'Lake',
    'Sunset',
    'Pine',
    'Shadow',
    'Leaf',
    'Dawn',
    'Glitter',
    'Forest',
    'Hill',
    'Cloud',
    'Meadow',
    'Sun',
    'Glade',
    'Bird',
    'Brook',
    'Butterfly',
    'Bush',
    'Dew',
    'Dust',
    'Field',
    'Fire',
    'Flower',
    'Firefly',
    'Feather',
    'Grass',
    'Haze',
    'Mountain',
    'Night',
    'Pond',
    'Darkness',
    'Snowflake',
    'Silence',
    'Sound',
    'Sky',
    'Shape',
    'Surf',
    'Thunder',
    'Violet',
    'Water',
    'Wildflower',
    'Wave',
    'Water',
    'Resonance',
    'Sun',
    'Wood',
    'Dream',
    'Cherry',
    'Tree',
    'Fog',
    'Frost',
    'Voice',
    'Paper',
    'Frog',
    'Smoke',
    'Star',
  ]

  return adjs[Math.floor(Math.random() * (adjs.length - 1))] + ' ' + nouns[Math.floor(Math.random() * (nouns.length - 1))]
}

// console.log(makeid(5));
