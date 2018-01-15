import axios from 'axios';
import {
    LISTENING, REQUESTED_TARGET,
    NAVIGATION_DONE, STOP_LISTENING,
    SAY_TARGET, REPEAT_COMMAND,
} from './types';
import GoogleNowSound from '../assets/sounds/google_now_voice.mp3';

const API_ENDPOINT = 'http://raaapi.luisdev.eu/api';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-EN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const handleSuccessSpeechRequest = (dispatch, { data: { target } }) => {
    dispatch({
        type: REQUESTED_TARGET,
        payload: target,
    });
};

const handleErrorSpeechRequest = (dispatch, { response: { data: { error } } }) => {
    switch (error) {
        case SAY_TARGET:
            return dispatch({ type: SAY_TARGET });
        case REPEAT_COMMAND:
            return dispatch({ type: REPEAT_COMMAND });
        default:
            console.log('request failed');
    }
    return 0;
};

export const listen = () => {
    return (dispatch) => {
        dispatch({ type: LISTENING });
        new Audio(GoogleNowSound).play();
        recognition.start();
        recognition.onresult = ({ results }) => {
            const last = results.length - 1;
            const text = results[last][0].transcript;
            axios.post(`${API_ENDPOINT}/request`, { text })
            .then(response => handleSuccessSpeechRequest(dispatch, response))
            .catch(response => handleErrorSpeechRequest(dispatch, response));
        };
        recognition.onspeechend = () => {
            recognition.stop();
            dispatch({ type: STOP_LISTENING });
        };
    };
};

export const navigateAction = (nextTarget, callback) => {
    return (dispatch) => {
        callback(nextTarget);
        dispatch({
            type: NAVIGATION_DONE,
            payload: nextTarget,
        });
    };
};

export const stopListening = () => {
    recognition.stop();
    return { type: STOP_LISTENING };
};
