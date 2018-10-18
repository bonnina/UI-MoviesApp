import React from 'react';
import { Link } from 'react-router-dom';

export default class Clear extends React.Component {
    render() {
        return (
            <div className="box clear-box">
                <p id="clear"> Clear everything? </p>
                <button type="button" className="clear" onClick={() => this.props.clear()}> OK </button>
                <button type="button" className="clear"><Link to="/"> Cancel </Link></button>
            </div>
        );
    }
}