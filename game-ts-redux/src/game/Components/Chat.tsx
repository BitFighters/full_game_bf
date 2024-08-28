// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */


import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
// import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseIcon from '@mui/icons-material/Close'
// import 'emoji-mart/css/emoji-mart.css'
// import { Picker } from 'emoji-mart'
import Picker from '@emoji-mart/react'

import phaserGame from '../../PhaserGame'
import Game from '../scenes/Game'
import { Alert, Snackbar } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../hooks'
import store from '../../stores'
import { v4 as uuidv4 } from 'uuid';
import { SetFocussedOnChat, SetMouseClickControlChat, ShowChatWindow, TurnMouseClickOff } from '../../stores/UserActions'
import { IChatObject, MessageType } from '../../stores/ChatStore'
import { getSystemInfo } from '../../utils/systemInfo'
// import { Picker } from 'emoji-mart'

const Backdrop = styled.div`
    position: fixed;
    align-self: flex-end;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const Wrapper2 = styled.div`
    display: flex;
    flex-direction: column;
`

const FabWrapper = styled.div``

const ChatHeader = styled.div`
    position: relative;
    height: 35px;
    background: #000000a7;
    border-radius: 10px 10px 0px 0px;
    h3 {
        color: #fff;
        margin: 7px;
        font-size: 17px;
        text-align: center;
    }

    .close {
        position: absolute;
        top: 0;
        right: 0;
    }
`

const ChatBox = styled(Box)`
    position: relative;
    display: inline-block;
    opacity: 0.9;
    background: #2c2c2c;
    border: 1px solid #00000029;
`

const MessageWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 0px 2px;
    padding-bottom: 2px;
    
    p {
        margin: 3px;
        text-shadow: 0.3px 0.3px black;
        font-size: 15px;
        font-weight: bold;
        line-height: 1.4;
        overflow-wrap: anywhere;
    }

    span {
        color: white;
        font-weight: normal;
        line-height: 1.4;
    }

    .notification {
        color: grey;
        font-weight: normal;
    }

    :hover {
        background: #3a3a3a;
    }
`

const InputWrapper = styled.form`
  box-shadow: 10px 10px 10px #00000018;
  border: 1px solid #42eacb;
  border-radius: 0px 0px 10px 10px;
  display: flex;
  flex-direction: row;
  background: linear-gradient(180deg, #000000c1, #242424c0);
`

const InputTextField = styled(InputBase)`
    border-radius: 0px 0px 10px 10px;
    input {
        padding: 5px;
    }
`

const EmojiPickerWrapper = styled.div`
    overflow-y: scroll;
    position: absolute;
    left: ${getSystemInfo() ? (-37) : (0)}px;
    bottom: ${getSystemInfo() ? (-45) : (0)}px;
    transform: scale(${getSystemInfo() ? (0.8) : (1.0)});
`

export interface IMsgObject {
    chatMessage: IChatObject,
}

const vertical = 'top';
const horizontal = 'center';

const CustomSplit = (text: string) => {
    // let ntext = "";
    // if (text.length > 30) {
    //   for (let i =0; i< text.length; i = i + 30) {
    //     ntext += text.slice(i,i+30) + "\n"
    //   }
    // } else {
    //   return text;
    // }
    // return ntext;
    return text;
}

const getVh = (px: number) => {
    return (100 * (px / (window.innerHeight * window.devicePixelRatio)))
}

const Message = (messageObj: IMsgObject) => {
    const [tooltipOpen, setTooltipOpen] = useState(false)
    return (
        <MessageWrapper className={`${messageObj.chatMessage.direction}-msg`}
            onMouseEnter={() => {
                setTooltipOpen(true)
            }}
            onMouseLeave={() => {
                setTooltipOpen(false)
            }}
            key={uuidv4()}
        >
            {
                (messageObj.chatMessage.type === MessageType.Announcement) ?
                    <>
                        <div>
                            <span style={{ color: 'grey', fontSize: "15px", fontFamily: 'monospace' }}>
                                {(messageObj.chatMessage.nick_name)} {messageObj.chatMessage.message}
                            </span>
                        </div>
                    </> :
                    (messageObj.chatMessage.type === MessageType.FightAnnouncement) ?
                        <>
                            <div>
                                <span style={{ color: 'green', fontSize: "10px", fontFamily: 'monospace' }}>
                                    {(messageObj.chatMessage.message)}
                                </span>
                            </div>
                        </> :
                        <div>
                            {(messageObj.chatMessage.direction === "left") ?
                                (
                                    <div className="msg-bubble">
                                        <div>
                                            <span style={{ color: 'red', fontSize: "10px", fontWeight: 'bold', fontFamily: 'monospace' }}>
                                                {(messageObj.chatMessage.nick_name)}
                                            </span> <span style={{ paddingLeft: "15px" }}>     </span>
                                            <span style={{ display: "block", width: "150px", wordWrap: "break-word" }}> {CustomSplit(messageObj.chatMessage.message)}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="msg-bubble" style={{ flexDirection: 'row-reverse', float: 'right' }}>
                                        <div style={{
                                            borderBottomLeftRadius: 0
                                        }}>
                                            <span style={{ color: 'blue', fontSize: "10px", fontWeight: 'bold', fontFamily: 'monospace' }}>
                                                {(messageObj.chatMessage.nick_name)}
                                            </span> <span style={{ paddingLeft: "15px" }}>     </span>
                                            <span style={{ display: "block", width: "150px", wordWrap: "break-word" }}> {CustomSplit(messageObj.chatMessage.message)}</span>
                                        </div>
                                    </div>
                                )}
                        </div>
            }
        </MessageWrapper>
    )
}

export default function Chat() {
    const [inputValue, setInputValue] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [chatMessages, setChatMessages] = useState([{ walletAddress: "", message: "Welcome to the Chat Box of bitfighters ." }]);
    // const [focused, setFocused] = useState(false);
    // const [showChat, setShowChat] = useState(false);
    const focussedOnChat = useAppSelector((state) => state.userActionsDataStore.focussedOnChat)
    const showChatWindow = useAppSelector((state) => state.userActionsDataStore.showChatWindow)
    // console.log("focused --", focussedOnChat, showChatWindow)
    const dispatch = useAppDispatch();
    const userAddress = useAppSelector((state) => state.web3store.userAddress)
    const StoreChatMessage = useAppSelector((state) => state.chatStore.chatMessage)
    const StoreChatMessageUpdate = useAppSelector((state) => state.chatStore.chatUpdate)
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("")
    const [lastMessageSubmittedTime, setlastMessageSubMittedTime] = useState(0)
    const [placeHolderText, setPlaceHolderText] = useState("Press Enter to chat")
    const placeHoderTextConst = "Press Enter to chat."
    const [timer, setTimer] = useState(0);
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const ismobile = getSystemInfo();

    let lastTypingSent = 0;

    const handleClose = () => {
        setSnackBarOpen(false);
    };

    const startTimer = () => {
        const time = 2
        setTimer(time)
        countDown(time)
    };

    const countDown = (time: number) => {
        // console.log("time ", time)
        setTimer(time - 1)
        setPlaceHolderText(`Wait for ${time} seconds`);
        const myTimeout = setTimeout(() => {
            countDown(time - 1)
        }, 1000);
        if (time === 0) {
            setPlaceHolderText(placeHoderTextConst);
            clearTimeout(myTimeout);
        }
    }
    const game = phaserGame.scene.keys.game as Game

    const handleChange = (event: any) => {
        inputRef.current?.focus()
        // console.log(inputValue.length)
        if (inputValue.length > 100) {
            setSnackBarMessage("Message length should not exceed 100.")
            setSnackBarOpen(true);
            setInputValue(event.target.value)
        } else {
            setInputValue(event.target.value)
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // console.log("focus --")
        if (event.key === 'Escape') {
            // move focus back to the game
            inputRef.current?.blur()
            // setShowChat(false)
            dispatch(ShowChatWindow(false));
            dispatch(SetFocussedOnChat(false));
            game.enableKeyBoard()
        }
        else {
            // setFocused(true);
            dispatch(SetFocussedOnChat(true));
            // game.myPlayer.createNewDialogBox("...")
            if (new Date().getTime() - lastTypingSent > 1 * 1000) {
                lastTypingSent = new Date().getTime()
                game.lobbySocketConnection.send(JSON.stringify({
                    event: "typing",
                    walletAddress: userAddress,
                    room_id: "lobby",
                    message: "...",
                }))
                game.disableKeyBOard()
            }
        }
        // console.log("pressing key in handlekey down in chat.", event.key)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // console.log("handlesubmit__debug_chat", inputValue)
        console.log("focus-- handle submit pressed",)
        if (new Date().getTime() - lastMessageSubmittedTime < 2 * 1000) {
            setSnackBarMessage("Please wait for the Slow Mode time to finish")
            inputRef.current?.blur()
            setSnackBarOpen(true);
            return;
        }
        // move focus back to the game
        // inputRef.current?.blur()

        let val = inputValue.trim()
        val = val.replace(/'/g, ' ');
        //console.log("handlesubmit__debug_chat", val)
        setInputValue('')
        if (val) {
            inputRef.current?.blur()
            dispatch(SetFocussedOnChat(false))
            setlastMessageSubMittedTime(new Date().getTime())
            startTimer()
            setChatMessages(arr => [...arr, { walletAddress: userAddress, message: val }])
            // game.myPlayer.createNewDialogBox(val)
            game.lobbySocketConnection.send(JSON.stringify({
                event: "chat",
                walletAddress: userAddress,
                room_id: "lobby",
                message: val,
                nick_name: store.getState().playerDataStore.nick_name
            }))
        }
        //scrollToBottom()
        game.enableKeyBoard()
    }

    useEffect(() => {
        if (focussedOnChat) {
            inputRef.current?.focus()
        }
    }, [focussedOnChat])

    useEffect(() => {
        scrollToBottom();
    }, [StoreChatMessage]);

    useEffect(() => {
        if (chatBoxRef.current && showChatWindow) {
            scrollToBottom();
        }
    }, [showChatWindow]);
    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };


    return (
        <div style={{
            display: "flex",
            height: "100%",
        }}>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={snackBarOpen}
                autoHideDuration={4000}
                onClose={handleClose}
                key={'top' + 'center'}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
            <Backdrop style={{
                margin: ismobile ? "0.1%" : "0.9%",
            }}>
                {
                    showChatWindow &&
                        !store.getState().websiteStateStore.showing_jackpot_wheel ?
                        (
                            <Wrapper
                                onMouseOver={() => {
                                    dispatch(SetMouseClickControlChat(true))
                                }}
                                onMouseOut={() => {
                                    dispatch(SetMouseClickControlChat(false))
                                }}
                                style={{
                                    margin: ismobile ? "2%" : "-3%",
                                }}
                            >
                                <ChatHeader>
                                    <h3>Chat</h3>
                                    <IconButton
                                        aria-label="close dialog"
                                        className="close"
                                        onClick={() => {
                                            dispatch(ShowChatWindow(false))
                                            dispatch(SetFocussedOnChat(false))
                                            game.enableKeyBoard()
                                            dispatch(TurnMouseClickOff(false))
                                            dispatch(SetMouseClickControlChat(false))
                                        }
                                        }
                                        size="small"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </ChatHeader>
                                <ChatBox ref={chatBoxRef}>
                                    <div style={{ height: "40vh", overflowY: "scroll" }}>
                                        {StoreChatMessage.map((chatMessage, index) => (
                                            <Message chatMessage={chatMessage} key={uuidv4()} />
                                        ))}
                                    </div>
                                    <div ref={messagesEndRef} />
                                    {
                                        showEmojiPicker &&
                                        (
                                            <EmojiPickerWrapper
                                                onMouseOver={() => {
                                                    dispatch(SetMouseClickControlChat(true))
                                                }}
                                                onMouseOut={() => {
                                                    dispatch(SetMouseClickControlChat(false))
                                                }}
                                            >
                                                <Picker
                                                    theme="dark"
                                                    showSkinTones={false}
                                                    showPreview={false}
                                                    onMouseOver={() => {
                                                        dispatch(SetMouseClickControlChat(true))
                                                    }}
                                                    onMouseOut={() => {
                                                        dispatch(SetMouseClickControlChat(false))
                                                    }}
                                                    onEmojiSelect={(emoji: any) => {
                                                        // console.log("emoji selected -- ", emoji)
                                                        setInputValue(inputValue + emoji.native)
                                                        setShowEmojiPicker(!showEmojiPicker)
                                                        // setFocused(true)
                                                        dispatch(SetFocussedOnChat(true))
                                                    }}
                                                    exclude={['recent', 'flags']}
                                                />
                                            </EmojiPickerWrapper>
                                        )
                                    }
                                </ChatBox>

                                <InputWrapper onSubmit={handleSubmit}>
                                    <InputTextField
                                        onMouseOver={() => {
                                            dispatch(SetMouseClickControlChat(true))
                                        }}
                                        onMouseOut={() => {
                                            dispatch(SetMouseClickControlChat(false))
                                        }}
                                        inputRef={inputRef}
                                        autoFocus={focussedOnChat}
                                        fullWidth
                                        placeholder={placeHolderText}
                                        value={inputValue}
                                        onKeyDown={handleKeyDown}
                                        onChange={handleChange}
                                        // onFocus={() => {
                                        //   if (!focussedOnChat) {
                                        //     console.log("on focused focused --", focussedOnChat, showChatWindow)
                                        //     // setFocused(true)
                                        //     dispatch(SetFocussedOnChat(true))
                                        //     // dispatch(SetMouseClickControlChat(true))
                                        //   }
                                        // }}
                                        onBlur={() => {
                                            console.log("on blur focused --", focussedOnChat, showChatWindow)
                                            // console.log("on blur triggered,, ")
                                            // setFocused(false)
                                            dispatch(SetFocussedOnChat(false))
                                            // game.enableKeyBoard()
                                            dispatch(SetMouseClickControlChat(false))
                                        }}
                                    />
                                    <IconButton aria-label="emoji" onClick={() => {
                                        setShowEmojiPicker(!showEmojiPicker)
                                        dispatch(SetMouseClickControlChat(false))
                                    }}>
                                        <InsertEmoticonIcon />
                                    </IconButton>
                                </InputWrapper>

                            </Wrapper>
                        ) :
                        (
                            <Wrapper2
                                onMouseOver={() => {
                                    dispatch(TurnMouseClickOff(true))
                                }}
                                onMouseOut={() => {
                                    dispatch(TurnMouseClickOff(false))
                                }}
                            >
                                <FabWrapper>
                                    <Fab
                                        color="info"
                                        aria-label="showChat"
                                        onClick={() => {
                                            dispatch(SetFocussedOnChat(true))
                                            dispatch(ShowChatWindow(true))
                                            dispatch(TurnMouseClickOff(false))
                                        }}
                                        style={{
                                            background: '#9c341a',
                                            transform: ismobile ? 'scale(0.7)' : 'scale(1.3)',
                                        }}
                                    >
                                        <ChatBubbleOutlineIcon />
                                    </Fab>
                                </FabWrapper>
                            </Wrapper2>
                        )
                }
            </Backdrop>

        </div>
    )
}
