import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';


import Badge from './Badge';

const Components = storiesOf('Components', module)
  .addDecorator(withKnobs);

Components
  .add('Badge', () => <Badge text={text('Text', 'hello')} /> )

export default Components;
