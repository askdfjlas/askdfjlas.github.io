import React, { Component } from 'react';
import ContentType from './ContentType';

class Toolbar extends Component {
  render() {
    const boldSelected = (this.props.mask & ContentType.BOLD) > 0;
    const italicSelected = (this.props.mask & ContentType.ITALIC) > 0;
    const underlineSelected = (this.props.mask & ContentType.UNDERLINE) > 0;
    const mathSelected = (this.props.mask & ContentType.MATH) > 0;

    const selectHandler = (type) => {
      return (event) => {
        event.preventDefault();
        this.props.callback(type);
      };
    };

    return (
      <div className="Askd-text-editor-toolbar">
        <ul>
          <li className={`Askd-tb-selected-${boldSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-BOLD"
                    onPointerDown={selectHandler(ContentType.BOLD)} />
          </li>
          <li className={`Askd-tb-selected-${italicSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-ITALIC"
                    onPointerDown={selectHandler(ContentType.ITALIC)} />
          </li>
          <li className={`Askd-tb-selected-${underlineSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-UNDERLINE"
                    onPointerDown={selectHandler(ContentType.UNDERLINE)} />
          </li>
          <li className={`Askd-tb-selected-${mathSelected}`}>
            <button type="button" className="Askd-tb-icon Askd-tb-MATH"
                    onPointerDown={selectHandler(ContentType.MATH)} />
          </li>
        </ul>
      </div>
    );
  }
}

export default Toolbar;
