
// const TOTAL_SUM_OF_RANDOM_NUMBERS = 28
const TOTAL_NUMBERS_OF_VARIABLE_TO_GET = 6
const MAX_INDIVIDUAL_NUMBER = 5

export interface IAttributes {
  Defense: number;
  Health: number;
  Kick: number;
  Punch: number;
  Speed: number;
  Stamina: number;
  Throw?: number;
  Weapon?: number;
}

export interface IDressAttributes {
  "Hat/Hair": string;
  Eyes: string;
  Head: string;
  Hands: string;
  Arms: string;
  Body: string;
  Legs: string;
  Feet: string;
}

function sumOfArray(array) {
  var sumArray = 0;
  for (var i = 0; i < array.length; i++) {
    sumArray += array[i]
  }
  return sumArray;
}

function getRandomArray(m: number, S: number, take_zero = false) {
  var result_arr = []
  for (var i = 0; i < m; i++) {
    var temp = Math.floor(Math.random() * 10000000000);
    if (temp % 2 === 0) {
      result_arr.push(Math.floor(Math.random() * (1 + S / m)));
    } else {
      result_arr.push(Math.floor(Math.random() * (S / m)));
    }
  }
  return result_arr
}

function addArrays(arr1, arr2, max_int = 0, correction = false) {
  var sumArray = []
  for (var i = 0; i < arr1.length; i++) {
    if (correction) {
      if (arr1[i] + arr2[i] <= max_int && arr1[i] + arr2[i] > 0) {
        sumArray.push(arr1[i] + arr2[i])
      } else if (arr1[i] + arr2[i] <= 1) {
        sumArray.push(arr1[i] + 1)
      } else {
        sumArray.push(arr1[i])
      }
    } else sumArray.push(arr1[i] + arr2[i])
  }
  return sumArray
}

function generateRandomNumbersInRange(total_sum = 0): Array<number> {
  // get a random array
  var result_arr = getRandomArray(TOTAL_NUMBERS_OF_VARIABLE_TO_GET, total_sum)
  // console.log("-------")
  // console.log(result_arr)
  // console.log("-------")

  // step2: 
  var residual_amount = total_sum - sumOfArray(result_arr)
  // console.log(residual_amount)
  while (residual_amount > 0) {
    var tempArray = getRandomArray(TOTAL_NUMBERS_OF_VARIABLE_TO_GET, residual_amount, true)
    result_arr = addArrays(result_arr, tempArray, MAX_INDIVIDUAL_NUMBER, true)
    residual_amount = total_sum - sumOfArray(result_arr)
    // console.log("result array --> ", result_arr, residual_amount)
  }

  // correction 
  while (residual_amount != 0) {
    var selectIndex = Math.floor(Math.random() * result_arr.length)
    if (result_arr[selectIndex] > 2) {
      result_arr[selectIndex]--;
    }
    residual_amount = total_sum - sumOfArray(result_arr)
    // console.log("2 result array --> ",selectIndex, result_arr[selectIndex], residual_amount)
  }


  // final decrese 1 from all..

  // for (var i = 0; i< result_arr.length; i++) {
  //   result_arr[i]--;
  // }

  // bring the smallest to the front.
  
  // let arrayCopy = [];
  // let minimum = 999;
  // let minIndex = 999;
  // for (var i = 0; i< result_arr.length; i++) {
  //   if (result_arr[i] < minimum) {
  //     minimum = result_arr[i];
  //     minIndex = i;
  //   }
  // }
  // let b = result_arr[0];
  // result_arr[0] = minimum;
  // result_arr[minIndex] = b;

  return result_arr
}

export function genrateRandomAttribute(): IAttributes {
  let TOTAL_SUM_OF_RANDOM_NUMBERS =20;
  var result: Array<number> = generateRandomNumbersInRange()
  var residual_amount = TOTAL_SUM_OF_RANDOM_NUMBERS - sumOfArray(result)
  // console.log("result ----> ", result, sumOfArray(result), residual_amount)
  var attributes: IAttributes = {
    Defense: 0,
    Health: 0,
    Kick: 0,
    Punch: 0,
    Speed: 0,
    Stamina: 0,
    Throw: 0,
    Weapon: 0
  };
  Object.keys(attributes).map((element, i) => {
    attributes[element] = result[i];
  })
  return attributes;
}


export function genrateRandomAttributeV3(total: number): IAttributes {
  console.log("in_genrateRandomAttributeV3 ", total)
  var result: Array<number> = generateRandomNumbersInRange(total)
  var residual_amount = total - sumOfArray(result)
  console.log("result_in_genrateRandomAttributeV3 ", result, sumOfArray(result), residual_amount)
  var attributes: IAttributes = {
    Defense: 0,
    Health: 0,
    Kick: 0,
    Punch: 0,
    Speed: 0,
    Stamina: 0,
  };
  Object.keys(attributes).map((element, i) => {
    attributes[element] = result[i];
  })
  return attributes;
}

export function genrateRandomAttributeV4(total: number, parts_array: Array<string>) {
  console.log("in_genrateRandomAttributeV3 ", total)
  var result: Array<number> = generateRandomNumbersInRange(total)
  var residual_amount = total - sumOfArray(result)
  console.log("result_in_genrateRandomAttributeV3 ", result, sumOfArray(result), residual_amount)

  var attributesMap: IAttributes = {
    Defense: 0,
    Health: 0,
    Kick: 0,
    Punch: 0,
    Speed: 0,
    Stamina: 0,
  };

  var dressAttributes: IDressAttributes = {
    "Hat/Hair": "",
    Eyes: "",
    Head: "",
    Hands: "",
    Arms: "",
    Body: "",
    Legs: "",
    Feet: ""
  };
  
  Object.keys(attributesMap).map((element, i) => {
    attributesMap[element] = result[i];
  })

  for(let i =0; i < parts_array.length; i++) {
    var partsArr = parts_array[i].split("/")
    var part = partsArr[partsArr.length - 1].split(".")[0]
    if (parts_array[i].includes("hat_hair")) {
      dressAttributes["Hat/Hair"] = part;
    }
    if (parts_array[i].includes("eyes")) {
      dressAttributes.Eyes = part;
    }
    if (parts_array[i].includes("heads")) {
      dressAttributes.Head = part;
    }
    if (parts_array[i].includes("hands")) {
      dressAttributes.Hands = part;
    }
    if (parts_array[i].includes("hands")) {
      dressAttributes.Hands = part;
    }
    if (parts_array[i].includes("7 arms")) {
      dressAttributes.Arms = part;
    }
    if (parts_array[i].includes("6 body")) {
      dressAttributes.Body = part;
    }
    if (parts_array[i].includes("legs")) {
      dressAttributes.Legs = part;
    }
    if (parts_array[i].includes("legs")) {
      dressAttributes.Legs = part;
    }
    if (parts_array[i].includes("3 feet")) {
      dressAttributes.Feet = part;
    }
  }

  return {
    attributesMap,
    dressAttributes
  };
}

