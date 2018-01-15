import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FaMicrophone, FaSoundcloud } from 'react-icons/lib/fa';
import PropTypes from 'prop-types';

import { listen, stopListening, navigateAction } from '../actions';

const StyledAudioAssistant = styled.div`
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

class AudioAssistant extends Component {
    static propTypes = {
        navigate: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.onListen = this.onListen.bind(this);
    }

    componentDidUpdate() {
        const { nextTarget, navigate, navigateAction } = this.props;
        if (nextTarget) navigateAction(nextTarget, navigate);
    }

    onListen() {
        const { listening } = this.props;
        if (!listening) this.props.listen();
        else this.props.stopListening();
    }

    renderIcon() {
        const { listening } = this.props;
        if (listening) return <FaSoundcloud key={1} className="icon-animate"/>;
        return <FaMicrophone key={2}/>;
    }

    renderFeedback() {
        const { repeat, sayTarget } = this.props;
        if (repeat) return 'Sorry, couldn\'t get that';
        else if (sayTarget) return 'Where do you want to go?';
        return '';
    }

    render() {
        const { listening, repeat, sayTarget } = this.props;
        return (
            <StyledAudioAssistant onClick={this.onListen} listening={listening}>
                <div className="icon">
                    {this.renderIcon()}
                </div>
                <div className={`feedback${repeat || sayTarget ? ' active' : ''}`}>
                    <div className="simulated-button"/>
                    {this.renderFeedback()}
                </div>
            </StyledAudioAssistant>
        );
    }
}

function mapStateToProps({ audioAssistant: { listening, currentTarget, nextTarget, repeat, sayTarget } }) {
    return {
        listening,
        currentTarget,
        nextTarget,
        repeat,
        sayTarget,
    };
}

export default connect(mapStateToProps, {
    listen,
    stopListening,
    navigateAction,
})(AudioAssistant);
