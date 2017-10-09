import {
    LISTENING, REQUESTED_TARGET,
    NAVIGATION_DONE, STOP_LISTENING,
    SAY_TARGET, REPEAT_COMMAND,
} from '../actions/types';

const INITIAL_STATE = {
    listening: false,
    currentTarget: null,
    nextTarget: null,
    sayTarget: false,
    repeat: false,
};

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case LISTENING:
            return {
                ...state,
                listening: true,
                repeat: false,
                sayTarget: false,
            };
        case REQUESTED_TARGET:
            return {
                ...state,
                nextTarget: payload,
                repeat: false,
                sayTarget: false,
            };
        case NAVIGATION_DONE:
            return {
                ...state,
                currentTarget: payload,
                nextTarget: null,
                repeat: false,
                sayTarget: false,
            };
        case SAY_TARGET:
            return {
                ...state,
                sayTarget: true,
                repeat: false,
            };
        case REPEAT_COMMAND:
            return {
                ...state,
                sayTarget: false,
                repeat: true,
            };
        case STOP_LISTENING:
            return {
                ...state,
                listening: false,
            };
        default:
            return state;
    }
};
