import styles from './CustomImage.module.scss';
import { ReactComponent as UserIcon } from '../../../public/icons/profile.svg';

type IImageProps = {
  src: string | ArrayBuffer;
  alt: string;
  rounded?: boolean;
  width?: number | string;
  height?: number | string;
  background?: 'white' | 'gray';
  className?: any;
};

export function CustomImage({ src = '', alt, width = 160, height = 160, rounded = true, className }: IImageProps) {
  return (
    <div className={`${styles.CustomImage} ${className}`} style={{ width, height }}>
      {src ? <img className={styles.rounded} src={src as string} alt={alt} /> : <UserIcon />}
    </div>
  );
}
