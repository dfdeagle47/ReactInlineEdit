var React = require('react'),
    ReactDOM = require('react-dom');


function SelectInputText(element) {
    element.setSelectionRange(0, element.value.length);
}

module.exports = React.createClass({
    propTypes: {
        text: React.PropTypes.string.isRequired,
        paramName: React.PropTypes.string.isRequired,
        change: React.PropTypes.func.isRequired,
        placeholder: React.PropTypes.string,
        activeClassName: React.PropTypes.string,
        minLength: React.PropTypes.number,
        maxLength: React.PropTypes.number,
        validate: React.PropTypes.func,
        element: React.PropTypes.string,
        component: React.PropTypes.string
    },

    getInitialState: function() {
        this.isInputValid = this.props.validate || this.isInputValid;

        return {
            editing: false,
            text: this.props.text,
            minLength: this.props.minLength || 1,
            maxLength: this.props.maxLength || 256,
        };
    },

    startEditing: function() {
        this.setState({
            editing: true,
            text: this.props.text
        });
    },

    finishEditing: function() {
        if (this.isInputValid(this.state.text) && this.props.text != this.state.text) {
            this.commitEditing();
        } else if (this.props.text === this.state.text || !this.isInputValid(this.state.text)) {
            this.cancelEditing();
        }
    },

    cancelEditing: function() {
        this.setState({
            editing: false,
            text: this.props.text
        });
    },

    commitEditing: function() {
        this.setState({
            editing: false,
            text: this.state.text
        });
        var newProp = {};
        newProp[this.props.paramName] = this.state.text;
        this.props.change(newProp);
    },

    isInputValid: function(text) {
        return (text.length >= this.state.minLength && text.length <= this.state.maxLength);
    },

    keyDown: function(event) {
        if (event.keyCode === 13) {
            this.finishEditing();
        } else if (event.keyCode === 27) {
            this.cancelEditing();
        }
    },

    textChanged: function(event) {
        this.setState({
            text: event.target.value.trim()
        })
    },

    componentDidUpdate: function(prevProps, prevState) {
        var inputElem = ReactDOM.findDOMNode(this.refs.input);
        if (this.state.editing && !prevState.editing) {
            inputElem.focus();
            SelectInputText(inputElem);
        } else if (this.state.editing && prevProps.text != this.props.text) {
            this.finishEditing();
        }
    },

    render: function() {
        if (!this.state.editing) {
            var component = this.props.component || 'span';
            return React.createElement(component, {
                className: this.props.className,
                onClick: this.startEditing
            }, this.state.text || this.props.placeholder);
        } else {
            var element = this.props.element || 'input';

            return React.createElement(element, {
                className: this.props.activeClassName,
                onKeyDown: this.keyDown,
                onBlur: this.finishEditing,
                ref: 'input',
                placeholder: this.props.placeholder,
                defaultValue: this.state.text,
                onChange: this.textChanged,
                onReturn: this.finishEditing
            })
        }
    }
});