import loginImg from "../assets/Images/login.png";
import Template from "../components/core/Auth/Template";

function Login() {
  return (
    <Template
      title="Tekrar Hoş Geldiniz"
      description1="Bugün, yarın ve ötesi için yetenekler kazanın."
      description2="Kariyerinizi geleceğe hazırlayacak eğitim."
      image={loginImg}
      formType="login"
    />
  );
}

export default Login;
