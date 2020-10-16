import React, { Component } from 'react';
import Utils from '../Utils';
import '../css/SearchSelect.css';

const MAX_OPTIONS = 10;
const GLOBAL_SORT_KEY = 'sk';

class SearchSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      previousValidSearchTerm: '',
      showOptions: true,
      options: [],
      filteredOptions: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleOptionSelect = this.handleOptionSelect.bind(this);
  }

  getOptionString(option) {
    const optionStringArray = [];
    for(const key of this.props.keys)
      optionStringArray.push(option[key]);

    return optionStringArray.join(' - ');
  }

  async componentDidUpdate(prevProps) {
    if(!this.props.staticKey || this.props.staticKey === prevProps.staticKey)
      return;

    const options = await this.props.search();
    await Utils.setStatePromise(this, {
      searchTerm: '',
      previousValidSearchTerm: '',
      options: options,
      filteredOptions: []
    });
  }

  async handleChange(event) {
    const newSearchTerm = event.target.value.toLowerCase();

    var filteredOptions = [];
    for(const option of this.state.options) {
      if(filteredOptions.length === MAX_OPTIONS)
        break;

      const optionString = this.getOptionString(option);
      if(optionString.toLowerCase().includes(newSearchTerm)) {
        filteredOptions.push(option);
        continue;
      }

      for(const key of this.props.keys) {
        if(option[key].toLowerCase().includes(newSearchTerm)) {
          filteredOptions.push(option);
          break;
        }
      }
    }

    await Utils.setStatePromise(this, {
      searchTerm: event.target.value,
      filteredOptions: filteredOptions
    });
  }

  async handleBlur(event) {
    const focusedElement = event.relatedTarget;
    if(focusedElement && focusedElement.id === `Select-options-${this.props.name}`)
      return;

    await Utils.setStatePromise(this, {
      showOptions: false,
      searchTerm: this.state.previousValidSearchTerm,
      filteredOptions: []
    });
  }

  async handleFocus(event) {
    await Utils.setStatePromise(this, {
      showOptions: true
    });
  }

  async handleOptionSelect(sortKey, optionString) {
    await Utils.setStatePromise(this, {
      searchTerm: optionString,
      previousValidSearchTerm: optionString,
      showOptions: false,
      filteredOptions: []
    });

    this.props.callback(sortKey);
  }

  render() {
    var optionElements = [];
    for(const option of this.state.filteredOptions) {
      const optionString = this.getOptionString(option);
      const sortKey = option[GLOBAL_SORT_KEY];
      optionElements.push(
        <li onClick={() => this.handleOptionSelect(sortKey, optionString)}
            key={sortKey}>
            {optionString}
        </li>
      );
    }

    return (
      <div onBlur={this.handleBlur} className="Search-select">
        <input onChange={this.handleChange} autoComplete="off" type="text"
               value={this.state.searchTerm} onFocus={this.handleFocus}
               name={this.props.name} id={this.props.id}
               disabled={!this.props.search} />
        {
          optionElements.length > 0 && this.state.showOptions &&
          <ol id={`Select-options-${this.props.name}`} tabIndex="-1"
              className="Search-select-options">
            { optionElements }
          </ol>
        }
      </div>
    );
  }
}

export default SearchSelect;
