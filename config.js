export const CONFIG = {
    botToken: '8228167242:AAH8tGPdLUdiNGCG4EYG21s5twEy8M-xfXA',
    ownerId: '8062935882',
    groupId: '-1003887790861',
    groupLink: 'https://t.me/otpspyx',
    botImage: 'https://i.postimg.cc/R0WNr0Wy/file-00000000de7071fda45ab3115935cf0d.png',
    dbPath: './database',
    batchSize: 50,
    maxEmails: 20,
    maxCountPerEmail: 15,
    scriptLink: 'https://t.me/numberspyx',
    vercelUrl: 'https://email-api-walzy.vercel.app/api/send'
};

export const APPEAL_TEXTS = {
    fixred: [
        {
            subject: "Login Indisponível",
            body: "Prezada Equipe de Suporte do WhatsApp, Estou com problemas para registrar meu número. Sempre que tento, recebo a mensagem login indisponível. Este número é muito importante porque o utilizo para fins educacionais e de comunicação como estudante. Espero sinceramente que a equipe do WhatsApp possa ajudar a resolver este problema o mais rápido possível para que eu possa usá-lo novamente no WhatsApp. Meu número é {nomor} Agradeço a atenção e o apoio de todos."
        },
        {
            subject: "Verification Problem",
            body: "Hello WhatsApp, I am having problems with number verification. The problem is that it says the number is not available, even though I just bought it, please re-verify my WhatsApp number which is affected by the issue because the number is very important {nomor}, I hope this problem can be resolved soon, thank you."
        }
    ],
    spam: [
        {
            subject: "Appeal for Account Suspension - Business Misunderstanding",
            body: "Dear WhatsApp Support,\n\nMy number {nomor} was banned for spamming, but I believe this is a mistake. I run a small local delivery business and I was sending order updates to my customers who have saved my number. I do not send unsolicited messages. This account is vital for my livelihood. Please review my chat history to see that my interactions are legitimate and restore my access."
        },
        {
            subject: "Suspensión por error - Organización de Evento Familiar",
            body: "Hola equipo de WhatsApp,\n\nMi número {nomor} ha sido bloqueado por supuesto spam. Soy el organizador de la boda de mi hermana y estaba enviando invitaciones y coordenadas a mi lista de contactos familiares. No soy un bot ni un spammer comercial. Por favor, restablezcan mi cuenta ya que necesito coordinar urgentemente con los invitados este fin de semana."
        },
        {
            subject: "Banding Pemblokiran: Kesalahan Deteksi pada Nomor Baru",
            body: "Halo Tim WhatsApp,\n\nSaya baru saja membeli kartu perdana ini ({nomor}) dari konter resmi kemarin. Saat saya mencoba mendaftar, nomor langsung terblokir. Sepertinya pemilik lama nomor ini melakukan pelanggaran di masa lalu, bukan saya. Mohon bijaksana untuk memverifikasi bahwa saya adalah pemilik baru yang sah dan tidak melakukan kesalahan apa pun."
        },
        {
            subject: "Ошибка блокировки - Учебная группа",
            body: "Уважаемая поддержка WhatsApp,\n\nМой номер {nomor} был заблокирован. Я староста университетской группы и рассылал расписание экзаменов своим одногруппникам. Система могла принять это за спам, но это важная учебная информация, и все получатели знают меня. Прошу разблокировать мой аккаунт, так как сессия скоро начнется."
        },
        {
            subject: "حظر عن طريق الخطأ - تهاني الأعياد",
            body: "فريق دعم واتساب العزيز،\n\nتم حظر رقمي {nomor} لأنني كنت أرسل تهاني بمناسبة العيد للأصدقاء والأقارب المسجلين في هاتفي. لم أرسل أي رسائل تجارية أو ضارة. أرجو منكم تفهم الموقف وإعادة تفعيل حسابي لأنني أستخدمه للتواصل مع عائلتي البعيدة."
        }
    ],
    permanen: [
        {
            subject: "Conta Hackeada e Recuperada - Solicitação de Desbanimento",
            body: "Equipe de Segurança do WhatsApp,\n\nMeu telefone foi roubado na semana passada e acessaram meu WhatsApp ({nomor}) indevidamente, enviando mensagens proibidas. Recuperei meu chip hoje na operadora, mas a conta está banida permanentemente. O infrator não fui eu. Peço que verifiquem os logs de acesso e devolvam minha conta, por favor."
        },
        {
            subject: "Suspension Injustifiée - Usage Professionnel Légitime",
            body: "Bonjour,\n\nMon compte {nomor} est banni définitivement. Je suis agent immobilier et je communiquais des détails de visite à mes clients. Je n'ai pas utilisé d'outils d'automatisation non autorisés. Je m'engage à relire vos conditions d'utilisation, mais je vous assure que mon intention n'a jamais été de nuire. Merci de reconsidérer cette sanction sévère."
        },
        {
            subject: "Permanente Sperrung nach Gerätewechsel",
            body: "Sehr geehrte Damen und Herren,\n\nIch habe mein Handy verloren und versucht, mich auf einem neuen Gerät mit meiner Nummer {nomor} anzumelden. Daraufhin wurde ich permanent gesperrt. Ich vermute, das Sicherheitssystem hat dies fälschlicherweise als verdächtige Aktivität erkannt. Bitte stellen Sie mein Konto wieder her, ich bin ein langjähriger Nutzer und habe keine Regeln verletzt."
        },
        {
            subject: "स्थायी प्रतिबंध - सामुदायिक सेवा",
            body: "नमस्ते व्हाट्सएप टीम,\n\nमेरा नंबर {nomor} स्थायी रूप से प्रतिबंधित कर दिया गया है। मैं एक गैर-सरकारी संगठन (NGO) चलाता हूं और हम बाढ़ पीड़ितों के लिए राहत कार्य का समन्वय कर रहे थे। शायद अधिक संदेश भेजने के कारण ऐसा हुआ, लेकिन यह एक मानवीय कार्य था। कृपया मेरी स्थिति को समझें और खाता बहाल करें।"
        },
        {
            subject: "Blocco Permanente - Passaggio ad App Ufficiale",
            body: "Gentile Assistenza,\n\nIl mio numero {nomor} è stato bloccato. Ammetto di aver provato un'app di terze parti per curiosità, senza sapere che violasse gravemente i termini. Me ne pento e ho già disinstallato tutto. Ho scaricato l'app ufficiale dal Play Store e prometto di usare solo quella d'ora in poi. Vi prego di darmi una seconda possibilità."
        }
    ]
};
