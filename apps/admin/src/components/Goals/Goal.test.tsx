import { shallow } from 'enzyme';
import React from 'react';
import Goal from './Goal';
import EditButton from 'atoms/Buttons/EditButton';

describe('Goal.tsx', () => {
  const onEdit = jest.fn();
  it('is defined', () => {
    const wrapper = shallow(<Goal onEdit={onEdit} text="This is my goal" />);

    expect(wrapper).toBeDefined();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Goal onEdit={onEdit} text="This is my goal" />);

    expect(wrapper).toMatchSnapshot();
  });

  it('can be edited', () => {
    const onEdit = jest.fn();
    const wrapper = shallow(<Goal text="This is my goal" onEdit={onEdit} />);
    const editButton = wrapper.dive().find(EditButton);

    editButton.simulate('click');

    expect(onEdit).toHaveBeenCalled();
  });
});
