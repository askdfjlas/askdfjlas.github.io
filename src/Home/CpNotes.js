import React, { Component } from 'react';
import Utils from '../Utils';

class CpNotes extends Component {
  componentDidMount() {
    Utils.renderMathJax();
  }

  render() {
    return (
      <div className="Module-description Module-description-centered">
        <p>A work-in-progress web application for storing publicly
        accessible competitive programming notes! Currently working on re-styling
        the site to make it finally look good (hopefully.) Recent actions done
        except for icons (and username colors in the future), users page mostly done,
        login/registration form mostly done, notes page partially done.
        \[\LaTeX\]</p>
      </div>
    );
  }
}

export default CpNotes;
