import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NewsCard } from './NewsCard';

export default {
  title: 'components/NewsCard',
  component: NewsCard,
} as ComponentMeta<typeof NewsCard>;

// нужно отобразить каждый вид карточки со всеми пропсами

const Template: ComponentStory<typeof NewsCard> = (args) => <NewsCard {...args} />;

export const NewsCardComponent = Template.bind({});
NewsCardComponent.args = {
  newsCardDetails: {
    excerpt: 'Беларусы против войны',
    id: 285,
    image: null,
    organization: { id: 6, type_id: 2, type_name: 'Движение', name: 'ООО МеталРос', short_name: 'МеталРос', avatar: '' },
    published_at: '2022-03-05T12:29:57.000000Z',
    tags: ['Беларусы против войны'],
    title: 'Заголовок',
  },
  type: 'allNews',
};
