import { fetchAllNFTsFromDbEntries } from '../hooks/FetchNFT';
import { setNFTDetails, setNFTLoadedBool, setTotalNFTData } from '../stores/BitFighters';
import { ChangeAuthTOken, ChangeBitsBalance, ChangeMaticBalance, ChangeUserData, ChangeValidUserState, ChangewbtcBalance, USER_DETAILS } from '../stores/UserWebsiteStore';
import { fetchNFTsFromDB, fetchUserDetails, fetchWalletInfo, loginAndAuthenticateUser } from '../hooks/ApiCaller';
import store from '../stores';
import { Login, SetConnectedWeb3 } from '../stores/Web3Store';
import { isNullOrUndefined } from 'util';

export async function Web2Login(web2Address: string) {
  console.log("in web2login ....(*******", web2Address)

  // const web2Address = localStorage.getItem("web2_wallet_address")
  if (!isNullOrUndefined(web2Address) && web2Address !== "") {
    console.log("-------accounts---- .",);
    console.log(web2Address);
    console.log("----------- .",);

    store.dispatch(Login(web2Address));
    store.dispatch(ChangeValidUserState(true))

    const auth_token: string = await loginAndAuthenticateUser(web2Address);
    store.dispatch(ChangeAuthTOken(auth_token)); 

    const user_all_data: USER_DETAILS = await fetchUserDetails();
    store.dispatch(ChangeUserData(user_all_data)); 

    const result = await fetchNFTsFromDB(web2Address);
    // console.log(web2Address);
    const dataOfNFTS = await fetchAllNFTsFromDbEntries(result.message)
    store.dispatch(setTotalNFTData(result.message))
    store.dispatch(setNFTDetails(dataOfNFTS))
    store.dispatch(setNFTLoadedBool(true))
    store.dispatch(Login(web2Address));
    store.dispatch(SetConnectedWeb3(false));

    store.dispatch(ChangewbtcBalance("0"));
    store.dispatch(ChangeMaticBalance("0"));
    const coins = await fetchWalletInfo(web2Address);
    if (!isNullOrUndefined(coins)) {
      console.log("coins -- ", coins.data.web2_coins );
      store.dispatch(ChangeBitsBalance(coins.data.web2_coins.toString())) 
    }
    
  }
}