import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import VisibilitySvg from 'src/assets/images/icons/auth-password-icons/visibility_24dp_FILL0_wght400_GRAD0_opsz24.svg?react';
import VisibilityOffSvg from 'src/assets/images/icons/auth-password-icons/visibility_off_24dp_FILL0_wght400_GRAD0_opsz24.svg?react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IAuthValues } from 'src/interfaces/AuthValues.interface';
import { Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { firebaseDatabase } from 'src/firebase';
import { ref as refFirebaseDatabase, set } from 'firebase/database';
/* import { useAddUserToDataBaseMutation } from 'src/redux'; */
import LogoSvg from 'src/assets/images/icons/logo-icons/Logo.svg?react';

import styles from './AuthForm.module.scss';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

interface AuthFormProps {
  btnText: string;
  isRegister?: boolean;
  isLogin?: boolean;
  isResetPassword?: boolean;
  setIsMessageSended?: Dispatch<SetStateAction<boolean>>;
}

const AuthForm: FC<AuthFormProps> = ({
  btnText,
  isRegister,
  isLogin,
  isResetPassword,
  setIsMessageSended,
}) => {
  /* const [addUserToDataBase] = useAddUserToDataBaseMutation(); */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [mailValue, setMailValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>('');
  const [usernameValue, setUsernameValue] = useState<string>('');
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<IAuthValues>({
    mode: 'all',
  });
  const { ref } = register('password');

  useEffect(() => {
    return () => {
      if (isLoading === true) {
        setIsLoading(false)
      }
    }
  }, [])
  

  const onPasswordInputClick = () => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };
    
  /*   const formReset = (): void => { 
    setPasswordValue('')
    setMailValue('')
    setConfirmPasswordValue('')
    setUsernameValue('')
   }
 */
  const addUserDuringRegister = async (user: User, username: string) => {
    const uid = user.uid;

    // создать user в "userChats"
    set(refFirebaseDatabase(firebaseDatabase, 'users/' + uid), {
      uid: uid,
      email: user.email,
      username: username,
      avatar: ''
    });

    // создать user в "userChats"
    set(refFirebaseDatabase(firebaseDatabase, `userChats/${uid}`), {
      uid: uid,
    });
  }

  const onFormSubmit: SubmitHandler<IAuthValues> = (data) => {
    setIsLoading(true)
    const auth = getAuth();
    if (isRegister) {
      /* start firebase register */
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(({ user }) => {
          if (user) {
            addUserDuringRegister(user, data.username);
          }
          // Signed up
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          if (errorCode === 'auth/email-already-in-use') {
            setError('email', {
              type: 'manual',
              message: 'Email адрес уже зарегистрирован',
            });
          }
          setIsLoading(false)
        });
      /* end firebase register */
    } else if (isLogin) {
      /* start firebase login */
      signInWithEmailAndPassword(auth, data.email, data.password)
        .then(({ user }) => {
          // Signed in
          if (user) {
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode) {
            setError('password', {
              type: 'manual',
              message: 'Неверный пароль',
            });
            console.log(errorMessage);
            setIsLoading(false)
          }
        });
      /* end firebase login */
    } else if (isResetPassword) {
      sendPasswordResetEmail(auth, data.email)
        .then(() => {
          // Password reset email sent!
          if (setIsMessageSended) {
            setIsMessageSended(true);
          }
          setIsLoading(false)
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode) {
            setError('email', {
              type: 'manual',
              message: 'Данный аккаунт не существует',
            });
            console.log(errorMessage);
          }
          setIsLoading(false)
        });
    }
    /* formReset(); */
    /* navigate('/', { state: data }); */
  };

  return (
    <>
      <div className={styles['form-wrapper']}>
        <LogoSvg className={styles['form-wrapper__logo']} />
        {/* <div className={styles['form-welcome-wrapper']}> */}
        {isLogin && (
          <h1 className={styles['form-wrapper__title']}>Войти в Online Chat</h1>
        )}
        {isRegister && (
          <h1 className={styles['form-wrapper__title']}>
            Регистрация в Online Chat
          </h1>
        )}
        {isResetPassword && (
          <h1 className={styles['form-wrapper__title']}>
            Сброс пароля в Online Chat
          </h1>
        )}
        {/* </div> */}
        <form onSubmit={handleSubmit(onFormSubmit)} className={styles['form']}>
          <label
            className={
              errors.email
                ? `${styles['form__label']} ${styles['form__label-error']}`
                : styles['form__label']
            }
            htmlFor="login"
          >
            {errors.email ? errors.email.message : 'Введите email'}
          </label>
          <input
            value={mailValue}
            {...register('email', {
              required: {
                value: true,
                message: 'Обязательное поле',
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Неверный email адрес',
              },
            })}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMailValue(e.target.value)
            }
            className={
              errors.email
                ? `${styles['form__input-bg']} ${styles['form__input-error']}`
                : `${styles['form__input-bg']}`
            }
            type="text"
            placeholder="example@email.com"
          />

          {isRegister && (
            <label
              className={
                errors.password
                  ? `${styles['form__label']} ${styles['form__label-error']}`
                  : styles['form__label']
              }
              htmlFor="password"
            >
              {errors.password ? errors.password.message : 'Задайте пароль'}
            </label>
          )}

          {isLogin && (
            <label
              className={
                errors.password
                  ? `${styles['form__label']} ${styles['form__label-error']}`
                  : styles['form__label']
              }
              htmlFor="password"
            >
              {errors.password && !isRegister
                ? errors.password.message
                : 'Введите пароль'}
            </label>
          )}
          {!isResetPassword && (
            <div
              className={
                errors.password
                  ? `${styles['form__input-bg']} ${styles['form__input-wrapper']} ${styles['form__input-error']}`
                  : `${styles['form__input-bg']} ${styles['form__input-wrapper']}`
              }
              onClick={onPasswordInputClick}
            >
              <input
                {...register('password', {
                  required: {
                    value: true,
                    message: 'Обязательное поле',
                  },
                  minLength: {
                    value: 8,
                    message: 'Минимальная длина 8 символов',
                  },
                })}
                ref={(e) => {
                  ref(e);
                  passwordInputRef.current = e;
                }}
                className={styles['form__input']}
                value={passwordValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPasswordValue(e.target.value)
                }
                type={isPasswordHidden ? 'password' : 'text'}
                placeholder="Пароль"
              />

              {isPasswordHidden && passwordValue.length > 0 && (
                <div
                  onClick={() => setIsPasswordHidden((prev) => !prev)}
                  className={styles['form__hide-btn']}
                >
                  <VisibilitySvg className={styles['form__svg']} />
                </div>
              )}
              {!isPasswordHidden && passwordValue.length > 0 && (
                <div
                  onClick={() => setIsPasswordHidden((prev) => !prev)}
                  className={styles['form__hide-btn']}
                >
                  <VisibilityOffSvg className={styles['form__svg']} />
                </div>
              )}
            </div>
          )}

          {isRegister && (
            <>
              <label
                className={
                  errors.confirmPassword
                    ? `${styles['form__label']} ${styles['form__label-error']}`
                    : styles['form__label']
                }
                htmlFor="confirmPassword"
              >
                {errors.confirmPassword
                  ? errors.confirmPassword.message
                  : 'Подтвердите пароль'}
              </label>

              <input
                {...register('confirmPassword', {
                  required: {
                    value: true,
                    message: 'Обязательное поле',
                  },
                  minLength: {
                    value: 8,
                    message: 'Минимальная длина 8 символов',
                  },
                  validate: {
                    matchesPassword: (value) => {
                      if (value !== passwordValue) {
                        return 'Пароли не совпадают';
                      }
                    },
                  },
                })}
                className={
                  errors.confirmPassword
                    ? `${styles['form__input-bg']} ${styles['form__input-error']}`
                    : `${styles['form__input-bg']}`
                }
                value={confirmPasswordValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPasswordValue(e.target.value)
                }
                type={'password'}
                placeholder="Пароль"
              />

              <label
                className={
                  errors.username
                    ? `${styles['form__label']} ${styles['form__label-error']}`
                    : styles['form__label']
                }
                htmlFor="username"
              >
                {errors.username ? errors.username.message : 'Введите имя'}
              </label>

              <input
                value={usernameValue}
                {...register('username', {
                  required: {
                    value: true,
                    message: 'Обязательное поле',
                  },
                  minLength: {
                    value: 3,
                    message: 'Минимальная длина 3 символа',
                  },
                  maxLength: {
                    value: 32,
                    message: 'Максимальная длина 32 символа',
                  },
                  validate: {
                    // Проверка на минимальную длину, игнорируя пробелы
                    minLengthNoSpaces: (value) => {
                      const cleanedValue = value.replace(/\s/g, ''); // удаляем пробелы
                      console.log(cleanedValue); // Для отладки
                      return (
                        cleanedValue.length >= 3 ||
                        'Минимальная длина 3 символа'
                      );
                    },
                  },
                  pattern: {
                    value: /^[a-zA-Zа-яА-Я0-9\s]+$/, // только латиница и кириллица буквы + цифры + пробелы
                    message: 'Допускаются только буквы и цифры',
                  },
                })}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsernameValue(e.target.value)
                }
                className={
                  errors.email
                    ? `${styles['form__input-bg']} ${styles['form__input-error']}`
                    : `${styles['form__input-bg']}`
                }
                type="text"
                placeholder="Имя"
              />
            </>
          )}

          {isLogin && (
            <Link to={'/register'} className={styles['form__link']}>
              Создать аккаунт
            </Link>
          )}
          {isLogin && (
            <Link to={'/reset-password'} className={styles['form__link']}>
              Не помню пароль
            </Link>
          )}
          {isRegister && (
            <Link to={'/login'} className={styles['form__link']}>
              Войти в аккаунт
            </Link>
          )}
          {isResetPassword && (
            <Link to={'/login'} className={styles['form__link']}>
              Войти в аккаунт
            </Link>
          )}
          <button className={styles['form__btn']}>
            {isLoading && (
              <div className={styles['form__circular-progressbar-wrapper']}>
                <CircularProgressbar
                  className={styles['form__circular-progressbar']}
                  value={66}
                  styles={buildStyles({
                    // Rotation of path and trail, in number of turns (0-1)
                    /* rotation: 0.25, */
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'round',
                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 0.5,
                    // Colors
                    pathColor: 'rgb(255, 255, 255)',
                    /* textColor: '#f88', */
                    trailColor: 'none',
                  })}
                />
              </div>
            )}
            {!isLoading && btnText}
          </button>
        </form>
      </div>
    </>
  );
};

export default AuthForm;
