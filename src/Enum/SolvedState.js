const SolvedState = Object.freeze({
  SOLVED: { value: 0, text: 'Solved', css: 'solved' },
  UPSOLVED: { value: 1, text: 'Upsolved', css: 'upsolved' },
  UPSOLVED_HELP: { value: 2, text: 'Upsolved with help', css: 'upsolved-help' },
  UNSOLVED: { value: 3, text: 'Unsolved', css: 'unsolved' }
});

export default SolvedState;
