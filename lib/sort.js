'use strict';

module.exports = function(api) {

  api.common.sortComparePriority = (
    priority, // array of strings with priority order
    s1, s2 // config files names to sort in required order
    // Example:
    // comp = api.common.sortComparePriority(impress.CONFIG_FILES_PRIORITY);
    // files.sort(comp);
  ) => {
    let a = priority.indexOf(s1);
    let b = priority.indexOf(s2);
    if (a === -1) a = Infinity;
    if (b === -1) b = Infinity;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  api.common.sortCompareDirectories = (
    a, b // strings to compare
    // Example: files.sort(api.common.sortCompareDirectories);
  ) => {
    let s1 = a.name;
    let s2 = b.name;
    if (s1.charAt(0) !== '/') s1 = '0' + s1;
    if (s2.charAt(0) !== '/') s2 = '0' + s2;
    if (s1 < s2) return -1;
    if (s1 > s2) return 1;
    return 0;
  };

  api.common.sortCompareByName = (
    a, b // objects to compare
    // Example: files.sort(api.common.sortCompareByName);
  ) => {
    const s1 = a.name;
    const s2 = b.name;
    if (s1 < s2) return -1;
    if (s1 > s2) return 1;
    return 0;
  };

};
