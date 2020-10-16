import React, { Component } from 'react';
import Utils from '../Utils';
import '../css/SearchSelect.css';

const MAX_OPTIONS = 10;
const GLOBAL_SORT_KEY = 'sk';

class SearchSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchTerm: '',
      previousValidSearchTerm: '',
      showOptions: false,
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

  async filterOptions() {
    var filteredOptions = [];
    const searchTerm = this.state.searchTerm.toLowerCase();

    for(const option of this.state.options) {
      if(filteredOptions.length === MAX_OPTIONS)
        break;

      const optionString = this.getOptionString(option);
      if(optionString.toLowerCase().includes(searchTerm)) {
        filteredOptions.push(option);
        continue;
      }

      for(const key of this.props.keys) {
        if(option[key].toLowerCase().includes(searchTerm)) {
          filteredOptions.push(option);
          break;
        }
      }
    }

    await Utils.setStatePromise(this, {
      filteredOptions: filteredOptions
    });
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.staticKey && !this.props.staticKey) {
      await Utils.setStatePromise(this, {
        searchTerm: ''
      });
      return;
    }

    if(this.props.staticKey === prevProps.staticKey)
      return;

    await Utils.setStatePromise(this, {
      searchTerm: '',
      loading: true
    });
    const options = await this.props.search();

    await Utils.setStatePromise(this, {
      loading: false,
      previousValidSearchTerm: '',
      options: options,
      showOptions: false
    });

    await this.filterOptions();
  }

  async handleChange(event) {
    await Utils.setStatePromise(this, {
      searchTerm: event.target.value,
    });

    await this.filterOptions();
  }

  async handleBlur(event) {
    const focusedElement = event.relatedTarget;
    if(focusedElement && focusedElement.id === `Select-options-${this.props.name}`)
      return;

    await Utils.setStatePromise(this, {
      showOptions: false,
      searchTerm: this.state.previousValidSearchTerm
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
      showOptions: false
    });

    await this.filterOptions();
    this.props.callback(sortKey);
  }

  render() {
    var optionElements = [];
    for(const option of this.state.filteredOptions) {
      const optionString = this.getOptionString(option);
      const displayString = option[this.props.displayKey];
      const sortKey = option[GLOBAL_SORT_KEY];
      optionElements.push(
        <li onClick={() => this.handleOptionSelect(sortKey, displayString)}
            key={sortKey}>
            {optionString}
        </li>
      );
    }

    return (
      <div onBlur={this.handleBlur} className="Search-select">
        <input className={this.state.loading ? "Askd-form-loading" : ""}
               onChange={this.handleChange} autoComplete="off" type="text"
               value={this.state.searchTerm} onFocus={this.handleFocus}
               name={this.props.name} id={this.props.id}
               disabled={!this.props.search || this.state.loading} />
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
