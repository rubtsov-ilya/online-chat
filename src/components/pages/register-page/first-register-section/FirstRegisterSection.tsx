import { FC } from "react";
import styles from "./FirstRegisterSection.module.scss";
import AuthForm from "src/components/ui/auth-form/AuthForm";


const FirstRegisterSection: FC = () => {

  return (
    <section className={styles["first-section"]}>
      <div className={`container container--height`}>
        <div className={styles["first-section__content"]}>
          <AuthForm btnText={"Зарегистрироваться"} isRegister={true}/>
        </div>
      </div>
    </section>
  );
};

export default FirstRegisterSection;
