const DEFAULT_NOTE_VIEW = {
  sortByRecent: true,
  organizeBySolved: false,
  organizeByPlatform: false,
  organizeByContest: false
};

class LocalStorageApi {
  static getNoteViewPreferences() {
    const preferenceString = localStorage.getItem('noteViewPreferences');
    try {
      const preferenceJson = JSON.parse(preferenceString);
      for(const key in DEFAULT_NOTE_VIEW) {
        if(!preferenceJson.hasOwnProperty(key)) {
          preferenceJson[key] = DEFAULT_NOTE_VIEW[key];
        }
      }
      return preferenceJson;
    }
    catch(err) {
      return DEFAULT_NOTE_VIEW;
    }
  }

  static setNoteViewPreferences(preferences) {
    localStorage.setItem('noteViewPreferences', JSON.stringify(preferences));
  }
}

export default LocalStorageApi;
