const { Website } = require('../js/Website.js');

test('Website constructor sets indices', () => {
    const w = new Website('test.com', 1, 2);
    expect(w.domain).toBe('test.com');
    expect(w.novelIndex).toBe(1);
    expect(w.chapterIndex).toBe(2);
});