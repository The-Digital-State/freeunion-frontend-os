import { routes } from 'Routes';

type NavigationType = {
  title: string;
  route: string;
};

export const navigationKbase = (): NavigationType[] => {
  if (!routes) {
    return null;
  }

  return [
    {
      title: 'Статьи',
      route: routes.KNOWLEDGE_BASE_MATERIALS,
    },
    // {
    //   title: 'Разделы',
    //   route: routes.KNOWLEDGE_BASE_SECTIONS,
    // },
  ];
};
