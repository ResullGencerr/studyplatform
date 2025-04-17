import signupImg from "../assets/Images/signup.png";
import Template from "../components/core/Auth/Template";

function Signup() {
  return (
    <Template
      title="Ücretsiz olarak StudyNotion ile kodlama öğrenen milyonlara katıl"
      description1="Bugün, yarın ve ötesi için yeteneklerini geliştir."
      description2="Kariyerini geleceğe hazırlayacak bir eğitim."
      image={signupImg}
      formType="signup"
    />
  );
}

export default Signup;
