import React, { Component } from 'react';
import TextEditor from '../TextEditor/TextEditor';

class EditNoteForm extends Component {
  render() {
    return (
      <form className="Askd-form">
        <label htmlFor="notes">Notes</label>
        <TextEditor />
      </form>
    );
  }
}

export default EditNoteForm;
