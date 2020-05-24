// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import SearchSuggestionInput from './search_suggestion_input';

const exampleTags = ['from:', 'in:', 'on:', 'before:', 'after:'];

export default class SearchSuggestionTaggedInput extends SearchSuggestionInput {
        static propTypes = {
            onClear: PropTypes.func,
            onInput: PropTypes.func,
            onCompositionStart: PropTypes.func,
            onCompositionUpdate: PropTypes.func,
            onCompositionEnd: PropTypes.func,
            pretext: PropTypes.string,
            onKeyDown: PropTypes.func,
            value: PropTypes.string,
        };

        constructor(props) {
            super(props);
            this.state = {
                tags: [], value: props.value, pairs: [], remainder: '',
            };
        }

    removeTag = (index) => {
        const newTags = [...this.state.tags];
        newTags.splice(index, 1);
        this.setState({tags: newTags});
    }

    onKeyDown = (e) => {
        // const val = e.target.value;

        // if (val && exampleTags.includes(this.props.pretext)) {
        //     this.setState({tags: [...this.state.tags, this.props.pretext].filter((tag, index) => this.state.tags.indexOf(tag) !== index)});

        //     this.state.tags.find((tag) => {
        //         if (tag.toLowerCase() === this.props.pretext.toLowerCase()) {
        //             this.input.value = this.input.value.replace(this.props.pretext, '');
        //         }
        //         return this.input.value;
        //     });

        //     if (this.props.onKeyDown) {
        //         this.props.onKeyDown(e);
        //     }
        // }
        // if (e.key === 'Backspace' && !val) {
        //     this.removeTag(this.state.tags.length - 1);
        // }

        if (this.props.onKeyDown) {
            this.props.onKeyDown(e);
        }
    }

    determinePairs(value = this.props.value) {
        // TODO: use exampleTags to simplify this
        // TODO: support ""
        const split = value.split(/(?<!:) /);
        let lastEntry = split[split.length - 1];
        const lastEntryIsTag = lastEntry.includes(':');
        lastEntry = lastEntry.split(':');
        const remainder = lastEntry[lastEntryIsTag ? 1 : 0];
        let pairs = split.slice(0, split.length - 1).map((x) => x.split(':'));

        if (lastEntryIsTag) {
            pairs.push([lastEntry[0]]);
        }

        pairs = pairs.filter((pair) => pair.some((x) => Boolean(x)));

        return {
            pairs, remainder
        };
    }

    getPretext = () => {
        const input = this.inputRef.current;
        let inputValue = '';
        if (input) {
            inputValue = input.value.substring(0, input.selectionEnd);
        }

        return (this.getPairsText() + inputValue).toLowerCase();
    }

    getPairsText = () => {
        const {pairs} = this.state;
        let pairsText = pairs.map(([name, value = '']) => `${name}:${value}`).join(' ');
        if (pairs.length > 0 && pairs[pairs.length - 1].length > 1) {
            pairsText += ' ';
        }

        return pairsText;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
            ...this.determinePairs(nextProps.value),
        });
    }

    handleChange = (e) => {
        const change = e.target.value;
        const pairsText = this.getPairsText();

        this.props.onInput(pairsText + change);
    }

    getValue = () => {
        return this.getPairsText() + this.state.remainder;
    }

    render() {
        const {pairs, remainder} = this.state;

        return (
            <div className='input-tag'>
                <ul className='input-tag__tags'>
                    { pairs.map(([tag, value]) => (
                        <>
                            <li
                                className='tag'
                                key={tag}
                            >
                                {tag}{':'}
                            </li>
                            <li
                                key={value}
                            >
                                {value}
                            </li>
                        </>
                    ))}
                    <li>
                        <input
                            ref={(current) => {
                                this.inputRef.current = current;
                            }}
                            type='text'
                            autoComplete='off'

                            onChange={this.handleChange}
                            onKeyDown={this.onKeyDown}
                            value={remainder}
                        />
                    </li>
                </ul>
            </div>
        );
    }
}

