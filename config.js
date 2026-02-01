export const CONFIG = {
    botToken: '8182701764:AAFZnFZQwn4aAV3Gowh5eGZ43ogG2V4swJk',
    ownerId: '7650101390',
    groupId: '-1003675929763',
    groupLink: 'https://t.me/stockwalzyy',
    botImage: 'https://files.catbox.moe/kjfe0d.jpg',
    dbPath: './database',
    batchSize: 50,
    maxEmails: 20,
    maxCountPerEmail: 15,
    scriptLink: 'https://t.me/walzyexploit'
};

export const APPEAL_TEXTS = {
    fixred: [
        {
            subject: "Login Indisponível",
            body: "Prezada Equipe de Suporte do WhatsApp, Estou com problemas para registrar meu número. Sempre que tento, recebo a mensagem \"login indisponível\". Este número é muito importante porque o utilizo para fins educacionais e de comunicação como estudante. Espero sinceramente que a equipe do WhatsApp possa ajudar a resolver este problema o mais rápido possível para que eu possa usá-lo novamente no WhatsApp. Meu número é {nomor} Agradeço a atenção e o apoio de todos."
        },
        {
            subject: "Verification Problem",
            body: "Hello WhatsApp, I am having problems with number verification. The problem is that it says the number is not available, even though I just bought it, please re-verify my WhatsApp number which is affected by the issue because the number is very important {nomor}, I hope this problem can be resolved soon, thank you."
        }
    ],
    spam: [
        {
            subject: "Peninjauan Kembali Pemblokiran Akun",
            body: "Yth. Tim Dukungan WhatsApp, saya menulis ini untuk mengajukan banding atas pemblokiran nomor saya {nomor} yang dianggap melakukan spam. Saya meyakini adanya kesalahan pada sistem deteksi otomatis Anda. Nomor ini saya gunakan secara eksklusif untuk komunikasi bisnis yang sah dengan klien yang telah memberikan persetujuan untuk dihubungi. Saya selalu mematuhi pedoman komunitas dan tidak pernah mengirim pesan massal yang tidak diinginkan. Mohon tinjau aktivitas akun saya secara manual dan pulihkan akses saya sesegera mungkin."
        },
        {
            subject: "Urgent: Review Incorrect Spam Flagging",
            body: "Dear WhatsApp Support Team, my account {nomor} has been flagged for spamming, which is completely incorrect. I use this number strictly for personal communication with family and close friends. I suspect that unusual activity might be due to a network glitch or a misunderstanding of my messaging patterns. I value the WhatsApp platform and strictly adhere to the Terms of Service. Please remove this temporary ban as it is hindering my daily communication."
        },
        {
            subject: "Solicitud de Revisión de Suspensión Temporal",
            body: "Estimado equipo de WhatsApp, mi número {nomor} ha sido suspendido temporalmente por supuesto spam. Quisiera aclarar que utilizo esta cuenta para coordinar actividades escolares y grupos comunitarios, y no para enviar publicidad no deseada. Es vital para mí recuperar el acceso ya que tengo información importante en mis chats. Por favor, verifiquen que mi comportamiento no viola ninguna política y restablezcan mi servicio."
        },
        {
            subject: "Erro de Detecção de Spam - Solicitação de Desbloqueio",
            body: "Olá, equipe de segurança do WhatsApp. Fui surpreendido com uma mensagem de bloqueio por spam no meu número {nomor}. Gostaria de informar que isso é um erro. Eu apenas respondo a clientes que entram em contato comigo primeiro. Não utilizo automação nem bots. Este bloqueio está prejudicando meu pequeno negócio. Peço gentilmente que façam uma análise humana da minha conta e removam essa restrição injusta."
        },
        {
            subject: "Appeal Against Spam Ban",
            body: "To the Review Board, I am writing to appeal the suspension of my mobile number {nomor}. It appears I have been banned for 'spam', but I assure you this is a false positive. I recently changed devices and sent messages to my saved contacts to inform them, which may have triggered your filters. I am not a spammer. Please restore my account functionality as soon as possible."
        },
        {
            subject: "Widerspruch gegen Spam-Sperre",
            body: "Sehr geehrtes WhatsApp-Team, meine Nummer {nomor} wurde wegen angeblichen Spams gesperrt. Ich nutze diesen Account ausschließlich für private Zwecke und halte mich strikt an Ihre Nutzungsbedingungen. Diese Sperre ist ein Fehler. Bitte überprüfen Sie mein Konto manuell und heben Sie die Sperrung auf, da ich auf diesen Kommunikationskanal angewiesen bin."
        },
        {
            subject: "Demande de levée de suspension pour spam",
            body: "Bonjour l'équipe WhatsApp, mon numéro {nomor} a été bloqué temporairement. Je conteste cette décision car je n'envoie pas de messages indésirables. J'utilise WhatsApp pour rester en contact avec ma famille à l'étranger. Je pense qu'il s'agit d'une erreur de vos algorithmes. Merci de bien vouloir rétablir mon compte rapidement."
        },
        {
            subject: "Richiesta di revisione account bloccato",
            body: "Gentile assistenza, il mio numero {nomor} è stato segnalato come spam. Vorrei chiarire che uso questo numero per lavoro e comunico solo con colleghi che hanno il mio numero in rubrica. Non ho violato nessuna regola. Vi prego di verificare e riattivare il mio account, poiché questo blocco mi sta causando problemi lavorativi."
        },
        {
            subject: "Hatalı Spam Tespiti Hakkında",
            body: "Sayın WhatsApp Ekibi, {nomor} numaralı hesabım spam şüphesiyle kapatıldı. Bu tamamen bir yanlış anlaşılmadır. Ben sadece rehberimdeki kişilerle iletişim kuruyorum. Lütfen hesabımı inceleyin ve bu kısıtlamayı kaldırın. WhatsApp kurallarına her zaman saygı duyuyorum."
        },
        {
            subject: "Rayuan Penyahaktifan Akaun",
            body: "Salam sejahtera pihak WhatsApp, nombor saya {nomor} telah disekat kerana disyaki melakukan spam. Saya ingin menegaskan bahawa saya tidak menggunakan sebarang perisian pihak ketiga atau menghantar mesej pukal. Nombor ini sangat penting untuk urusan harian saya. Saya memohon jasa baik pihak tuan untuk menyemak semula dan mengaktifkan akaun saya."
        }
    ],
    permanen: [
        {
            subject: "Permohonan Maaf dan Peninjauan Kembali Blokir Permanen",
            body: "Yth. Tim Keamanan WhatsApp, saya menyadari bahwa nomor saya {nomor} telah diblokir secara permanen. Saya ingin menyampaikan permohonan maaf yang tulus jika saya secara tidak sengaja melanggar Ketentuan Layanan. Saya mungkin kurang memahami beberapa kebijakan terbaru. Saya berjanji untuk membaca ulang semua aturan dan mematuhinya dengan ketat di masa depan. Nomor ini sangat krusial bagi kehidupan pribadi dan pekerjaan saya. Mohon berikan saya kesempatan kedua untuk menggunakan layanan ini."
        },
        {
            subject: "Compassionate Appeal for Permanent Suspension",
            body: "Dear WhatsApp Team, I am writing to desperately appeal the permanent ban on my number {nomor}. Being disconnected from WhatsApp has cut me off from essential medical updates and family groups. If I violated any rules, it was completely unintentional. I implore you to review my case with compassion and restore my access. I guarantee full compliance with all guidelines moving forward."
        },
        {
            subject: "Sinceras Disculpas y Solicitud de Reactivación",
            body: "Estimados señores, mi número {nomor} ha sido suspendido permanentemente. Lamento profundamente cualquier acción que haya causado esto. No fue mi intención dañar la plataforma ni molestar a otros usuarios. He revisado sus términos de servicio y entiendo dónde pude haber fallado. Por favor, consideren desbloquear mi cuenta, ya que dependo de ella para comunicarme con mis hijos."
        },
        {
            subject: "Pedido de Reconsideração de Banimento Definitivo",
            body: "Prezada equipe de suporte, recebi a notificação de que meu número {nomor} foi banido para sempre. Peço humildemente que reconsiderem. Talvez minha conta tenha sido comprometida ou usada indevidamente sem meu conhecimento. Sou um usuário fiel há anos e nunca tive problemas antes. Por favor, me deem a chance de recuperar meu histórico e contatos."
        },
        {
            subject: "Critical Request for Account Restoration",
            body: "To the Legal and Policy Team, my account {nomor} is permanently banned. This entails a massive loss of business data and personal memories for me. I am willing to undergo any verification process required to prove my identity and good intent. I promise to adhere strictly to WhatsApp's policies. Please lift this suspension."
        },
        {
            subject: "Bitte um zweite Chance",
            body: "Sehr geehrtes Support-Team, meine Nummer {nomor} wurde dauerhaft gesperrt. Ich entschuldige mich aufrichtig für etwaige Verstöße. Ich war mir der spezifischen Regelung nicht bewusst, habe mich aber nun informiert. Bitte geben Sie mir eine zweite Chance, diesen wichtigen Kommunikationskanal zu nutzen. Ich werde mich in Zukunft korrekt verhalten."
        },
        {
            subject: "Appel de décision de bannissement permanent",
            body: "Madame, Monsieur, je vous écris concernant la suspension définitive de mon numéro {nomor}. Je reconnais l'importance de maintenir la sécurité sur votre plateforme. Si j'ai commis une erreur, je vous prie de m'excuser. Ce numéro est lié à tous mes comptes administratifs et bancaires. Je vous supplie de bien vouloir réexaminer mon cas et de rétablir mon accès."
        },
        {
            subject: "Richiesta di clemenza per blocco permanente",
            body: "Gentile Team WhatsApp, vi scrivo con il cuore in mano per chiedere lo sblocco del numero {nomor}. Ho capito di aver commesso un errore e me ne pento amaramente. Prometto solennemente di non ripetere azioni che violino i vostri termini. Vi prego di concedermi un'ultima possibilità di dimostrare la mia buona fede."
        },
        {
            subject: "Kalıcı Engel Kaldırma Talebi",
            body: "Sayın Yetkili, {nomor} numaralı hesabım kalıcı olarak kapatıldı. Eğer bilmeden bir kural ihlali yaptıysam çok özür dilerim. Bu numarayı yıllardır kullanıyorum ve tüm çevrem bu numarada. Lütfen hesabımı tekrar inceleyin ve bana bir şans daha verin. Kurallara harfiyen uyacağımı taahhüt ederim."
        },
        {
            subject: "Rayuan Terakhir Pemulihan Akaun",
            body: "Kehadapan pasukan keselamatan WhatsApp, saya merayu agar nombor {nomor} saya dipulihkan daripada sekatan kekal. Saya amat menyesal jika terdapat sebarang pelanggaran. Saya bersedia membuang semua kandungan yang melanggar peraturan jika ada. Tolonglah kembalikan akaun saya, ini adalah satu-satunya cara saya berhubung dengan keluarga di kampung."
        }
    ]
};
