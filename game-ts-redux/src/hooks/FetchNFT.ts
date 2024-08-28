// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import axios from "axios";

export const resolveURL = async (url: string) => {
  const res = await axios(url);
  // console.log(res);
  return res.data;
};

export async function fetchAllNFTs(array: Array<string>) {
  const result = await Promise.all(array.map(async (element) => {
    // const res = await axios(element);
    const data = await resolveURL(element)
    // const imageData = resolveURL(data.image)
    // console.log("---------------")
    // data['image_data'] = imageData
    return data
  }))
  return result;
}


export async function fetchAllNFTsFromDbEntries(array: Array<any>) {
  console.log("in here .. fetching ", array)
  const result = await Promise.all(array.map(async (element) => {
    const data = await resolveURL(element.nftURL);
    element["data"] = data;
    // console.log("*** ", element.nftURL, "***", data)
    return element;
  }));
  return result;
}

// export async function fetchAllProfileFromNftUrls(array: Array<any>) {
//   // console.log("in here .. fetching ", array)
//   const result = await Promise.all(array.map(async (element) => {
//     const data = await resolveURL(element.profile_image);
//     element["data"] = data;
//     // console.log("*** ", element.nftURL, "***", data)
//     return element;
//   }));
//   return result;
// }
