import React, { Component } from 'react';
import ContentType from './ContentType';
import Utils from '../Utils';

class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mask: 0
    };

    this.updatingMask = false;
    this.updateMask = this.updateMask.bind(this);
  }

  async updateMask(bit) {
    this.updatingMask = true;

    await Utils.setStatePromise(this, {
      mask : this.state.mask ^ bit
    });

    this.props.callback(bit, (this.state.mask & bit) > 0);
  }

  async componentDidUpdate() {
    if(this.updatingMask) {
      this.updatingMask = false;
      return;
    }

    if(this.props.mask !== this.state.mask) {
      await Utils.setStatePromise(this, {
        mask: this.props.mask
      });
    }
  }

  render() {
    const boldSelected = (this.state.mask & ContentType.BOLD) > 0;

    return (
      <div className="Askd-text-editor-toolbar">
        <ul>
          <li className={`Askd-tb-selected-${boldSelected}`}>
            <button type="button"
                    onClick={() => this.updateMask(ContentType.BOLD)}>
                    Bold
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default Toolbar;
