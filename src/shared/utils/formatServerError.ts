export default function formatServerError(error) {
  const { errors } = error; // maybe delete

  let errorText = error.message || 'Что-то пошло не так...';

  if (Array.isArray(errors)) {
    errorText = errors.join('/n');
  } else if (typeof errors === 'object' && errors !== null) {
    errorText = Object.keys(errors)
      .map((error) => errors[error])
      .join('/');
  }
  return errorText;
}
