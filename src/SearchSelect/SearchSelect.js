import React, { Component } from 'react';
import Utils from '../Utils';
import '../css/SearchSelect.css';

const MAX_OPTIONS = 15;
const MAX_SEARCH_TERMS = 4;
const GLOBAL_SORT_KEY = 'sk';
const NETWORK_LOAD_DELAY = 250;

class SearchSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      searchTerm: '',
      previousValidSearchTerm: '',
      showOptions: false,
      lastChangedTime: 0,
      lastLoadTime: 0,
      options: [],
      filteredOptions: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleOptionSelectWithKeys = this.handleOptionSelectWithKeys.bind(this);
  }

  getOptionString(option) {
    const optionStringArray = [];
    for(const key of this.props.keys)
      optionStringArray.push(option[key]);

    return optionStringArray.join(' - ');
  }

  checkSearchTermsMatch(searchTerms, option) {
    let searchTermsMatch = true;
    const optionString = this.getOptionString(option).toLowerCase();

    for(let i = 0; i < Math.min(MAX_SEARCH_TERMS, searchTerms.length); i++) {
      const searchTerm = searchTerms[i];
      let searchTermMatch = false;

      if(optionString.includes(searchTerm)) {
        searchTermMatch = true;
      }

      for(const key of this.props.keys) {
        if(option[key].toLowerCase().includes(searchTerm)) {
          searchTermMatch = true;
          break;
        }
      }

      if(!searchTermMatch) {
        searchTermsMatch = false;
        break;
      }
    }

    return searchTermsMatch;
  }

  async filterOptions() {
    let filteredOptions = [];
    const searchText = this.state.searchTerm.toLowerCase();
    const searchTextContainsNumber = /\d/.test(searchText);
    const searchTerms = searchText.split(' ');

    if(searchTextContainsNumber && this.props.reverseSearch) {
      this.state.options.reverse();
    }

    for(const option of this.state.options) {
      if(filteredOptions.length === MAX_OPTIONS)
        break;

      if(this.checkSearchTermsMatch(searchTerms, option)) {
        filteredOptions.push(option);
      }
    }

    if(searchTextContainsNumber && this.props.reverseSearch) {
      this.state.options.reverse();
    }

    await Utils.setStatePromise(this, {
      filteredOptions: filteredOptions
    });
  }

  async networkLoadOptions() {
    if(this.mounted === false) return;

    const currentTime = Date.now();
    await Utils.setStatePromise(this, {
      loading: true,
      lastLoadTime: currentTime
    });

    const currentSearchTerm = this.state.searchTerm;
    const filteredOptions = await this.props.search(this.state.searchTerm);
    if(currentSearchTerm === this.state.searchTerm) {
      await Utils.setStatePromise(this, {
        filteredOptions: filteredOptions
      });
    }

    if(this.state.lastLoadTime === currentTime) {
      await Utils.setStatePromise(this, {
        loading: false
      });
    }
  }

  async setInitialSearchSortKey() {
    await Utils.setStatePromise(this, {
      searchTerm: ''
    });

    for(const option of this.state.options) {
      if(option[GLOBAL_SORT_KEY] === this.props.initialSearchSortKey) {
        const searchTerm = this.getOptionString(option);
        await Utils.setStatePromise(this, {
          searchTerm: searchTerm,
          previousValidSearchTerm: searchTerm,
          loading: false
        });
        break;
      }
    }

    await this.filterOptions();
  }

  async componentDidMount() {
    if(!this.props.network && this.props.search) {
      await this.componentDidUpdate({});
    }
    else if(this.props.initialSearchTerm) {
      await Utils.setStatePromise(this, {
        searchTerm: this.props.initialSearchTerm
      });
      await this.networkLoadOptions();
    }
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.staticKey && !this.props.staticKey) {
      await Utils.setStatePromise(this, {
        searchTerm: ''
      });
      return;
    }

    if(this.props.initialSearchTerm !== prevProps.initialSearchTerm) {
       await Utils.setStatePromise(this, {
         searchTerm: this.props.initialSearchTerm
       });
    }

    if(this.props.staticKey !== prevProps.staticKey) {
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

    if(this.props.initialSearchSortKey !== prevProps.initialSearchSortKey) {
      await this.setInitialSearchSortKey();
    }
  }

  async handleChange(event) {
    if(this.props.network) {
      const currentTime = Date.now();
      await Utils.setStatePromise(this, {
        searchTerm: event.target.value,
        lastChangedTime: currentTime
      });

      if(this.state.searchTerm.length > 0) {
        window.setTimeout(() => {
          if(this.state.lastChangedTime === currentTime) {
            this.networkLoadOptions();
          }
        }, NETWORK_LOAD_DELAY);
      }
      else {
        await Utils.setStatePromise(this, {
          filteredOptions: []
        });
      }
    }
    else {
      await Utils.setStatePromise(this, {
        searchTerm: event.target.value
      });

      await this.filterOptions();
    }
  }

  async handleBlur(event) {
    const focusedElement = event.relatedTarget;
    if(focusedElement && focusedElement.id === `Select-options-${this.props.name}`)
      return;

    if(this.props.network) {
      await Utils.setStatePromise(this, {
        showOptions: false
      });
    }
    else {
      await Utils.setStatePromise(this, {
        showOptions: false,
        searchTerm: this.state.previousValidSearchTerm
      });
    }
  }

  async handleFocus(event) {
    await Utils.setStatePromise(this, {
      showOptions: true
    });
  }

  async handleOptionSelectWithKeys(sortKey, optionString) {
    await Utils.setStatePromise(this, {
      searchTerm: optionString,
      previousValidSearchTerm: optionString,
      showOptions: false
    });

    await this.filterOptions();
    this.props.callback(sortKey);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let optionElements = [];
    for(const option of this.state.filteredOptions) {
      if(this.props.keys) {
        const optionString = this.getOptionString(option);
        const displayString = option[this.props.displayKey];
        const sortKey = option[GLOBAL_SORT_KEY];
        optionElements.push(
          <li onClick={() => this.handleOptionSelectWithKeys(sortKey, displayString)}
              key={sortKey}>
              {optionString}
          </li>
        );
      }
      else {
        let optionCallback = async () => {
          await Utils.setStatePromise(this, {
            searchTerm: option,
            showOptions: false
          });
          this.props.callback(option);

          await this.networkLoadOptions();
        };

        optionElements.push(
          <li onClick={optionCallback} key={option}>
            {option}
          </li>
        );
      }
    }

    const inputDisabled = !this.props.network &&
      (!this.props.search || this.state.loading);

    return (
      <div onBlur={this.handleBlur} className="Search-select">
        <input className={this.state.loading ? "Askd-form-loading" : ""}
               onChange={this.handleChange} autoComplete="off" type="text"
               value={this.state.searchTerm} onFocus={this.handleFocus}
               name={this.props.name} id={this.props.id}
               disabled={inputDisabled} placeholder={this.props.placeholder} />
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
