import { Dispatch, FC, SetStateAction } from "react";
import styles from "./ResetPasswordSection.module.scss";
import AuthForm from "src/components/ui/auth-form/AuthForm";


interface ResetPasswordSectionProps {
  setIsMessageSended: Dispatch<SetStateAction<boolean>>;
}

const ResetPasswordSection: FC<ResetPasswordSectionProps> = ({ setIsMessageSended }) => {



  return (
    <section className={styles["reset-password-section"]}>
      <div className={`container container--height`}>
        <div className={styles["reset-password-section__content"]}>
          <AuthForm setIsMessageSended={setIsMessageSended} isResetPassword={true} btnText={"Направить письмо на почту"}/>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordSection;
