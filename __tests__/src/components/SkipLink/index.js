import React from 'react';
import { mount } from 'enzyme';
import SkipLink from 'src/components/SkipLink';
import { axe } from 'jest-axe';

test('onClick queries the document for the target and focuses it', () => {
  expect.assertions(2);

  const target = window.document.createElement('div');
  target.id = 'skip-target';
  window.document.body.appendChild(target);
  const wrapper = mount(<SkipLink target={'#skip-target'} />);

  wrapper.find('.dqpl-skip-link').simulate('click');

  expect(document.activeElement).toBe(target);
  expect(target.tabIndex).toBe(-1);
});

test('onFocus sets `currentClass` state properly', done => {
  const wrapper = mount(<SkipLink target={'#skip-target'} />);
  wrapper.instance().onFocus();

  // accounts for async setState calls (including the 2nd one with a timeout)
  setTimeout(() => {
    const node = wrapper.getDOMNode(); // enzyme is silly about hasClass on the wrapper itself
    expect(node.classList.contains('dqpl-skip-container-active')).toBeTruthy();
    expect(node.classList.contains('dqpl-skip-fade')).toBeTruthy();
    done();
  }, 100);
});

test('onBlur sets `currentClass` state properly', done => {
  const wrapper = mount(<SkipLink target={'#skip-target'} />);
  wrapper.instance().onFocus(); // trigger the adding of the classes
  wrapper.instance().onBlur();

  // accounts for async setState calls (including the 2nd one with a timeout)
  setTimeout(() => {
    const node = wrapper.getDOMNode(); // enzyme is silly about hasClass on the wrapper itself
    expect(node.classList.contains('dqpl-skip-container-active')).toBeFalsy();
    expect(node.classList.contains('dqpl-skip-fade')).toBeFalsy();
    done();
  }, 100);
});

test('should return no axe violations', async () => {
  const skiplink = mount(<SkipLink target="#skip-target" />);
  expect(await axe(skiplink.html())).toHaveNoViolations();
});
