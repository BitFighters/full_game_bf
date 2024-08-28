// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { useEffect } from "react"

export default function MintPage() {
  
  useEffect(()=> {
    //     <script>
    // deBridge.widget({"v":"1","element":"debridgeWidget","title":"","description":"","width":"600","height":"800","r":null,"supportedChains":"{\"inputChains\":{\"1\":\"all\",\"56\":\"all\",\"137\":\"all\",\"42161\":\"all\",\"43114\":\"all\"},\"outputChains\":{\"1\":\"all\",\"56\":\"all\",\"137\":\"all\",\"42161\":\"all\",\"43114\":\"all\"}}","inputChain":56,"outputChain":1,"inputCurrency":"0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d","outputCurrency":"0xdac17f958d2ee523a2206206994597c13d831ec7","address":"","showSwapTransfer":true,"amount":"10","lang":"en","mode":"deswap","isEnableBundle":false,"styles":"eyJib3JkZXJSYWRpdXMiOjgsImZvbnRGYW1pbHkiOiIifQ==","theme":"dark","isHideLogo":false})
    // </script>

    // const script = document.createElement('script');
    // script.src = 'deBridge.widget({"v":"1","element":"debridgeWidget","title":"","description":"","width":"600","height":"800","r":null,"supportedChains":"{\"inputChains\":{\"1\":\"all\",\"56\":\"all\",\"137\":\"all\",\"42161\":\"all\",\"43114\":\"all\"},\"outputChains\":{\"1\":\"all\",\"56\":\"all\",\"137\":\"all\",\"42161\":\"all\",\"43114\":\"all\"}}","inputChain":56,"outputChain":1,"inputCurrency":"0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d","outputCurrency":"0xdac17f958d2ee523a2206206994597c13d831ec7","address":"","showSwapTransfer":true,"amount":"10","lang":"en","mode":"deswap","isEnableBundle":false,"styles":"eyJib3JkZXJSYWRpdXMiOjgsImZvbnRGYW1pbHkiOiIifQ==","theme":"dark","isHideLogo":false})';
    // // script.id = 'debridgeWidget';
    // document.body.appendChild(script);
    // script.onload = () => { 
    //   console.log("loaded..")
    //   // if (callback) callback();
    // };

  }, [])
  return(
    <div>
      <div id="debridgeWidget"></div>
    </div>
  )
}
