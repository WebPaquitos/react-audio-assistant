import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';
import { FaMicrophone, FaSoundcloud } from 'react-icons/lib/fa';
import PropTypes from 'prop-types';

import GoogleNowSound from '../assets/sounds/google_now_voice.mp3';
import { REPEAT_COMMAND, SAY_TARGET } from '../actions/types';

const API_ENDPOINT = 'http://raaapi.luisdev.eu/api';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-EN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
const StyledJarvis = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: ${({ listening }) => listening ? '75px' : '100px'};
    bottom: ${({ listening }) => listening ? '50px' : '80px'};
    height: ${({ listening }) => listening ? '150px' : '100px'};
    width: ${({ listening }) => listening ? '150px' : '100px'};
    background-color: ${({ listening }) => listening ? '#B71C1C' : '#C62828'};
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(0,0,0,.3);
    color: #fff;
    cursor: pointer;
    font-size: 50px;
    transition: all 200ms;
    &:hover {
        background-color: #B71C1C;
    }
    .icon {
        display: flex;
        align-items: center;
        z-index: 1;
        animation: ${({ listening }) => listening ? 'Listening-Cloud infinite 2s linear' : ''};
        @keyframes Listening-Cloud {
            0% {
                transform: scale(1.2);
            }
            50% {
                transform: scale(.8);
            }
            100% {
                transform: scale(1.2);
            }
        }
    }
    .feedback {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        height: 100%;
        width: 100px;
        opacity: 0;
        padding: 20px;
        transition: all 200ms;
        background-color: #D68585;
        box-shadow: 0 0 15px rgba(0,0,0,.3);
        color: #fff;
        border-radius: 50px;
        font-size: 14px;
        &.active {
            opacity: 1;
            width: 300px;
        }
        .simulated-button {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            height: 100px;
            width: 100px;
            border-radius: 50%;
            background-color: #C62828;
        }
    }
`;

export default class Jarvis extends Component {
    static propTypes = {
        navigate: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.onListen = this.onListen.bind(this);
        this.listen = this.listen.bind(this);
        this.stopListening = this.stopListening.bind(this);
        this.handleSuccessSpeechRequest = this.handleSuccessSpeechRequest.bind(this);
        this.handleErrorSpeechRequest = this.handleErrorSpeechRequest.bind(this);
    }

    state = {
        listening: false,
        repeat: false,
        sayTarget: false,
        currentTarget: null,
        nextTarget: null,
    };

    componentDidUpdate() {
        const { navigate } = this.props;
        const { nextTarget } = this.state;
        if (nextTarget) navigate(nextTarget);
    }

    onListen() {
        const { listening } = this.state;
        if (!listening) this.listen();
        else this.stopListening();
    }

    listen() {
        this.setState({
            listening: true,
            repeat: false,
            sayTarget: false,
        });
        new Audio(GoogleNowSound).play();
        recognition.start();
        recognition.onresult = ({ results }) => {
            const last = results.length - 1;
            const text = results[last][0].transcript;
            axios.post(`${API_ENDPOINT}/request`, { text })
                .then(response => this.handleSuccessSpeechRequest(response))
                .catch(response => this.handleErrorSpeechRequest(response));
        };
        recognition.onspeechend = () => {
            recognition.stop();
            this.setState({ listening: false });
        };
    }

    stopListening() {
        recognition.stop();
        this.setState({ listening: false });
    }

    handleSuccessSpeechRequest({ data: { target: nextTarget } }) {
        this.setState({
            nextTarget,
            repeat: false,
            sayTarget: false,
        });
    }

    handleErrorSpeechRequest({ response: { data: { error } } }) {
        switch (error) {
            case SAY_TARGET:
                return this.setState({
                    sayTarget: true,
                    repeat: false,
                });
            case REPEAT_COMMAND:
                return this.setState({
                    sayTarget: false,
                    repeat: true,
                });
            default:
                console.warn('failed to get a response from the api. Is the token correct?');
        }
        return 0;
    }

    renderIcon() {
        const { listening } = this.state;
        if (listening) return <FaSoundcloud key={1} className="icon-animate"/>;
        return <FaMicrophone key={2}/>;
    }

    renderFeedback() {
        const { repeat, sayTarget } = this.state;
        if (repeat) return 'Sorry, couldn\'t get that';
        else if (sayTarget) return 'Where do you want to go?';
        return '';
    }

    render() {
        const { listening, repeat, sayTarget } = this.state;
        return (
            <StyledJarvis onClick={this.onListen} listening={listening}>
                <div className="icon">
                    {this.renderIcon()}
                </div>
                <div className={`feedback${repeat || sayTarget ? ' active' : ''}`}>
                    <div className="simulated-button"/>
                    {this.renderFeedback()}
                </div>
            </StyledJarvis>
        );
    }
}
