import React from 'react';
import './Toggle.css';
import Toner from './toner.js';

export default class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: false };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prevState => ({ isToggleOn: !prevState.isToggleOn }));
        console.log(this.props.id);
        this.state.isToggleOn ? Toner.stop() : Toner.start();
    }

    render() {
        return (
            <div className={`
            stepDiv
            ${this.state.isToggleOn ? "toggled" : ""} 
            `}
                onClick={this.handleClick}>
                {this.props.id + 1}
            </div>
        );
    }
}
