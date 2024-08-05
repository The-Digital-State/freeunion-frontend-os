import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Checkbox as Chip } from './Checkbox';

export default {
  title: 'components/Checkbox',
  component: Chip,
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />;

export const CheckboxComponent = Template.bind({});
CheckboxComponent.args = {
  label: 'Hello',
  variant: 'outlined',
  //   avatar: <Avatar style={{ width: 30, height: 30 }}>H</Avatar>,
  onDelete: () => {
    console.log('Deleted');
  },
};
