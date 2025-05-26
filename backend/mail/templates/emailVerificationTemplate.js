const otpTemplate = (otp, name) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Doğrulama E-postası</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			
			<div class="message">OTP Doğrulama E-postası</div>
			<div class="body">
				<p>Merhaba ${name},</p>
				<p>StudyNotion platformuna kaydolduğunuz için teşekkür ederiz. Kaydınızı tamamlamak için aşağıdaki OTP'yi (Tek Kullanımlık Şifre) kullanarak hesabınızı doğrulayabilirsiniz:</p>
				<h2 class="highlight">${otp}</h2>
				<p>Bu OTP 3 dakika boyunca geçerlidir. Bu doğrulama isteğini siz yapmadıysanız, bu e-postayı dikkate almayınız.
				Hesabınız doğrulandıktan sonra platformumuza ve özelliklerine erişebileceksiniz.</p>
			</div>
			<div class="support">Herhangi bir sorunuz varsa veya yardıma ihtiyaç duyarsanız, lütfen bizimle iletişime geçin: 
				<a href="mailto:denemee111deneme@gmail.com">denemee111deneme@gmail.com</a>. Yardımcı olmaktan memnuniyet duyarız!
			</div>
		</div>
	</body>
	
	</html>`;
};
module.exports = otpTemplate;
