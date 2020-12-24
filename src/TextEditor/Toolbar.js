import React, { Component } from 'react';
import ContentType from './ContentType';

class Toolbar extends Component {
  render() {
    const boldSelected = (this.props.mask & ContentType.BOLD) > 0;
    const italicSelected = (this.props.mask & ContentType.ITALIC) > 0;
    const underlineSelected = (this.props.mask & ContentType.UNDERLINE) > 0;
    const mathSelected = (this.props.mask & ContentType.MATH) > 0;

    return (
      <div className="Askd-text-editor-toolbar">
        <ul>
          <li className={`Askd-tb-selected-${boldSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-BOLD"
                    onClick={() => this.props.callback(ContentType.BOLD)} />
          </li>
          <li className={`Askd-tb-selected-${italicSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-ITALIC"
                    onClick={() => this.props.callback(ContentType.ITALIC)} />
          </li>
          <li className={`Askd-tb-selected-${underlineSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-UNDERLINE"
                    onClick={() => this.props.callback(ContentType.UNDERLINE)} />
          </li>
          <li className={`Askd-tb-selected-${mathSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-MATH"
                    onClick={() => this.props.callback(ContentType.MATH)} />
          </li>
        </ul>
      </div>
    );
  }
}

export default Toolbar;
