exports.courseEnrollmentEmail = (courseName, name) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Kurs Kayıt Onayı</title>
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
            <div class="message">Kurs Kayıt Onayı</div>
            <div class="body">
                <p>Sayın ${name},</p>
                <p><span class="highlight">"${courseName}"</span> adlı kursa başarıyla kayıt oldunuz. Sizi aramızda görmekten mutluluk duyuyoruz!</p>
                <p>Kurs materyallerine erişmek ve öğrenme yolculuğunuza başlamak için lütfen öğrenme panelinize giriş yapın.</p>
                <a class="cta" href="https://study-notion-mern-stack.netlify.app/dashboard/enrolled-courses">Panelime Git</a>
            </div>
            <div class="support">Herhangi bir sorunuz varsa veya yardıma ihtiyaç duyarsanız, lütfen bizimle iletişime geçin: 
            <a href="mailto:denemee111deneme@gmail.com">denemee111deneme@gmail.com</a>. Yardımcı olmaktan memnuniyet duyarız!</div>
        </div>
    </body>
    
    </html>`;
};
