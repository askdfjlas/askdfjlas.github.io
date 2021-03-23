import React, { Component } from 'react';
import Utils from '../Utils';

const confirmationTextOptions = [
  'dijkstra',
  'aho-corasick',
  'dynamic programming',
  'fast matrix exponentiation',
  'sieve of eratosthenes',
  'fenwick tree',
  'fast fourier transform',
  'disjoint set union',
  'square root decomposition',
  'burnside\'s lemma',
  'ford-fulkerson maximum flow',
  'topological sort',
  '0-1 breadth-first-search'
];

class DeleteMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: ''
    };

    const randomIndex = Math.floor(confirmationTextOptions.length * Math.random());
    this.randomCode = confirmationTextOptions[randomIndex];

    this.close = this.close.bind(this);
    this.delete = this.delete.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  close() {
    this.props.exitCallback();
  }

  async delete(event) {
    event.preventDefault();

    const confirmCode = event.target.confirmCode.value;
    if(confirmCode !== this.randomCode) {
      await Utils.componentSetError(this, "Your confirmation code doesn't match!");
      return;
    }

    try {
      await this.setLoading(true);
      await this.props.deleteCallback();
    }
    catch(err) {
      await Utils.componentSetError(this, err.message);
      await this.setLoading(false);
    }
  }

  async setLoading(isLoading) {
    await Utils.setStatePromise(this, {
      loading: isLoading
    });
  }

  render() {
    let submitButtonClassName = 'Askd-button';
    if(this.state.loading) {
      submitButtonClassName += ' Askd-form-loading';
    }

    return (
      <div className="Module-blocker">
        <button onClick={this.close}
                className="Askd-form-close Askd-button Askd-button-circular" />
        <div className="Edit-note-delete-menu Module-popup">
          { this.state.error && <h2>{this.state.error}</h2> }
          <h2>Are you sure you want to permanently delete this
              {' ' + this.props.entityName}?
          </h2>
          <p>
            This action cannot be undone! Please enter the following
            text as confirmation.
          </p>
          <form className="Askd-form" onSubmit={this.delete}>
            <label htmlFor="confirmCode">{this.randomCode}</label>
            <input autoComplete="off" type="text" name="confirmCode"
                   key="confirmCode" id="confirmCode" />

            <input className={submitButtonClassName} type="submit" value="Delete"
                   disabled={this.state.loading} />
          </form>
        </div>
      </div>
    );
  }
}

export default DeleteMenu;
