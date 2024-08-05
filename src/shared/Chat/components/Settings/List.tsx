import { useSelector } from '../../../../redux';
import { Checkbox } from '../../../components/common/Checkbox/Checkbox';
import { CustomImage } from '../CustomImage/CustomImage';

function OrganizationList({ values, setValues }: any) {
  const user = useSelector((state) => state.chat.user);
  if (!user?.membership || user?.membership?.length < 2) return null;
  return (
    <ul>
      {(user?.membership || []).map(({ id, short_name, avatar }) => {
        return (
          <li key={id} title={short_name}>
            <Checkbox
              isSquare
              isDark
              value={values.includes(id)}
              valueChange={(value) => {
                if (value) {
                  setValues([...values, id])
                } else {
                  setValues(values.filter(value => value !== id))
                }
              }}
              name={`${id}`}
            />
            <CustomImage
              rounded={true}
              src={avatar}
              width={42}
              height={42}
              alt=""
            />
            <h5>
              <strong>{short_name}</strong>
            </h5>
          </li>
        );
      })}
    </ul>
  );
}

export default OrganizationList;
