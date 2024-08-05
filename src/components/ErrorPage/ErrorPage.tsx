import { Link } from 'react-router-dom';
import { routes } from 'Routes';

export function ErrorPage() {
  return (
    <div>
      <div>Что-то пошло не так...</div>
      <div>
        Вернуться на <Link to={routes.UNION}>главную страницу</Link>
      </div>
    </div>
  );
}
