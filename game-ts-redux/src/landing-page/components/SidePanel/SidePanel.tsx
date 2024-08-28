// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { useDispatch } from "react-redux";
import { setCardState } from "../../../stores/MintCardStateStore";
import "./SidePanel.scss";
import { useAppSelector } from "../../../hooks";
import store from "../../../stores";
import { SetSuccessNotificationBool, SetSuccessNotificationMessage } from "../../../stores/NotificationStore";
import NotificationMessageHelper from "../../../game/Components/NotificationMessageHelper";
import phaserGame from "../../../PhaserGame";
import Bootstrap from "../../../game/scenes/Bootstrap";
import { useState } from "react";


export enum PageStates {
  Presale = "presale",
  OneKClub = "oneKClub",
  DripPreSale = "drip_presale",
  Minting = "Minting",
  NotConnectedState = "NotConnected",
  ProgressState = "progress",
  MakeSelection = "make_selection",
  FailedState = "failed_state",

  Bitfighter = "Bitfighter",
  DripFighter = "DripFighter"
}

const SidePanel = () => {
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
  const loggedInUserWalletAddress = useAppSelector(
    (state) => state.web3store.userAddress
  );
  const dispatch = useDispatch();
  const state = useAppSelector(
    (state) => state.mintCardStateStore.state_selected
  );
  const [onbutton, setOnButton] = useState(false);
  const [hoverplace, startHover] = useState(0)

  const refrinkHandle = () => {
    const temp = document.URL;
    console.log(temp, document);
    bootstrap.play_button_down_sound()

    const allMetaElements = document.getElementsByTagName('meta')
    console.log("meta -- ", allMetaElements)
    for (let i = 0; i < allMetaElements.length; i++) {
      console.log("---meta", allMetaElements[i].getAttribute("name"))
      if (allMetaElements[i].getAttribute("name") === "description") {
        //make necessary changes
        console.log("meta 1 -- ", allMetaElements[i])
        // Use my ref code to join my gang and dominate the cities with me!
        // store.dispatch(SetMetaTagDescription())
        allMetaElements[i].setAttribute('description', "Use my ref code to join my gang and dominate Bit Fighters with me!");
        allMetaElements[i].setAttribute('title', "Bit Fighters");
        allMetaElements[i].setAttribute('og:description', "Use my ref code to join my gang and dominate Bit Fighters with me!");
        allMetaElements[i].setAttribute('og:title', "Bit Fighters");
        break;
      }
    }

    navigator.clipboard
      .writeText(temp + "?ref_code=" + loggedInUserWalletAddress)
      .then(() => {
        store.dispatch(SetSuccessNotificationBool(true));
        store.dispatch(SetSuccessNotificationMessage("Your ref link has been copied! Go paste and share it with everyone!"));
        // confirm(
        //   "Your ref link has been copied! Go paste and share it with everyone!"
        // );
      });
  };
  return (
    <div>
      <NotificationMessageHelper />
      <aside className="side-panel">
        <div className="side-panel__layer">
          <div className="side-panel__inner">
            <div className="bottom-button-cover"></div>
            {
              <>
                {/* {state === PageStates.Presale ? (
                  <>
                    <div 
                      className="btn-mint--small presale-state-active"
                      onMouseOver={() => {
                          if ( hoverplace !== 1) {
                            setOnButton(true)
                            bootstrap.play_button_hover_sound()
                          }
                        }}
                        onMouseOut={() => {
                          console.log("on mouse out fn. 1 active ")
                          setOnButton(false)
                        }}
                    ></div>
                  </>
                ) : (
                  <>
                    {state === PageStates.NotConnectedState ? (
                      <div className="btn-mint--small sidePanel-disabled"></div>
                    ) : (
                      <div
                        onClick={() => {
                          localStorage.setItem("state", "Drip Fighter Mint Card");
                          dispatch(setCardState(PageStates.Presale));
                          bootstrap.play_button_down_sound()
                        }}
                        onMouseOver={() => {
                          if ( hoverplace !== 1) {
                            setOnButton(true)
                            bootstrap.play_button_hover_sound()
                          }
                        }}
                        onMouseOut={() => {
                          console.log("on mouse out fn. 1")
                          setOnButton(false)
                        }}
                        className="btn-mint--small sidePanel-drip"
                      ></div>
                    )}
                  </>
                )} */}

                {state === PageStates.Bitfighter ? (
                  <>
                    <div className="btn-mint--small drippresale-state-active"
                      onMouseOver={() => {
                        if (hoverplace !== 5) {
                          setOnButton(true)
                          bootstrap.play_button_hover_sound()
                        }
                      }}
                      onMouseOut={() => {
                        setOnButton(false)
                      }}
                    ></div>
                  </>
                )
                  : (
                    <>
                      {state === PageStates.NotConnectedState ? (
                        <div className="btn-mint--small sidePanel-disabled"
                        ></div>
                      ) : (
                        <div
                          onClick={() => {
                            localStorage.setItem("state", "Bit Fighters");
                            dispatch(setCardState(PageStates.Bitfighter));
                            bootstrap.play_button_down_sound()
                          }}
                          onMouseOver={() => {
                            if (hoverplace !== 5) {
                              setOnButton(true)
                              bootstrap.play_button_hover_sound()
                            }
                          }}
                          onMouseOut={() => {
                            console.log("on mouse out fn. 3")
                            setOnButton(false)
                          }}
                          className="btn-mint--small sidePanel-bit"
                        ></div>
                      )}
                    </>
                  )}


                {/* {state === PageStates.DripPreSale ? (
                  <>
                    <div className="btn-mint--small drippresale-state-active"
                    onMouseOver={() => {
                          if ( hoverplace !== 2) {
                            setOnButton(true)
                            bootstrap.play_button_hover_sound()
                          }
                        }}
                        onMouseOut={() => {
                          console.log("on mouse out fn. 2 active ")
                          setOnButton(false)
                        }}
                    ></div>
                  </>
                ) : (
                  <>
                    {state === PageStates.NotConnectedState ? (
                      <div className="btn-mint--small sidePanel-disabled"></div>
                    ) : (
                      <div
                        onClick={() => {
                          localStorage.setItem("state", "Bit Fighter Mint Card");
                          dispatch(setCardState(PageStates.DripPreSale));
                          bootstrap.play_button_down_sound()
                        }}
                        onMouseOver={() => {
                          console.log("on mouse in fn. 2 ", onbutton)
                          if (hoverplace !== 2) {
                            setOnButton(true)
                            bootstrap.play_button_hover_sound()
                          }
                        }}
                        onMouseOut={() => {
                          console.log("on mouse out fn. 2")
                          setOnButton(false)
                        }}
                        className="btn-mint--small sidePanel-bit"
                      ></div>
                    )}
                  </>
                )} */}

                {state === PageStates.OneKClub ? (
                  <>
                    <div className="btn-mint--small oneclub-state-active"
                      onMouseOver={() => {
                        if (hoverplace !== 3) {
                          setOnButton(true)
                          bootstrap.play_button_hover_sound()
                        }
                      }}
                      onMouseOut={() => {
                        console.log("on mouse out fn. 3 active ")
                        setOnButton(false)
                      }}
                    ></div>
                  </>
                ) : (
                  <>
                    {state === PageStates.NotConnectedState ? (
                      <div className="btn-mint--small sidePanel-disabled"
                      ></div>
                    ) : (
                      <div
                        onClick={() => {
                          localStorage.setItem("state", "The 1K Club");
                          dispatch(setCardState(PageStates.OneKClub));
                          bootstrap.play_button_down_sound()
                        }}
                        onMouseOver={() => {
                          if (hoverplace !== 3) {
                            setOnButton(true)
                            bootstrap.play_button_hover_sound()
                          }
                        }}
                        onMouseOut={() => {
                          console.log("on mouse out fn. 3")
                          setOnButton(false)
                        }}
                        className="btn-mint--small sidePanel-oneclub"
                      ></div>
                    )}
                  </>
                )}

                <div className="btn-mint--small sidePanel-disabled"></div>

                <div style={{
                  height: '50px'
                }}></div>


                {state === PageStates.NotConnectedState ? (
                  <div className="btn-mint--small sidePanel-refrink-disabled sidePanel-disabled"></div>
                ) : (
                  <div
                    onClick={refrinkHandle}
                    className="btn-mint--small sidePanel-refrink"
                    onMouseOver={() => {
                      if (hoverplace !== 4) {
                        setOnButton(true)
                        bootstrap.play_button_hover_sound()
                      }
                    }}
                    onMouseOut={() => {
                      console.log("on mouse out fn. 4")
                      setOnButton(false)
                    }}
                  ></div>
                )}

                <div style={{
                  height: '20px'
                }}></div>

                {/* {state === PageStates.Bitfighter ? (
                  <>
                    <div className="btn-mint--small drippresale-state-active" 
                      onMouseOver={() => {
                        if ( hoverplace !== 5) {
                          setOnButton(true)
                          bootstrap.play_button_hover_sound()
                        }
                      }}
                      onMouseOut={() => {
                        setOnButton(false)
                      }}
                    ></div>
                  </>
                ) 
                : (
                  <>
                    {state === PageStates.NotConnectedState ? (
                      <div className="btn-mint--small sidePanel-disabled"
                      ></div>
                    ) : (
                      <div
                        onClick={() => {
                          localStorage.setItem("state", "Bitfighters");
                          dispatch(setCardState(PageStates.Bitfighter));
                          bootstrap.play_button_down_sound()
                        }}
                        onMouseOver={() => {
                          if (hoverplace !== 5) {
                            setOnButton(true)
                            bootstrap.play_button_hover_sound()
                          }
                        }}
                        onMouseOut={() => {
                          console.log("on mouse out fn. 3")
                          setOnButton(false)
                        }}
                        className="btn-mint--small sidePanel-bit"
                      ></div>
                    )}
                  </>
                )} */}

                {/* <div style={{
                  height: '5px'
                }}></div> */}

                {/* {state === PageStates.DripFighter ? (
                  <>
                    <div className="btn-mint--small presale-state-active" 
                      onMouseOver={() => {
                        if ( hoverplace !== 6) {
                          setOnButton(true)
                          bootstrap.play_button_hover_sound()
                        }
                      }}
                      onMouseOut={() => {
                        setOnButton(false)
                      }}
                    ></div>
                  </>
                ) 
                : 
                (
                  <>
                    {state === PageStates.NotConnectedState ? (
                      <div className="btn-mint--small sidePanel-disabled"
                      ></div>
                    ) : (
                      <div
                        onClick={() => {
                          localStorage.setItem("state", "DripFighters");
                          dispatch(setCardState(PageStates.DripFighter));
                          bootstrap.play_button_down_sound()
                        }}
                        onMouseOver={() => {
                          if (hoverplace !== 6) {
                            setOnButton(true)
                            bootstrap.play_button_hover_sound()
                          }
                        }}
                        onMouseOut={() => {
                          console.log("on mouse out fn. 3")
                          setOnButton(false)
                        }}
                        className="btn-mint--small sidePanel-drip"
                      ></div>
                    )}
                  </>
                )
                } */}
              </>
            }
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidePanel;
