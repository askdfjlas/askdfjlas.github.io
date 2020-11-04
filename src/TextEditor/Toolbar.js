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
    const italicSelected = (this.state.mask & ContentType.ITALIC) > 0;
    const underlineSelected = (this.state.mask & ContentType.UNDERLINE) > 0;

    return (
      <div className="Askd-text-editor-toolbar">
        <ul>
          <li className={`Askd-tb-selected-${boldSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-BOLD"
                    onClick={() => this.updateMask(ContentType.BOLD)} />
          </li>
          <li className={`Askd-tb-selected-${italicSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-ITALIC"
                    onClick={() => this.updateMask(ContentType.ITALIC)} />
          </li>
          <li className={`Askd-tb-selected-${underlineSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-UNDERLINE"
                    onClick={() => this.updateMask(ContentType.UNDERLINE)} />
          </li>
        </ul>
      </div>
    );
  }
}

export default Toolbar;
