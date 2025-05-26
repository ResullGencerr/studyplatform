exports.passwordUpdated = (email, name) => {
	return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Şifre Güncelleme Onayı</title>
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
           
            <div class="message">Şifre Güncelleme Onayı</div>
            <div class="body">
                <p>Merhaba ${name},</p>
                <p><span class="highlight">${email}</span> e-posta adresiniz için şifreniz başarıyla güncellendi.</p>
                <p>Eğer bu şifre değişikliğini siz yapmadıysanız, lütfen hemen bizimle iletişime geçerek hesabınızı güvence altına alın.</p>
            </div>
            <div class="support">Herhangi bir sorunuz veya ek yardıma ihtiyacınız olursa, lütfen bizimle iletişime geçin: 
                <a href="mailto:denemee111deneme@gmail.com">denemee111deneme@gmail.com</a>. Yardımcı olmaktan memnuniyet duyarız!
            </div>
        </div>
    </body>
    
    </html>`;
};
