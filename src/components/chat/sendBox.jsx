import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, IconButton } from '@material-ui/core';
import sender from '@/assets/images/sender@2x.png';
import Emoji from './toolbars/emoji'
import { useSelector, useDispatch } from 'react-redux';
import MessageActions from '@/redux/message'
import { useParams } from "react-router-dom";
import WebIM from '@/common/WebIM'
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: theme.spacing(37.5),
        width: '86%',
        background: "#fff",
        marginBottom: theme.spacing(12),
        borderRadius: theme.spacing(2),
        position: 'absolute',
        bottom: 0
    },
    emitter: {
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 16px'
    },
    input: {
        outline: 'none',
        flex: 1,
        lineHeight: '17px',
        fontSize: '14px',
        border: 'none',
        color: '#010101',
        resize: 'none'
    },
    senderBar: {
        height: theme.spacing(12),
        width: theme.spacing(12),
        cursor: 'pointer'
    },
    hide: {
        display: 'none'
    }
}));


function SendBox() {
    const dispatch = useDispatch();
    const classes = useStyles();
    let { chatType, to } = useParams();
    console.log('** Render SendBox **')
    const emojiRef = useRef(null)
    const fileEl = useRef(null)
    const [emojiVisible, setEmojiVisible] = useState(null)
    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef(null)
    const inputValueRef = useRef(null)
    const imageEl = useRef(null)
    inputValueRef.current = inputValue
    const handleClickEmoji = (e) => {
        setEmojiVisible(e.currentTarget)
    }
    const handleEmojiClose = () => {
        setEmojiVisible(null)
    }
    const handleEmojiSelected = (emoji) => {
        setEmojiVisible(null)
        setInputValue(value => value + emoji)
        setTimeout(() => {
            let el = inputRef.current
            el.focus()
            el.selectionStart = inputValueRef.current.length;
            el.selectionEnd = inputValueRef.current.length;
        }, 0)
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }
    const sendMessage = useCallback(() => {
        if (!inputValue) return
        dispatch(MessageActions.sendTxtMessage(to, chatType, {
            msg: inputValue
        }))
        setInputValue('')
        inputRef.current.focus()
    }, [inputValue, to, chatType, dispatch])

    const onKeyDownEvent = useCallback((e) => {
        if (e.keyCode === 13 && e.shiftKey) {
            e.preventDefault()
            inputRef.current.value += "\n";
        }
        else if (e.keyCode === 13) {
            e.preventDefault()
            sendMessage()
        }
    }, [sendMessage])

    useEffect(() => {
        inputRef.current.addEventListener('keydown', onKeyDownEvent)
        return function cleanup() {
            let _inputRef = inputRef
            _inputRef && _inputRef?.current?.removeEventListener('keydown', onKeyDownEvent)
        };
    }, [onKeyDownEvent])

    const handleFileClick = () => {
        fileEl.current.focus()
        fileEl.current.click()
    }
    const handleImageClick = () => {
        imageEl.current.focus()
        imageEl.current.click()
    }
    const handleFileChange = (e) => {
        let file = WebIM.utils.getFileUrl(e.target)
        console.log(file)
        if (!file.filename) {
            return false
        }
        dispatch(MessageActions.sendFileMessage(to, chatType, file))
    }
    const handleImageChange = (e) => {
        let file = WebIM.utils.getFileUrl(e.target)
        console.log(file)
        if (!file.filename) {
            return false
        }
        dispatch(MessageActions.sendImgMessage(to, chatType, file))
    }
    return (
        <Box className={classes.root}>
            <Box className={classes.toolbar}>
                <IconButton ref={emojiRef} className="iconfont icon-biaoqing icon" onClick={handleClickEmoji}></IconButton>

                {/* <IconButton className="iconfont icon-luyin icon"></IconButton> */}
                <IconButton className="iconfont icon-tupian icon"
                    onClick={handleImageClick}
                >
                    <input
                        type="file"
                        accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                        ref={imageEl}
                        onChange={handleImageChange}
                        className={classes.hide}
                    />
                </IconButton>
                <IconButton className="iconfont icon-wenjianfujian icon"
                    onClick={handleFileClick}
                >
                    <input
                        ref={fileEl}
                        onChange={handleFileChange}
                        type="file"
                        className={classes.hide}
                    />
                </IconButton>

            </Box>
            <Box className={classes.emitter}>
                <textarea className={classes.input}
                    rows="4"
                    value={inputValue}
                    onChange={handleInputChange}
                    ref={inputRef}
                ></textarea>
                <IconButton onClick={sendMessage}>
                    <img src={sender} alt="send" className={classes.senderBar} />
                </IconButton>
            </Box>

            <Emoji anchorEl={emojiVisible}
                onSelected={handleEmojiSelected}
                onClose={handleEmojiClose}></Emoji>
        </Box>
    )
}
export default memo(SendBox)