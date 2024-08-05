export default function formatServerError(error) {
  const errorsOld = error?.errors;
  const errorsNew = error?.response?.data?.errors;
  let errors;
  if (!!errorsOld) {
    errors = errorsOld;
  }
  if (!!errorsNew) {
    errors = errorsNew;
  }

  let errorText = error.message || 'Что-то пошло не так...';

  if (Array.isArray(errors)) {
    errorText = errors.join('/n');
  } else if (typeof errors === 'object' && errors !== null) {
    errorText = Object.keys(errors)
      .map((error) => errors[error])
      .join('/');
  }
  if (error.response?.status === 401) {
    const redirect = window.location.pathname + window.location.search;
    window.location.href = `/login?redirect=${redirect}`;
  }
  return errorText;
}
