// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import QuickInput from 'components/quick_input.jsx';

export default class SearchSuggestionInput extends React.PureComponent {
    static propTypes = QuickInput.propTypes;
    inputRef = React.createRef();

    recalculateSize = () => {
        // only for textarea, nothing to do here.
    }

    getPretext = () => {
        const input = this.inputRef.current;

        return input.value.substring(0, input.selectionEnd);
    }

    static focus = (input) => {
        if (input.value === '""' || input.value.endsWith('""')) {
            input.selectionStart = input.value.length - 1;
            input.selectionEnd = input.value.length - 1;
        } else {
            input.selectionStart = input.value.length;
        }
        input.focus();
    }

    focus = () => {
        SearchSuggestionInput.focus(this.inputRef.current);
    }

    blur = () => {
        this.inputRef.current.blur();
    }

    getClientHeight = () => {
        return this.inputRef.current.input.clientHeight;
    }

    getValue = () => {
        return this.inputRef.current.input.value;
    }

    getSelectionEnd = () => {
        return this.inputRef.current.input.selectionEnd;
    }

    handleChange = (e) => {
        this.props.onInput(e.target.value);
    }

    render() {
        return (
            <QuickInput
                ref={this.inputRef}
                {...this.props}
                onInput={this.handleChange}
            />
        );
    }
}

